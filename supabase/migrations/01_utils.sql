-- CREATE OR REPLACE FUNCTION public.current_user_has_admin_role()
-- RETURNS boolean
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- STABLE
-- SET search_path = public
-- AS $func$
-- BEGIN
--   RETURN EXISTS (
--     SELECT 1
--     FROM public.app_user_roles ur
--     JOIN public.app_agencies_people op ON ur.id = op.user_role_id
--     JOIN public.people p               ON op.person_id = p.id
--     JOIN public.app_users au           ON p.user_account_id = au.id
--     WHERE au.user_id = auth.uid()
--       AND p.is_deleted  = false
--       AND op.is_deleted = false
--       AND ur.is_deleted = false
--       AND ur.role_name IN ('admin', 'owner')
--   );
-- END;
-- $func$;



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


