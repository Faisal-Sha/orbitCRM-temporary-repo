-- Fix the variable scoping bug in get_organization_settings function
CREATE OR REPLACE FUNCTION public.get_organization_settings()
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  org_id UUID;
  app_user_id UUID;
  person_id UUID;
  result JSON;
BEGIN
  -- Get app_users record
  SELECT id INTO app_user_id
  FROM public.app_users
  WHERE user_id = auth.uid()
  LIMIT 1;

  IF app_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'App user not found');
  END IF;

  -- Get people record linked to this app_user
  SELECT id INTO person_id
  FROM public.people
  WHERE user_account_id = app_user_id AND is_deleted = false
  LIMIT 1;

  IF person_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Person record not found');
  END IF;

  -- Get user's organization (check both admin and regular people tables)
  -- FIX: Use function variable name to avoid column name collision
  SELECT organization_id INTO org_id
  FROM public.app_organization_admins
  WHERE app_organization_admins.person_id = get_organization_settings.person_id AND is_deleted = false
  LIMIT 1;

  IF org_id IS NULL THEN
    SELECT organization_id INTO org_id
    FROM public.app_organization_people
    WHERE app_organization_people.person_id = get_organization_settings.person_id AND is_deleted = false
    LIMIT 1;
  END IF;

  IF org_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'No organization found for user');
  END IF;

  -- Build result with organization data, settings, and domains
  SELECT json_build_object(
    'success', true,
    'organization_id', org_id,
    'organization', COALESCE(org_data.organization, '{}'),
    'settings', COALESCE(settings_data.settings, '{}'),
    'domains', COALESCE(domains_data.domains, '[]')
  ) INTO result
  FROM (
    SELECT json_build_object(
      'id', o.id,
      'organization_name', o.organization_name,
      'organization_state', o.organization_state
    ) as organization
    FROM public.app_organizations o
    WHERE o.id = org_id AND o.is_deleted = false
  ) org_data
  CROSS JOIN (
    SELECT COALESCE(json_build_object(
      'organization_logo', s.organization_logo,
      'address_line_1', s.address_line_1,
      'address_line_2', s.address_line_2,
      'zip_cone', s.zip_cone,
      'country', s.country,
      'default_language', s.default_language,
      'default_currency', s.default_currency,
      'default_timezone', s.default_timezone,
      'facebook_url', s.facebook_url,
      'instagram_url', s.instagram_url,
      'x_url', s.x_url,
      'tiktok_url', s.tiktok_url,
      'linkedin_url', s.linkedin_url,
      'google_profile_url', s.google_profile_url,
      'youtube_url', s.youtube_url
    ), '{}') as settings
    FROM public.settings_organization s
    WHERE s.organization_id = org_id AND s.is_deleted = false
    LIMIT 1
  ) settings_data
  CROSS JOIN (
    SELECT json_agg(
      json_build_object(
        'id', d.id,
        'protocol', d.protocol,
        'domain', d.domain
      )
    ) as domains
    FROM public.settings_organization_domains d
    WHERE d.organization_id = org_id AND d.is_deleted = false
  ) domains_data;

  RETURN result;
END;
$function$;

-- Fix the variable scoping bug in save_organization_settings function
CREATE OR REPLACE FUNCTION public.save_organization_settings(p_organization_name text, p_organization_state text, p_organization_logo text, p_address_line_1 text, p_address_line_2 text, p_zip_cone text, p_country text, p_default_language text, p_default_currency text, p_default_timezone text, p_facebook_url text, p_instagram_url text, p_x_url text, p_tiktok_url text, p_linkedin_url text, p_google_profile_url text, p_youtube_url text, p_domains jsonb)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  org_id UUID;
  app_user_id UUID;
  people_person_id UUID;
  domain_record jsonb;
  result JSON;
  current_user_id UUID := auth.uid();
BEGIN
  -- Get app_users record
  SELECT id INTO app_user_id
  FROM public.app_users
  WHERE user_id = current_user_id
  LIMIT 1;

  IF app_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'App user not found');
  END IF;

  -- Get people record linked to this app_user
  SELECT id INTO people_person_id
  FROM public.people
  WHERE user_account_id = app_user_id AND is_deleted = false
  LIMIT 1;

  IF people_person_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Person record not found');
  END IF;

  -- Get user's organization (check both admin and regular people tables)
  SELECT organization_id INTO org_id
  FROM public.app_organization_admins
  WHERE person_id = people_person_id AND is_deleted = false
  LIMIT 1;

  IF org_id IS NULL THEN
    SELECT organization_id INTO org_id
    FROM public.app_organization_people
    WHERE person_id = people_person_id AND is_deleted = false
    LIMIT 1;
  END IF;

  IF org_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'No organization found for user');
  END IF;

  -- Update app_organizations table
  UPDATE public.app_organizations 
  SET 
    organization_name = p_organization_name,
    organization_state = p_organization_state,
    updated_by = current_user_id,
    updated_at = now()
  WHERE id = org_id;

  -- First, delete any existing settings for this organization
  DELETE FROM public.settings_organization
  WHERE organization_id = org_id;

  -- Upsert settings_organization table
  INSERT INTO public.settings_organization (
    organization_id,
    organization_logo,
    address_line_1,
    address_line_2,
    zip_cone,
    country,
    default_language,
    default_currency,
    default_timezone,
    facebook_url,
    instagram_url,
    x_url,
    tiktok_url,
    linkedin_url,
    google_profile_url,
    youtube_url,
    created_by,
    updated_by
  ) VALUES (
    org_id,
    p_organization_logo,
    p_address_line_1,
    p_address_line_2,
    p_zip_cone,
    p_country,
    p_default_language,
    p_default_currency,
    p_default_timezone,
    p_facebook_url,
    p_instagram_url,
    p_x_url,
    p_tiktok_url,
    p_linkedin_url,
    p_google_profile_url,
    p_youtube_url,
    current_user_id,
    current_user_id
  );

  -- Soft delete existing domains
  UPDATE public.settings_organization_domains
  SET 
    is_deleted = true,
    deleted_by = current_user_id,
    deleted_at = now()
  WHERE organization_id = org_id AND is_deleted = false;

  -- Insert new domains if p_domains is not null
  IF p_domains IS NOT NULL THEN
    -- Handle both array and single object cases
    FOR domain_record IN 
      SELECT * FROM jsonb_array_elements(
        CASE 
          WHEN jsonb_typeof(p_domains) = 'array' THEN p_domains 
          ELSE jsonb_build_array(p_domains)
        END
      )
    LOOP
      IF domain_record->>'domain' IS NOT NULL AND trim(domain_record->>'domain') != '' THEN
        INSERT INTO public.settings_organization_domains (
          organization_id,
          protocol,
          domain,
          created_by,
          updated_by
        ) VALUES (
          org_id,
          domain_record->>'protocol',
          trim(domain_record->>'domain'),
          current_user_id,
          current_user_id
        );
      END IF;
    END LOOP;
  END IF;

  SELECT json_build_object(
    'success', true,
    'message', 'Organization settings saved successfully',
    'organization_id', org_id
  ) INTO result;

  RETURN result;
END;
$function$;