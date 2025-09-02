-- Drop and recreate save_organization_settings function without organization_logo parameter
DROP FUNCTION IF EXISTS public.save_organization_settings;

CREATE OR REPLACE FUNCTION public.save_organization_settings(
  p_organization_name text, 
  p_organization_state text, 
  p_address_line_1 text, 
  p_address_line_2 text, 
  p_zip_cone text, 
  p_country text, 
  p_default_language text, 
  p_default_currency text, 
  p_default_timezone text, 
  p_facebook_url text, 
  p_instagram_url text, 
  p_x_url text, 
  p_tiktok_url text, 
  p_linkedin_url text, 
  p_google_profile_url text, 
  p_youtube_url text, 
  p_domains jsonb
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$DECLARE
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

  -- Upsert settings_organization table (without organization_logo)
  INSERT INTO public.settings_organization (
    organization_id,
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
END;$function$