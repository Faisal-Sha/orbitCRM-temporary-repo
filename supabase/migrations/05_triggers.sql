-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_users_updated_at BEFORE
UPDATE ON public.app_users FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_people_leads_updated_at
BEFORE UPDATE ON public.people_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_settings_integrations_webhooks_updated_at
    BEFORE UPDATE ON public.settings_integrations_webhooks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forms_submissions_updated_at
    BEFORE UPDATE ON public.forms_submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create a comprehensive user registration function that handles both scenarios
CREATE OR REPLACE FUNCTION public.handle_user_registration()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  app_user_id UUID;
  existing_person_id UUID;
  existing_person_record RECORD;
  default_role_id UUID;
BEGIN
  -- Get the default 'general' role ID
  SELECT id INTO default_role_id
  FROM public.app_user_roles 
  WHERE role_name = 'general'::user_roles_enum 
  LIMIT 1;

  -- Step 1: Create app_users record (always needed)
  INSERT INTO public.app_users (user_id, account_email)
  VALUES (NEW.id, NEW.email)
  RETURNING id INTO app_user_id;

  -- Step 2: Check if user email exists in people_contacts table
  SELECT p.id, p.first_name, p.last_name INTO existing_person_record
  FROM public.people p
  JOIN public.people_contacts pc ON p.id = pc.person_id
  WHERE pc.email = NEW.email 
    AND p.is_deleted = false 
    AND pc.is_deleted = false
  LIMIT 1;

  IF existing_person_record.id IS NOT NULL THEN
    -- Scenario 1: User email exists in people_contacts
    -- Update the existing people record with user account link and optionally update name
    UPDATE public.people 
    SET 
      user_account_id = app_user_id,
      first_name = COALESCE(NEW.raw_user_meta_data ->> 'first_name', first_name),
      last_name = COALESCE(NEW.raw_user_meta_data ->> 'last_name', last_name),
      user_role_id = COALESCE(user_role_id, default_role_id),
      updated_at = now()
    WHERE id = existing_person_record.id;
    
  ELSE
    -- Scenario 2: User email does NOT exist in people_contacts
    -- Create new people record with default role and active status
    INSERT INTO public.people (
      first_name, 
      last_name, 
      user_account_id,
      user_role_id,
      status
    )
    VALUES (
      NEW.raw_user_meta_data ->> 'first_name', 
      NEW.raw_user_meta_data ->> 'last_name', 
      app_user_id,
      default_role_id,
      'active'
    )
    RETURNING id INTO existing_person_id;

    -- Create new people_contacts record
    INSERT INTO public.people_contacts (
      person_id, 
      email
    )
    VALUES (
      existing_person_id, 
      NEW.email
    );

    -- Create initial status record in people_assign_status
    INSERT INTO public.people_assign_status (
      person_id,
      new_status,
      old_status
    )
    VALUES (
      existing_person_id,
      'active',
      NULL
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create the trigger using the new comprehensive function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_registration();


-- Create trigger to sync auth.users email changes to app_users table
CREATE OR REPLACE FUNCTION public.sync_auth_email_to_app_users()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Update account_email in app_users when auth.users email changes
  UPDATE public.app_users 
  SET 
    account_email = NEW.email,
    updated_at = now()
  WHERE user_id = NEW.id;

  RETURN NEW;
END;
$$;

-- Create trigger on auth.users table for email sync
DROP TRIGGER IF EXISTS sync_email_on_auth_users_update ON auth.users;
CREATE TRIGGER sync_email_on_auth_users_update
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_auth_email_to_app_users();


-- 5. Create trigger function to track status changes
CREATE OR REPLACE FUNCTION public.track_people_status_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only track status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.people_assign_status (
      person_id,
      new_status,
      old_status,
      created_by,
      updated_by
    )
    VALUES (
      NEW.id,
      NEW.status,
      OLD.status,
      NEW.updated_by,
      NEW.updated_by
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- 6. Create trigger on people table for status tracking
CREATE TRIGGER track_people_status_changes_trigger
  AFTER UPDATE ON public.people
  FOR EACH ROW
  EXECUTE FUNCTION public.track_people_status_changes();