-- Fix sync_lead_to_mailerlite trigger function to use proper configuration
CREATE OR REPLACE FUNCTION public.sync_lead_to_mailerlite()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  supabase_url text := 'https://nmgtsstkoqepxoadulzu.supabase.co';
  function_url text;
  request_id bigint;
BEGIN
  -- Only sync for leads (not other roles)
  IF NEW.user_role_id != (SELECT id FROM public.app_user_roles WHERE role_name = 'lead' LIMIT 1) THEN
    RETURN NEW;
  END IF;

  -- Build function URL
  function_url := supabase_url || '/functions/v1/sync-mailerlite-lead';

  -- Log the sync attempt immediately
  INSERT INTO public.mailerlite_sync_log (person_id, sync_status, error_message)
  VALUES (NEW.id, 'pending', 'Trigger fired, calling edge function');

  -- Call edge function asynchronously using pg_net
  BEGIN
    SELECT net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZ3Rzc3Rrb3FlcHhvYWR1bHp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MDIwNzQsImV4cCI6MjA3MzA3ODA3NH0.Lo8lIFv-mFRJPY8d6YyreupmMzqomT-VNhj7SqxJvk8'
      ),
      body := jsonb_build_object('person_id', NEW.id::text)
    ) INTO request_id;
    
    -- Update log with success
    UPDATE public.mailerlite_sync_log 
    SET sync_status = 'initiated', error_message = 'HTTP request sent with ID: ' || request_id
    WHERE person_id = NEW.id AND sync_status = 'pending';
    
  EXCEPTION WHEN OTHERS THEN
    -- Log the error
    UPDATE public.mailerlite_sync_log 
    SET sync_status = 'error', error_message = 'Trigger error: ' || SQLERRM
    WHERE person_id = NEW.id AND sync_status = 'pending';
  END;

  RETURN NEW;
END;
$$;