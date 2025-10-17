-- Drop old trigger on people table
DROP TRIGGER IF EXISTS trigger_sync_lead_to_mailerlite ON public.people;

-- Create new trigger function that fires on form submission
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

  -- Log the sync attempt
  INSERT INTO public.mailerlite_sync_log (person_id, sync_status, error_message)
  VALUES (NEW.submitted_by_id, 'pending', 'Trigger fired for CPST lead from submission: ' || NEW.id);

  -- Call edge function asynchronously
  BEGIN
    SELECT net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZ3Rzc3Rrb3FlcHhvYWR1bHp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MDIwNzQsImV4cCI6MjA3MzA3ODA3NH0.Lo8lIFv-mFRJPY8d6YyreupmMzqomT-VNhj7SqxJvk8'
      ),
      body := jsonb_build_object('person_id', NEW.submitted_by_id::text)
    ) INTO request_id;
    
    UPDATE public.mailerlite_sync_log 
    SET sync_status = 'initiated', error_message = 'HTTP request sent with ID: ' || request_id
    WHERE person_id = NEW.submitted_by_id AND sync_status = 'pending';
    
  EXCEPTION WHEN OTHERS THEN
    UPDATE public.mailerlite_sync_log 
    SET sync_status = 'error', error_message = 'Trigger error: ' || SQLERRM
    WHERE person_id = NEW.submitted_by_id AND sync_status = 'pending';
  END;

  RETURN NEW;
END;
$$;

-- Create new trigger on forms_submissions table
CREATE TRIGGER trigger_sync_lead_to_mailerlite_on_submission
  AFTER INSERT ON public.forms_submissions
  FOR EACH ROW
  WHEN (NEW.is_deleted = false)
  EXECUTE FUNCTION public.sync_lead_to_mailerlite_on_submission();

COMMENT ON FUNCTION public.sync_lead_to_mailerlite_on_submission() IS 'Syncs CPST leads to MailerLite when form is submitted';
COMMENT ON TRIGGER trigger_sync_lead_to_mailerlite_on_submission ON public.forms_submissions IS 'Fires MailerLite sync for CPST lead submissions';