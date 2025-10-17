-- Create trigger function for syncing discharged clients to MailerLite
CREATE OR REPLACE FUNCTION public.sync_client_to_mailerlite_on_discharge()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  supabase_url text := 'https://nmgtsstkoqepxoadulzu.supabase.co';
  function_url text;
  request_id bigint;
  has_cpst_service boolean;
BEGIN
  -- Only proceed if status changed TO 'Discharged' (case-insensitive)
  IF LOWER(OLD.status) = LOWER(NEW.status) THEN
    RETURN NEW;
  END IF;

  IF LOWER(NEW.status) != 'discharged' THEN
    RAISE LOG 'Person % status is not Discharged (%) - skipping MailerLite discharged sync', NEW.id, NEW.status;
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
    RAISE LOG 'Person % does not have CPST service - skipping MailerLite discharged sync', NEW.id;
    RETURN NEW;
  END IF;

  -- Build function URL
  function_url := supabase_url || '/functions/v1/sync-mailerlite-lead';

  -- Log the sync attempt
  INSERT INTO public.mailerlite_sync_log (person_id, sync_type, sync_status, error_message)
  VALUES (NEW.id, 'client_discharged', 'pending', 'Trigger fired for discharged CPST client from status change');

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
        'sync_type', 'client_discharged'
      )
    ) INTO request_id;
    
    UPDATE public.mailerlite_sync_log 
    SET sync_status = 'initiated', error_message = 'HTTP request sent with ID: ' || request_id
    WHERE person_id = NEW.id AND sync_status = 'pending' AND sync_type = 'client_discharged';
    
  EXCEPTION WHEN OTHERS THEN
    UPDATE public.mailerlite_sync_log 
    SET sync_status = 'error', error_message = 'Trigger error: ' || SQLERRM
    WHERE person_id = NEW.id AND sync_status = 'pending' AND sync_type = 'client_discharged';
  END;

  RETURN NEW;
END;
$$;

-- Create trigger on people table for status changes to 'Discharged'
CREATE TRIGGER trigger_sync_client_to_mailerlite_on_discharge
  AFTER UPDATE OF status ON public.people
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_client_to_mailerlite_on_discharge();