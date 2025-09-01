-- Fix get_organization_settings function to handle empty settings and domains
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
  org_json JSON;
  settings_json JSON;
  domains_json JSON;
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

  -- Get organization data
  SELECT json_build_object(
    'id', o.id,
    'organization_name', o.organization_name,
    'organization_state', o.organization_state
  ) INTO org_json
  FROM public.app_organizations o
  WHERE o.id = org_id AND o.is_deleted = false;

  -- Get settings data (handle empty case)
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
  ), '{}') INTO settings_json
  FROM public.settings_organization s
  WHERE s.organization_id = org_id AND s.is_deleted = false
  LIMIT 1;

  -- Get domains data (handle empty case)
  SELECT COALESCE(json_agg(
    json_build_object(
      'id', d.id,
      'protocol', d.protocol,
      'domain', d.domain
    )
  ), '[]') INTO domains_json
  FROM public.settings_organization_domains d
  WHERE d.organization_id = org_id AND d.is_deleted = false;

  -- Build final result
  SELECT json_build_object(
    'success', true,
    'organization_id', org_id,
    'organization', COALESCE(org_json, '{}'),
    'settings', COALESCE(settings_json, '{}'),
    'domains', COALESCE(domains_json, '[]')
  ) INTO result;

  RETURN result;
END;
$function$