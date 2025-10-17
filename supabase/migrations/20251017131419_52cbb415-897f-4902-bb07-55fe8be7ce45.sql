-- Add sync_type column to mailerlite_sync_log
ALTER TABLE public.mailerlite_sync_log 
ADD COLUMN IF NOT EXISTS sync_type text;

COMMENT ON COLUMN public.mailerlite_sync_log.sync_type IS 
'Type of sync: application (form submission) or appointment (status scheduled)';

-- Create trigger function for syncing lead appointments to MailerLite
CREATE OR REPLACE FUNCTION public.sync_lead_appointment_to_mailerlite()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  supabase_url text := 'https://nmgtsstkoqepxoadulzu.supabase.co';
  function_url text;
  request_id bigint;
  person_role_id uuid;
  lead_role_id uuid;
  has_cpst_service boolean;
BEGIN
  -- Only proceed if status changed TO 'Scheduled' (and was not already Scheduled)
  IF OLD.status = 'Scheduled' OR NEW.status != 'Scheduled' THEN
    RETURN NEW;
  END IF;

  -- Get the lead role ID
  SELECT id INTO lead_role_id
  FROM public.app_user_roles
  WHERE role_name = 'lead'
  LIMIT 1;

  -- Only proceed if person is a Lead
  IF NEW.user_role_id != lead_role_id THEN
    RAISE LOG 'Person % is not a Lead (role: %) - skipping MailerLite appointment sync', NEW.id, NEW.user_role_id;
    RETURN NEW;
  END IF;

  -- Check if person has CPST service assigned
  SELECT EXISTS (
    SELECT 1 
    FROM public.people_assign_service pas
    JOIN public.settings_services_and_fees ssf ON pas.service_id = ssf.id
    WHERE pas.person_id = NEW.id 
      AND pas.is_deleted = false
      AND ssf.is_deleted = false
      AND ssf.service ILIKE '%CPST%'
  ) INTO has_cpst_service;

  -- Only proceed if they have CPST service
  IF NOT has_cpst_service THEN
    RAISE LOG 'Person % does not have CPST service assigned - skipping MailerLite appointment sync', NEW.id;
    RETURN NEW;
  END IF;

  -- Build function URL
  function_url := supabase_url || '/functions/v1/sync-mailerlite-lead';

  -- Log the sync attempt
  INSERT INTO public.mailerlite_sync_log (person_id, sync_type, sync_status, error_message)
  VALUES (NEW.id, 'appointment', 'pending', 'Trigger fired for CPST lead with Scheduled status');

  -- Call edge function asynchronously
  BEGIN
    SELECT net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZ3Rzc3Rrb3FlcHhvYWR1bHp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MDIwNzQsImV4cCI6MjA3MzA3ODA3NH0.Lo8lIFv-mFRJPY8d6YyreupmMzqomT-VNhj7SqxJvk8'
      ),
      body := jsonb_build_object(
        'person_id', NEW.id::text,
        'sync_type', 'appointment'
      )
    ) INTO request_id;
    
    UPDATE public.mailerlite_sync_log 
    SET sync_status = 'initiated', error_message = 'HTTP request sent with ID: ' || request_id
    WHERE person_id = NEW.id AND sync_status = 'pending' AND sync_type = 'appointment';
    
  EXCEPTION WHEN OTHERS THEN
    UPDATE public.mailerlite_sync_log 
    SET sync_status = 'error', error_message = 'Trigger error: ' || SQLERRM
    WHERE person_id = NEW.id AND sync_status = 'pending' AND sync_type = 'appointment';
  END;

  RETURN NEW;
END;
$$;

-- Create trigger on people table for status changes to Scheduled
CREATE TRIGGER trigger_sync_lead_appointment_to_mailerlite
  AFTER UPDATE ON public.people
  FOR EACH ROW
  WHEN (
    NEW.status = 'Scheduled' 
    AND OLD.status IS DISTINCT FROM 'Scheduled'
    AND NEW.is_deleted = false
  )
  EXECUTE FUNCTION public.sync_lead_appointment_to_mailerlite();

COMMENT ON FUNCTION public.sync_lead_appointment_to_mailerlite() IS 'Syncs CPST leads to MailerLite appointment group when status changes to Scheduled';
COMMENT ON TRIGGER trigger_sync_lead_appointment_to_mailerlite ON public.people IS 'Fires MailerLite appointment sync for scheduled CPST leads';

-- Update existing trigger function to include sync_type
CREATE OR REPLACE FUNCTION public.sync_lead_to_mailerlite_on_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  supabase_url text := 'https://nmgtsstkoqepxoadulzu.supabase.co';
  function_url text;
  request_id bigint;
  person_role_id uuid;
  lead_role_id uuid;
  has_cpst_service boolean;
BEGIN
  -- Get the lead role ID
  SELECT id INTO lead_role_id
  FROM public.app_user_roles
  WHERE role_name = 'lead'
  LIMIT 1;

  -- Get the person's role
  SELECT user_role_id INTO person_role_id
  FROM public.people
  WHERE id = NEW.submitted_by_id
    AND is_deleted = false;

  -- Only proceed if person is a Lead
  IF person_role_id != lead_role_id THEN
    RAISE LOG 'Person % is not a Lead - skipping MailerLite sync', NEW.submitted_by_id;
    RETURN NEW;
  END IF;

  -- Check if submission contains CPST service
  has_cpst_service := (
    (NEW.submission_data->>'service')::text ILIKE '%CPST%'
    OR (NEW.submission_data->>'Service')::text ILIKE '%CPST%'
    OR (NEW.submission_data->>'services')::text ILIKE '%CPST%'
    OR (NEW.submission_data->>'Services')::text ILIKE '%CPST%'
  );

  -- Only proceed if they have CPST service
  IF NOT COALESCE(has_cpst_service, false) THEN
    RAISE LOG 'Submission % does not have CPST service - skipping MailerLite sync', NEW.id;
    RETURN NEW;
  END IF;

  -- Build function URL
  function_url := supabase_url || '/functions/v1/sync-mailerlite-lead';

  -- Log the sync attempt with sync_type
  INSERT INTO public.mailerlite_sync_log (person_id, sync_type, sync_status, error_message)
  VALUES (NEW.submitted_by_id, 'application', 'pending', 'Trigger fired for CPST lead from submission: ' || NEW.id);

  -- Call edge function asynchronously
  BEGIN
    SELECT net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZ3Rzc3Rrb3FlcHhvYWR1bHp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MDIwNzQsImV4cCI6MjA3MzA3ODA3NH0.Lo8lIFv-mFRJPY8d6YyreupmMzqomT-VNhj7SqxJvk8'
      ),
      body := jsonb_build_object(
        'person_id', NEW.submitted_by_id::text,
        'sync_type', 'application'
      )
    ) INTO request_id;
    
    UPDATE public.mailerlite_sync_log 
    SET sync_status = 'initiated', error_message = 'HTTP request sent with ID: ' || request_id
    WHERE person_id = NEW.submitted_by_id AND sync_status = 'pending' AND sync_type = 'application';
    
  EXCEPTION WHEN OTHERS THEN
    UPDATE public.mailerlite_sync_log 
    SET sync_status = 'error', error_message = 'Trigger error: ' || SQLERRM
    WHERE person_id = NEW.submitted_by_id AND sync_status = 'pending' AND sync_type = 'application';
  END;

  RETURN NEW;
END;
$$;