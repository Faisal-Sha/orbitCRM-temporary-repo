-- Fix infinite recursion in people table RLS policies
-- Create security definer function to check agency membership without recursion

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

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can create people in their organization" ON public.people;
DROP POLICY IF EXISTS "Users can update people in their organization" ON public.people;
DROP POLICY IF EXISTS "Users can view people in their organization" ON public.people;

-- Create new policies using the security definer function
CREATE POLICY "Users can view people in their organization" 
ON public.people 
FOR SELECT 
USING (public.current_user_has_agency_access());

CREATE POLICY "Users can create people in their organization" 
ON public.people 
FOR INSERT 
WITH CHECK (public.current_user_has_agency_access());

CREATE POLICY "Users can update people in their organization" 
ON public.people 
FOR UPDATE 
USING (public.current_user_has_agency_access());