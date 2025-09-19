-- Fix the update_people_emergency_field function to return JSON and handle missing records
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
  IF p_field_name = 'relationship' THEN
    UPDATE public.people_emergency 
    SET relationship = p_field_value::emergency_relationship_enum,
        updated_by = current_user_id,
        updated_at = now()
    WHERE id = emergency_record_id;
  ELSIF p_field_name = 'first_name' THEN
    UPDATE public.people_emergency 
    SET first_name = p_field_value,
        updated_by = current_user_id,
        updated_at = now()
    WHERE id = emergency_record_id;
  ELSIF p_field_name = 'last_name' THEN
    UPDATE public.people_emergency 
    SET last_name = p_field_value,
        updated_by = current_user_id,
        updated_at = now()
    WHERE id = emergency_record_id;
  ELSIF p_field_name = 'phone_number' THEN
    UPDATE public.people_emergency 
    SET phone_number = p_field_value,
        updated_by = current_user_id,
        updated_at = now()
    WHERE id = emergency_record_id;
  ELSIF p_field_name = 'email' THEN
    UPDATE public.people_emergency 
    SET email = p_field_value,
        updated_by = current_user_id,
        updated_at = now()
    WHERE id = emergency_record_id;
  ELSE
    RETURN json_build_object('success', false, 'message', 'Invalid field name');
  END IF;

  SELECT json_build_object(
    'success', true,
    'message', 'Emergency contact field updated successfully'
  ) INTO result;

  RETURN result;
END;
$function$;