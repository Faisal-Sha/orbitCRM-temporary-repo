-- Create storage bucket for organization logos
INSERT INTO storage.buckets (id, name, public) VALUES ('organization-logos', 'organization-logos', true);

-- Create policies for organization logo uploads
CREATE POLICY "Users can view organization logos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'organization-logos');

CREATE POLICY "Users can upload organization logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'organization-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update organization logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'organization-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete organization logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'organization-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Update save_organization_settings function to include organization_logo parameter
CREATE OR REPLACE FUNCTION public.save_organization_settings(
  p_organization_name text, 
  p_organization_state text, 
  p_organization_logo text DEFAULT NULL::text, 
  p_address_line_1 text DEFAULT ''::text, 
  p_address_line_2 text DEFAULT ''::text, 
  p_zip_cone text DEFAULT ''::text, 
  p_country text DEFAULT 'United States'::text, 
  p_default_language text DEFAULT 'English (US)'::text, 
  p_default_currency text DEFAULT 'USD ($)'::text, 
  p_default_timezone text DEFAULT 'America/New_York'::text, 
  p_facebook_url text DEFAULT ''::text, 
  p_instagram_url text DEFAULT ''::text, 
  p_x_url text DEFAULT ''::text, 
  p_tiktok_url text DEFAULT ''::text, 
  p_linkedin_url text DEFAULT ''::text, 
  p_google_profile_url text DEFAULT ''::text, 
  p_youtube_url text DEFAULT ''::text, 
  p_domains json DEFAULT '[]'::json
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    org_id UUID;
    domain_item JSON;
BEGIN
    -- Get or create organization
    SELECT id INTO org_id 
    FROM public.app_organizations 
    WHERE user_id = auth.uid() 
    LIMIT 1;
    
    IF org_id IS NULL THEN
        INSERT INTO public.app_organizations (user_id, organization_name, organization_state)
        VALUES (auth.uid(), p_organization_name, p_organization_state)
        RETURNING id INTO org_id;
    ELSE
        UPDATE public.app_organizations
        SET organization_name = p_organization_name,
            organization_state = p_organization_state,
            updated_at = now()
        WHERE id = org_id;
    END IF;
    
    -- Upsert settings
    INSERT INTO public.settings_organization (
        organization_id, organization_logo, address_line_1, address_line_2, zip_cone,
        country, default_language, default_currency, default_timezone,
        facebook_url, instagram_url, x_url, tiktok_url, linkedin_url,
        google_profile_url, youtube_url
    ) VALUES (
        org_id, p_organization_logo, p_address_line_1, p_address_line_2, p_zip_cone,
        p_country, p_default_language, p_default_currency, p_default_timezone,
        p_facebook_url, p_instagram_url, p_x_url, p_tiktok_url, p_linkedin_url,
        p_google_profile_url, p_youtube_url
    )
    ON CONFLICT (organization_id) 
    DO UPDATE SET
        organization_logo = p_organization_logo,
        address_line_1 = p_address_line_1,
        address_line_2 = p_address_line_2,
        zip_cone = p_zip_cone,
        country = p_country,
        default_language = p_default_language,
        default_currency = p_default_currency,
        default_timezone = p_default_timezone,
        facebook_url = p_facebook_url,
        instagram_url = p_instagram_url,
        x_url = p_x_url,
        tiktok_url = p_tiktok_url,
        linkedin_url = p_linkedin_url,
        google_profile_url = p_google_profile_url,
        youtube_url = p_youtube_url,
        updated_at = now();
    
    -- Clear existing domains
    DELETE FROM public.app_organization_domains WHERE organization_id = org_id;
    
    -- Insert new domains
    FOR domain_item IN SELECT * FROM json_array_elements(p_domains)
    LOOP
        INSERT INTO public.app_organization_domains (organization_id, protocol, domain)
        VALUES (
            org_id,
            domain_item->>'protocol',
            domain_item->>'domain'
        );
    END LOOP;
    
    RETURN json_build_object('success', true, 'message', 'Organization settings saved successfully');
END;
$$;