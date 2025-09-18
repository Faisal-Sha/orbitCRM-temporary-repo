-- Add new enums for services and billing settings
CREATE TYPE insurance_category_enum AS ENUM ('medicaid', 'medicare', 'dual', 'private');
CREATE TYPE service_category_enum AS ENUM ('adults', 'teens');
CREATE TYPE service_fee_type_enum AS ENUM ('per hour', 'per session', 'per day', 'flat fee');
CREATE TYPE service_status_enum AS ENUM ('active', 'inactive');