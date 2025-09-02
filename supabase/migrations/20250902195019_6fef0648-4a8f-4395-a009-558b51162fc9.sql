-- Remove organization_logo column from settings_organization table
ALTER TABLE public.settings_organization DROP COLUMN IF EXISTS organization_logo;