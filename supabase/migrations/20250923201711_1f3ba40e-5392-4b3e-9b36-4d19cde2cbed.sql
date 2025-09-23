-- Create function to get active staff data with agency filtering
CREATE OR REPLACE FUNCTION public.get_active_staff_data()
RETURNS TABLE(
  person_id uuid,
  first_name text,
  last_name text,
  email text,
  phone text,
  status text,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_agency_id uuid;
BEGIN
  -- Get the current user's agency ID
  SELECT public.current_user_agency_id() INTO current_agency_id;
  
  IF current_agency_id IS NULL THEN
    -- Return empty result if user has no agency access
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    p.id as person_id,
    p.first_name,
    p.last_name,
    pc.email,
    pc.phone,
    p.status,
    p.created_at
  FROM public.people p
  JOIN public.app_agencies_people ap ON p.id = ap.person_id
  JOIN public.app_user_roles aur ON p.user_role_id = aur.id
  LEFT JOIN public.people_contacts pc ON p.id = pc.person_id AND pc.is_deleted = false
  WHERE p.is_deleted = false
    AND ap.is_deleted = false
    AND ap.agency_id = current_agency_id
    AND aur.role_name = 'staff'::user_roles_enum
    AND aur.is_deleted = false
    AND LOWER(p.status) IN ('active', 'on leave')
  ORDER BY p.created_at DESC;
END;
$function$;