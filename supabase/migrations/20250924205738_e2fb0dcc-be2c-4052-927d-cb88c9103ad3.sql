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