-- Create settings_services_insurances table
CREATE TABLE public.settings_services_insurances (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL,
  insurance_provider text,
  insurance_category public.insurance_category_enum NOT NULL DEFAULT 'medicaid',
  insurance_status public.service_status_enum NOT NULL DEFAULT 'active',
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  CONSTRAINT settings_services_insurances_pkey PRIMARY KEY (id),
  CONSTRAINT settings_services_insurances_agency_id_fkey FOREIGN KEY (agency_id) REFERENCES public.app_agencies(id),
  CONSTRAINT settings_services_insurances_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT settings_services_insurances_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id),
  CONSTRAINT settings_services_insurances_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users(id)
);

-- Create settings_services_and_fees table
CREATE TABLE public.settings_services_and_fees (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL,
  service text,
  service_category public.service_category_enum NOT NULL DEFAULT 'adults',
  service_status public.service_status_enum NOT NULL DEFAULT 'active',
  service_fee text,
  service_fee_type public.service_fee_type_enum NOT NULL DEFAULT 'per hour',
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  CONSTRAINT settings_services_and_fees_pkey PRIMARY KEY (id),
  CONSTRAINT settings_services_and_fees_agency_id_fkey FOREIGN KEY (agency_id) REFERENCES public.app_agencies(id),
  CONSTRAINT settings_services_and_fees_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT settings_services_and_fees_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id),
  CONSTRAINT settings_services_and_fees_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users(id)
);

-- Create people_assign_service table
CREATE TABLE public.people_assign_service (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL,
  service_id uuid NOT NULL,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  CONSTRAINT people_assign_service_pkey PRIMARY KEY (id),
  CONSTRAINT people_assign_service_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.people(id),
  CONSTRAINT people_assign_service_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.settings_services_and_fees(id),
  CONSTRAINT people_assign_service_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT people_assign_service_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id),
  CONSTRAINT people_assign_service_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users(id)
);