-- Create people_leads table
CREATE TABLE public.people_leads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL,
  person_id uuid NOT NULL,
  user_role_id uuid NOT NULL,
  lead_source_id text,
  lead_goals text,
  preferences text,
  expectation text,
  note text,
  service_id text,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  CONSTRAINT people_leads_pkey PRIMARY KEY (id),
  CONSTRAINT people_leads_agency_id_fkey FOREIGN KEY (agency_id) REFERENCES public.app_agencies(id),
  CONSTRAINT people_leads_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.people(id),
  CONSTRAINT people_leads_user_role_id_fkey FOREIGN KEY (user_role_id) REFERENCES public.app_user_roles(id),
  CONSTRAINT people_leads_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT people_leads_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id),
  CONSTRAINT people_leads_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users(id)
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

-- Create trigger for automatic updated_at timestamp
CREATE TRIGGER update_people_leads_updated_at
BEFORE UPDATE ON public.people_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();