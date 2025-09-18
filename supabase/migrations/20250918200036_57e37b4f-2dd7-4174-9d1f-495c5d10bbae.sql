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