-- Update settings_services_and_fees table to rename columns and add payout fields
ALTER TABLE public.settings_services_and_fees 
RENAME COLUMN service_fee TO fee_billed;

ALTER TABLE public.settings_services_and_fees 
RENAME COLUMN service_fee_type TO billed_fee_type;

ALTER TABLE public.settings_services_and_fees 
ADD COLUMN fee_payout TEXT;

ALTER TABLE public.settings_services_and_fees 
ADD COLUMN payout_fee_type TEXT CHECK (payout_fee_type IN ('per hour', 'per session', 'per day', 'flat fee'));