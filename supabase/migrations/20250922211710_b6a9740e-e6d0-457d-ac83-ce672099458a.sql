-- Update the update_people_user_role function to handle people_clients table
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

  -- Handle client role transitions
  IF p_role_name = 'client' AND current_role_name != 'client' THEN
    -- Adding client role - insert into people_clients if not exists
    IF user_agency_id IS NOT NULL THEN
      INSERT INTO public.people_clients (
        person_id,
        agency_id,
        created_by,
        updated_by
      )
      SELECT p_person_id, user_agency_id, current_user_id, current_user_id
      WHERE NOT EXISTS (
        SELECT 1 FROM public.people_clients 
        WHERE person_id = p_person_id AND agency_id = user_agency_id AND is_deleted = false
      );
    END IF;
  ELSIF current_role_name = 'client' AND p_role_name != 'client' THEN
    -- Removing client role - soft delete from people_clients
    UPDATE public.people_clients
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
$function$