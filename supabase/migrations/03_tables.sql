CREATE TABLE public.app_data_labels (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_by uuid,
  updated_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  label_color text,
  label_name text,
  label_category text,
  text_color text,
  font_weight text,
  CONSTRAINT app_data_labels_pkey PRIMARY KEY (id),
  CONSTRAINT app_data_labels_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id),
  CONSTRAINT app_data_labels_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

CREATE TABLE public.app_data_programs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  program_name text,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  CONSTRAINT app_data_programs_pkey PRIMARY KEY (id),
  CONSTRAINT app_data_programs_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id),
  CONSTRAINT app_data_programs_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT app_data_programs_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users(id)
);

CREATE TABLE public.app_data_programs_goals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  goal_name text,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  program_id uuid,
  CONSTRAINT app_data_programs_goals_pkey PRIMARY KEY (id),
  CONSTRAINT app_data_programs_goals_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.app_data_programs(id),
  CONSTRAINT app_data_programs_goals_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT app_data_programs_goals_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users(id),
  CONSTRAINT app_data_programs_goals_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id)
);

CREATE TABLE public.app_user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  role_name public.user_roles_enum NOT NULL DEFAULT 'general'::user_roles_enum,
  role_label_id uuid,
  CONSTRAINT app_user_roles_pkey PRIMARY KEY (id),
  CONSTRAINT fk_user_roles_updated_by FOREIGN KEY (updated_by) REFERENCES auth.users(id),
  CONSTRAINT fk_user_roles_deleted_by FOREIGN KEY (deleted_by) REFERENCES auth.users(id),
  CONSTRAINT app_user_roles_role_label_id_fkey FOREIGN KEY (role_label_id) REFERENCES public.app_data_labels(id),
  CONSTRAINT fk_user_roles_created_by FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

CREATE TABLE public.app_user_permissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  user_permissions text,
  CONSTRAINT app_user_permissions_pkey PRIMARY KEY (id),
  CONSTRAINT app_user_permissions_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users(id),
  CONSTRAINT app_user_permissions_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT app_user_permissions_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id)
);


CREATE TABLE public.app_user_permissions_role (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  user_role_id uuid NOT NULL,
  user_permission_id uuid NOT NULL,
  CONSTRAINT app_user_permissions_role_pkey PRIMARY KEY (id),
  CONSTRAINT app_user_permissions_role_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id),
  CONSTRAINT app_user_permissions_role_user_role_id_fkey FOREIGN KEY (user_role_id) REFERENCES public.app_user_roles(id),
  CONSTRAINT app_user_permissions_role_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users(id),
  CONSTRAINT app_user_permissions_role_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT app_user_permissions_role_user_permission_id_fkey FOREIGN KEY (user_permission_id) REFERENCES public.app_user_permissions(id)
);

CREATE TABLE public.app_user_staff_types (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  staff_type public.staff_type_enum NOT NULL,
  staff_type_label_id uuid,
  CONSTRAINT app_user_staff_types_pkey PRIMARY KEY (id),
  CONSTRAINT app_staff_types_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT app_staff_types_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users(id),
  CONSTRAINT app_staff_types_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id),
  CONSTRAINT app_user_staff_types_staff_type_label_id_fkey FOREIGN KEY (staff_type_label_id) REFERENCES public.app_data_labels(id)
);

CREATE TABLE public.app_user_permissions_staff_type (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  staff_type_id uuid NOT NULL,
  user_permission_id uuid NOT NULL,
  CONSTRAINT app_user_permissions_staff_type_pkey PRIMARY KEY (id),
  CONSTRAINT app_user_permissions_staff_type_staff_type_id_fkey FOREIGN KEY (staff_type_id) REFERENCES public.app_user_staff_types(id),
  CONSTRAINT app_user_permissions_staff_type_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT app_user_permissions_staff_type_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users(id),
  CONSTRAINT app_user_permissions_staff_type_user_permission_id_fkey FOREIGN KEY (user_permission_id) REFERENCES public.app_user_permissions(id),
  CONSTRAINT app_user_permissions_staff_type_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id)
);

