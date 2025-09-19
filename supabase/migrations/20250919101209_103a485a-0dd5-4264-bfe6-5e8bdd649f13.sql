-- Fix infinite recursion in app_agencies_people table RLS policies
-- Create security definer function to check user permissions without recursion

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

-- Drop existing problematic policies for app_agencies_people
DROP POLICY IF EXISTS "Admins can create agency people" ON public.app_agencies_people;
DROP POLICY IF EXISTS "Users can view agency people in their organization" ON public.app_agencies_people;

-- Create new policies using security definer functions
CREATE POLICY "Users can view agency people in their organization" 
ON public.app_agencies_people 
FOR SELECT 
USING (public.user_can_access_agency(agency_id));

CREATE POLICY "Admins can create agency people" 
ON public.app_agencies_people 
FOR INSERT 
WITH CHECK (public.user_can_access_agency(agency_id));