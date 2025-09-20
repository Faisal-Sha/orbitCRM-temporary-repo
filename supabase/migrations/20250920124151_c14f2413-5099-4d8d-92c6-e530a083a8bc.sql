-- Add foreign keys for people_clients
ALTER TABLE public.people_clients
  ADD CONSTRAINT people_clients_agency_id_fkey
    FOREIGN KEY (agency_id) REFERENCES public.app_agencies(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  ADD CONSTRAINT people_clients_person_id_fkey
    FOREIGN KEY (person_id) REFERENCES public.people(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  ADD CONSTRAINT people_clients_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD CONSTRAINT people_clients_updated_by_fkey
    FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD CONSTRAINT people_clients_deleted_by_fkey
    FOREIGN KEY (deleted_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add foreign keys for people_assign_assessor
ALTER TABLE public.people_assign_assessor
  ADD CONSTRAINT people_assign_assessor_agency_id_fkey
    FOREIGN KEY (agency_id) REFERENCES public.app_agencies(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  ADD CONSTRAINT people_assign_assessor_person_id_fkey
    FOREIGN KEY (person_id) REFERENCES public.people(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  ADD CONSTRAINT people_assign_assessor_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD CONSTRAINT people_assign_assessor_updated_by_fkey
    FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD CONSTRAINT people_assign_assessor_deleted_by_fkey
    FOREIGN KEY (deleted_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add foreign keys for people_assign_provider
ALTER TABLE public.people_assign_provider
  ADD CONSTRAINT people_assign_provider_agency_id_fkey
    FOREIGN KEY (agency_id) REFERENCES public.app_agencies(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  ADD CONSTRAINT people_assign_provider_person_id_fkey
    FOREIGN KEY (person_id) REFERENCES public.people(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  ADD CONSTRAINT people_assign_provider_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD CONSTRAINT people_assign_provider_updated_by_fkey
    FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD CONSTRAINT people_assign_provider_deleted_by_fkey
    FOREIGN KEY (deleted_by) REFERENCES auth.users(id) ON DELETE SET NULL;