CREATE TABLE public.app_users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  account_email text NOT NULL,
  CONSTRAINT app_users_pkey PRIMARY KEY (id),
  CONSTRAINT fk_app_users_created_by FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT app_users_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users(id),
  CONSTRAINT app_users_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id),
  CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.people (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_account_id uuid,
  user_role_id uuid,
  staff_type_id uuid,
  first_name text NOT NULL,
  middle_name text,
  last_name text NOT NULL,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active',
  user_profile_pic text,
  user_profile_bio text,
  CONSTRAINT people_pkey PRIMARY KEY (id),
  CONSTRAINT fk_people_user_account FOREIGN KEY (user_account_id) REFERENCES public.app_users(id),
  CONSTRAINT fk_people_user_role_id FOREIGN KEY (user_role_id) REFERENCES public.app_user_roles(id),
  CONSTRAINT fk_people_staff_type_id FOREIGN KEY (staff_type_id) REFERENCES public.app_user_staff_types(id),
  CONSTRAINT fk_people_updated_by FOREIGN KEY (updated_by) REFERENCES auth.users(id),
  CONSTRAINT fk_people_deleted_by FOREIGN KEY (deleted_by) REFERENCES auth.users(id),
  CONSTRAINT fk_people_created_by FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

CREATE TABLE public.people_contacts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL UNIQUE,
  email text NOT NULL,
  work_email text,
  phone text,
  phone_home text,
  address_line_1 text,
  address_line_2 text,
  city text,
  state text,
  zip_code text,
  country text NOT NULL DEFAULT 'USA'::text,
  url_facebook text,
  url_instagram text,
  url_tiktok text,
  url_linkedin text,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  CONSTRAINT people_contacts_pkey PRIMARY KEY (id),
  CONSTRAINT fk_people_contacts_deleted_by FOREIGN KEY (deleted_by) REFERENCES auth.users(id),
  CONSTRAINT fk_people_contacts_person FOREIGN KEY (person_id) REFERENCES public.people(id),
  CONSTRAINT fk_people_contacts_created_by FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT fk_people_contacts_updated_by FOREIGN KEY (updated_by) REFERENCES auth.users(id)
);

CREATE TABLE public.people_emergency (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL,
  first_name text,
  last_name text,
  email text,
  phone_number text,
  relationship public.emergency_relationship_enum,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  CONSTRAINT people_emergency_pkey PRIMARY KEY (id),
  CONSTRAINT fk_people_emergency_updated_by FOREIGN KEY (updated_by) REFERENCES auth.users(id),
  CONSTRAINT fk_people_emergency_created_by FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT fk_people_emergency_deleted_by FOREIGN KEY (deleted_by) REFERENCES auth.users(id),
  CONSTRAINT fk_people_emergency_person FOREIGN KEY (person_id) REFERENCES public.people(id)
);

CREATE TABLE public.people_referrals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL,
  referred_by_id uuid,
  referred_by_name text,
  referral_type public.referral_type_enum,
  referral_relationship public.referral_relationship_enum,
  referral_note text,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  CONSTRAINT people_referrals_pkey PRIMARY KEY (id),
  CONSTRAINT fk_people_referrals_created_by FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT fk_people_referrals_updated_by FOREIGN KEY (updated_by) REFERENCES auth.users(id),
  CONSTRAINT fk_people_referrals_deleted_by FOREIGN KEY (deleted_by) REFERENCES auth.users(id),
  CONSTRAINT fk_people_referrals_referred_by FOREIGN KEY (referred_by_id) REFERENCES public.people(id)
  CONSTRAINT fk_people_referrals_person_id FOREIGN KEY (person_id) REFERENCES public.people(id);
);

CREATE TABLE public.people_identifiers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL UNIQUE,
  date_of_birth date,
  npi_number text,
  ssn_number text,
  insurance_provider text,
  insurance_number text,
  insurance_expiration_date date,
  gender_identity text,
  ethnicity_identity text,
  marital_status text,
  living_situation text,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  CONSTRAINT people_identifiers_pkey PRIMARY KEY (id),
  CONSTRAINT fk_people_identifiers_created_by FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT fk_people_identifiers_updated_by FOREIGN KEY (updated_by) REFERENCES auth.users(id),
  CONSTRAINT fk_people_identifiers_person FOREIGN KEY (person_id) REFERENCES public.people(id),
  CONSTRAINT fk_people_identifiers_deleted_by FOREIGN KEY (deleted_by) REFERENCES auth.users(id)
);


CREATE TABLE public.people_assign_staff_type (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  staff_type_id uuid NOT NULL,
  CONSTRAINT people_assign_staff_type_pkey PRIMARY KEY (id),
  CONSTRAINT people_assign_staff_type_staff_type_id_fkey FOREIGN KEY (staff_type_id) REFERENCES public.app_user_staff_types(id),
  CONSTRAINT people_assign_staff_type_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.people(id),
  CONSTRAINT people_assign_staff_type_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users(id),
  CONSTRAINT people_assign_staff_type_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT people_assign_staff_type_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id)
);

CREATE TABLE public.people_assign_user_role (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  user_role_id uuid NOT NULL,
  CONSTRAINT people_assign_user_role_pkey PRIMARY KEY (id),
  CONSTRAINT people_assign_user_role_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.people(id),
  CONSTRAINT people_assign_user_role_user_role_id_fkey FOREIGN KEY (user_role_id) REFERENCES public.app_user_roles(id),
  CONSTRAINT people_assign_user_role_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id),
  CONSTRAINT people_assign_user_role_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users(id),
  CONSTRAINT people_assign_user_role_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

