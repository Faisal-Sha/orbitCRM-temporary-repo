-- Fix create_organization_with_admin function to handle organization_state
DROP FUNCTION IF EXISTS public.create_organization_with_admin(text, text, text, text, text, uuid);

CREATE OR REPLACE FUNCTION public.create_organization_with_admin(
  organization_name text, 
  organization_state text, 
  admin_first_name text, 
  admin_last_name text, 
  admin_email text, 
  created_by_user_id uuid
)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  new_org_id UUID;
  new_person_id UUID;
  result JSON;
BEGIN
  -- Create organization with organization_state
  INSERT INTO public.app_organizations (
    organization_name,
    organization_state,
    status,
    created_by,
    updated_by,
    created_at,
    updated_at
  )
  VALUES (
    organization_name,
    organization_state,
    'active'::organization_status_enum,
    created_by_user_id,
    created_by_user_id,
    now(),
    now()
  )
  RETURNING id INTO new_org_id;

  -- Create admin person
  INSERT INTO public.people (
    first_name,
    last_name,
    status,
    created_by,
    updated_by,
    created_at,
    updated_at
  )
  VALUES (
    admin_first_name,
    admin_last_name,
    'active'::people_status_enum,
    created_by_user_id,
    created_by_user_id,
    now(),
    now()
  )
  RETURNING id INTO new_person_id;

  -- Create admin contact
  INSERT INTO public.people_contacts (
    person_id,
    email,
    created_by,
    updated_by,
    created_at,
    updated_at
  )
  VALUES (
    new_person_id,
    admin_email,
    created_by_user_id,
    created_by_user_id,
    now(),
    now()
  );

  -- Link admin to organization
  INSERT INTO public.app_organization_admins (
    organization_id,
    person_id,
    created_by,
    updated_by,
    created_at,
    updated_at
  )
  VALUES (
    new_org_id,
    new_person_id,
    created_by_user_id,
    created_by_user_id,
    now(),
    now()
  );

  -- Assign admin role
  INSERT INTO public.app_organization_people (
    organization_id,
    person_id,
    user_role_id,
    created_by,
    updated_by,
    created_at,
    updated_at
  )
  VALUES (
    new_org_id,
    new_person_id,
    '389ef5df-2b0c-46d0-a31b-e83cf88ba5a4'::UUID,
    created_by_user_id,
    created_by_user_id,
    now(),
    now()
  );

  -- Return result
  SELECT json_build_object(
    'organization_id', new_org_id,
    'person_id', new_person_id,
    'success', true
  ) INTO result;

  RETURN result;
END;
$function$;