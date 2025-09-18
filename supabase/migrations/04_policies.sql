-- Enable RLS
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies for app_users
DROP POLICY IF EXISTS "Users can view their own profile" ON public.app_users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.app_users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.app_users;

CREATE POLICY "Users can view their own profile" 
  ON public.app_users 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.app_users 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.app_users 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Enable RLS
ALTER TABLE public.app_organizations ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies completely
DROP POLICY IF EXISTS "Users can view active organizations" ON public.app_organizations;
DROP POLICY IF EXISTS "Users can create organizations" ON public.app_organizations;  
DROP POLICY IF EXISTS "Users can update organizations" ON public.app_organizations;

-- Create new comprehensive policies that handle soft delete properly

-- 1. SELECT: Only show active (non-deleted) organizations
CREATE POLICY "View active organizations only" 
ON public.app_organizations 
FOR SELECT 
TO authenticated
USING (is_deleted = false);

-- 2. INSERT: Allow creating new organizations
CREATE POLICY "Allow organization creation"
ON public.app_organizations
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. UPDATE: Allow updating organizations that are currently active, and allow any new values (including soft delete)
CREATE POLICY "Allow organization updates and soft deletes"
ON public.app_organizations  
FOR UPDATE
TO authenticated
USING (is_deleted = false)  -- Can only update currently active organizations
WITH CHECK (true);          -- But allow setting any new values (including is_deleted = true)

-- Enable RLS
ALTER TABLE public.app_user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view user roles" ON public.app_user_roles;
DROP POLICY IF EXISTS "Authenticated users can insert user roles" ON public.app_user_roles;
DROP POLICY IF EXISTS "Authenticated users can update user roles" ON public.app_user_roles;

-- Create new RLS policies for admin/owner only access
CREATE POLICY "Admin/Owner users can view user roles" 
ON public.app_user_roles 
FOR SELECT 
TO authenticated
USING (public.current_user_has_admin_role());

CREATE POLICY "Admin/Owner users can insert user roles" 
ON public.app_user_roles 
FOR INSERT 
TO authenticated
WITH CHECK (public.current_user_has_admin_role());

CREATE POLICY "Admin/Owner users can update user roles" 
ON public.app_user_roles 
FOR UPDATE 
TO authenticated
USING (public.current_user_has_admin_role())
WITH CHECK (public.current_user_has_admin_role());

-- Enable RLS on app_data_labels table
ALTER TABLE public.app_data_labels ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for app_data_labels
CREATE POLICY "Users can view labels in their organization" 
ON public.app_data_labels 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  )
);

CREATE POLICY "Users can create labels in their organization" 
ON public.app_data_labels 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  )
);

CREATE POLICY "Users can update labels in their organization" 
ON public.app_data_labels 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  )
);

CREATE POLICY "Users can delete labels in their organization" 
ON public.app_data_labels 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  )
);


-- Enable RLS
ALTER TABLE public.app_data_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view programs in their organization" 
ON public.app_data_programs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  )
);

CREATE POLICY "Users can create programs in their organization" 
ON public.app_data_programs 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  )
);

CREATE POLICY "Users can update programs in their organization" 
ON public.app_data_programs 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  )
);

CREATE POLICY "Users can delete programs in their organization" 
ON public.app_data_programs 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  )
);

-- Enable RLS
ALTER TABLE public.app_data_programs_goals ENABLE ROW LEVEL SECURITY;

-- View
CREATE POLICY "Users can view goals in their organization" 
ON public.app_data_programs_goals
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  )
);

CREATE POLICY "Users can create goals in their organization" 
ON public.app_data_programs_goals
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  )
);

CREATE POLICY "Users can update goals in their organization" 
ON public.app_data_programs_goals
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  )
);

CREATE POLICY "Users can delete goals in their organization" 
ON public.app_data_programs_goals
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  )
);


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
    JOIN app_agencies_people op ON ((p.id = op.person_id)))
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
    JOIN app_agencies_people op ON ((p.id = op.person_id)))
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
    JOIN app_agencies_people op ON ((p.id = op.person_id)))
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
    JOIN app_agencies_people op ON ((p.id = op.person_id)))
  WHERE ((au.user_id = auth.uid()) AND (p.is_deleted = false) AND (op.is_deleted = false))
));





-- Enable RLS on all the tables
ALTER TABLE public.app_agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_agencies_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_agencies_people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_global_people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_organizations_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_user_permissions_role ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_user_permissions_staff_type ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people_assign_staff_type ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people_assign_user_role ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people_contacts_emergency ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings_organization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings_organization_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people_contacts_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people_identifiers ENABLE ROW LEVEL SECURITY;


-- Add missing RLS policies for people tables
CREATE POLICY "Users can view identifiers in their organization" 
ON public.people_identifiers 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
      AND p.id = people_identifiers.person_id
  )
);

