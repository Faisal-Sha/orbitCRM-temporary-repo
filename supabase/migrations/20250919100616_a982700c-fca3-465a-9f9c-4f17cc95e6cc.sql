-- Fix security warnings: Set search_path for functions that are missing it

-- Update existing functions that don't have search_path set
CREATE OR REPLACE FUNCTION public.current_user_has_admin_role()
RETURNS boolean AS $$
BEGIN
  -- Check if user is an owner
  IF public.current_user_is_owner() THEN
    RETURN true;
  END IF;
  
  -- Check if user is an agency admin
  RETURN EXISTS (
    SELECT 1
    FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_admins aa ON p.id = aa.person_id
    WHERE au.user_id = auth.uid()
      AND p.is_deleted = false
      AND aa.is_deleted = false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Check which tables have RLS enabled but no policies
-- (We'll address these next if any are found)