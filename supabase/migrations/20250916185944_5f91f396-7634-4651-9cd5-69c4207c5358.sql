-- 1. Convert people.status from enum to text and migrate existing data
ALTER TABLE public.people ALTER COLUMN status DROP DEFAULT;
ALTER TABLE public.people ALTER COLUMN status TYPE text USING status::text;
ALTER TABLE public.people ALTER COLUMN status SET DEFAULT 'active';

-- 2. Drop the people_status_enum since it's no longer needed
DROP TYPE IF EXISTS people_status_enum;

-- 3. Create the new people_assign_status table
CREATE TABLE public.people_assign_status (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL,
  new_status text,
  old_status text,
  created_by uuid,
  updated_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT people_assign_status_pkey PRIMARY KEY (id),
  CONSTRAINT people_assign_status_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.people(id),
  CONSTRAINT people_assign_status_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT people_assign_status_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id)
);

-- 4. Create initial status records for all existing people
INSERT INTO public.people_assign_status (person_id, new_status, old_status)
SELECT id, status, NULL 
FROM public.people 
WHERE is_deleted = false;

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

-- 7. Update the handle_user_registration function to handle user_role_id and status tracking
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

-- 8. Update the get_leads_data function to use text comparison instead of enum
CREATE OR REPLACE FUNCTION public.get_leads_data()
RETURNS TABLE(
  lead_id uuid,
  first_name text,
  last_name text,
  email text,
  phone text,
  created_at timestamp with time zone,
  lead_goals text,
  preferences text,
  expectation text,
  note text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pl.id as lead_id,
    p.first_name,
    p.last_name, 
    pc.email,
    pc.phone,
    pl.created_at,
    pl.lead_goals,
    pl.preferences,
    pl.expectation,
    pl.note
  FROM people_leads pl
  JOIN people p ON pl.person_id = p.id
  JOIN people_assign_user_role paur ON p.id = paur.person_id
  JOIN app_user_roles aur ON paur.user_role_id = aur.id
  LEFT JOIN people_contacts pc ON p.id = pc.person_id AND pc.is_deleted = false
  WHERE pl.is_deleted = false 
    AND p.is_deleted = false 
    AND p.status = 'active'
    AND paur.is_deleted = false
    AND aur.role_name = 'lead'::user_roles_enum
  ORDER BY pl.created_at DESC;
END;
$$;