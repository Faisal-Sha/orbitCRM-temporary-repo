CREATE OR REPLACE FUNCTION public.current_user_has_admin_role()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $func$
DECLARE
  v_person_id uuid;
  has_rights  boolean;
BEGIN
  -- Find the current user's person_id
  SELECT p.id
    INTO v_person_id
  FROM public.app_users au
  JOIN public.people p
    ON p.user_account_id = au.id
   AND p.is_deleted = false
  WHERE au.user_id = auth.uid()
  LIMIT 1;

  -- If not logged in or no person row, deny
  IF v_person_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Owner OR agency admin
  SELECT
    EXISTS (
      SELECT 1
      FROM public.app_agencies_admins aa
      WHERE aa.person_id = v_person_id
        AND aa.is_deleted = false
    )
    OR
    EXISTS (
      SELECT 1
      FROM public.app_organizations_owners oo
      WHERE oo.owner_id = v_person_id
        AND oo.is_deleted = false
    )
  INTO has_rights;

  RETURN COALESCE(has_rights, FALSE);
END;
$func$;

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

CREATE OR REPLACE FUNCTION public.current_user_permissions()
RETURNS text[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  pid uuid;
  perms text[];
  is_owner boolean;
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

  RETURN COALESCE(perms, ARRAY[]::text[]);
END;
$fn$;

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

