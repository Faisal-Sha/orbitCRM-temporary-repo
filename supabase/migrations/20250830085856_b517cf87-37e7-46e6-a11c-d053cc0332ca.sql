-- Create function to link user account with existing person record
CREATE OR REPLACE FUNCTION public.link_user_to_person(
  user_email TEXT,
  new_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  person_record_id UUID;
  app_user_record_id UUID;
  result JSON;
BEGIN
  -- Find the person record by email
  SELECT p.id INTO person_record_id
  FROM public.people p
  JOIN public.people_contacts pc ON p.id = pc.person_id
  WHERE pc.email = user_email AND p.is_deleted = false AND pc.is_deleted = false
  LIMIT 1;

  -- Find the app_users record by user_id
  SELECT id INTO app_user_record_id
  FROM public.app_users
  WHERE user_id = new_user_id
  LIMIT 1;

  -- If both records exist, update the person record
  IF person_record_id IS NOT NULL AND app_user_record_id IS NOT NULL THEN
    UPDATE public.people 
    SET 
      user_account_id = app_user_record_id,
      updated_at = now()
    WHERE id = person_record_id;

    SELECT json_build_object(
      'success', true,
      'message', 'User account linked to person record successfully',
      'person_id', person_record_id,
      'app_user_id', app_user_record_id
    ) INTO result;
  ELSE
    SELECT json_build_object(
      'success', false,
      'message', 'Person record or app_users record not found',
      'person_id', person_record_id,
      'app_user_id', app_user_record_id
    ) INTO result;
  END IF;

  RETURN result;
END;
$$;