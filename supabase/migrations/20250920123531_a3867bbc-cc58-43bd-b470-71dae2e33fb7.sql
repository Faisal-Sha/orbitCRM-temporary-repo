-- Create people_clients table
CREATE TABLE public.people_clients (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id uuid NOT NULL,
  person_id uuid NOT NULL,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false
);

-- Create people_assign_assessor table
CREATE TABLE public.people_assign_assessor (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id uuid NOT NULL,
  person_id uuid NOT NULL,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false
);

-- Create people_assign_provider table
CREATE TABLE public.people_assign_provider (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id uuid NOT NULL,
  person_id uuid NOT NULL,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false
);

-- Enable RLS on all tables
ALTER TABLE public.people_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people_assign_assessor ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people_assign_provider ENABLE ROW LEVEL SECURITY;

-- RLS Policies for people_clients
CREATE POLICY "Users can view clients in their agency"
  ON public.people_clients
  FOR SELECT
  USING (user_can_access_agency(agency_id));

CREATE POLICY "Users can create clients in their agency"
  ON public.people_clients
  FOR INSERT
  WITH CHECK (user_can_access_agency(agency_id));

CREATE POLICY "Users can update clients in their agency"
  ON public.people_clients
  FOR UPDATE
  USING (user_can_access_agency(agency_id));

CREATE POLICY "Users can delete clients in their agency"
  ON public.people_clients
  FOR DELETE
  USING (user_can_access_agency(agency_id));

-- RLS Policies for people_assign_assessor
CREATE POLICY "Users can view assessor assignments in their agency"
  ON public.people_assign_assessor
  FOR SELECT
  USING (user_can_access_agency(agency_id));

CREATE POLICY "Users can create assessor assignments in their agency"
  ON public.people_assign_assessor
  FOR INSERT
  WITH CHECK (user_can_access_agency(agency_id));

CREATE POLICY "Users can update assessor assignments in their agency"
  ON public.people_assign_assessor
  FOR UPDATE
  USING (user_can_access_agency(agency_id));

CREATE POLICY "Users can delete assessor assignments in their agency"
  ON public.people_assign_assessor
  FOR DELETE
  USING (user_can_access_agency(agency_id));

-- RLS Policies for people_assign_provider
CREATE POLICY "Users can view provider assignments in their agency"
  ON public.people_assign_provider
  FOR SELECT
  USING (user_can_access_agency(agency_id));

CREATE POLICY "Users can create provider assignments in their agency"
  ON public.people_assign_provider
  FOR INSERT
  WITH CHECK (user_can_access_agency(agency_id));

CREATE POLICY "Users can update provider assignments in their agency"
  ON public.people_assign_provider
  FOR UPDATE
  USING (user_can_access_agency(agency_id));

CREATE POLICY "Users can delete provider assignments in their agency"
  ON public.people_assign_provider
  FOR DELETE
  USING (user_can_access_agency(agency_id));

-- Create indexes for performance
CREATE INDEX idx_people_clients_agency_person ON public.people_clients (agency_id, person_id) WHERE is_deleted = false;
CREATE INDEX idx_people_clients_agency ON public.people_clients (agency_id) WHERE is_deleted = false;
CREATE INDEX idx_people_clients_person ON public.people_clients (person_id) WHERE is_deleted = false;

CREATE INDEX idx_people_assign_assessor_agency_person ON public.people_assign_assessor (agency_id, person_id) WHERE is_deleted = false;
CREATE INDEX idx_people_assign_assessor_agency ON public.people_assign_assessor (agency_id) WHERE is_deleted = false;
CREATE INDEX idx_people_assign_assessor_person ON public.people_assign_assessor (person_id) WHERE is_deleted = false;

CREATE INDEX idx_people_assign_provider_agency_person ON public.people_assign_provider (agency_id, person_id) WHERE is_deleted = false;
CREATE INDEX idx_people_assign_provider_agency ON public.people_assign_provider (agency_id) WHERE is_deleted = false;
CREATE INDEX idx_people_assign_provider_person ON public.people_assign_provider (person_id) WHERE is_deleted = false;