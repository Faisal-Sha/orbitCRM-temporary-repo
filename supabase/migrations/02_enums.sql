-- create enums
CREATE TYPE agency_status_enum AS ENUM ('active', 'inactive', 'deleted');
CREATE TYPE organization_status_enum AS ENUM ('active', 'inactive', 'deleted');
CREATE TYPE user_status_enum AS ENUM ('invited', 'active', 'inactive', 'deleted');
CREATE TYPE user_roles_enum AS ENUM ('admin', 'owner', 'general', 'lead', 'staff', 'client', 'partner');
CREATE TYPE referral_type_enum AS ENUM ('client', 'staff');
CREATE TYPE referral_relationship_enum AS ENUM ('family member', 'colleague', 'friend', 'organization', 'other');
CREATE TYPE emergency_relationship_enum AS ENUM ('family member', 'colleague', 'friend', 'organization', 'other');
CREATE TYPE staff_type_enum AS ENUM ('specialist_marketer', 'clinical_assessor', 'clinical_supervisor', 'case_manager', 'admin_support', 'sales_rep', 'specialist_hr', 'specialist_it', 'specialist_finance', 'leadership_team_lead', 'leadership_exec');
-- Add new enums for services and billing settings
CREATE TYPE insurance_category_enum AS ENUM ('medicaid', 'medicare', 'dual', 'private');
CREATE TYPE service_category_enum AS ENUM ('adults', 'teens');
CREATE TYPE service_fee_type_enum AS ENUM ('per hour', 'per session', 'per day', 'flat fee');
CREATE TYPE service_status_enum AS ENUM ('active', 'inactive');