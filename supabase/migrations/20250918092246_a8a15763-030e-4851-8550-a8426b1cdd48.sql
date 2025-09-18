-- Simplify the update_people_contact_field function since email updates are now handled by edge function
CREATE OR REPLACE FUNCTION public.update_people_contact_field(p_person_id uuid, p_field_name text, p_field_value text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_id UUID := auth.uid();
  contact_record_id UUID;
  result JSON;
BEGIN
  -- Email updates are now handled by the comprehensive edge function
  IF p_field_name = 'email' THEN
    RETURN json_build_object('success', false, 'message', 'Email updates should use the comprehensive edge function');
  END IF;

  -- Find existing contact record
  SELECT id INTO contact_record_id
  FROM public.people_contacts
  WHERE person_id = p_person_id AND is_deleted = false
  LIMIT 1;

  -- If no contact record exists, create one
  IF contact_record_id IS NULL THEN
    INSERT INTO public.people_contacts (
      person_id,
      email,
      created_by,
      updated_by
    ) VALUES (
      p_person_id,
      'temp@example.com',
      current_user_id,
      current_user_id
    ) RETURNING id INTO contact_record_id;
  END IF;

  -- Update the specific field
  CASE p_field_name
    WHEN 'work_email' THEN
      UPDATE public.people_contacts SET work_email = p_field_value, updated_by = current_user_id, updated_at = now() WHERE id = contact_record_id;
    WHEN 'phone' THEN
      UPDATE public.people_contacts SET phone = p_field_value, updated_by = current_user_id, updated_at = now() WHERE id = contact_record_id;
    WHEN 'phone_home' THEN
      UPDATE public.people_contacts SET phone_home = p_field_value, updated_by = current_user_id, updated_at = now() WHERE id = contact_record_id;
    WHEN 'url_facebook' THEN
      UPDATE public.people_contacts SET url_facebook = p_field_value, updated_by = current_user_id, updated_at = now() WHERE id = contact_record_id;
    WHEN 'url_instagram' THEN
      UPDATE public.people_contacts SET url_instagram = p_field_value, updated_by = current_user_id, updated_at = now() WHERE id = contact_record_id;
    WHEN 'url_tiktok' THEN
      UPDATE public.people_contacts SET url_tiktok = p_field_value, updated_by = current_user_id, updated_at = now() WHERE id = contact_record_id;
    WHEN 'url_linkedin' THEN
      UPDATE public.people_contacts SET url_linkedin = p_field_value, updated_by = current_user_id, updated_at = now() WHERE id = contact_record_id;
    ELSE
      RETURN json_build_object('success', false, 'message', 'Invalid field name');
  END CASE;

  SELECT json_build_object(
    'success', true,
    'message', 'Contact field updated successfully'
  ) INTO result;

  RETURN result;
END;
$$;

-- Remove the comprehensive email update function since it's now handled by edge function
DROP FUNCTION IF EXISTS public.update_contact_email_comprehensive(uuid, text);