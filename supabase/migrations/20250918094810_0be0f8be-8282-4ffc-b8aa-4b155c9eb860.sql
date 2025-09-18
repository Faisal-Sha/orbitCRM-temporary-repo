-- Add missing RLS policies for tables that still need them

-- Policies for app_agencies table
CREATE POLICY "Users can view agencies in their organization" 
ON public.app_agencies 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people ap ON p.id = ap.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND ap.is_deleted = false
      AND ap.agency_id = app_agencies.id
  )
);

CREATE POLICY "Users can create agencies" 
ON public.app_agencies 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their agencies" 
ON public.app_agencies 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_admins aa ON p.id = aa.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND aa.is_deleted = false
      AND aa.agency_id = app_agencies.id
  )
);

-- Policies for app_agencies_admins table
CREATE POLICY "Users can view agency admins in their organization" 
ON public.app_agencies_admins 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people ap ON p.id = ap.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND ap.is_deleted = false
      AND ap.agency_id = app_agencies_admins.agency_id
  )
);

CREATE POLICY "Admins can create agency admins" 
ON public.app_agencies_admins 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_admins aa ON p.id = aa.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND aa.is_deleted = false
      AND aa.agency_id = app_agencies_admins.agency_id
  )
);

-- Policies for app_agencies_people table
CREATE POLICY "Users can view agency people in their organization" 
ON public.app_agencies_people 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people ap ON p.id = ap.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND ap.is_deleted = false
      AND ap.agency_id = app_agencies_people.agency_id
  )
);

CREATE POLICY "Admins can create agency people" 
ON public.app_agencies_people 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_admins aa ON p.id = aa.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND aa.is_deleted = false
      AND aa.agency_id = app_agencies_people.agency_id
  )
);

-- Policies for people_assign_staff_type table
CREATE POLICY "Users can view staff type assignments in their organization" 
ON public.people_assign_staff_type 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people ap ON p.id = ap.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND ap.is_deleted = false
      AND p.id = people_assign_staff_type.person_id
  )
);

CREATE POLICY "Admins can create staff type assignments" 
ON public.people_assign_staff_type 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people ap ON p.id = ap.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND ap.is_deleted = false
  )
);

-- Policies for people_assign_user_role table
CREATE POLICY "Users can view role assignments in their organization" 
ON public.people_assign_user_role 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people ap ON p.id = ap.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND ap.is_deleted = false
      AND p.id = people_assign_user_role.person_id
  )
);

CREATE POLICY "Admins can create role assignments" 
ON public.people_assign_user_role 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people ap ON p.id = ap.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND ap.is_deleted = false
  )
);

-- Policies for app_organizations_owners table
CREATE POLICY "Owners can view their organization ownership" 
ON public.app_organizations_owners 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND p.id = app_organizations_owners.owner_id
  )
);

CREATE POLICY "System can create organization owners" 
ON public.app_organizations_owners 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Policies for app_global_people table
CREATE POLICY "Global admins can view global people" 
ON public.app_global_people 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_global_people gp ON p.id = gp.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND gp.is_deleted = false
  )
);