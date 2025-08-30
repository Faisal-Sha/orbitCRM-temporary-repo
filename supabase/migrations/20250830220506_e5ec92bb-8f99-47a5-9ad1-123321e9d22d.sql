-- Create function to update personal profile data
CREATE OR REPLACE FUNCTION public.update_personal_profile(
  p_first_name text,
  p_middle_name text,
  p_last_name text,
  p_bio text,
  p_profile_pic text,
  p_phone text,
  p_address_line_1 text,
  p_address_line_2 text,
  p_city text,
  p_state text,
  p_zip_code text,
  p_facebook text,
  p_instagram text,
  p_tiktok text,
  p_linkedin text,
  p_updated_by uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  person_record_id UUID;
  result JSON;
BEGIN
  -- Find the person record linked to the current user
  SELECT p.id INTO person_record_id
  FROM public.people p
  JOIN public.app_users au ON p.user_account_id = au.id
  WHERE au.user_id = auth.uid() AND p.is_deleted = false
  LIMIT 1;

  IF person_record_id IS NOT NULL THEN
    -- Update people table
    UPDATE public.people 
    SET 
      first_name = p_first_name,
      middle_name = p_middle_name,
      last_name = p_last_name,
      user_profile_bio = p_bio,
      user_profile_pic = p_profile_pic,
      updated_by = p_updated_by,
      updated_at = now()
    WHERE id = person_record_id;

    -- Update people_contacts table
    UPDATE public.people_contacts 
    SET 
      phone = p_phone,
      address_line_1 = p_address_line_1,
      address_line_2 = p_address_line_2,
      city = p_city,
      state = p_state,
      zip_code = p_zip_code,
      url_facebook = p_facebook,
      url_instagram = p_instagram,
      url_tiktok = p_tiktok,
      url_linkedin = p_linkedin,
      updated_by = p_updated_by,
      updated_at = now()
    WHERE person_id = person_record_id AND is_deleted = false;

    SELECT json_build_object(
      'success', true,
      'message', 'Profile updated successfully',
      'person_id', person_record_id
    ) INTO result;
  ELSE
    SELECT json_build_object(
      'success', false,
      'message', 'Person record not found'
    ) INTO result;
  END IF;

  RETURN result;
END;
$$;

-- Create function to update email in people_contacts
CREATE OR REPLACE FUNCTION public.update_personal_email(
  p_email text,
  p_updated_by uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  person_record_id UUID;
  result JSON;
BEGIN
  -- Find the person record linked to the current user
  SELECT p.id INTO person_record_id
  FROM public.people p
  JOIN public.app_users au ON p.user_account_id = au.id
  WHERE au.user_id = auth.uid() AND p.is_deleted = false
  LIMIT 1;

  IF person_record_id IS NOT NULL THEN
    -- Update email in people_contacts table
    UPDATE public.people_contacts 
    SET 
      email = p_email,
      updated_by = p_updated_by,
      updated_at = now()
    WHERE person_id = person_record_id AND is_deleted = false;

    SELECT json_build_object(
      'success', true,
      'message', 'Email updated successfully in contacts',
      'person_id', person_record_id
    ) INTO result;
  ELSE
    SELECT json_build_object(
      'success', false,
      'message', 'Person record not found'
    ) INTO result;
  END IF;

  RETURN result;
END;
$$;

-- Create trigger to sync auth.users email changes to app_users table
CREATE OR REPLACE FUNCTION public.sync_auth_email_to_app_users()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Update account_email in app_users when auth.users email changes
  UPDATE public.app_users 
  SET 
    account_email = NEW.email,
    updated_at = now()
  WHERE user_id = NEW.id;

  RETURN NEW;
END;
$$;

-- Create trigger on auth.users table for email sync
DROP TRIGGER IF EXISTS sync_email_on_auth_users_update ON auth.users;
CREATE TRIGGER sync_email_on_auth_users_update
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_auth_email_to_app_users();

-- Create function to get personal profile data
CREATE OR REPLACE FUNCTION public.get_personal_profile()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  profile_data JSON;
BEGIN
  SELECT json_build_object(
    'first_name', p.first_name,
    'middle_name', p.middle_name,
    'last_name', p.last_name,
    'bio', p.user_profile_bio,
    'profile_pic', p.user_profile_pic,
    'email', pc.email,
    'phone', pc.phone,
    'address_line_1', pc.address_line_1,
    'address_line_2', pc.address_line_2,
    'city', pc.city,
    'state', pc.state,
    'zip_code', pc.zip_code,
    'facebook', pc.url_facebook,
    'instagram', pc.url_instagram,
    'tiktok', pc.url_tiktok,
    'linkedin', pc.url_linkedin
  ) INTO profile_data
  FROM public.people p
  JOIN public.app_users au ON p.user_account_id = au.id
  LEFT JOIN public.people_contacts pc ON p.id = pc.person_id AND pc.is_deleted = false
  WHERE au.user_id = auth.uid() AND p.is_deleted = false
  LIMIT 1;

  RETURN COALESCE(profile_data, '{}'::json);
END;
$$;