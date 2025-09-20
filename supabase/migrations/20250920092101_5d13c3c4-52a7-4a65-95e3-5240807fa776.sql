-- Fix get_user_profile_data function to remove references to deleted columns
CREATE OR REPLACE FUNCTION public.get_user_profile_data(p_person_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  profile_data jsonb;
BEGIN
  -- Build the payload with independent subqueries to avoid row multiplication
  SELECT jsonb_build_object(
    'personal_info',
      jsonb_build_object(
        'first_name', p.first_name,
        'middle_name', p.middle_name,
        'last_name', p.last_name,
        'user_profile_bio', p.user_profile_bio,
        'user_profile_pic', p.user_profile_pic,
        'status', p.status
      ),

    'contact_info',
      COALESCE((
        SELECT jsonb_build_object(
          'email', pc.email,
          'work_email', pc.work_email,
          'phone', pc.phone,
          'phone_home', pc.phone_home,
          'address_line_1', pc.address_line_1,
          'address_line_2', pc.address_line_2,
          'city', pc.city,
          'state', pc.state,
          'zip_code', pc.zip_code,
          'url_facebook', pc.url_facebook,
          'url_instagram', pc.url_instagram,
          'url_tiktok', pc.url_tiktok,
          'url_linkedin', pc.url_linkedin
        )
        FROM public.people_contacts pc
        WHERE pc.person_id = p.id
          AND pc.is_deleted = false
        ORDER BY pc.updated_at DESC NULLS LAST, pc.created_at DESC NULLS LAST
        LIMIT 1
      ), '{}'::jsonb),

    'identifiers',
      COALESCE((
        SELECT jsonb_build_object(
          'date_of_birth', pi.date_of_birth,
          'ssn_number', pi.ssn_number,
          'npi_number', pi.npi_number,
          'insurance_provider', pi.insurance_provider,
          'insurance_number', pi.insurance_number,
          'insurance_expiration_date', pi.insurance_expiration_date,
          'gender_identity', pi.gender_identity,
          'ethnicity_identity', pi.ethnicity_identity,
          'marital_status', pi.marital_status,
          'living_situation', pi.living_situation
        )
        FROM public.people_identifiers pi
        WHERE pi.person_id = p.id
          AND pi.is_deleted = false
        ORDER BY pi.updated_at DESC NULLS LAST, pi.created_at DESC NULLS LAST
        LIMIT 1
      ), '{}'::jsonb),

    'emergency_contact',
      COALESCE((
        SELECT jsonb_build_object(
          'first_name', pe.first_name,
          'last_name', pe.last_name,
          'email', pe.email,
          'phone_number', pe.phone_number,
          'relationship', pe.relationship
        )
        FROM public.people_emergency pe
        WHERE pe.person_id = p.id
          AND pe.is_deleted = false
        ORDER BY pe.updated_at DESC NULLS LAST, pe.created_at DESC NULLS LAST
        LIMIT 1
      ), '{}'::jsonb),

    'referral_info',
      COALESCE((
        SELECT jsonb_build_object(
          'referral_type', pr.referral_type,
          'referral_relationship', pr.referral_relationship,
          'referred_by_name', pr.referred_by_name,
          'referral_note', pr.referral_note
        )
        FROM public.people_referrals pr
        WHERE pr.person_id = p.id
          AND pr.is_deleted = false
        ORDER BY pr.updated_at DESC NULLS LAST, pr.created_at DESC NULLS LAST
        LIMIT 1
      ), '{}'::jsonb),

    'lead_info',
      COALESCE((
        SELECT jsonb_build_object()
        FROM public.people_leads pl
        WHERE pl.person_id = p.id
          AND pl.is_deleted = false
        ORDER BY pl.updated_at DESC NULLS LAST, pl.created_at DESC NULLS LAST
        LIMIT 1
      ), '{}'::jsonb),

    'user_roles',
      COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object(
            'role_id', paur.user_role_id,
            'role_name', aur.role_name
          )
        )
        FROM public.people_assign_user_role paur
        JOIN public.app_user_roles aur ON paur.user_role_id = aur.id
        WHERE paur.person_id = p.id
          AND paur.is_deleted = false
          AND aur.is_deleted = false
      ), '[]'::jsonb),

    'staff_types',
      COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object(
            'staff_type_id', past.staff_type_id,
            'staff_type', aust.staff_type
          )
        )
        FROM public.people_assign_staff_type past
        JOIN public.app_user_staff_types aust ON past.staff_type_id = aust.id
        WHERE past.person_id = p.id
          AND past.is_deleted = false
          AND aust.is_deleted = false
      ), '[]'::jsonb)
  )
  INTO profile_data
  FROM public.people p
  WHERE p.id = p_person_id
    AND p.is_deleted = false;

  RETURN COALESCE(profile_data, '{}'::jsonb);
