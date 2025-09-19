-- Fix the update_people_staff_type function to work without enum cast and ON CONFLICT
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
  -- Find staff type ID (remove enum cast)
  SELECT id INTO staff_type_id
  FROM public.app_user_staff_types
  WHERE staff_type::text = p_staff_type AND is_deleted = false
  LIMIT 1;

  IF staff_type_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Staff type not found');
  END IF;

  -- First, soft delete all existing staff type assignments for this person
  UPDATE public.people_assign_staff_type
  SET is_deleted = true, deleted_by = current_user_id, deleted_at = now()
  WHERE person_id = p_person_id AND is_deleted = false;

  -- Then insert the new staff type assignment
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
  );

  SELECT json_build_object(
    'success', true,
    'message', 'Staff type updated successfully'
  ) INTO result;

  RETURN result;
END;
$function$;