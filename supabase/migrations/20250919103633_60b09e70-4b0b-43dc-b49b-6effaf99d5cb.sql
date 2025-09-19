-- Fix RLS policies for settings_services_and_fees table to prevent infinite recursion
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view services in their agency" ON public.settings_services_and_fees;
DROP POLICY IF EXISTS "Users can create services in their agency" ON public.settings_services_and_fees;
DROP POLICY IF EXISTS "Users can update services in their agency" ON public.settings_services_and_fees;
DROP POLICY IF EXISTS "Users can delete services in their agency" ON public.settings_services_and_fees;

-- Create new policies using security definer function
CREATE POLICY "Users can view services in their agency" 
ON public.settings_services_and_fees 
FOR SELECT 
USING (user_can_access_agency(agency_id));

CREATE POLICY "Users can create services in their agency" 
ON public.settings_services_and_fees 
FOR INSERT 
WITH CHECK (user_can_access_agency(agency_id));

CREATE POLICY "Users can update services in their agency" 
ON public.settings_services_and_fees 
FOR UPDATE 
USING (user_can_access_agency(agency_id))
WITH CHECK (user_can_access_agency(agency_id));

CREATE POLICY "Users can delete services in their agency" 
ON public.settings_services_and_fees 
FOR DELETE 
USING (user_can_access_agency(agency_id));