END;
$function$;

-- Fix update_people_leads_field function to return error for invalid fields
CREATE OR REPLACE FUNCTION public.update_people_leads_field(p_person_id uuid, p_field_name text, p_field_value text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  result JSON;
BEGIN
  -- All lead-specific fields have been removed, so return error for any field name
  RETURN json_build_object('success', false, 'message', 'Lead field updates are no longer supported');
END;
$function$;

-- Fix delete_people_additional_field function to remove references to deleted columns
CREATE OR REPLACE FUNCTION public.delete_people_additional_field(p_person_id uuid, p_field_name text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  result JSON;
BEGIN
  -- Clear the specific field based on table
  IF p_field_name IN ('date_of_birth', 'ssn_number', 'npi_number', 'insurance_provider', 'insurance_number', 'insurance_expiration_date', 'gender_identity', 'ethnicity_identity', 'marital_status', 'living_situation') THEN
    CASE p_field_name
      WHEN 'date_of_birth' THEN
        UPDATE public.people_identifiers SET date_of_birth = NULL, updated_by = current_user_id, updated_at = now() 
        WHERE person_id = p_person_id AND is_deleted = false;
      WHEN 'ssn_number' THEN
        UPDATE public.people_identifiers SET ssn_number = NULL, updated_by = current_user_id, updated_at = now() 
        WHERE person_id = p_person_id AND is_deleted = false;
      WHEN 'npi_number' THEN
        UPDATE public.people_identifiers SET npi_number = NULL, updated_by = current_user_id, updated_at = now() 
        WHERE person_id = p_person_id AND is_deleted = false;
      WHEN 'insurance_provider' THEN
        UPDATE public.people_identifiers SET insurance_provider = NULL, updated_by = current_user_id, updated_at = now() 
        WHERE person_id = p_person_id AND is_deleted = false;
      WHEN 'insurance_number' THEN
        UPDATE public.people_identifiers SET insurance_number = NULL, updated_by = current_user_id, updated_at = now() 
        WHERE person_id = p_person_id AND is_deleted = false;
      WHEN 'insurance_expiration_date' THEN
        UPDATE public.people_identifiers SET insurance_expiration_date = NULL, updated_by = current_user_id, updated_at = now() 
        WHERE person_id = p_person_id AND is_deleted = false;
      WHEN 'gender_identity' THEN
        UPDATE public.people_identifiers SET gender_identity = NULL, updated_by = current_user_id, updated_at = now() 
        WHERE person_id = p_person_id AND is_deleted = false;
      WHEN 'ethnicity_identity' THEN
        UPDATE public.people_identifiers SET ethnicity_identity = NULL, updated_by = current_user_id, updated_at = now() 
        WHERE person_id = p_person_id AND is_deleted = false;
      WHEN 'marital_status' THEN
        UPDATE public.people_identifiers SET marital_status = NULL, updated_by = current_user_id, updated_at = now() 
        WHERE person_id = p_person_id AND is_deleted = false;
      WHEN 'living_situation' THEN
        UPDATE public.people_identifiers SET living_situation = NULL, updated_by = current_user_id, updated_at = now() 
        WHERE person_id = p_person_id AND is_deleted = false;
    END CASE;
  ELSIF p_field_name IN ('referred_by_name') THEN
    CASE p_field_name
      WHEN 'referred_by_name' THEN
        UPDATE public.people_referrals SET referred_by_name = NULL, updated_by = current_user_id, updated_at = now() 
        WHERE person_id = p_person_id AND is_deleted = false;
    END CASE;
  ELSE
    RETURN json_build_object('success', false, 'message', 'Invalid field name');
  END IF;

  SELECT json_build_object(
    'success', true,
    'message', 'Additional field cleared successfully'
  ) INTO result;

  RETURN result;
END;
$function$;