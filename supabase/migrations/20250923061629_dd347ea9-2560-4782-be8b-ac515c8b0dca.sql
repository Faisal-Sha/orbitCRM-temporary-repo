-- Drop existing functions first
DROP FUNCTION IF EXISTS public.get_user_profile_data(uuid);
DROP FUNCTION IF EXISTS public.update_people_leads_field(uuid, text, text);

-- Recreate get_user_profile_data function without people_leads references
CREATE OR REPLACE FUNCTION public.get_user_profile_data(p_person_id uuid)
 RETURNS TABLE(person_id uuid, first_name text, last_name text, middle_name text, user_profile_pic text, user_profile_bio text, status text, user_role text, staff_type text, email text, work_email text, phone text, phone_home text, address_line_1 text, address_line_2 text, city text, state text, zip_code text, country text, url_facebook text, url_instagram text, url_tiktok text, url_linkedin text, date_of_birth date, ssn_number text, npi_number text, insurance_provider text, insurance_number text, insurance_expiration_date date, gender_identity text, ethnicity_identity text, marital_status text, living_situation text, emergency_first_name text, emergency_last_name text, emergency_email text, emergency_phone_number text, emergency_relationship text, referred_by_name text, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    p.id AS person_id,
    p.first_name,
    p.last_name,
    p.middle_name,
    p.user_profile_pic,
    p.user_profile_bio,
    p.status,
    aur.role_name::text AS user_role,
    aust.staff_type::text AS staff_type,
    pc.email,
    pc.work_email,
    pc.phone,
    pc.phone_home,
    pc.address_line_1,
    pc.address_line_2,
    pc.city,
    pc.state,
    pc.zip_code,
    pc.country,
    pc.url_facebook,
    pc.url_instagram,
    pc.url_tiktok,
    pc.url_linkedin,
    pi.date_of_birth,
    pi.ssn_number,
    pi.npi_number,
    pi.insurance_provider,
    pi.insurance_number,
    pi.insurance_expiration_date,
    pi.gender_identity,
    pi.ethnicity_identity,
    pi.marital_status,
    pi.living_situation,
    pe.first_name AS emergency_first_name,
    pe.last_name AS emergency_last_name,
    pe.email AS emergency_email,
    pe.phone_number AS emergency_phone_number,
    pe.relationship::text AS emergency_relationship,
    pr.referred_by_name,
    p.created_at,
    p.updated_at
  FROM public.people p
  LEFT JOIN public.app_user_roles aur ON p.user_role_id = aur.id AND aur.is_deleted = false
  LEFT JOIN public.app_user_staff_types aust ON p.staff_type_id = aust.id AND aust.is_deleted = false
  LEFT JOIN public.people_contacts pc ON p.id = pc.person_id AND pc.is_deleted = false
  LEFT JOIN public.people_identifiers pi ON p.id = pi.person_id AND pi.is_deleted = false
  LEFT JOIN public.people_emergency pe ON p.id = pe.person_id AND pe.is_deleted = false
  LEFT JOIN public.people_referrals pr ON p.id = pr.person_id AND pr.is_deleted = false
  WHERE p.id = p_person_id AND p.is_deleted = false;
END;
$function$;

-- Recreate update_people_leads_field function to return error since leads table no longer exists
CREATE OR REPLACE FUNCTION public.update_people_leads_field(p_person_id uuid, p_field_name text, p_field_value text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Leads functionality has been removed - return error for any field name
  RETURN json_build_object('success', false, 'message', 'Lead field updates are no longer supported - leads table has been removed');
END;
$function$;