CREATE TABLE public.app_organizations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  organization_name text,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  status public.organization_status_enum NOT NULL DEFAULT 'active'::organization_status_enum,
  organization_state text,
  CONSTRAINT app_organizations_pkey PRIMARY KEY (id),
  CONSTRAINT fk_app_organizations_deleted_by FOREIGN KEY (deleted_by) REFERENCES auth.users(id),
  CONSTRAINT fk_app_organizations_created_by FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT fk_app_organizations_updated_by FOREIGN KEY (updated_by) REFERENCES auth.users(id)
);

CREATE TABLE public.app_organizations_owners (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  owner_id uuid NOT NULL,
  is_deleted boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NULL,
  deleted_at timestamp with time zone NULL,
  created_by uuid NOT NULL,
  updated_by uuid NULL,
  deleted_by uuid NULL,
  CONSTRAINT app_organization_owners_pkey PRIMARY KEY (id),
  CONSTRAINT app_organization_owners_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users (id),
  CONSTRAINT app_organization_owners_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users (id),
  CONSTRAINT app_organization_owners_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES app_organizations (id),
  CONSTRAINT app_organization_owners_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES people (id),
  CONSTRAINT app_organization_owners_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users (id)
);

CREATE TABLE public.settings_organization (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  address_line_1 text,
  address_line_2 text,
  zip_cone text,
  country text,
  default_language text,
  default_currency text,
  default_timezone text,
  facebook_url text,
  instagram_url text,
  x_url text,
  tiktok_url text,
  linkedin_url text,
  google_profile_url text,
  youtube_url text,
  organization_logo text,
  CONSTRAINT settings_organization_pkey PRIMARY KEY (id),
  CONSTRAINT settings_organization_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users(id),
  CONSTRAINT settings_organization_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.app_organizations(id),
  CONSTRAINT settings_organization_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id),
  CONSTRAINT settings_organization_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

CREATE TABLE public.settings_organization_domains (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  domain text,
  protocol text,
  CONSTRAINT settings_organization_domains_pkey PRIMARY KEY (id),
  CONSTRAINT app_organization_domains_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.app_organizations(id),
  CONSTRAINT app_organization_domains_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT app_organization_domains_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id),
  CONSTRAINT app_organization_domains_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users(id)
);

CREATE TABLE public.app_agencies (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  agency_name text NOT NULL UNIQUE,
  agency_state text,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  status public.agency_status_enum NOT NULL DEFAULT 'active'::agency_status_enum,
  CONSTRAINT app_agencies_pkey PRIMARY KEY (id),
  CONSTRAINT app_agency_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id),
  CONSTRAINT app_agency_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users(id),
  CONSTRAINT app_agency_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

CREATE TABLE public.app_agencies_admins (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL,
  person_id uuid NOT NULL,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  CONSTRAINT app_agencies_admins_pkey PRIMARY KEY (id),
  CONSTRAINT fk_app_org_admins_created_by FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT fk_app_org_admins_deleted_by FOREIGN KEY (deleted_by) REFERENCES auth.users(id),
  CONSTRAINT fk_app_org_admins_updated_by FOREIGN KEY (updated_by) REFERENCES auth.users(id),
  CONSTRAINT app_agencies_admins_agency_id_fkey FOREIGN KEY (agency_id) REFERENCES public.app_agencies(id),
  CONSTRAINT app_organization_admins_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.people(id)
);

CREATE TABLE public.app_agencies_people (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL,
  person_id uuid NOT NULL,
  user_role_id uuid NOT NULL,
  user_staff_type_id uuid NULL,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  CONSTRAINT app_agencies_people_pkey PRIMARY KEY (id),
  CONSTRAINT fk_app_org_people_role FOREIGN KEY (user_role_id) REFERENCES public.app_user_roles(id),
  CONSTRAINT fk_app_org_people_created_by FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT fk_app_org_people_deleted_by FOREIGN KEY (deleted_by) REFERENCES auth.users(id),
  CONSTRAINT fk_app_org_people_person FOREIGN KEY (person_id) REFERENCES public.people(id),
  CONSTRAINT fk_app_org_people_updated_by FOREIGN KEY (updated_by) REFERENCES auth.users(id),
  CONSTRAINT app_agencies_people_agency_id_fkey FOREIGN KEY (agency_id) REFERENCES public.app_agencies(id),
  CONSTRAINT app_agencies_people_user_staff_type_id_fkey FOREIGN KEY (user_staff_type_id) REFERENCES public.app_user_staff_types(id)
);

