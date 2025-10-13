-- Install pg_net extension for async HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA extensions TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA extensions TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA extensions TO postgres, anon, authenticated, service_role;

-- Update the sync_lead_to_mailerlite function to handle errors gracefully
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
    
    BEGIN
      -- Get Supabase configuration
      supabase_url := current_setting('app.settings.api_external_url', true);
      supabase_anon_key := current_setting('app.settings.service_role_key', true);
      
      -- Call edge function asynchronously via pg_net (using extensions schema)
      PERFORM extensions.http_post(
        url := supabase_url || '/functions/v1/sync-mailerlite-lead',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || supabase_anon_key
        ),
        body := jsonb_build_object('person_id', NEW.id)
      );
      
      RAISE LOG 'Triggered MailerLite sync for person_id: %', NEW.id;
    EXCEPTION WHEN OTHERS THEN
      -- Log error but don't fail the transaction - this ensures form submissions succeed
      RAISE WARNING 'Failed to trigger MailerLite sync for person_id %. Error: %', NEW.id, SQLERRM;
    END;
  END IF;

  RETURN NEW;
END;
$$;

-- Create logging table for MailerLite sync attempts
CREATE TABLE IF NOT EXISTS public.mailerlite_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID NOT NULL REFERENCES public.people(id),
  sync_status TEXT NOT NULL CHECK (sync_status IN ('success', 'failed', 'pending')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mailerlite_sync_log_person_id ON public.mailerlite_sync_log(person_id);
CREATE INDEX IF NOT EXISTS idx_mailerlite_sync_log_status ON public.mailerlite_sync_log(sync_status);

-- Enable RLS on the log table
ALTER TABLE public.mailerlite_sync_log ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view sync logs for people in their agency
CREATE POLICY "Users can view sync logs for people in their agency"
ON public.mailerlite_sync_log
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.people p
    JOIN public.app_agencies_people ap ON p.id = ap.person_id
    JOIN public.app_users au ON au.id = (
      SELECT p2.user_account_id 
      FROM public.people p2 
      WHERE p2.id = ap.person_id 
      AND p2.is_deleted = false
      LIMIT 1
    )
    WHERE p.id = mailerlite_sync_log.person_id
    AND au.user_id = auth.uid()
    AND ap.is_deleted = false
  )
);

COMMENT ON TABLE public.mailerlite_sync_log IS 'Logs MailerLite synchronization attempts for debugging and monitoring';
COMMENT ON FUNCTION public.sync_lead_to_mailerlite() IS 'Automatically syncs new leads to MailerLite when person role is set to lead. Errors are logged but do not fail the transaction.';