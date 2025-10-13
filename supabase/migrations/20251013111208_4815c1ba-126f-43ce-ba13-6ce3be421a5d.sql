-- Create settings_integrations_external table
CREATE TABLE IF NOT EXISTS public.settings_integrations_external (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_provider text,
  category text,
  configuration jsonb,
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id),
  deleted_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  is_deleted boolean NOT NULL DEFAULT false
);

-- Create indexes for performance
CREATE INDEX idx_settings_integrations_external_is_deleted 
  ON public.settings_integrations_external(is_deleted);
CREATE INDEX idx_settings_integrations_external_service_provider 
  ON public.settings_integrations_external(service_provider) 
  WHERE is_deleted = false;

-- Create trigger function for updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic updated_at updates
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.settings_integrations_external
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.settings_integrations_external ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users with agency access can view non-deleted integrations
CREATE POLICY "Users with agency access can view integrations"
  ON public.settings_integrations_external
  FOR SELECT
  USING (
    is_deleted = false 
    AND current_user_has_agency_access()
  );

-- RLS Policy: Users with agency access can create integrations
CREATE POLICY "Users with agency access can create integrations"
  ON public.settings_integrations_external
  FOR INSERT
  WITH CHECK (current_user_has_agency_access());

-- RLS Policy: Users with agency access can update integrations
CREATE POLICY "Users with agency access can update integrations"
  ON public.settings_integrations_external
  FOR UPDATE
  USING (current_user_has_agency_access());

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.settings_integrations_external TO authenticated;