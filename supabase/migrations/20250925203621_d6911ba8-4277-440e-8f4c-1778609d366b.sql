-- Drop existing functions first
DROP FUNCTION IF EXISTS public.get_personal_profile();
DROP FUNCTION IF EXISTS public.update_personal_profile(text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, uuid);

-- Create get_personal_profile function to include work_email and phone_home
CREATE OR REPLACE FUNCTION public.get_personal_profile()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  person_id UUID;
  profile_data jsonb;
BEGIN
  -- Get person ID for current user
  SELECT p.id INTO person_id
  FROM public.people p
  JOIN public.app_users au ON p.user_account_id = au.id
  WHERE au.user_id = current_user_id
    AND p.is_deleted = false
    AND au.is_deleted = false
  LIMIT 1;

  IF person_id IS NULL THEN
    RETURN '{"error": "Person record not found"}'::jsonb;
  END IF;

  -- Build profile data
  SELECT jsonb_build_object(
    'first_name', p.first_name,
    'middle_name', p.middle_name,
    'last_name', p.last_name,
    'bio', p.user_profile_bio,
    'profile_pic', p.user_profile_pic,
    'email', pc.email,
    'work_email', pc.work_email,
    'phone', pc.phone,
    'phone_home', pc.phone_home,
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
  LEFT JOIN public.people_contacts pc ON p.id = pc.person_id AND pc.is_deleted = false
  WHERE p.id = person_id;

  RETURN COALESCE(profile_data, '{}'::jsonb);
END;
$function$;

-- Create update_personal_profile function to handle work_email and phone_home
CREATE OR REPLACE FUNCTION public.update_personal_profile(
  p_first_name text,
  p_middle_name text,
  p_last_name text,
  p_bio text,
  p_profile_pic text,
  p_phone text,
  p_work_email text,
  p_phone_home text,
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
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  person_id UUID;
  contact_record_id UUID;
  result JSON;
BEGIN
  -- Get person ID for current user
  SELECT p.id INTO person_id
  FROM public.people p
  JOIN public.app_users au ON p.user_account_id = au.id
  WHERE au.user_id = current_user_id
    AND p.is_deleted = false
    AND au.is_deleted = false
  LIMIT 1;

  IF person_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Person record not found');
  END IF;

  -- Update people table
  UPDATE public.people 
  SET 
    first_name = COALESCE(p_first_name, first_name),
    middle_name = p_middle_name,
    last_name = COALESCE(p_last_name, last_name),
    user_profile_bio = p_bio,
    user_profile_pic = p_profile_pic,
    updated_by = p_updated_by,
    updated_at = now()
  WHERE id = person_id;

  -- Find existing contact record
  SELECT id INTO contact_record_id
  FROM public.people_contacts
  WHERE person_id = person_id AND is_deleted = false
  LIMIT 1;

  -- If no contact record exists, create one with required email
  IF contact_record_id IS NULL THEN
    INSERT INTO public.people_contacts (
      person_id,
      email,
      work_email,
      phone,
      phone_home,
      address_line_1,
      address_line_2,
      city,
      state,
      zip_code,
      url_facebook,
      url_instagram,
      url_tiktok,
      url_linkedin,
      created_by,
      updated_by
    ) VALUES (
      person_id,
      'temp@example.com',
      p_work_email,
      p_phone,
      p_phone_home,
      p_address_line_1,
      p_address_line_2,
      p_city,
      p_state,
      p_zip_code,
      p_facebook,
      p_instagram,
      p_tiktok,
      p_linkedin,
      p_updated_by,
      p_updated_by
    );
  ELSE
    -- Update existing contact record
    UPDATE public.people_contacts 
    SET 
      work_email = p_work_email,
      phone = p_phone,
      phone_home = p_phone_home,
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
    WHERE id = contact_record_id;
  END IF;

  SELECT json_build_object(
    'success', true,
    'message', 'Profile updated successfully'
  ) INTO result;

  RETURN result;
END;
$function$;