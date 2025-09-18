-- Enable RLS on the new tables
ALTER TABLE public.settings_services_insurances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings_services_and_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people_assign_service ENABLE ROW LEVEL SECURITY;

-- RLS Policies for settings_services_insurances
CREATE POLICY "Users can view insurances in their agency" 
ON public.settings_services_insurances 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people ap ON p.id = ap.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND ap.is_deleted = false
      AND ap.agency_id = settings_services_insurances.agency_id
  )
);

CREATE POLICY "Users can create insurances in their agency" 
ON public.settings_services_insurances 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people ap ON p.id = ap.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND ap.is_deleted = false
      AND ap.agency_id = settings_services_insurances.agency_id
  )
);

CREATE POLICY "Users can update insurances in their agency" 
ON public.settings_services_insurances 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people ap ON p.id = ap.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND ap.is_deleted = false
      AND ap.agency_id = settings_services_insurances.agency_id
  )
);

CREATE POLICY "Users can delete insurances in their agency" 
ON public.settings_services_insurances 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people ap ON p.id = ap.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND ap.is_deleted = false
      AND ap.agency_id = settings_services_insurances.agency_id
  )
);

-- RLS Policies for settings_services_and_fees
CREATE POLICY "Users can view services in their agency" 
ON public.settings_services_and_fees 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people ap ON p.id = ap.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND ap.is_deleted = false
      AND ap.agency_id = settings_services_and_fees.agency_id
  )
);

CREATE POLICY "Users can create services in their agency" 
ON public.settings_services_and_fees 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people ap ON p.id = ap.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND ap.is_deleted = false
      AND ap.agency_id = settings_services_and_fees.agency_id
  )
);

CREATE POLICY "Users can update services in their agency" 
ON public.settings_services_and_fees 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people ap ON p.id = ap.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND ap.is_deleted = false
      AND ap.agency_id = settings_services_and_fees.agency_id
  )
);

CREATE POLICY "Users can delete services in their agency" 
ON public.settings_services_and_fees 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people ap ON p.id = ap.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND ap.is_deleted = false
      AND ap.agency_id = settings_services_and_fees.agency_id
  )
);

-- RLS Policies for people_assign_service
CREATE POLICY "Users can view service assignments in their agency" 
ON public.people_assign_service 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people ap ON p.id = ap.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND ap.is_deleted = false
      AND p.id = people_assign_service.person_id
  )
);

CREATE POLICY "Users can create service assignments in their agency" 
ON public.people_assign_service 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people ap ON p.id = ap.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND ap.is_deleted = false
      AND p.id = people_assign_service.person_id
  )
);

CREATE POLICY "Users can update service assignments in their agency" 
ON public.people_assign_service 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people ap ON p.id = ap.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND ap.is_deleted = false
      AND p.id = people_assign_service.person_id
  )
);

CREATE POLICY "Users can delete service assignments in their agency" 
ON public.people_assign_service 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people ap ON p.id = ap.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND ap.is_deleted = false
      AND p.id = people_assign_service.person_id
  )
);