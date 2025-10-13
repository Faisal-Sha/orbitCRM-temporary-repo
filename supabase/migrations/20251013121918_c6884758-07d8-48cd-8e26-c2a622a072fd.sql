-- Create function to sync leads to MailerLite
CREATE OR REPLACE FUNCTION public.sync_lead_to_mailerlite()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  lead_role_id UUID;
  supabase_url TEXT;
  supabase_anon_key TEXT;
BEGIN
  -- Get the 'lead' role ID
  SELECT id INTO lead_role_id
  FROM public.app_user_roles 
  WHERE role_name = 'lead'::user_roles_enum 
  LIMIT 1;

  -- Check if this is a new lead or role changed to lead
  IF (TG_OP = 'INSERT' AND NEW.user_role_id = lead_role_id) OR
     (TG_OP = 'UPDATE' AND OLD.user_role_id IS DISTINCT FROM NEW.user_role_id AND NEW.user_role_id = lead_role_id) THEN
    
    -- Get Supabase configuration
    supabase_url := current_setting('app.settings.api_external_url', true);
    supabase_anon_key := current_setting('app.settings.service_role_key', true);
    
    -- Call edge function asynchronously via pg_net
    PERFORM net.http_post(
      url := supabase_url || '/functions/v1/sync-mailerlite-lead',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || supabase_anon_key
      ),
      body := jsonb_build_object('person_id', NEW.id)
    );
    
    RAISE LOG 'Triggered MailerLite sync for person_id: %', NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger on people table
DROP TRIGGER IF EXISTS trigger_sync_lead_to_mailerlite ON public.people;

CREATE TRIGGER trigger_sync_lead_to_mailerlite
  AFTER INSERT OR UPDATE OF user_role_id ON public.people
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_lead_to_mailerlite();

COMMENT ON FUNCTION public.sync_lead_to_mailerlite() IS 'Automatically syncs new leads to MailerLite when person role is set to lead';
COMMENT ON TRIGGER trigger_sync_lead_to_mailerlite ON public.people IS 'Fires MailerLite sync when a person becomes a lead';