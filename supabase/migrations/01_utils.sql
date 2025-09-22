-- Update current_user_has_admin_role to check both app_agencies_admins and ownership
CREATE OR REPLACE FUNCTION public.current_user_has_admin_role()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
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

CREATE OR REPLACE FUNCTION public.current_user_app_user_id()
RETURNS uuid AS $$
DECLARE
  app_user_id uuid;
BEGIN
  SELECT au.id INTO app_user_id
  FROM public.app_users au
  WHERE au.user_id = auth.uid()
  AND au.is_deleted = false
  LIMIT 1;
  
  RETURN app_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Create function to check if user can access agency data
CREATE OR REPLACE FUNCTION public.user_can_access_agency(target_agency_id uuid)
RETURNS boolean AS $$
DECLARE
  user_app_id uuid;
  has_access boolean := false;
BEGIN
  user_app_id := public.current_user_app_user_id();
  
  IF user_app_id IS NULL THEN
    RETURN false;
  END IF;

  -- Check if user is in the agency via app_agencies_people
  SELECT EXISTS (
    SELECT 1
    FROM public.app_agencies_people ap
    JOIN public.people p ON ap.person_id = p.id
    WHERE p.user_account_id = user_app_id
    AND ap.agency_id = target_agency_id
    AND p.is_deleted = false
    AND ap.is_deleted = false
  ) INTO has_access;

  -- If not found, check if user is agency admin
  IF NOT has_access THEN
    SELECT EXISTS (
      SELECT 1
      FROM public.app_agencies_admins aa
      JOIN public.people p ON aa.person_id = p.id
      WHERE p.user_account_id = user_app_id
      AND aa.agency_id = target_agency_id
      AND p.is_deleted = false
      AND aa.is_deleted = false
    ) INTO has_access;
  END IF;

  RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.current_user_person_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id
  FROM public.people p
  JOIN public.app_users au ON p.user_account_id = au.id
  WHERE au.user_id = auth.uid()
    AND p.is_deleted = false
    AND au.is_deleted = false
  LIMIT 1;
$$;


CREATE OR REPLACE FUNCTION public.current_user_is_owner()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH me AS (SELECT public.current_user_person_id() AS person_id)
  SELECT EXISTS (
    SELECT 1
    FROM public.app_organizations_owners o, me
    WHERE o.is_deleted = false
      AND o.owner_id = me.person_id
  );
$$;

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

-- Update current_user_permissions function to grant settings.view permission to agency admins
CREATE OR REPLACE FUNCTION public.current_user_permissions()
 RETURNS text[]
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  pid uuid;
  perms text[];
  is_owner boolean;
  is_agency_admin boolean;
BEGIN
  pid := public.current_user_person_id();
  IF pid IS NULL THEN
    RETURN ARRAY[]::text[];
  END IF;

  -- Role-based permissions (global + agency)
  perms := ARRAY(
    SELECT DISTINCT p.user_permissions
    FROM (
      -- Roles from global
      SELECT gp.user_role_id
      FROM public.app_global_people gp
      WHERE gp.is_deleted = false
        AND gp.person_id = pid

      UNION

      -- Roles from agency memberships
      SELECT ap.user_role_id
      FROM public.app_agencies_people ap
      WHERE ap.is_deleted = false
        AND ap.person_id = pid
    ) roles
    JOIN public.app_user_permissions_role upr
      ON upr.user_role_id = roles.user_role_id
     AND upr.is_deleted = false
    JOIN public.app_user_permissions p
      ON p.id = upr.user_permission_id
     AND p.is_deleted = false
  );

  -- Staff-type permissions (from agency memberships)
  perms := ARRAY(
    SELECT DISTINCT x
    FROM (
      SELECT unnest(perms) AS x
      UNION
      SELECT p2.user_permissions
      FROM public.app_agencies_people ap2
      JOIN public.app_user_permissions_staff_type pst
        ON pst.staff_type_id = ap2.user_staff_type_id
       AND pst.is_deleted = false
      JOIN public.app_user_permissions p2
        ON p2.id = pst.user_permission_id
       AND p2.is_deleted = false
      WHERE ap2.is_deleted = false
        AND ap2.person_id = pid
        AND ap2.user_staff_type_id IS NOT NULL
    ) u
  );

  -- Owner bonus permissions
  is_owner := public.current_user_is_owner();
  IF is_owner THEN
    perms := ARRAY(
      SELECT DISTINCT y
      FROM (
        SELECT unnest(perms) AS y
        UNION SELECT 'owner.view'
        UNION SELECT 'settings.view'
      ) t
    );
  END IF;

  -- Agency admin bonus permissions
  is_agency_admin := EXISTS (
    SELECT 1
    FROM public.app_agencies_admins aa
    WHERE aa.person_id = pid
      AND aa.is_deleted = false
  );
  
  IF is_agency_admin THEN
    perms := ARRAY(
      SELECT DISTINCT z
      FROM (
        SELECT unnest(perms) AS z
        UNION SELECT 'settings.view'
      ) t2
    );
  END IF;

  RETURN COALESCE(perms, ARRAY[]::text[]);
END;
$function$

CREATE OR REPLACE FUNCTION public.current_user_has_permission(p_permission text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  perms text[];
BEGIN
  -- Owners pass everything
  IF public.current_user_is_owner() THEN
    RETURN true;
  END IF;

  perms := public.current_user_permissions();
  RETURN p_permission = ANY(perms);
END;
$fn$;

CREATE OR REPLACE FUNCTION public.current_user_has_agency_access()
RETURNS boolean AS $$
DECLARE
  has_access boolean := false;
BEGIN
  -- Check if user has agency access via app_agencies_people
  SELECT EXISTS (
    SELECT 1
    FROM public.app_users au
    JOIN public.app_agencies_people ap ON au.id = (
      SELECT p.user_account_id 
      FROM public.people p 
      WHERE p.id = ap.person_id 
      AND p.is_deleted = false
      LIMIT 1
    )
    WHERE au.user_id = auth.uid()
    AND ap.is_deleted = false
  ) INTO has_access;

  -- If not found in agencies_people, check agencies_admins
  IF NOT has_access THEN
    SELECT EXISTS (
      SELECT 1
      FROM public.app_users au
      JOIN public.app_agencies_admins aa ON au.id = (
        SELECT p.user_account_id 
        FROM public.people p 
        WHERE p.id = aa.person_id 
        AND p.is_deleted = false
        LIMIT 1
      )
      WHERE au.user_id = auth.uid()
      AND aa.is_deleted = false
    ) INTO has_access;
  END IF;

  RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

