-- Enable Row Level Security on app_user_staff_types table
ALTER TABLE public.app_user_staff_types ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users in organizations to view staff types
CREATE POLICY "Users can view staff types in their organization" 
ON public.app_user_staff_types 
FOR SELECT 
USING (EXISTS ( 
  SELECT 1
  FROM ((people p
    JOIN app_users au ON ((p.user_account_id = au.id)))
    JOIN app_organization_people op ON ((p.id = op.person_id)))
  WHERE ((au.user_id = auth.uid()) AND (p.is_deleted = false) AND (op.is_deleted = false))
));

-- Create policy that allows users in organizations to create staff types
CREATE POLICY "Users can create staff types in their organization" 
ON public.app_user_staff_types 
FOR INSERT 
WITH CHECK (EXISTS ( 
  SELECT 1
  FROM ((people p
    JOIN app_users au ON ((p.user_account_id = au.id)))
    JOIN app_organization_people op ON ((p.id = op.person_id)))
  WHERE ((au.user_id = auth.uid()) AND (p.is_deleted = false) AND (op.is_deleted = false))
));

-- Create policy that allows users in organizations to update staff types
CREATE POLICY "Users can update staff types in their organization" 
ON public.app_user_staff_types 
FOR UPDATE 
USING (EXISTS ( 
  SELECT 1
  FROM ((people p
    JOIN app_users au ON ((p.user_account_id = au.id)))
    JOIN app_organization_people op ON ((p.id = op.person_id)))
  WHERE ((au.user_id = auth.uid()) AND (p.is_deleted = false) AND (op.is_deleted = false))
));

-- Create policy that allows users in organizations to delete (soft delete) staff types  
CREATE POLICY "Users can delete staff types in their organization" 
ON public.app_user_staff_types 
FOR UPDATE 
USING (EXISTS ( 
  SELECT 1
  FROM ((people p
    JOIN app_users au ON ((p.user_account_id = au.id)))
    JOIN app_organization_people op ON ((p.id = op.person_id)))
  WHERE ((au.user_id = auth.uid()) AND (p.is_deleted = false) AND (op.is_deleted = false))
));