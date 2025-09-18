-- Add missing RLS policies for sensitive data tables

-- Enable RLS on tables that don't have it enabled yet
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people_identifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people_emergency ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings_organization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings_organization_domains ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for people table (main sensitive data)
CREATE POLICY "Users can view people in their organization" 
ON public.people 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
      AND p.id = people.id
  )
);

CREATE POLICY "Users can create people in their organization" 
ON public.people 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  )
);

CREATE POLICY "Users can update people in their organization" 
ON public.people 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
      AND p.id = people.id
  )
);

-- Add RLS policies for settings tables
CREATE POLICY "Users can view organization settings" 
ON public.settings_organization 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_organizations_owners oo ON p.id = oo.owner_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND oo.is_deleted = false
      AND oo.organization_id = settings_organization.organization_id
  )
);

CREATE POLICY "Users can create organization settings" 
ON public.settings_organization 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_organizations_owners oo ON p.id = oo.owner_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND oo.is_deleted = false
      AND oo.organization_id = settings_organization.organization_id
  )
);

CREATE POLICY "Users can update organization settings" 
ON public.settings_organization 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_organizations_owners oo ON p.id = oo.owner_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND oo.is_deleted = false
      AND oo.organization_id = settings_organization.organization_id
  )
);

-- Add RLS policies for organization domains
CREATE POLICY "Users can view organization domains" 
ON public.settings_organization_domains 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_organizations_owners oo ON p.id = oo.owner_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND oo.is_deleted = false
      AND oo.organization_id = settings_organization_domains.organization_id
  )
);

CREATE POLICY "Users can create organization domains" 
ON public.settings_organization_domains 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_organizations_owners oo ON p.id = oo.owner_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND oo.is_deleted = false
      AND oo.organization_id = settings_organization_domains.organization_id
  )
);

CREATE POLICY "Users can update organization domains" 
ON public.settings_organization_domains 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_organizations_owners oo ON p.id = oo.owner_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND oo.is_deleted = false
      AND oo.organization_id = settings_organization_domains.organization_id
  )
);

-- Fix search_path for existing functions that don't have it set
CREATE OR REPLACE FUNCTION public.current_user_person_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT p.id
  FROM public.people p
  JOIN public.app_users au ON p.user_account_id = au.id
  WHERE au.user_id = auth.uid()
    AND p.is_deleted = false
    AND au.is_deleted = false
  LIMIT 1;
$function$;