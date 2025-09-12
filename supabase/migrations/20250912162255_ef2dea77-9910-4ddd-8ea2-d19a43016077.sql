-- Fix search_path security issue for get_organization_settings function
CREATE OR REPLACE FUNCTION public.get_organization_settings()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result JSON;
    org_record RECORD;
    settings_record RECORD;
    domains_array JSON;
BEGIN
    -- Get the user's organization
    SELECT * INTO org_record 
    FROM public.app_organizations 
    WHERE user_id = auth.uid() 
    LIMIT 1;
    
    IF org_record IS NULL THEN
        RETURN json_build_object('success', false, 'message', 'No organization found');
    END IF;
    
    -- Get organization settings
    SELECT * INTO settings_record 
    FROM public.settings_organization 
    WHERE organization_id = org_record.id;
    
    -- Get domains
    SELECT json_agg(
        json_build_object(
            'id', id,
            'protocol', protocol,
            'domain', domain
        )
    ) INTO domains_array
    FROM public.app_organization_domains 
    WHERE organization_id = org_record.id;
    
    -- Build result
    result := json_build_object(
        'success', true,
        'organization', row_to_json(org_record),
        'settings', row_to_json(settings_record),
        'domains', COALESCE(domains_array, '[]'::json)
    );
    
    RETURN result;
END;
$$;

-- Fix search_path security issue for save_organization_settings function
CREATE OR REPLACE FUNCTION public.save_organization_settings(
    p_organization_name TEXT,
    p_organization_state TEXT,
    p_organization_logo TEXT DEFAULT NULL,
    p_address_line_1 TEXT DEFAULT '',
    p_address_line_2 TEXT DEFAULT '',
    p_zip_cone TEXT DEFAULT '',
    p_country TEXT DEFAULT 'United States',
    p_default_language TEXT DEFAULT 'English (US)',
    p_default_currency TEXT DEFAULT 'USD ($)',
    p_default_timezone TEXT DEFAULT 'America/New_York',
    p_facebook_url TEXT DEFAULT '',
    p_instagram_url TEXT DEFAULT '',
    p_x_url TEXT DEFAULT '',
    p_tiktok_url TEXT DEFAULT '',
    p_linkedin_url TEXT DEFAULT '',
    p_google_profile_url TEXT DEFAULT '',
    p_youtube_url TEXT DEFAULT '',
    p_domains JSON DEFAULT '[]'::json
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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