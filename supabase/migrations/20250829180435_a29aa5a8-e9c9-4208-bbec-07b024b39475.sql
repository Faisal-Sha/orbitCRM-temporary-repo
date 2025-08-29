
-- Create edge function for organization management
CREATE OR REPLACE FUNCTION public.create_organization_with_admin(
  organization_name TEXT,
  organization_state TEXT,
  admin_first_name TEXT,
  admin_last_name TEXT,
  admin_email TEXT,
  created_by_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_org_id UUID;
  new_person_id UUID;
  result JSON;
BEGIN
  -- Create organization
  INSERT INTO public.app_organizations (
    organization_name,
    status,
    created_by,
    updated_by,
    created_at,
    updated_at
  )
  VALUES (
    organization_name,
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
$$;

-- Create function to get organizations with admin details
CREATE OR REPLACE FUNCTION public.get_organizations_with_admins()
RETURNS TABLE (
  id UUID,
  organization_name TEXT,
  status organization_status_enum,
  created_at TIMESTAMP WITH TIME ZONE,
  admin_first_name TEXT,
  admin_last_name TEXT,
  admin_email TEXT,
  user_count BIGINT,
  storage_used TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.organization_name,
    o.status,
    o.created_at,
    p.first_name as admin_first_name,
    p.last_name as admin_last_name,
    pc.email as admin_email,
    COALESCE(user_counts.count, 0) as user_count,
    '0 MB'::TEXT as storage_used
  FROM public.app_organizations o
  LEFT JOIN public.app_organization_admins oa ON o.id = oa.organization_id AND oa.is_deleted = false
  LEFT JOIN public.people p ON oa.person_id = p.id AND p.is_deleted = false
  LEFT JOIN public.people_contacts pc ON p.id = pc.person_id AND pc.is_deleted = false
  LEFT JOIN (
    SELECT 
      op.organization_id,
      COUNT(*) as count
    FROM public.app_organization_people op
    WHERE op.is_deleted = false
    GROUP BY op.organization_id
  ) user_counts ON o.id = user_counts.organization_id
  WHERE o.is_deleted = false
  ORDER BY o.created_at DESC;
END;
$$;

-- Create function to update organization
CREATE OR REPLACE FUNCTION public.update_organization_with_admin(
  org_id UUID,
  organization_name TEXT,
  organization_state TEXT,
  organization_status organization_status_enum,
  admin_first_name TEXT,
  admin_last_name TEXT,
  admin_email TEXT,
  updated_by_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  person_id UUID;
  result JSON;
BEGIN
  -- Update organization
  UPDATE public.app_organizations 
  SET 
    organization_name = update_organization_with_admin.organization_name,
    status = organization_status,
    updated_by = updated_by_user_id,
    updated_at = now()
  WHERE id = org_id;

  -- Get the admin person_id
  SELECT oa.person_id INTO person_id
  FROM public.app_organization_admins oa
  WHERE oa.organization_id = org_id AND oa.is_deleted = false
  LIMIT 1;

  -- Update admin person if found
  IF person_id IS NOT NULL THEN
    UPDATE public.people 
    SET 
      first_name = admin_first_name,
      last_name = admin_last_name,
      updated_by = updated_by_user_id,
      updated_at = now()
    WHERE id = person_id;

    -- Update admin contact
    UPDATE public.people_contacts 
    SET 
      email = admin_email,
      updated_by = updated_by_user_id,
      updated_at = now()
    WHERE person_id = update_organization_with_admin.person_id;
  END IF;

  -- Return result
  SELECT json_build_object(
    'organization_id', org_id,
    'person_id', person_id,
    'success', true
  ) INTO result;

  RETURN result;
END;
$$;
