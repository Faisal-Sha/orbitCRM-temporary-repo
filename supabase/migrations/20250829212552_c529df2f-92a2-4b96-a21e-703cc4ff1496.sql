-- Clean up duplicate create_organization_with_admin functions
-- Drop the older version without organization_status parameter
DROP FUNCTION IF EXISTS public.create_organization_with_admin(text, text, text, text, text, uuid);

-- Ensure the newer version has proper security settings
CREATE OR REPLACE FUNCTION public.create_organization_with_admin(
  organization_name TEXT,
  organization_state TEXT,
  admin_first_name TEXT,
  admin_last_name TEXT,
  admin_email TEXT,
  created_by_user_id UUID,
  organization_status organization_status_enum DEFAULT 'active'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  org_id UUID;
  person_id UUID;
  admin_role_id UUID;
  result JSON;
BEGIN
  -- Create organization with specified status
  INSERT INTO public.app_organizations (
    organization_name, 
    organization_state, 
    status,
    created_by, 
    updated_by
  )
  VALUES (
    organization_name, 
    organization_state, 
    organization_status,
    created_by_user_id, 
    created_by_user_id
  )
  RETURNING id INTO org_id;

  -- Create person record for admin
  INSERT INTO public.people (
    first_name, 
    last_name, 
    created_by, 
    updated_by
  )
  VALUES (
    admin_first_name, 
    admin_last_name, 
    created_by_user_id, 
    created_by_user_id
  )
  RETURNING id INTO person_id;

  -- Create contact record for the person
  INSERT INTO public.people_contacts (
    person_id, 
    email, 
    created_by, 
    updated_by
  )
  VALUES (
    person_id, 
    admin_email, 
    created_by_user_id, 
    created_by_user_id
  );

  -- Get admin role ID dynamically
  SELECT id INTO admin_role_id 
  FROM public.app_user_roles 
  WHERE role_name = 'admin' 
  LIMIT 1;

  -- Create organization admin record
  INSERT INTO public.app_organization_admins (
    organization_id, 
    person_id, 
    created_by, 
    updated_by
  )
  VALUES (
    org_id, 
    person_id, 
    created_by_user_id, 
    created_by_user_id
  );

  -- Create organization people record
  INSERT INTO public.app_organization_people (
    organization_id, 
    person_id, 
    user_role_id, 
    created_by, 
    updated_by
  )
  VALUES (
    org_id, 
    person_id, 
    admin_role_id, 
    created_by_user_id, 
    created_by_user_id
  );

  -- Return success response
  SELECT json_build_object(
    'organization_id', org_id,
    'person_id', person_id,
    'success', true,
    'message', 'Organization and admin created successfully'
  ) INTO result;

  RETURN result;
END;
$$;