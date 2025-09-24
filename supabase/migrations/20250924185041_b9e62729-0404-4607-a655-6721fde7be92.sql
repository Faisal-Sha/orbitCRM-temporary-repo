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
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    deleted_by UUID REFERENCES auth.users(id)
);

-- Add indexes for performance
CREATE INDEX idx_settings_integrations_webhooks_agency_id ON public.settings_integrations_webhooks(agency_id);
CREATE INDEX idx_settings_integrations_webhooks_status ON public.settings_integrations_webhooks(status);

CREATE INDEX idx_forms_submissions_agency_id ON public.forms_submissions(agency_id);
CREATE INDEX idx_forms_submissions_submitted_by_id ON public.forms_submissions(submitted_by_id);
CREATE INDEX idx_forms_submissions_status ON public.forms_submissions(submission_status);
CREATE INDEX idx_forms_submissions_form_id ON public.forms_submissions(form_id);

-- Enable RLS on both tables
ALTER TABLE public.settings_integrations_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forms_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for settings_integrations_webhooks
CREATE POLICY "Users can view webhooks in their agency" 
ON public.settings_integrations_webhooks 
FOR SELECT 
USING (user_can_access_agency(agency_id));

CREATE POLICY "Users can create webhooks in their agency" 
ON public.settings_integrations_webhooks 
FOR INSERT 
WITH CHECK (user_can_access_agency(agency_id));

CREATE POLICY "Users can update webhooks in their agency" 
ON public.settings_integrations_webhooks 
FOR UPDATE 
USING (user_can_access_agency(agency_id));

CREATE POLICY "Users can delete webhooks in their agency" 
ON public.settings_integrations_webhooks 
FOR DELETE 
USING (user_can_access_agency(agency_id));

-- RLS policies for forms_submissions
CREATE POLICY "Users can view submissions in their agency" 
ON public.forms_submissions 
FOR SELECT 
USING (user_can_access_agency(agency_id));

CREATE POLICY "Users can create submissions in their agency" 
ON public.forms_submissions 
FOR INSERT 
WITH CHECK (user_can_access_agency(agency_id));

CREATE POLICY "Users can update submissions in their agency" 
ON public.forms_submissions 
FOR UPDATE 
USING (user_can_access_agency(agency_id));

-- Create update triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_settings_integrations_webhooks_updated_at
    BEFORE UPDATE ON public.settings_integrations_webhooks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forms_submissions_updated_at
    BEFORE UPDATE ON public.forms_submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();