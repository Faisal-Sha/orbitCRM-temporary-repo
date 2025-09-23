-- Step 1: Update get_active_clients_data function to remove people_clients dependency
CREATE OR REPLACE FUNCTION public.get_active_clients_data()
RETURNS TABLE(
  person_id uuid,
  first_name text,
  last_name text,
  email text,
  phone text,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_agency_id uuid;
BEGIN
  -- Get current user's agency ID
  current_agency_id := public.current_user_agency_id();
  
  IF current_agency_id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    p.id as person_id,
    p.first_name,
    p.last_name,
    pc.email,
    pc.phone,
    p.created_at
  FROM public.people p
  JOIN public.app_agencies_people ap ON p.id = ap.person_id
  JOIN public.app_user_roles aur ON p.user_role_id = aur.id
  LEFT JOIN public.people_contacts pc ON p.id = pc.person_id AND pc.is_deleted = false
  WHERE p.is_deleted = false
    AND ap.is_deleted = false
    AND ap.agency_id = current_agency_id
    AND aur.role_name = 'client'::user_roles_enum
    AND p.status IN ('active', 'on hold', 'inactive', 'qualified')
  ORDER BY p.created_at DESC;
END;
$$;

-- Step 2: Update update_people_user_role function to remove people_clients logic
CREATE OR REPLACE FUNCTION public.update_people_user_role(p_person_id uuid, p_role_name text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  role_id UUID;
  current_role_name text;
  user_agency_id UUID;
  result JSON;
BEGIN
  -- Find role ID
  SELECT id INTO role_id
  FROM public.app_user_roles
  WHERE role_name = p_role_name::user_roles_enum AND is_deleted = false
  LIMIT 1;

  IF role_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Role not found');
  END IF;

  -- Get current role to check if transitioning from admin or staff
  SELECT aur.role_name::text INTO current_role_name
  FROM public.people p
  JOIN public.app_user_roles aur ON p.user_role_id = aur.id
  WHERE p.id = p_person_id AND p.is_deleted = false AND aur.is_deleted = false;

  -- Get agency_id for this person
  SELECT ap.agency_id INTO user_agency_id
  FROM public.app_agencies_people ap
  WHERE ap.person_id = p_person_id AND ap.is_deleted = false
  LIMIT 1;

  -- Update user_role_id in people table
  UPDATE public.people
  SET user_role_id = role_id, updated_by = current_user_id, updated_at = now()
  WHERE id = p_person_id;

  -- Update user_role_id in app_agencies_people table
  UPDATE public.app_agencies_people
  SET user_role_id = role_id, updated_by = current_user_id, updated_at = now()
  WHERE person_id = p_person_id AND is_deleted = false;

  -- Handle admin role transitions
  IF p_role_name = 'admin' AND current_role_name != 'admin' THEN
    -- Adding admin role - insert into app_agencies_admins if not exists
    IF user_agency_id IS NOT NULL THEN
      INSERT INTO public.app_agencies_admins (
        person_id,
        agency_id,
        created_by,
        updated_by
      )
      SELECT p_person_id, user_agency_id, current_user_id, current_user_id
      WHERE NOT EXISTS (
        SELECT 1 FROM public.app_agencies_admins 
        WHERE person_id = p_person_id AND agency_id = user_agency_id AND is_deleted = false
      );
    END IF;
  ELSIF current_role_name = 'admin' AND p_role_name != 'admin' THEN
    -- Removing admin role - soft delete from app_agencies_admins
    UPDATE public.app_agencies_admins
    SET is_deleted = true, deleted_by = current_user_id, deleted_at = now()
    WHERE person_id = p_person_id AND is_deleted = false;
  END IF;

  -- Handle staff role transitions
  IF current_role_name = 'staff' AND p_role_name != 'staff' THEN
    -- Transitioning away from staff role - clear staff type data
    UPDATE public.people
    SET staff_type_id = NULL, updated_by = current_user_id, updated_at = now()
    WHERE id = p_person_id;
    
    UPDATE public.app_agencies_people
    SET user_staff_type_id = NULL, updated_by = current_user_id, updated_at = now()
    WHERE person_id = p_person_id AND is_deleted = false;
    
    -- Soft delete all staff type assignments for this person
    UPDATE public.people_assign_staff_type
    SET is_deleted = true, deleted_by = current_user_id, deleted_at = now()
    WHERE person_id = p_person_id AND is_deleted = false;
  END IF;

  -- First, soft delete all existing role assignments for this person
  UPDATE public.people_assign_user_role
  SET is_deleted = true, deleted_by = current_user_id, deleted_at = now()
  WHERE person_id = p_person_id AND is_deleted = false;

  -- Then insert the new role assignment
  INSERT INTO public.people_assign_user_role (
    person_id,
    user_role_id,
    created_by,
    updated_by
  ) VALUES (
    p_person_id,
    role_id,
    current_user_id,
    current_user_id
  );

  SELECT json_build_object(
    'success', true,
    'message', 'User role updated successfully'
  ) INTO result;

  RETURN result;
END;
$function$;

-- Step 3: Drop all RLS policies on people_clients table
DROP POLICY IF EXISTS "Users can create clients in their agency" ON public.people_clients;
DROP POLICY IF EXISTS "Users can delete clients in their agency" ON public.people_clients;
DROP POLICY IF EXISTS "Users can update clients in their agency" ON public.people_clients;
DROP POLICY IF EXISTS "Users can view clients in their agency" ON public.people_clients;

-- Step 4: Drop the people_clients table
DROP TABLE IF EXISTS public.people_clients CASCADE;