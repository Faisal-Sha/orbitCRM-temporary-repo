-- Function to get current user's agency ID
CREATE OR REPLACE FUNCTION public.current_user_agency_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  agency_id UUID;
BEGIN
  -- Get the agency ID for the current authenticated user
  SELECT ap.agency_id INTO agency_id
  FROM public.people p
  JOIN public.app_users au ON p.user_account_id = au.id
  JOIN public.app_agencies_people ap ON p.id = ap.person_id
  WHERE au.user_id = auth.uid() 
    AND p.is_deleted = false 
    AND ap.is_deleted = false
  LIMIT 1;

  RETURN agency_id;
END;
$$;