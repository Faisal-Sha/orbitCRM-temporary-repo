-- Drop the existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the existing function
DROP FUNCTION IF EXISTS public.handle_new_user();

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
BEGIN
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
      updated_at = now()
    WHERE id = existing_person_record.id;
    
  ELSE
    -- Scenario 2: User email does NOT exist in people_contacts
    -- Create new people record
    INSERT INTO public.people (
      first_name, 
      last_name, 
      user_account_id
    )
    VALUES (
      NEW.raw_user_meta_data ->> 'first_name', 
      NEW.raw_user_meta_data ->> 'last_name', 
      app_user_id
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
  END IF;

  RETURN NEW;
END;
$$;

-- Create the trigger using the new comprehensive function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_registration();