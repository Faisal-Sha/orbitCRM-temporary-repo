-- Create trigger function for syncing clients to MailerLite when role changes to 'client'
CREATE OR REPLACE FUNCTION public.sync_client_to_mailerlite_on_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  supabase_url text := 'https://nmgtsstkoqepxoadulzu.supabase.co';
  function_url text;
  request_id bigint;
  client_role_id uuid;
  has_cpst_service boolean;
BEGIN
  -- Only proceed if role changed TO 'client' (and was not already client)
  IF OLD.user_role_id = NEW.user_role_id THEN
    RETURN NEW;
  END IF;

  -- Get the client role ID
  SELECT id INTO client_role_id
  FROM public.app_user_roles
  WHERE role_name = 'client'
  LIMIT 1;

  -- Only proceed if new role is client
  IF NEW.user_role_id != client_role_id THEN
    RAISE LOG 'Person % is not a Client - skipping MailerLite client sync', NEW.id;
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
    RAISE LOG 'Person % does not have CPST service - skipping MailerLite client sync', NEW.id;
    RETURN NEW;
  END IF;

  -- Build function URL
  function_url := supabase_url || '/functions/v1/sync-mailerlite-lead';

  -- Log the sync attempt
  INSERT INTO public.mailerlite_sync_log (person_id, sync_type, sync_status, error_message)
  VALUES (NEW.id, 'client_active', 'pending', 'Trigger fired for CPST client from role change');

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
        'sync_type', 'client_active'
      )
    ) INTO request_id;
    
    UPDATE public.mailerlite_sync_log 
    SET sync_status = 'initiated', error_message = 'HTTP request sent with ID: ' || request_id
    WHERE person_id = NEW.id AND sync_status = 'pending' AND sync_type = 'client_active';
    
  EXCEPTION WHEN OTHERS THEN
    UPDATE public.mailerlite_sync_log 
    SET sync_status = 'error', error_message = 'Trigger error: ' || SQLERRM
    WHERE person_id = NEW.id AND sync_status = 'pending' AND sync_type = 'client_active';
  END;

  RETURN NEW;
END;
$$;

-- Create trigger function for syncing clients to MailerLite when CPST service is assigned
CREATE OR REPLACE FUNCTION public.sync_client_to_mailerlite_on_service()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  supabase_url text := 'https://nmgtsstkoqepxoadulzu.supabase.co';
  function_url text;
  request_id bigint;
  person_role_name text;
  service_name text;
BEGIN
  -- Get the service name
  SELECT ssf.service INTO service_name
  FROM public.settings_services_and_fees ssf
  WHERE ssf.id = NEW.service_id
    AND ssf.is_deleted = false;

  -- Only proceed if service is CPST
  IF service_name NOT ILIKE '%CPST%' THEN
    RAISE LOG 'Service % is not CPST - skipping MailerLite client sync', service_name;
    RETURN NEW;
  END IF;

  -- Get person's role
  SELECT aur.role_name INTO person_role_name
  FROM public.people p
  JOIN public.app_user_roles aur ON p.user_role_id = aur.id
  WHERE p.id = NEW.person_id
    AND p.is_deleted = false
    AND aur.is_deleted = false;

  -- Only proceed if person is a client
  IF person_role_name != 'client' THEN
    RAISE LOG 'Person % is not a Client (role: %) - skipping MailerLite client sync', NEW.person_id, person_role_name;
    RETURN NEW;
  END IF;

  -- Build function URL
  function_url := supabase_url || '/functions/v1/sync-mailerlite-lead';

  -- Log the sync attempt
  INSERT INTO public.mailerlite_sync_log (person_id, sync_type, sync_status, error_message)
  VALUES (NEW.person_id, 'client_active', 'pending', 'Trigger fired for CPST client from service assignment');

  -- Call edge function asynchronously
  BEGIN
    SELECT net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZ3Rzc3Rrb3FlcHhvYWR1bHp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MDIwNzQsImV4cCI6MjA3MzA3ODA3NH0.Lo8lIFv-mFRJPY8d6YyreupmMzqomT-VNhj7SqxJvk8'
      ),
      body := jsonb_build_object(
        'person_id', NEW.person_id::text,
        'sync_type', 'client_active'
      )
    ) INTO request_id;
    
    UPDATE public.mailerlite_sync_log 
    SET sync_status = 'initiated', error_message = 'HTTP request sent with ID: ' || request_id
    WHERE person_id = NEW.person_id AND sync_status = 'pending' AND sync_type = 'client_active';
    
  EXCEPTION WHEN OTHERS THEN
    UPDATE public.mailerlite_sync_log 
    SET sync_status = 'error', error_message = 'Trigger error: ' || SQLERRM
    WHERE person_id = NEW.person_id AND sync_status = 'pending' AND sync_type = 'client_active';
  END;

  RETURN NEW;
END;
$$;

-- Create trigger on people table for role changes to 'client'
CREATE TRIGGER trigger_sync_client_to_mailerlite_on_role_change
  AFTER UPDATE OF user_role_id ON public.people
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_client_to_mailerlite_on_role_change();

-- Create trigger on people_assign_service table for CPST service assignments
CREATE TRIGGER trigger_sync_client_to_mailerlite_on_service
  AFTER INSERT ON public.people_assign_service
  FOR EACH ROW
  WHEN (NEW.is_deleted = false)
  EXECUTE FUNCTION public.sync_client_to_mailerlite_on_service();