-- Add soft delete columns to settings_integrations_webhooks table
ALTER TABLE public.settings_integrations_webhooks 
ADD COLUMN deleted_by uuid REFERENCES auth.users(id),
ADD COLUMN deleted_at timestamptz,
ADD COLUMN is_deleted boolean NOT NULL DEFAULT false;