-- Create function to update people status
CREATE OR REPLACE FUNCTION public.update_people_status(p_person_id uuid, p_status text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  result JSON;
BEGIN
  -- Update the status in people table
  UPDATE public.people 
  SET 
    status = p_status,
    updated_by = current_user_id,
    updated_at = now()
  WHERE id = p_person_id
    AND is_deleted = false;

  -- Check if update was successful
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Person not found or no permission to update');
  END IF;

  SELECT json_build_object(
    'success', true,
    'message', 'Status updated successfully'
  ) INTO result;

  RETURN result;
END;
$function$;