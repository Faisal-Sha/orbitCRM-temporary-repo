-- Create function to update people name fields
CREATE OR REPLACE FUNCTION public.update_people_name_field(
  p_person_id uuid,
  p_first_name text,
  p_middle_name text,
  p_last_name text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  result JSON;
BEGIN
  -- Update the name fields in people table
  UPDATE public.people 
  SET 
    first_name = p_first_name,
    middle_name = p_middle_name,
    last_name = p_last_name,
    updated_by = current_user_id,
    updated_at = now()
  WHERE id = p_person_id
    AND is_deleted = false;

  SELECT json_build_object(
    'success', true,
    'message', 'Name updated successfully'
  ) INTO result;

  RETURN result;
END;
$function$;