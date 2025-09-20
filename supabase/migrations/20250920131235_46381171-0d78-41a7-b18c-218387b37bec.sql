-- Update get_leads_data function to properly filter cold leads
CREATE OR REPLACE FUNCTION public.get_leads_data()
 RETURNS TABLE(lead_id uuid, person_id uuid, first_name text, last_name text, email text, phone text, created_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_agency_id uuid;
BEGIN
  -- Get the current user's agency ID
  SELECT current_user_agency_id() INTO current_agency_id;
  
  IF current_agency_id IS NULL THEN
    -- Return empty result if user has no agency access
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    pl.id AS lead_id,
    p.id AS person_id,
    p.first_name,
    p.last_name, 
    pc.email,
    pc.phone,
    pl.created_at
  FROM public.people_leads pl
  JOIN public.people p ON pl.person_id = p.id
  JOIN public.people_assign_user_role paur ON p.id = paur.person_id
  JOIN public.app_user_roles aur ON paur.user_role_id = aur.id
  JOIN public.app_agencies_people ap ON p.id = ap.person_id
  LEFT JOIN public.people_contacts pc ON p.id = pc.person_id AND pc.is_deleted = false
  LEFT JOIN public.people_referrals pr ON p.id = pr.person_id AND pr.is_deleted = false
  WHERE pl.is_deleted = false 
    AND p.is_deleted = false 
    AND p.status = 'active'
    AND paur.is_deleted = false
    AND aur.is_deleted = false
    AND aur.role_name = 'lead'
    AND ap.is_deleted = false
    AND ap.agency_id = current_agency_id
    AND pr.id IS NULL  -- Exclude people who exist in people_referrals (not referrals)
  ORDER BY pl.created_at DESC;
END;
$function$