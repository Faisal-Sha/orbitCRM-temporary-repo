-- Drop the existing check constraint
ALTER TABLE public.settings_integrations_webhooks DROP CONSTRAINT webhook_type_check;

-- Add new check constraint with updated values
ALTER TABLE public.settings_integrations_webhooks 
ADD CONSTRAINT webhook_type_check 
CHECK (webhook_type IN ('forms', 'scheduling', 'marketing', 'crm', 'payment', 'lead_capture', 'custom', 'form_submission', 'crm_data', 'payment_notification'));

-- Update existing entries to use new naming convention
UPDATE public.settings_integrations_webhooks 
SET webhook_type = 'forms' 
WHERE webhook_type = 'form_submission';

UPDATE public.settings_integrations_webhooks 
SET webhook_type = 'crm' 
WHERE webhook_type = 'crm_data';

UPDATE public.settings_integrations_webhooks 
SET webhook_type = 'payment' 
WHERE webhook_type = 'payment_notification';

-- Update the default value for webhook_type column
ALTER TABLE public.settings_integrations_webhooks 
ALTER COLUMN webhook_type SET DEFAULT 'forms';