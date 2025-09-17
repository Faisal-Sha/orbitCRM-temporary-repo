-- Contact field management functions for GeneralTab
CREATE OR REPLACE FUNCTION public.update_people_contact_field(
  p_person_id UUID,
  p_field_name TEXT,
  p_field_value TEXT
)
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
      CASE WHEN p_field_name = 'email' THEN p_field_value ELSE 'temp@example.com' END,
      current_user_id,
      current_user_id
    ) RETURNING id INTO contact_record_id;
  END IF;

  -- Update the specific field
  CASE p_field_name
    WHEN 'email' THEN
      UPDATE public.people_contacts SET email = p_field_value, updated_by = current_user_id, updated_at = now() WHERE id = contact_record_id;
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

CREATE OR REPLACE FUNCTION public.update_people_contact_address(
  p_person_id UUID,
  p_address_line_1 TEXT,
  p_address_line_2 TEXT,
  p_city TEXT,
  p_state TEXT,
  p_zip_code TEXT
)
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
      address_line_1,
      address_line_2,
      city,
      state,
      zip_code,
      created_by,
      updated_by
    ) VALUES (
      p_person_id,
      'temp@example.com',
      p_address_line_1,
      p_address_line_2,
      p_city,
      p_state,
      p_zip_code,
      current_user_id,
      current_user_id
    );
  ELSE
    -- Update address fields
    UPDATE public.people_contacts 
    SET 
      address_line_1 = p_address_line_1,
      address_line_2 = p_address_line_2,
      city = p_city,
      state = p_state,
      zip_code = p_zip_code,
      updated_by = current_user_id,
      updated_at = now()
    WHERE id = contact_record_id;
  END IF;

  SELECT json_build_object(
    'success', true,
    'message', 'Address updated successfully'
  ) INTO result;

  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_people_contact_field(
  p_person_id UUID,
  p_field_name TEXT
)
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
  -- Find existing contact record
  SELECT id INTO contact_record_id
  FROM public.people_contacts
  WHERE person_id = p_person_id AND is_deleted = false
  LIMIT 1;

  IF contact_record_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Contact record not found');
  END IF;

  -- Clear the specific field
  CASE p_field_name
    WHEN 'work_email' THEN
      UPDATE public.people_contacts SET work_email = NULL, updated_by = current_user_id, updated_at = now() WHERE id = contact_record_id;
    WHEN 'phone_home' THEN
      UPDATE public.people_contacts SET phone_home = NULL, updated_by = current_user_id, updated_at = now() WHERE id = contact_record_id;
    WHEN 'url_facebook' THEN
      UPDATE public.people_contacts SET url_facebook = NULL, updated_by = current_user_id, updated_at = now() WHERE id = contact_record_id;
    WHEN 'url_instagram' THEN
      UPDATE public.people_contacts SET url_instagram = NULL, updated_by = current_user_id, updated_at = now() WHERE id = contact_record_id;
    WHEN 'url_tiktok' THEN
      UPDATE public.people_contacts SET url_tiktok = NULL, updated_by = current_user_id, updated_at = now() WHERE id = contact_record_id;
    WHEN 'url_linkedin' THEN
      UPDATE public.people_contacts SET url_linkedin = NULL, updated_by = current_user_id, updated_at = now() WHERE id = contact_record_id;
    WHEN 'address' THEN
      UPDATE public.people_contacts 
      SET address_line_1 = NULL, address_line_2 = NULL, city = NULL, state = NULL, zip_code = NULL, 
          updated_by = current_user_id, updated_at = now() 
      WHERE id = contact_record_id;
    ELSE
      RETURN json_build_object('success', false, 'message', 'Cannot delete required field or invalid field name');
  END CASE;

  SELECT json_build_object(
    'success', true,
    'message', 'Contact field cleared successfully'
  ) INTO result;

  RETURN result;
END;
$$;