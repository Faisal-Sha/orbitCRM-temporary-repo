-- Rename people_contacts_referrals to people_referrals
ALTER TABLE public.people_contacts_referrals RENAME TO people_referrals;

-- Rename people_contacts_emergency to people_emergency
ALTER TABLE public.people_contacts_emergency RENAME TO people_emergency;

-- Rename lead_source_id column to lead_source in people_leads table
ALTER TABLE public.people_leads RENAME COLUMN lead_source_id TO lead_source;

-- Drop status column from app_users table
ALTER TABLE public.app_users DROP COLUMN status;