-- Create people_leads table (referencing existing tables)
CREATE TABLE public.people_leads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
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
  CONSTRAINT people_leads_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.app_organizations(id),
  CONSTRAINT people_leads_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT people_leads_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id),
  CONSTRAINT people_leads_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users(id)
);

-- Enable RLS on people_leads table
ALTER TABLE public.people_leads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for people_leads table
CREATE POLICY "Users can access their organization leads" 
ON public.people_leads 
FOR ALL
USING (
  is_deleted = false AND
  organization_id IN (
    SELECT id FROM public.app_organizations 
    WHERE user_id = auth.uid()
  )
);

-- Create function to update timestamps (if not exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for people_leads updated_at timestamp
CREATE TRIGGER update_people_leads_updated_at BEFORE
UPDATE ON public.people_leads FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();