CREATE POLICY "Users can create identifiers in their organization" 
ON public.people_identifiers 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
      AND p.id = people_identifiers.person_id
  )
);

CREATE POLICY "Users can update identifiers in their organization" 
ON public.people_identifiers 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
      AND p.id = people_identifiers.person_id
  )
);

-- RLS Policies for people_contacts
CREATE POLICY "Users can view contacts in their organization" 
ON public.people_contacts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
      AND p.id = people_contacts.person_id
  )
);

CREATE POLICY "Users can create contacts in their organization" 
ON public.people_contacts 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
      AND p.id = people_contacts.person_id
  )
);

CREATE POLICY "Users can update contacts in their organization" 
ON public.people_contacts 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
      AND p.id = people_contacts.person_id
  )
);

-- RLS Policies for people_emergency
CREATE POLICY "Users can view emergency contacts in their organization" 
ON public.people_emergency 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
      AND p.id = people_emergency.person_id
  )
);

CREATE POLICY "Users can create emergency contacts in their organization" 
ON public.people_emergency 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
      AND p.id = people_emergency.person_id
  )
);

CREATE POLICY "Users can update emergency contacts in their organization" 
ON public.people_emergency 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
      AND p.id = people_emergency.person_id
  )
);

-- Enable RLS
ALTER TABLE public.people_leads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view leads in their organization" 
ON public.people_leads 
FOR SELECT 
USING (EXISTS (
  SELECT 1
  FROM people p
  JOIN app_users au ON p.user_account_id = au.id
  JOIN app_agencies_people op ON p.id = op.person_id
  WHERE au.user_id = auth.uid() 
    AND p.is_deleted = false 
    AND op.is_deleted = false 
    AND op.agency_id = people_leads.agency_id
));

CREATE POLICY "Users can create leads in their organization" 
ON public.people_leads 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1
  FROM people p
  JOIN app_users au ON p.user_account_id = au.id
  JOIN app_agencies_people op ON p.id = op.person_id
  WHERE au.user_id = auth.uid() 
    AND p.is_deleted = false 
    AND op.is_deleted = false 
    AND op.agency_id = people_leads.agency_id
));

CREATE POLICY "Users can update leads in their organization" 
ON public.people_leads 
FOR UPDATE 
USING (EXISTS (
  SELECT 1
  FROM people p
  JOIN app_users au ON p.user_account_id = au.id
  JOIN app_agencies_people op ON p.id = op.person_id
  WHERE au.user_id = auth.uid() 
    AND p.is_deleted = false 
    AND op.is_deleted = false 
    AND op.agency_id = people_leads.agency_id
));

CREATE POLICY "Users can delete leads in their organization" 
ON public.people_leads 
FOR DELETE 
USING (EXISTS (
  SELECT 1
  FROM people p
  JOIN app_users au ON p.user_account_id = au.id
  JOIN app_agencies_people op ON p.id = op.person_id
  WHERE au.user_id = auth.uid() 
    AND p.is_deleted = false 
    AND op.is_deleted = false 
    AND op.agency_id = people_leads.agency_id
));

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

-- Step 5: Enable RLS on people_referrals table
ALTER TABLE public.people_referrals ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies for people_referrals
-- Users can view referrals in their organization
CREATE POLICY "Users can view referrals in their organization" 
ON public.people_referrals 
FOR SELECT 
USING (EXISTS (
  SELECT 1
  FROM public.people p
  JOIN public.app_users au ON p.user_account_id = au.id
  JOIN public.app_agencies_people op ON p.id = op.person_id
  WHERE au.user_id = auth.uid() 
    AND p.is_deleted = false 
    AND op.is_deleted = false
));

-- Users can create referrals in their organization
CREATE POLICY "Users can create referrals in their organization" 
ON public.people_referrals 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1
  FROM public.people p
  JOIN public.app_users au ON p.user_account_id = au.id
  JOIN public.app_agencies_people op ON p.id = op.person_id
  WHERE au.user_id = auth.uid() 
    AND p.is_deleted = false 
    AND op.is_deleted = false
));

-- Users can update referrals in their organization
CREATE POLICY "Users can update referrals in their organization" 
ON public.people_referrals 
FOR UPDATE 
USING (EXISTS (
  SELECT 1
  FROM public.people p
  JOIN public.app_users au ON p.user_account_id = au.id
  JOIN public.app_agencies_people op ON p.id = op.person_id
  WHERE au.user_id = auth.uid() 
    AND p.is_deleted = false 
    AND op.is_deleted = false
));

-- Users can delete referrals in their organization
CREATE POLICY "Users can delete referrals in their organization" 
ON public.people_referrals 
FOR DELETE 
USING (EXISTS (
  SELECT 1
  FROM public.people p
  JOIN public.app_users au ON p.user_account_id = au.id
  JOIN public.app_agencies_people op ON p.id = op.person_id
  WHERE au.user_id = auth.uid() 
    AND p.is_deleted = false 
    AND op.is_deleted = false
));