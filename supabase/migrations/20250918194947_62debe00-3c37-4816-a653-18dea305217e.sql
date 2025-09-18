-- Update current_user_agency_id to check both app_agencies_people and app_agencies_admins
CREATE OR REPLACE FUNCTION public.current_user_agency_id()
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  agency_id UUID;
BEGIN
  -- First check app_agencies_people (regular people)
  SELECT ap.agency_id INTO agency_id
  FROM public.people p
  JOIN public.app_users au ON p.user_account_id = au.id
  JOIN public.app_agencies_people ap ON p.id = ap.person_id
  WHERE au.user_id = auth.uid() 
    AND p.is_deleted = false 
    AND ap.is_deleted = false
  LIMIT 1;

  -- If not found, check app_agencies_admins (admin access)
  IF agency_id IS NULL THEN
    SELECT aa.agency_id INTO agency_id
    FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_admins aa ON p.id = aa.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND aa.is_deleted = false
    LIMIT 1;
  END IF;

  RETURN agency_id;
END;
$function$;

-- Update current_user_has_admin_role to check both app_agencies_admins and ownership
CREATE OR REPLACE FUNCTION public.current_user_has_admin_role()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  pid uuid;
  is_admin boolean := false;
BEGIN
  pid := public.current_user_person_id();
  IF pid IS NULL THEN
    RETURN false;
  END IF;

  -- Check if user is an owner
  IF public.current_user_is_owner() THEN
    RETURN true;
  END IF;

  -- Check if user is an agency admin
  SELECT EXISTS (
    SELECT 1
    FROM public.app_agencies_admins aa
    WHERE aa.person_id = pid
      AND aa.is_deleted = false
  ) INTO is_admin;

  RETURN is_admin;
END;
$function$;