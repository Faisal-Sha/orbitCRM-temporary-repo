-- Add emergency contact management functions
CREATE OR REPLACE FUNCTION public.update_people_emergency_field(p_person_id uuid, p_field_name text, p_field_value text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  emergency_record_id UUID;
  result JSON;
BEGIN
  -- Find existing emergency record
  SELECT id INTO emergency_record_id
  FROM public.people_emergency
  WHERE person_id = p_person_id AND is_deleted = false
  LIMIT 1;

  -- If no emergency record exists, create one
  IF emergency_record_id IS NULL THEN
    INSERT INTO public.people_emergency (
      person_id,
      created_by,
      updated_by
    ) VALUES (
      p_person_id,
      current_user_id,
      current_user_id
    ) RETURNING id INTO emergency_record_id;
  END IF;

  -- Update the specific field
  CASE p_field_name
    WHEN 'first_name' THEN
      UPDATE public.people_emergency SET first_name = p_field_value, updated_by = current_user_id, updated_at = now() WHERE id = emergency_record_id;
    WHEN 'last_name' THEN
      UPDATE public.people_emergency SET last_name = p_field_value, updated_by = current_user_id, updated_at = now() WHERE id = emergency_record_id;
    WHEN 'email' THEN
      UPDATE public.people_emergency SET email = p_field_value, updated_by = current_user_id, updated_at = now() WHERE id = emergency_record_id;
    WHEN 'phone_number' THEN
      UPDATE public.people_emergency SET phone_number = p_field_value, updated_by = current_user_id, updated_at = now() WHERE id = emergency_record_id;
    WHEN 'relationship' THEN
      UPDATE public.people_emergency SET relationship = p_field_value::emergency_contact_relationship_enum, updated_by = current_user_id, updated_at = now() WHERE id = emergency_record_id;
    ELSE
      RETURN json_build_object('success', false, 'message', 'Invalid field name');
  END CASE;

  SELECT json_build_object(
    'success', true,
    'message', 'Emergency contact field updated successfully'
  ) INTO result;

  RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.delete_people_emergency_field(p_person_id uuid, p_field_name text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  emergency_record_id UUID;
  result JSON;
BEGIN
  -- Find existing emergency record
  SELECT id INTO emergency_record_id
  FROM public.people_emergency
  WHERE person_id = p_person_id AND is_deleted = false
  LIMIT 1;

  IF emergency_record_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Emergency contact record not found');
  END IF;

  -- Clear the specific field
  CASE p_field_name
    WHEN 'first_name' THEN
      UPDATE public.people_emergency SET first_name = NULL, updated_by = current_user_id, updated_at = now() WHERE id = emergency_record_id;
    WHEN 'last_name' THEN
      UPDATE public.people_emergency SET last_name = NULL, updated_by = current_user_id, updated_at = now() WHERE id = emergency_record_id;
    WHEN 'email' THEN
      UPDATE public.people_emergency SET email = NULL, updated_by = current_user_id, updated_at = now() WHERE id = emergency_record_id;
    WHEN 'phone_number' THEN
      UPDATE public.people_emergency SET phone_number = NULL, updated_by = current_user_id, updated_at = now() WHERE id = emergency_record_id;
    WHEN 'relationship' THEN
      UPDATE public.people_emergency SET relationship = NULL, updated_by = current_user_id, updated_at = now() WHERE id = emergency_record_id;
    ELSE
      RETURN json_build_object('success', false, 'message', 'Invalid field name');
  END CASE;

  SELECT json_build_object(
    'success', true,
    'message', 'Emergency contact field cleared successfully'
  ) INTO result;

  RETURN result;
END;
$function$;

-- Add user role and staff type update functions
CREATE OR REPLACE FUNCTION public.update_people_user_role(p_person_id uuid, p_role_name text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  role_id UUID;
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

  -- Update or insert role assignment
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
  )
  ON CONFLICT (person_id, user_role_id) 
  DO UPDATE SET
    is_deleted = false,
    updated_by = current_user_id,
    updated_at = now();

  -- Soft delete other role assignments for this person
  UPDATE public.people_assign_user_role
  SET is_deleted = true, deleted_by = current_user_id, deleted_at = now()
  WHERE person_id = p_person_id AND user_role_id != role_id AND is_deleted = false;

  SELECT json_build_object(
    'success', true,
    'message', 'User role updated successfully'
  ) INTO result;

  RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_people_staff_type(p_person_id uuid, p_staff_type text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  staff_type_id UUID;
  result JSON;
BEGIN
  -- Find staff type ID
  SELECT id INTO staff_type_id
  FROM public.app_user_staff_types
  WHERE staff_type = p_staff_type::staff_types_enum AND is_deleted = false
  LIMIT 1;

  IF staff_type_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Staff type not found');
  END IF;

  -- Update or insert staff type assignment
  INSERT INTO public.people_assign_staff_type (
    person_id,
    staff_type_id,
    created_by,
    updated_by
  ) VALUES (
    p_person_id,
    staff_type_id,
    current_user_id,
    current_user_id
  )
  ON CONFLICT (person_id, staff_type_id) 
  DO UPDATE SET
    is_deleted = false,
    updated_by = current_user_id,
    updated_at = now();

  -- Soft delete other staff type assignments for this person
  UPDATE public.people_assign_staff_type
  SET is_deleted = true, deleted_by = current_user_id, deleted_at = now()
  WHERE person_id = p_person_id AND staff_type_id != staff_type_id AND is_deleted = false;

  SELECT json_build_object(
    'success', true,
    'message', 'Staff type updated successfully'
  ) INTO result;

  RETURN result;
END;
$function$;