CREATE TABLE public.app_global_people (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL UNIQUE,
  user_role_id uuid NOT NULL,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  CONSTRAINT app_global_people_pkey PRIMARY KEY (id),
  CONSTRAINT fk_updated_by FOREIGN KEY (updated_by) REFERENCES auth.users(id),
  CONSTRAINT fk_person FOREIGN KEY (person_id) REFERENCES public.people(id),
  CONSTRAINT fk_deleted_by FOREIGN KEY (deleted_by) REFERENCES auth.users(id),
  CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT fk_user_role FOREIGN KEY (user_role_id) REFERENCES public.app_user_roles(id)
);

-- Create people_leads table
CREATE TABLE public.people_leads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL,
  person_id uuid NOT NULL,
  lead_source text,
  lead_goals text,
  preferences text,
  expectation text,
  note text,
  preferred_language text NOT NULL DEFAULT 'English',
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
  CONSTRAINT people_leads_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT people_leads_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id),
  CONSTRAINT people_leads_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users(id)
);

-- 3. Create the new people_assign_status table
CREATE TABLE public.people_assign_status (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL,
  new_status text,
  old_status text,
  created_by uuid,
  updated_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT people_assign_status_pkey PRIMARY KEY (id),
  CONSTRAINT people_assign_status_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.people(id),
  CONSTRAINT people_assign_status_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT people_assign_status_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id)
);

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
  fee_billed text,
  billed_fee_type public.service_fee_type_enum NOT NULL DEFAULT 'per hour',
  fee_payout text,
  payout_fee_type TEXT CHECK (payout_fee_type IN ('per hour', 'per session', 'per day', 'flat fee')),
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
  is_deleted boolean NOT NULL DEFAULT false,
  CONSTRAINT people_clients_agency_id_fkey FOREIGN KEY (agency_id) REFERENCES public.app_agencies(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT people_clients_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.people(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT people_clients_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT people_clients_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT people_clients_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users(id) ON DELETE SET NULL
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
  is_deleted boolean NOT NULL DEFAULT false,
  CONSTRAINT people_assign_assessor_agency_id_fkey FOREIGN KEY (agency_id) REFERENCES public.app_agencies(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT people_assign_assessor_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.people(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT people_assign_assessor_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT people_assign_assessor_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT people_assign_assessor_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users(id) ON DELETE SET NULL
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
  is_deleted boolean NOT NULL DEFAULT false,
  CONSTRAINT people_assign_provider_agency_id_fkey FOREIGN KEY (agency_id) REFERENCES public.app_agencies(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT people_assign_provider_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.people(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT people_assign_provider_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT people_assign_provider_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT people_assign_provider_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users(id) ON DELETE SET NULL
);


-- Drop people_leads table if it exists (cleanup)
DROP TABLE IF EXISTS public.people_leads CASCADE;
-- Drop people_clients table if it exists (cleanup)
DROP TABLE IF EXISTS public.people_clients CASCADE;

-- Create settings_integrations_webhooks table (without audit columns as requested)
CREATE TABLE public.settings_integrations_webhooks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    agency_id UUID NOT NULL REFERENCES public.app_agencies(id),
    webhook_name TEXT NOT NULL,
    webhook_api_endpoint TEXT NOT NULL,
    webhook_api_secret TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add webhook_type and webhook_description fields to settings_integrations_webhooks table
ALTER TABLE public.settings_integrations_webhooks 
ADD COLUMN webhook_type text NOT NULL DEFAULT 'form_submission',
ADD COLUMN webhook_description text;

-- Add index for webhook_type for better performance
CREATE INDEX idx_settings_integrations_webhooks_type ON public.settings_integrations_webhooks(webhook_type);

-- Add a check constraint for webhook_type to allow predefined values
ALTER TABLE public.settings_integrations_webhooks 
ADD CONSTRAINT webhook_type_check 
CHECK (webhook_type IN ('form_submission', 'crm_data', 'payment_notification', 'lead_capture', 'custom'));

-- Update existing webhooks to have the form_submission type
UPDATE public.settings_integrations_webhooks 
SET webhook_type = 'form_submission' 
WHERE webhook_type IS NULL;

-- Create forms_submissions table with audit columns
CREATE TABLE public.forms_submissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    agency_id UUID NOT NULL REFERENCES public.app_agencies(id),
    form_id TEXT,
    sub_track_id TEXT,
    submitted_by_id UUID NOT NULL REFERENCES public.people(id),
    submission_data JSONB NOT NULL,
    submission_status TEXT NOT NULL DEFAULT 'active',
    updated_by_id UUID REFERENCES public.people(id),
    archived_by_user_id UUID REFERENCES auth.users(id),
    deleted_by_user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    archived_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN NOT NULL DEFAULT false
);