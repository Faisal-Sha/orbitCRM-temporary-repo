-- Create comprehensive email update function that updates all three tables
CREATE OR REPLACE FUNCTION public.update_contact_email_comprehensive(
  p_person_id uuid,
  p_new_email text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_id UUID := auth.uid();
  contact_record_id UUID;
  app_user_record_id UUID;
  auth_user_id UUID;
  result JSON;
BEGIN
  -- Validate email format
  IF p_new_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RETURN json_build_object('success', false, 'message', 'Invalid email format');
  END IF;

  -- Check if email already exists in people_contacts (excluding current person)
  IF EXISTS (
    SELECT 1 FROM public.people_contacts pc
    JOIN public.people p ON pc.person_id = p.id
    WHERE pc.email = p_new_email 
      AND pc.person_id != p_person_id 
      AND pc.is_deleted = false 
      AND p.is_deleted = false
  ) THEN
    RETURN json_build_object('success', false, 'message', 'Email already exists for another person');
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
      p_new_email,
      current_user_id,
      current_user_id
    ) RETURNING id INTO contact_record_id;
  ELSE
    -- Update the email in people_contacts
    UPDATE public.people_contacts 
    SET 
      email = p_new_email,
      updated_by = current_user_id,
      updated_at = now()
    WHERE id = contact_record_id;
  END IF;

  -- Find linked app_users and auth_users records
  SELECT 
    p.user_account_id,
    au.user_id
  INTO 
    app_user_record_id,
    auth_user_id
  FROM public.people p
  LEFT JOIN public.app_users au ON p.user_account_id = au.id
  WHERE p.id = p_person_id AND p.is_deleted = false
  LIMIT 1;

  -- If person is linked to a user account, update app_users and auth_users
  IF app_user_record_id IS NOT NULL AND auth_user_id IS NOT NULL THEN
    -- Update app_users table
    UPDATE public.app_users
    SET 
      account_email = p_new_email,
      updated_by = current_user_id,
      updated_at = now()
    WHERE id = app_user_record_id;

    -- Update auth.users table using admin client
    -- Note: This requires service role key and should be called from an edge function
    -- For now, we'll return a flag indicating auth update is needed
    SELECT json_build_object(
      'success', true,
      'message', 'Contact email updated successfully',
      'auth_update_needed', true,
      'auth_user_id', auth_user_id,
      'new_email', p_new_email
    ) INTO result;
  ELSE
    -- Person not linked to user account, only people_contacts was updated
    SELECT json_build_object(
      'success', true,
      'message', 'Contact email updated successfully',
      'auth_update_needed', false
    ) INTO result;
  END IF;

  RETURN result;
END;
$$;

-- Update the existing function to use comprehensive email update
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
  -- For email field, use comprehensive update function
  IF p_field_name = 'email' THEN
    RETURN public.update_contact_email_comprehensive(p_person_id, p_field_value);
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
      CASE WHEN p_field_name = 'email' THEN p_field_value ELSE 'temp@example.com' END,
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