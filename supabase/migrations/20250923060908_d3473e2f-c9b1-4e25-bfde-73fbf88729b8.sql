-- Drop existing get_leads_data function first
DROP FUNCTION IF EXISTS public.get_leads_data();

-- Create new get_leads_data function to query from people table with role 'lead'
CREATE OR REPLACE FUNCTION public.get_leads_data()
 RETURNS TABLE(lead_id uuid, person_id uuid, first_name text, last_name text, email text, phone text, created_at timestamp with time zone, lead_goals text, preferences text, expectation text, note text)
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
    p.id AS lead_id,
    p.id AS person_id,
    p.first_name,
    p.last_name, 
    pc.email,
    pc.phone,
    p.created_at,
    NULL::text AS lead_goals,
    NULL::text AS preferences,
    NULL::text AS expectation,
    NULL::text AS note
  FROM public.people p
  JOIN public.people_assign_user_role paur ON p.id = paur.person_id
  JOIN public.app_user_roles aur ON paur.user_role_id = aur.id
  JOIN public.app_agencies_people ap ON p.id = ap.person_id
  LEFT JOIN public.people_contacts pc ON p.id = pc.person_id AND pc.is_deleted = false
  LEFT JOIN public.people_referrals pr ON p.id = pr.person_id AND pr.is_deleted = false
  WHERE p.is_deleted = false 
    AND paur.is_deleted = false
    AND aur.is_deleted = false
    AND aur.role_name = 'lead'
    AND ap.is_deleted = false
    AND ap.agency_id = current_agency_id
    AND pr.id IS NULL  -- Exclude people who exist in people_referrals (not referrals)
  ORDER BY p.created_at DESC;
END;
$function$;