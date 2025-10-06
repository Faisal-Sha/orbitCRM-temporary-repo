-- Create RPC to get primary organization domain for current user
CREATE OR REPLACE FUNCTION public.get_primary_org_domain()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  org_id UUID;
  domain_result jsonb;
BEGIN
  -- Try to get organization through ownership
  SELECT s.organization_id INTO org_id
  FROM public.app_organizations_owners s
  JOIN public.people p ON s.owner_id = p.id
  JOIN public.app_users au ON p.user_account_id = au.id
  WHERE au.user_id = auth.uid()
    AND s.is_deleted = false
    AND p.is_deleted = false
  LIMIT 1;

  -- If not found, try through agency membership
  IF org_id IS NULL THEN
    SELECT DISTINCT ao.id INTO org_id
    FROM public.app_users au
    JOIN public.people p ON p.user_account_id = au.id
    JOIN public.app_agencies_people ap ON ap.person_id = p.id
    JOIN public.app_agencies aa ON aa.id = ap.agency_id
    JOIN public.app_organizations ao ON ao.id IS NOT NULL
    WHERE au.user_id = auth.uid()
      AND p.is_deleted = false
      AND ap.is_deleted = false
      AND aa.is_deleted = false
      AND ao.is_deleted = false
    LIMIT 1;
  END IF;

  -- If still no org found, return null
  IF org_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Get the first active domain for this organization
  SELECT jsonb_build_object(
    'protocol', sod.protocol,
    'domain', sod.domain
  ) INTO domain_result
  FROM public.settings_organization_domains sod
  WHERE sod.organization_id = org_id
    AND sod.is_deleted = false
  ORDER BY sod.created_at ASC
  LIMIT 1;

  RETURN domain_result;
END;
$function$;

-- Create RPC to get people with primary contact info for current user's agency
CREATE OR REPLACE FUNCTION public.get_people_with_primary_contact()
RETURNS TABLE(
  id uuid,
  first_name text,
  middle_name text,
  last_name text,
  email text,
  phone text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_agency_id uuid;
BEGIN
  -- Get current user's agency ID
  user_agency_id := public.current_user_agency_id();
  
  IF user_agency_id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    p.first_name,
    p.middle_name,
    p.last_name,
    COALESCE(
      (SELECT pc.email 
       FROM public.people_contacts pc 
       WHERE pc.person_id = p.id 
         AND pc.is_deleted = false 
       ORDER BY pc.updated_at DESC NULLS LAST, pc.created_at DESC NULLS LAST 
       LIMIT 1),
      ''
    ) as email,
    COALESCE(
      (SELECT pc.phone 
       FROM public.people_contacts pc 
       WHERE pc.person_id = p.id 
         AND pc.is_deleted = false 
       ORDER BY pc.updated_at DESC NULLS LAST, pc.created_at DESC NULLS LAST 
       LIMIT 1),
      ''
    ) as phone
  FROM public.people p
  JOIN public.app_agencies_people ap ON p.id = ap.person_id
  WHERE p.is_deleted = false
    AND ap.is_deleted = false
    AND ap.agency_id = user_agency_id
  ORDER BY p.first_name ASC, p.last_name ASC;
END;
$function$;