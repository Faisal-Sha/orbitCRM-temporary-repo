-- Enable RLS on people_assign_status table
ALTER TABLE public.people_assign_status ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for people_assign_status table
-- Users can view status records for people in their organization
CREATE POLICY "Users can view status records in their organization" 
ON public.people_assign_status 
FOR SELECT 
USING (EXISTS (
  SELECT 1
  FROM public.people p
  JOIN public.app_users au ON p.user_account_id = au.id
  JOIN public.app_agencies_people op ON p.id = op.person_id
  WHERE au.user_id = auth.uid() 
    AND p.is_deleted = false 
    AND op.is_deleted = false
    AND p.id = people_assign_status.person_id
));

-- Users can create status records for people in their organization
CREATE POLICY "Users can create status records in their organization" 
ON public.people_assign_status 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1
  FROM public.people p
  JOIN public.app_users au ON p.user_account_id = au.id
  JOIN public.app_agencies_people op ON p.id = op.person_id
  WHERE au.user_id = auth.uid() 
    AND p.is_deleted = false 
    AND op.is_deleted = false
    AND p.id = people_assign_status.person_id
));

-- Users can update status records for people in their organization
CREATE POLICY "Users can update status records in their organization" 
ON public.people_assign_status 
FOR UPDATE 
USING (EXISTS (
  SELECT 1
  FROM public.people p
  JOIN public.app_users au ON p.user_account_id = au.id
  JOIN public.app_agencies_people op ON p.id = op.person_id
  WHERE au.user_id = auth.uid() 
    AND p.is_deleted = false 
    AND op.is_deleted = false
    AND p.id = people_assign_status.person_id
));

-- Users can delete status records for people in their organization
CREATE POLICY "Users can delete status records in their organization" 
ON public.people_assign_status 
FOR DELETE 
USING (EXISTS (
  SELECT 1
  FROM public.people p
  JOIN public.app_users au ON p.user_account_id = au.id
  JOIN public.app_agencies_people op ON p.id = op.person_id
  WHERE au.user_id = auth.uid() 
    AND p.is_deleted = false 
    AND op.is_deleted = false
    AND p.id = people_assign_status.person_id
));