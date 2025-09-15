-- Create SECURITY DEFINER function to handle organization soft deletion
-- This bypasses RLS policies entirely and ensures proper soft delete
CREATE OR REPLACE FUNCTION public.soft_delete_agency(
  agency_id UUID,
  deleting_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Update organization with soft delete fields
  UPDATE public.app_agencies 
  SET 
    status = 'deleted'::agency_status_enum,
    is_deleted = true,
    deleted_by = deleting_user_id,
    deleted_at = now(),
    updated_by = deleting_user_id,
    updated_at = now()
  WHERE id = agency_id AND is_deleted = false;

  -- Check if update was successful
  IF FOUND THEN
    SELECT json_build_object(
      'agency_id', agency_id,
      'success', true,
      'message', 'Agency soft deleted successfully'
    ) INTO result;
  ELSE
    SELECT json_build_object(
      'agency_id', agency_id,
      'success', false,
      'message', 'Agency not found or already deleted'
    ) INTO result;
  END IF;

  RETURN result;
END;
$$;

-- Create function to link user account with existing person record
CREATE OR REPLACE FUNCTION public.link_user_to_person(
  user_email TEXT,
  new_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  person_record_id UUID;
  app_user_record_id UUID;
  result JSON;
BEGIN
  -- Find the person record by email
  SELECT p.id INTO person_record_id
  FROM public.people p
  JOIN public.people_contacts pc ON p.id = pc.person_id
  WHERE pc.email = user_email AND p.is_deleted = false AND pc.is_deleted = false
  LIMIT 1;

  -- Find the app_users record by user_id
  SELECT id INTO app_user_record_id
  FROM public.app_users
  WHERE user_id = new_user_id
  LIMIT 1;

  -- If both records exist, update the person record
  IF person_record_id IS NOT NULL AND app_user_record_id IS NOT NULL THEN
    UPDATE public.people 
    SET 
      user_account_id = app_user_record_id,
      updated_at = now()
    WHERE id = person_record_id;

    SELECT json_build_object(
      'success', true,
      'message', 'User account linked to person record successfully',
      'person_id', person_record_id,
      'app_user_id', app_user_record_id
    ) INTO result;
  ELSE
    SELECT json_build_object(
      'success', false,
      'message', 'Person record or app_users record not found',
      'person_id', person_record_id,
      'app_user_id', app_user_record_id
    ) INTO result;
  END IF;

  RETURN result;
END;
$$;

-- Clean up duplicate create_agency_with_admin functions
DROP FUNCTION IF EXISTS public.create_agency_with_admin(text, text, text, text, text, uuid);

-- Ensure the newer version has proper security settings
CREATE OR REPLACE FUNCTION public.create_agency_with_admin(
  agency_name TEXT,
  agency_state TEXT,
  admin_first_name TEXT,
  admin_last_name TEXT,
  admin_email TEXT,
  created_by_user_id UUID,
  agency_status agency_status_enum DEFAULT 'active'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  agency_id UUID;
  person_id UUID;
  admin_role_id UUID;
  result JSON;
BEGIN
  -- Create agency with specified status
  INSERT INTO public.app_agencies (
    agency_name, 
    agency_state, 
    status,
    created_by, 
    updated_by
  )
  VALUES (
    agency_name, 
    agency_state, 
    agency_status,
    created_by_user_id, 
    created_by_user_id
  )
  RETURNING id INTO agency_id;

  -- Create person record for admin
  INSERT INTO public.people (
    first_name, 
    last_name, 
    created_by, 
    updated_by
  )
  VALUES (
    admin_first_name, 
    admin_last_name, 
    created_by_user_id, 
    created_by_user_id
  )
  RETURNING id INTO person_id;

  -- Create contact record for the person
  INSERT INTO public.people_contacts (
    person_id, 
    email, 
    created_by, 
    updated_by
  )
  VALUES (
    person_id, 
    admin_email, 
    created_by_user_id, 
    created_by_user_id
  );

  -- Get admin role ID dynamically
  SELECT id INTO admin_role_id 
  FROM public.app_user_roles 
  WHERE role_name = 'admin' 
  LIMIT 1;

  -- Create agency admin record
  INSERT INTO public.app_agencies_admins (
    agency_id, 
    person_id, 
    created_by, 
    updated_by
  )
  VALUES (
    agency_id, 
    person_id, 
    created_by_user_id, 
    created_by_user_id
  );

  -- Create agency people record
  INSERT INTO public.app_agencies_people (
    agency_id, 
    person_id, 
    user_role_id, 
    created_by, 
    updated_by
  )
  VALUES (
    agency_id, 
    person_id, 
    admin_role_id, 
    created_by_user_id, 
    created_by_user_id
  );

  -- Return success response
  SELECT json_build_object(
    'agency_id', agency_id,
    'person_id', person_id,
    'success', true,
    'message', 'Agency and admin created successfully'
  ) INTO result;

  RETURN result;
END;
$$;


-- Drop the existing function first
DROP FUNCTION IF EXISTS public.get_agencies_with_admins();

-- Create the new function with JSON aggregation
CREATE OR REPLACE FUNCTION public.get_agencies_with_admins()
 RETURNS TABLE(id uuid, agency_name text, agency_state text, status agency_status_enum, created_at timestamp with time zone, admins json, user_count bigint, storage_used text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.agency_name,
    o.agency_state,
    o.status,
    o.created_at,
    COALESCE(
      json_agg(
        CASE 
          WHEN p.id IS NOT NULL THEN
            json_build_object(
              'first_name', p.first_name,
              'last_name', p.last_name,
              'email', pc.email
            )
          ELSE NULL
        END
      ) FILTER (WHERE p.id IS NOT NULL), 
      '[]'::json
    ) as admins,
    COALESCE(user_counts.count, 0) as user_count,
    '0 MB'::TEXT as storage_used
  FROM public.app_agencies o
  LEFT JOIN public.app_agencies_admins oa ON o.id = oa.agency_id AND oa.is_deleted = false
  LEFT JOIN public.people p ON oa.person_id = p.id AND p.is_deleted = false
  LEFT JOIN public.people_contacts pc ON p.id = pc.person_id AND pc.is_deleted = false
  LEFT JOIN (
    SELECT 
      op.agency_id,
      COUNT(*) as count
    FROM public.app_agencies_people op
    WHERE op.is_deleted = false
    GROUP BY op.agency_id
  ) user_counts ON o.id = user_counts.agency_id
  WHERE o.is_deleted = false
  GROUP BY o.id, o.agency_name, o.agency_state, o.status, o.created_at, user_counts.count
  ORDER BY o.created_at DESC;
END;
$function$;



-- Fix the ambiguous person_id reference in update_agency_with_admin function
CREATE OR REPLACE FUNCTION public.update_agency_with_admin(agency_id uuid, agency_name text, agency_state text, agency_status agency_status_enum, admin_first_name text, admin_last_name text, admin_email text, updated_by_user_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  admin_person_id UUID;
  result JSON;
BEGIN
  -- Update organization with organization_state
  UPDATE public.app_agencies 
  SET 
    agency_name = update_agency_with_admin.agency_name,
    agency_state = update_agency_with_admin.agency_state,
    status = agency_status,
    updated_by = updated_by_user_id,
    updated_at = now()
  WHERE id = agency_id;

  -- Get the admin person_id
  SELECT oa.person_id INTO admin_person_id
  FROM public.app_agencies_admins oa
  WHERE oa.agency_id = agency_id AND oa.is_deleted = false
  LIMIT 1;

  -- Update admin person if found
  IF admin_person_id IS NOT NULL THEN
    UPDATE public.people 
    SET 
      first_name = admin_first_name,
      last_name = admin_last_name,
      updated_by = updated_by_user_id,
      updated_at = now()
    WHERE id = admin_person_id;

    -- Update admin contact - Fixed the ambiguous reference
    UPDATE public.people_contacts 
    SET 
      email = admin_email,
      updated_by = updated_by_user_id,
      updated_at = now()
    WHERE person_id = admin_person_id;
  END IF;

  -- Return result
  SELECT json_build_object(
    'agency_id', agency_id,
    'person_id', admin_person_id,
    'success', true
  ) INTO result;

  RETURN result;
END;
$function$;


-- Create function to update personal profile data
CREATE OR REPLACE FUNCTION public.update_personal_profile(
  p_first_name text,
  p_middle_name text,
  p_last_name text,
  p_bio text,
  p_profile_pic text,
  p_phone text,
  p_address_line_1 text,
  p_address_line_2 text,
  p_city text,
  p_state text,
  p_zip_code text,
  p_facebook text,
  p_instagram text,
  p_tiktok text,
  p_linkedin text,
  p_updated_by uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  person_record_id UUID;
  result JSON;
BEGIN
  -- Find the person record linked to the current user
  SELECT p.id INTO person_record_id
  FROM public.people p
  JOIN public.app_users au ON p.user_account_id = au.id
  WHERE au.user_id = auth.uid() AND p.is_deleted = false
  LIMIT 1;

  IF person_record_id IS NOT NULL THEN
    -- Update people table
    UPDATE public.people 
    SET 
      first_name = p_first_name,
      middle_name = p_middle_name,
      last_name = p_last_name,
      user_profile_bio = p_bio,
      user_profile_pic = p_profile_pic,
      updated_by = p_updated_by,
      updated_at = now()
    WHERE id = person_record_id;

    -- Update people_contacts table
    UPDATE public.people_contacts 
    SET 
      phone = p_phone,
      address_line_1 = p_address_line_1,
      address_line_2 = p_address_line_2,
      city = p_city,
      state = p_state,
      zip_code = p_zip_code,
      url_facebook = p_facebook,
      url_instagram = p_instagram,
      url_tiktok = p_tiktok,
      url_linkedin = p_linkedin,
      updated_by = p_updated_by,
      updated_at = now()
    WHERE person_id = person_record_id AND is_deleted = false;

    SELECT json_build_object(
      'success', true,
      'message', 'Profile updated successfully',
      'person_id', person_record_id
    ) INTO result;
  ELSE
    SELECT json_build_object(
      'success', false,
      'message', 'Person record not found'
    ) INTO result;
  END IF;

  RETURN result;
END;
$$;

-- Create function to update email in people_contacts
CREATE OR REPLACE FUNCTION public.update_personal_email(
  p_email text,
  p_updated_by uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  person_record_id UUID;
  result JSON;
BEGIN
  -- Find the person record linked to the current user
  SELECT p.id INTO person_record_id
  FROM public.people p
  JOIN public.app_users au ON p.user_account_id = au.id
  WHERE au.user_id = auth.uid() AND p.is_deleted = false
  LIMIT 1;

  IF person_record_id IS NOT NULL THEN
    -- Update email in people_contacts table
    UPDATE public.people_contacts 
    SET 
      email = p_email,
      updated_by = p_updated_by,
      updated_at = now()
    WHERE person_id = person_record_id AND is_deleted = false;

    SELECT json_build_object(
      'success', true,
      'message', 'Email updated successfully in contacts',
      'person_id', person_record_id
    ) INTO result;
  ELSE
    SELECT json_build_object(
      'success', false,
      'message', 'Person record not found'
    ) INTO result;
  END IF;

  RETURN result;
END;
$$;

-- Create function to get personal profile data
CREATE OR REPLACE FUNCTION public.get_personal_profile()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  profile_data JSON;
BEGIN
  SELECT json_build_object(
    'first_name', p.first_name,
    'middle_name', p.middle_name,
    'last_name', p.last_name,
    'bio', p.user_profile_bio,
    'profile_pic', p.user_profile_pic,
    'email', pc.email,
    'phone', pc.phone,
    'address_line_1', pc.address_line_1,
    'address_line_2', pc.address_line_2,
    'city', pc.city,
    'state', pc.state,
    'zip_code', pc.zip_code,
    'facebook', pc.url_facebook,
    'instagram', pc.url_instagram,
    'tiktok', pc.url_tiktok,
    'linkedin', pc.url_linkedin
  ) INTO profile_data
  FROM public.people p
  JOIN public.app_users au ON p.user_account_id = au.id
  LEFT JOIN public.people_contacts pc ON p.id = pc.person_id AND pc.is_deleted = false
  WHERE au.user_id = auth.uid() AND p.is_deleted = false
  LIMIT 1;

  RETURN COALESCE(profile_data, '{}'::json);
END;
$$;


CREATE OR REPLACE FUNCTION public.get_organization_settings()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  org_id UUID;
  app_user_id UUID;
  people_id UUID;
  org_json JSON;
  settings_json JSON;
  domains_json JSON;
  result JSON;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Authentication failed: auth.uid() returned NULL');
  END IF;

  -- Get app_users record
  SELECT id INTO app_user_id
  FROM public.app_users
  WHERE user_id = current_user_id
  LIMIT 1;

  IF app_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'App user not found for auth user: ' || current_user_id::text);
  END IF;

  -- Get people record linked to this app_user
  SELECT id INTO people_id
  FROM public.people
  WHERE user_account_id = app_user_id AND is_deleted = false
  LIMIT 1;

  IF people_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Person record not found for app_user: ' || app_user_id::text);
  END IF;

  -- Get user's organization (check admin table first)
  SELECT s.organization_id INTO org_id
  FROM public.app_organizations_owners s
  WHERE s.owner_id = people_id AND s.is_deleted = false
  LIMIT 1;

  IF org_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'No organization found for person: ' || people_id::text);
  END IF;

  -- Get organization data
  SELECT json_build_object(
    'id', o.id,
    'organization_name', o.organization_name,
    'organization_state', o.organization_state
  ) INTO org_json
  FROM public.app_organizations o
  WHERE o.id = org_id AND o.is_deleted = false;

  IF org_json IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Organization not found or deleted: ' || org_id::text);
  END IF;

  -- Get settings data (handle empty case) - FIXED TYPO HERE
  SELECT json_build_object(
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
  ) INTO settings_json
  FROM public.settings_organization s
  WHERE s.organization_id = org_id AND s.is_deleted = false
  LIMIT 1;

  -- If no settings found, return empty object
  IF settings_json IS NULL THEN
    settings_json := '{}'::json;
  END IF;

  -- Get domains data (handle empty case)
  SELECT json_agg(
    json_build_object(
      'id', d.id,
      'protocol', d.protocol,
      'domain', d.domain
    )
  ) INTO domains_json
  FROM public.settings_organization_domains d
  WHERE d.organization_id = org_id AND d.is_deleted = false;

  -- If no domains found, return empty array
  IF domains_json IS NULL THEN
    domains_json := '[]'::json;
  END IF;

  -- Build final result
  SELECT json_build_object(
    'success', true,
    'organization_id', org_id,
    'organization', org_json,
    'settings', settings_json,
    'domains', domains_json
  ) INTO result;

  RETURN result;
END;
$function$;

-- Fix the variable scoping bug in save_organization_settings function
CREATE OR REPLACE FUNCTION public.save_organization_settings(p_organization_name text, p_organization_state text, p_address_line_1 text, p_address_line_2 text, p_zip_cone text, p_country text, p_default_language text, p_default_currency text, p_default_timezone text, p_facebook_url text, p_instagram_url text, p_x_url text, p_tiktok_url text, p_linkedin_url text, p_google_profile_url text, p_youtube_url text, p_domains jsonb)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  org_id UUID;
  app_user_id UUID;
  people_id UUID;
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
  SELECT id INTO people_id
  FROM public.people
  WHERE user_account_id = app_user_id AND is_deleted = false
  LIMIT 1;

  IF people_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Person record not found');
  END IF;

  -- Get user's organization (check both admin and regular people tables)
  SELECT s.organization_id INTO org_id
  FROM public.app_organizations_owners s
  WHERE s.owner_id = people_id AND s.is_deleted = false
  LIMIT 1;

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
  DELETE FROM public.settings_organization s
  WHERE s.organization_id = org_id;

  -- Upsert settings_organization table
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
  UPDATE public.settings_organization_domains s
  SET 
    is_deleted = true,
    deleted_by = current_user_id,
    deleted_at = now()
  WHERE s.organization_id = org_id AND s.is_deleted = false;

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


-- Fix the get_programs_with_goals function to properly handle GROUP BY
CREATE OR REPLACE FUNCTION public.get_programs_with_goals()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id uuid := auth.uid();
  app_user_id uuid;
  people_id uuid;
  owner_org_exists boolean;
  programs_data json;
BEGIN
  IF current_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Authentication failed: auth.uid() returned NULL');
  END IF;

  SELECT id INTO app_user_id
  FROM public.app_users
  WHERE user_id = current_user_id
  LIMIT 1;

  IF app_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'App user not found for auth user');
  END IF;

  SELECT id INTO people_id
  FROM public.people
  WHERE user_account_id = app_user_id AND is_deleted = false
  LIMIT 1;

  IF people_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Person record not found for app_user');
  END IF;

  -- Is this person an org owner? (Your schema doesn’t link programs to orgs, so we gate by ownership existence.)
  SELECT EXISTS (
    SELECT 1
    FROM public.app_organizations_owners op
    WHERE op.owner_id = people_id AND op.is_deleted = false
  ) INTO owner_org_exists;

  IF NOT owner_org_exists THEN
    RETURN json_build_object('success', false, 'message', 'Access denied');
  END IF;

  SELECT json_agg(
           json_build_object(
             'id', p.id,
             'name', p.program_name,
             'goals', COALESCE(garr.goals, '[]'::json)
           )
           ORDER BY p.created_at DESC
         )
    INTO programs_data
  FROM public.app_data_programs p
  LEFT JOIN (
    SELECT pg.program_id,
           json_agg(pg.goal_name ORDER BY pg.created_at) AS goals
    FROM public.app_data_programs_goals pg
    WHERE pg.is_deleted = false
    GROUP BY pg.program_id
  ) garr ON garr.program_id = p.id
  WHERE p.is_deleted = false;

  RETURN COALESCE(programs_data, '[]'::json);
END;
$function$;



-- create add_programms_with goals function to create the program and goals at the same time
CREATE OR REPLACE FUNCTION public.add_program_with_goals(
  p_program_name text,
  p_goals jsonb
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id uuid := auth.uid();
  app_user_id uuid;
  people_id uuid;
  owner_org_exists boolean;
  new_program_id uuid;
  goal_item jsonb;
  nonempty_goals_count int := 0;
BEGIN
  IF current_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Authentication failed: auth.uid() returned NULL');
  END IF;

  SELECT id INTO app_user_id
  FROM public.app_users
  WHERE user_id = current_user_id
  LIMIT 1;

  IF app_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'App user not found for auth user');
  END IF;

  SELECT id INTO people_id
  FROM public.people
  WHERE user_account_id = app_user_id AND is_deleted = false
  LIMIT 1;

  IF people_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Person record not found for app_user');
  END IF;

  SELECT EXISTS (
    SELECT 1
    FROM public.app_organizations_owners op
    WHERE op.owner_id = people_id AND op.is_deleted = false
  ) INTO owner_org_exists;

  IF NOT owner_org_exists THEN
    RETURN json_build_object('success', false, 'message', 'Access denied');
  END IF;

  IF COALESCE(trim(p_program_name), '') = '' THEN
    RETURN json_build_object('success', false, 'message', 'Program name is required');
  END IF;

  IF p_goals IS NULL OR jsonb_typeof(p_goals) <> 'array' THEN
    RETURN json_build_object('success', false, 'message', 'Goals must be a non-empty array');
  END IF;

  FOR goal_item IN SELECT * FROM jsonb_array_elements(p_goals)
  LOOP
    IF COALESCE(trim(goal_item->>'name'), '') <> '' THEN
      nonempty_goals_count := nonempty_goals_count + 1;
    END IF;
  END LOOP;

  IF nonempty_goals_count < 1 THEN
    RETURN json_build_object('success', false, 'message', 'At least one goal is required');
  END IF;

  INSERT INTO public.app_data_programs (program_name, created_by, updated_by, created_at, updated_at)
  VALUES (trim(p_program_name), current_user_id, current_user_id, now(), now())
  RETURNING id INTO new_program_id;

  FOR goal_item IN SELECT * FROM jsonb_array_elements(p_goals)
  LOOP
    IF COALESCE(trim(goal_item->>'name'), '') <> '' THEN
      INSERT INTO public.app_data_programs_goals (program_id, goal_name, created_by, updated_by, created_at, updated_at)
      VALUES (new_program_id, trim(goal_item->>'name'), current_user_id, current_user_id, now(), now());
    END IF;
  END LOOP;

  RETURN json_build_object('success', true, 'message', 'Program created successfully', 'program_id', new_program_id);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', 'Failed to create program: ' || sqlerrm);
END;
$function$;


-- create update_program function to update the program and goals at the same time
CREATE OR REPLACE FUNCTION public.update_program_with_goals(
  p_program_id uuid,
  p_program_name text,
  p_goals jsonb
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id uuid := auth.uid();
  app_user_id uuid;
  people_id uuid;
  owner_org_exists boolean;
  exists_program boolean;
  goal_item jsonb;
  nonempty_goals_count int := 0;
BEGIN
  IF current_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Authentication failed: auth.uid() returned NULL');
  END IF;

  SELECT id INTO app_user_id
  FROM public.app_users
  WHERE user_id = current_user_id
  LIMIT 1;

  IF app_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'App user not found for auth user');
  END IF;

  SELECT id INTO people_id
  FROM public.people
  WHERE user_account_id = app_user_id AND is_deleted = false
  LIMIT 1;

  IF people_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Person record not found for app_user');
  END IF;

  SELECT EXISTS (
    SELECT 1
    FROM public.app_organizations_owners op
    WHERE op.owner_id = people_id AND op.is_deleted = false
  ) INTO owner_org_exists;

  IF NOT owner_org_exists THEN
    RETURN json_build_object('success', false, 'message', 'Access denied');
  END IF;

  IF p_program_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Program id is required');
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM public.app_data_programs WHERE id = p_program_id AND is_deleted = false
  ) INTO exists_program;

  IF NOT exists_program THEN
    RETURN json_build_object('success', false, 'message', 'Program not found or deleted');
  END IF;

  IF COALESCE(trim(p_program_name), '') = '' THEN
    RETURN json_build_object('success', false, 'message', 'Program name is required');
  END IF;

  IF p_goals IS NULL OR jsonb_typeof(p_goals) <> 'array' THEN
    RETURN json_build_object('success', false, 'message', 'Goals must be a non-empty array');
  END IF;

  FOR goal_item IN SELECT * FROM jsonb_array_elements(p_goals)
  LOOP
    IF COALESCE(trim(goal_item->>'name'), '') <> '' THEN
      nonempty_goals_count := nonempty_goals_count + 1;
    END IF;
  END LOOP;

  IF nonempty_goals_count < 1 THEN
    RETURN json_build_object('success', false, 'message', 'At least one goal is required');
  END IF;

  -- Update program name
  UPDATE public.app_data_programs
  SET program_name = trim(p_program_name),
      updated_by   = current_user_id,
      updated_at   = now()
  WHERE id = p_program_id;

  -- Soft delete existing goals before inserting the new set
  UPDATE public.app_data_programs_goals
  SET is_deleted = true,
      deleted_by  = current_user_id,
      deleted_at  = now(),
      updated_by  = current_user_id,
      updated_at  = now()
  WHERE program_id = p_program_id AND is_deleted = false;

  -- Insert new goals
  FOR goal_item IN SELECT * FROM jsonb_array_elements(p_goals)
  LOOP
    IF COALESCE(trim(goal_item->>'name'), '') <> '' THEN
      INSERT INTO public.app_data_programs_goals (program_id, goal_name, created_by, updated_by, created_at, updated_at)
      VALUES (p_program_id, trim(goal_item->>'name'), current_user_id, current_user_id, now(), now());
    END IF;
  END LOOP;

  RETURN json_build_object('success', true, 'message', 'Program updated successfully', 'program_id', p_program_id);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', 'Failed to update program: ' || sqlerrm);
END;
$function$;


-- create delete_program function to delete the program and goals at the same time
CREATE OR REPLACE FUNCTION public.delete_program_with_goals(
  p_program_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id uuid := auth.uid();
  app_user_id uuid;
  people_id uuid;
  owner_org_exists boolean;
  exists_program boolean;
BEGIN
  IF current_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Authentication failed: auth.uid() returned NULL');
  END IF;

  SELECT id INTO app_user_id
  FROM public.app_users
  WHERE user_id = current_user_id
  LIMIT 1;

  IF app_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'App user not found for auth user');
  END IF;

  SELECT id INTO people_id
  FROM public.people
  WHERE user_account_id = app_user_id AND is_deleted = false
  LIMIT 1;

  IF people_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Person record not found for app_user');
  END IF;

  SELECT EXISTS (
    SELECT 1
    FROM public.app_organizations_owners op
    WHERE op.owner_id = people_id AND op.is_deleted = false
  ) INTO owner_org_exists;

  IF NOT owner_org_exists THEN
    RETURN json_build_object('success', false, 'message', 'Access denied');
  END IF;

  IF p_program_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Program id is required');
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM public.app_data_programs WHERE id = p_program_id AND is_deleted = false
  ) INTO exists_program;

  IF NOT exists_program THEN
    RETURN json_build_object('success', false, 'message', 'Program not found or already deleted');
  END IF;

  -- Soft delete program
  UPDATE public.app_data_programs
  SET is_deleted = true,
      deleted_by  = current_user_id,
      deleted_at  = now(),
      updated_by  = current_user_id,
      updated_at  = now()
  WHERE id = p_program_id;

  -- Soft delete program goals
  UPDATE public.app_data_programs_goals
  SET is_deleted = true,
      deleted_by  = current_user_id,
      deleted_at  = now(),
      updated_by  = current_user_id,
      updated_at  = now()
  WHERE program_id = p_program_id AND is_deleted = false;

  RETURN json_build_object('success', true, 'message', 'Program deleted successfully', 'program_id', p_program_id);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', 'Failed to delete program: ' || sqlerrm);
END;
$function$;



-- Function to get all labels for the user's organization
CREATE OR REPLACE FUNCTION public.get_data_labels()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id uuid;
  app_user_id     uuid;
  people_id       uuid;
  org_id          uuid;
  labels_data     json;
BEGIN
  -- 1) must be authenticated
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RETURN '[]'::json;
  END IF;

  -- 2) app_user must exist
  SELECT id
    INTO app_user_id
  FROM public.app_users
  WHERE user_id = current_user_id
  LIMIT 1;

  IF app_user_id IS NULL THEN
    RETURN '[]'::json;
  END IF;

  -- 3) person must exist & not deleted
  SELECT id
    INTO people_id
  FROM public.people
  WHERE user_account_id = app_user_id
    AND is_deleted = false
  LIMIT 1;

  IF people_id IS NULL THEN
    RETURN '[]'::json;
  END IF;

  -- 4) must be an organization OWNER (not just admin)
  SELECT s.organization_id
    INTO org_id
  FROM public.app_organizations_owners s
  WHERE s.owner_id = people_id
    AND s.is_deleted = false
  LIMIT 1;

  IF org_id IS NULL THEN
    RETURN '[]'::json;
  END IF;

  -- 5) return labels (global list; scope per-org if your table has organization_id)
  SELECT json_agg(
           json_build_object(
             'id',        dl.id,
             'name',      dl.label_name,
             'category',  dl.label_category,
             'color',     dl.label_color,
             'textColor', dl.text_color,
             'fontWeight',dl.font_weight
           )
         )
    INTO labels_data
  FROM public.app_data_labels dl;

  RETURN COALESCE(labels_data, '[]'::json);
END;
$function$;


-- Function to add a new label
CREATE OR REPLACE FUNCTION public.add_data_label(
  p_label_name text,
  p_label_category text,
  p_label_color text,
  p_text_color text,
  p_font_weight text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_label_id UUID;
  current_user_id UUID := auth.uid();
  result JSON;
BEGIN
  -- Check if user has access
  IF NOT EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_organizations_owners op ON p.id = op.owner_id
    WHERE au.user_id = current_user_id 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  ) THEN
    RETURN json_build_object('success', false, 'message', 'Access denied');
  END IF;

  -- Insert new label
  INSERT INTO public.app_data_labels (
    label_name,
    label_category,
    label_color,
    text_color,
    font_weight,
    created_by,
    updated_by
  ) VALUES (
    p_label_name,
    p_label_category,
    p_label_color,
    p_text_color,
    p_font_weight,
    current_user_id,
    current_user_id
  ) RETURNING id INTO new_label_id;

  RETURN json_build_object(
    'success', true,
    'message', 'Label created successfully',
    'label_id', new_label_id
  );
END;
$function$;

-- Function to update an existing label
CREATE OR REPLACE FUNCTION public.update_data_label(
  p_label_id uuid,
  p_label_name text,
  p_label_category text,
  p_label_color text,
  p_text_color text,
  p_font_weight text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  result JSON;
BEGIN
  -- Check if user has access
  IF NOT EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_organizations_owners op ON p.id = op.owner_id
    WHERE au.user_id = current_user_id 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  ) THEN
    RETURN json_build_object('success', false, 'message', 'Access denied');
  END IF;

  -- Update label
  UPDATE public.app_data_labels 
  SET 
    label_name = p_label_name,
    label_category = p_label_category,
    label_color = p_label_color,
    text_color = p_text_color,
    font_weight = p_font_weight,
    updated_by = current_user_id,
    updated_at = now()
  WHERE id = p_label_id;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Label not found');
  END IF;

  RETURN json_build_object(
    'success', true,
    'message', 'Label updated successfully'
  );
END;
$function$;

-- Function to delete a label
CREATE OR REPLACE FUNCTION public.delete_data_label(p_label_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  result JSON;
BEGIN
  -- Check if user has access
  IF NOT EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_organizations_owners op ON p.id = op.owner_id
    WHERE au.user_id = current_user_id 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  ) THEN
    RETURN json_build_object('success', false, 'message', 'Access denied');
  END IF;

  -- Delete label
  DELETE FROM public.app_data_labels 
  WHERE id = p_label_id;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Label not found');
  END IF;

  RETURN json_build_object(
    'success', true,
    'message', 'Label deleted successfully'
  );
END;
$function$;


-- Create function to add new user role
CREATE OR REPLACE FUNCTION public.add_user_role(p_role_name TEXT)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_role_id UUID;
  current_user_id UUID := auth.uid();
  result JSON;
BEGIN
  -- Check if current user has admin role
  IF NOT public.current_user_has_admin_role() THEN
    RETURN json_build_object('success', false, 'message', 'Access denied. Admin or owner role required.');
  END IF;

  -- Check if role name already exists
  IF EXISTS (SELECT 1 FROM public.app_user_roles WHERE role_name = p_role_name::user_roles_enum AND is_deleted = false) THEN
    RETURN json_build_object('success', false, 'message', 'Role name already exists.');
  END IF;

  -- Insert new role
  INSERT INTO public.app_user_roles (role_name, created_by, updated_by)
  VALUES (p_role_name::user_roles_enum, current_user_id, current_user_id)
  RETURNING id INTO new_role_id;

  RETURN json_build_object(
    'success', true,
    'message', 'Role created successfully',
    'role_id', new_role_id
  );
END;
$$;

-- Create function to update user role
CREATE OR REPLACE FUNCTION public.update_user_role(p_role_id UUID, p_role_name TEXT)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID := auth.uid();
  result JSON;
BEGIN
  -- Check if current user has admin role
  IF NOT public.current_user_has_admin_role() THEN
    RETURN json_build_object('success', false, 'message', 'Access denied. Admin or owner role required.');
  END IF;

  -- Check if role exists
  IF NOT EXISTS (SELECT 1 FROM public.app_user_roles WHERE id = p_role_id AND is_deleted = false) THEN
    RETURN json_build_object('success', false, 'message', 'Role not found.');
  END IF;

  -- Check if new role name already exists (excluding current role)
  IF EXISTS (SELECT 1 FROM public.app_user_roles WHERE role_name = p_role_name::user_roles_enum AND id != p_role_id AND is_deleted = false) THEN
    RETURN json_build_object('success', false, 'message', 'Role name already exists.');
  END IF;

  -- Update role
  UPDATE public.app_user_roles 
  SET 
    role_name = p_role_name::user_roles_enum,
    updated_by = current_user_id,
    updated_at = now()
  WHERE id = p_role_id;

  RETURN json_build_object(
    'success', true,
    'message', 'Role updated successfully'
  );
END;
$$;

-- Create function to delete user role (soft delete)
CREATE OR REPLACE FUNCTION public.delete_user_role(p_role_id UUID)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID := auth.uid();
  role_in_use BOOLEAN;
  result JSON;
BEGIN
  -- Check if current user has admin role
  IF NOT public.current_user_has_admin_role() THEN
    RETURN json_build_object('success', false, 'message', 'Access denied. Admin or owner role required.');
  END IF;

  -- Check if role exists
  IF NOT EXISTS (SELECT 1 FROM public.app_user_roles WHERE id = p_role_id AND is_deleted = false) THEN
    RETURN json_build_object('success', false, 'message', 'Role not found.');
  END IF;

  -- Check if role is in use
  SELECT EXISTS (
    SELECT 1 FROM public.app_agencies_people 
    WHERE user_role_id = p_role_id AND is_deleted = false
  ) INTO role_in_use;

  IF role_in_use THEN
    RETURN json_build_object('success', false, 'message', 'Cannot delete role that is assigned to users.');
  END IF;

  -- Soft delete role
  UPDATE public.app_user_roles 
  SET 
    is_deleted = true,
    deleted_by = current_user_id,
    deleted_at = now()
  WHERE id = p_role_id;

  RETURN json_build_object(
    'success', true,
    'message', 'Role deleted successfully'
  );
END;
$$;

-- Recreate with new return structure
-- 7) (Optional) augment your roles listing with permission_count
CREATE OR REPLACE FUNCTION public.get_user_roles_with_counts()
RETURNS TABLE(
  id uuid, 
  role_name text, 
  user_count bigint, 
  created_at timestamptz,
  updated_at timestamptz,
  role_label_id uuid,
  label_name text,
  label_color text,
  text_color text,
  font_weight text,
  permission_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Enforce admin/owner
  IF NOT public.current_user_has_admin_role() THEN
    RAISE EXCEPTION 'Access denied. Admin or owner role required.';
  END IF;

  RETURN QUERY
  WITH role_counts AS (
    SELECT op.user_role_id, COUNT(*)::bigint AS count
    FROM public.app_agencies_people op
    WHERE op.is_deleted = false
    GROUP BY op.user_role_id
  ),
  owner_ct AS (
    SELECT COUNT(*)::bigint AS count
    FROM public.app_organizations_owners o
    WHERE o.is_deleted = false
  ),
  perm_counts AS (
    SELECT upr.user_role_id, COUNT(*)::bigint AS count
    FROM public.app_user_permissions_role upr
    WHERE upr.is_deleted = false
    GROUP BY upr.user_role_id
  )
  SELECT 
    ur.id,
    ur.role_name::TEXT,
    CASE 
      WHEN ur.role_name = 'owner'::user_roles_enum THEN oc.count
      ELSE COALESCE(rc.count, 0)
    END AS user_count,
    ur.created_at,
    ur.updated_at,
    ur.role_label_id,
    dl.label_name,
    dl.label_color,
    dl.text_color,
    dl.font_weight,
    COALESCE(pc.count, 0) AS permission_count
  FROM public.app_user_roles ur
  LEFT JOIN role_counts rc ON ur.id = rc.user_role_id
  LEFT JOIN perm_counts pc ON ur.id = pc.user_role_id
  LEFT JOIN public.app_data_labels dl ON ur.role_label_id = dl.id
  CROSS JOIN owner_ct oc
  WHERE ur.is_deleted = false
  ORDER BY ur.created_at DESC;
END;
$function$;

-- Update add_user_role to accept role_label_id
CREATE OR REPLACE FUNCTION public.add_user_role(p_role_name text, p_role_label_id uuid DEFAULT NULL)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_role_id UUID;
  current_user_id UUID := auth.uid();
  result JSON;
BEGIN
  -- Check if current user has admin role
  IF NOT public.current_user_has_admin_role() THEN
    RETURN json_build_object('success', false, 'message', 'Access denied. Admin or owner role required.');
  END IF;

  -- Check if role name already exists
  IF EXISTS (SELECT 1 FROM public.app_user_roles WHERE role_name = p_role_name::user_roles_enum AND is_deleted = false) THEN
    RETURN json_build_object('success', false, 'message', 'Role name already exists.');
  END IF;

  -- Insert new role
  INSERT INTO public.app_user_roles (role_name, role_label_id, created_by, updated_by)
  VALUES (p_role_name::user_roles_enum, p_role_label_id, current_user_id, current_user_id)
  RETURNING id INTO new_role_id;

  RETURN json_build_object(
    'success', true,
    'message', 'Role created successfully',
    'role_id', new_role_id
  );
END;
$function$;

-- Update update_user_role to accept role_label_id
CREATE OR REPLACE FUNCTION public.update_user_role(p_role_id uuid, p_role_name text, p_role_label_id uuid DEFAULT NULL)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  result JSON;
BEGIN
  -- Check if current user has admin role
  IF NOT public.current_user_has_admin_role() THEN
    RETURN json_build_object('success', false, 'message', 'Access denied. Admin or owner role required.');
  END IF;

  -- Check if role exists
  IF NOT EXISTS (SELECT 1 FROM public.app_user_roles WHERE id = p_role_id AND is_deleted = false) THEN
    RETURN json_build_object('success', false, 'message', 'Role not found.');
  END IF;

  -- Check if new role name already exists (excluding current role)
  IF EXISTS (SELECT 1 FROM public.app_user_roles WHERE role_name = p_role_name::user_roles_enum AND id != p_role_id AND is_deleted = false) THEN
    RETURN json_build_object('success', false, 'message', 'Role name already exists.');
  END IF;

  -- Update role
  UPDATE public.app_user_roles 
  SET 
    role_name = p_role_name::user_roles_enum,
    role_label_id = p_role_label_id,
    updated_by = current_user_id,
    updated_at = now()
  WHERE id = p_role_id;

  RETURN json_build_object(
    'success', true,
    'message', 'Role updated successfully'
  );
END;
$function$;


CREATE OR REPLACE FUNCTION public.get_staff_types_with_counts()
RETURNS TABLE(
  id uuid,
  staff_type text,
  created_at timestamptz,
  updated_at timestamptz,
  is_deleted boolean,
  staff_type_label_id uuid,
  label_name text,
  label_color text,
  text_color text,
  font_weight text,
  count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- only admins/owners may view
  IF NOT public.current_user_has_admin_role() THEN
    RAISE EXCEPTION 'Access denied. Admin or owner role required.';
  END IF;

  RETURN QUERY
  SELECT
    st.id,
    st.staff_type::text,
    st.created_at,
    st.updated_at,
    st.is_deleted,
    st.staff_type_label_id,
    dl.label_name,
    dl.label_color,
    dl.text_color,
    dl.font_weight,
    COALESCE(c.cnt, 0)::bigint AS count
  FROM public.app_user_staff_types st
  LEFT JOIN public.app_data_labels dl
    ON dl.id = st.staff_type_label_id
  LEFT JOIN (
    SELECT user_staff_type_id, COUNT(*) AS cnt
    FROM public.app_agencies_people ag
    WHERE ag.is_deleted = false
    GROUP BY user_staff_type_id
  ) c ON c.user_staff_type_id = st.id
  WHERE st.is_deleted = false
  ORDER BY st.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.add_staff_type(
  p_staff_type text,
  p_staff_type_label_id uuid DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE new_id uuid;
BEGIN
  IF NOT public.current_user_has_admin_role() THEN
    RETURN json_build_object('success', false, 'message', 'Access denied. Admin or owner role required.');
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.app_user_staff_types
    WHERE staff_type = p_staff_type::public.staff_type_enum
      AND is_deleted = false
  ) THEN
    RETURN json_build_object('success', false, 'message', 'Staff type already exists.');
  END IF;

  INSERT INTO public.app_user_staff_types (staff_type, staff_type_label_id, created_by, updated_by)
  VALUES (p_staff_type::public.staff_type_enum, p_staff_type_label_id, auth.uid(), auth.uid())
  RETURNING id INTO new_id;

  RETURN json_build_object('success', true, 'message', 'Staff type created successfully', 'staff_type_id', new_id);
END;
$$;


CREATE OR REPLACE FUNCTION public.update_staff_type(
  p_staff_type_id uuid,
  p_staff_type text,
  p_staff_type_label_id uuid DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.current_user_has_admin_role() THEN
    RETURN json_build_object('success', false, 'message', 'Access denied. Admin or owner role required.');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.app_user_staff_types WHERE id = p_staff_type_id AND is_deleted = false) THEN
    RETURN json_build_object('success', false, 'message', 'Staff type not found.');
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.app_user_staff_types
    WHERE staff_type = p_staff_type::public.staff_type_enum
      AND id <> p_staff_type_id
      AND is_deleted = false
  ) THEN
    RETURN json_build_object('success', false, 'message', 'Staff type already exists.');
  END IF;

  UPDATE public.app_user_staff_types
  SET
    staff_type = p_staff_type::public.staff_type_enum,
    staff_type_label_id = p_staff_type_label_id,
    updated_at = now()
  WHERE id = p_staff_type_id;

  RETURN json_build_object('success', true, 'message', 'Staff type updated successfully');
END;
$$;


CREATE OR REPLACE FUNCTION public.delete_staff_type(
  p_staff_type_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE in_use boolean;
BEGIN
  IF NOT public.current_user_has_admin_role() THEN
    RETURN json_build_object('success', false, 'message', 'Access denied. Admin or owner role required.');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.app_user_staff_types WHERE id = p_staff_type_id AND is_deleted = false) THEN
    RETURN json_build_object('success', false, 'message', 'Staff type not found.');
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.app_agencies_people
    WHERE user_staff_type_id = p_staff_type_id AND is_deleted = false
  ) INTO in_use;

  IF in_use THEN
    RETURN json_build_object('success', false, 'message', 'Cannot delete staff type that is assigned to users.');
  END IF;

  UPDATE public.app_user_staff_types
  SET is_deleted = true
  WHERE id = p_staff_type_id;

  RETURN json_build_object('success', true, 'message', 'Staff type deleted successfully');
END;
$$;

-- 1) Get all permissions (not deleted)
CREATE OR REPLACE FUNCTION public.get_all_permissions()
RETURNS TABLE(
  id uuid,
  permission_name text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
BEGIN
  IF NOT public.current_user_has_admin_role() THEN
    RAISE EXCEPTION 'Access denied. Admin or owner role required.';
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    p.user_permissions AS permission_name,
    p.created_at,
    p.updated_at
  FROM public.app_user_permissions p
  WHERE p.is_deleted = false
  ORDER BY p.user_permissions ASC;
END;
$fn$;


-- 2) Add permission (unique name, soft constraints handled in code)
CREATE OR REPLACE FUNCTION public.add_permission(p_permission_name text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  new_id uuid;
  current_user_id uuid := auth.uid();
BEGIN
  IF NOT public.current_user_has_admin_role() THEN
    RETURN json_build_object('success', false, 'message', 'Access denied. Admin or owner role required.');
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.app_user_permissions 
    WHERE user_permissions = p_permission_name AND is_deleted = false
  ) THEN
    RETURN json_build_object('success', false, 'message', 'Permission already exists.');
  END IF;

  INSERT INTO public.app_user_permissions (user_permissions, created_by, updated_by)
  VALUES (p_permission_name, current_user_id, current_user_id)
  RETURNING id INTO new_id;

  RETURN json_build_object('success', true, 'message', 'Permission created successfully', 'permission_id', new_id);
END;
$fn$;


-- 3) Update permission name
CREATE OR REPLACE FUNCTION public.update_permission(p_permission_id uuid, p_permission_name text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  current_user_id uuid := auth.uid();
BEGIN
  IF NOT public.current_user_has_admin_role() THEN
    RETURN json_build_object('success', false, 'message', 'Access denied. Admin or owner role required.');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.app_user_permissions 
    WHERE id = p_permission_id AND is_deleted = false
  ) THEN
    RETURN json_build_object('success', false, 'message', 'Permission not found.');
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.app_user_permissions 
    WHERE user_permissions = p_permission_name 
      AND id <> p_permission_id
      AND is_deleted = false
  ) THEN
    RETURN json_build_object('success', false, 'message', 'Another permission with same name exists.');
  END IF;

  UPDATE public.app_user_permissions
  SET user_permissions = p_permission_name,
      updated_by = current_user_id,
      updated_at = now()
  WHERE id = p_permission_id;

  RETURN json_build_object('success', true, 'message', 'Permission updated successfully');
END;
$fn$;


-- 4) Soft delete permission (ensure no active link if you want to block)
CREATE OR REPLACE FUNCTION public.delete_permission(p_permission_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  current_user_id uuid := auth.uid();
BEGIN
  IF NOT public.current_user_has_admin_role() THEN
    RETURN json_build_object('success', false, 'message', 'Access denied. Admin or owner role required.');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.app_user_permissions 
    WHERE id = p_permission_id AND is_deleted = false
  ) THEN
    RETURN json_build_object('success', false, 'message', 'Permission not found.');
  END IF;

  -- (Optional) Block delete if linked:
  -- IF EXISTS (
  --   SELECT 1 FROM public.app_user_permissions_role 
  --   WHERE user_permission_id = p_permission_id AND is_deleted = false
  -- ) THEN
  --   RETURN json_build_object('success', false, 'message', 'Cannot delete permission in use.');
  -- END IF;

  UPDATE public.app_user_permissions
  SET is_deleted = true,
      deleted_by = current_user_id,
      deleted_at = now()
  WHERE id = p_permission_id;

  RETURN json_build_object('success', true, 'message', 'Permission deleted successfully');
END;
$fn$;


-- 5) List all permissions with "assigned" boolean for a role
create or replace function public.get_permissions_with_assignments(p_role_id uuid)
returns table(
  id uuid,
  permission_name text,
  assigned boolean
)
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if not public.current_user_has_admin_role() then
    raise exception 'Access denied. Admin or owner role required.';
  end if;

  return query
  select
    p.id,
    p.user_permissions as permission_name,
    exists (
      select 1
      from public.app_user_permissions_role upr
      where upr.user_permission_id = p.id
        and upr.user_role_id = p_role_id
        and upr.is_deleted = false
    ) as assigned
  from public.app_user_permissions p
  where p.is_deleted = false
    and (
      -- keep already-assigned-to-this-role visible
      exists (
        select 1
        from public.app_user_permissions_role upr1
        where upr1.user_permission_id = p.id
          and upr1.user_role_id = p_role_id
          and upr1.is_deleted = false
      )
      -- otherwise only show if NOT assigned to any staff type
      or not exists (
        select 1
        from public.app_user_permissions_staff_type ups_any
        where ups_any.user_permission_id = p.id
          and ups_any.is_deleted = false
      )
    )
  order by p.user_permissions asc;
end;
$fn$;


-- 5) List all permissions with "assigned" boolean for a staff type
create or replace function public.get_permissions_with_assignments_for_staff_type(p_staff_type_id uuid)
returns table(
  id uuid,
  permission_name text,
  assigned boolean
)
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if not public.current_user_has_admin_role() then
    raise exception 'Access denied. Admin or owner role required.';
  end if;

  return query
  select
    p.id,
    p.user_permissions as permission_name,
    exists (
      select 1
      from public.app_user_permissions_staff_type ups
      where ups.user_permission_id = p.id
        and ups.staff_type_id = p_staff_type_id
        and ups.is_deleted = false
    ) as assigned
  from public.app_user_permissions p
  where p.is_deleted = false
    and (
      -- keep already-assigned-to-this-staff-type visible
      exists (
        select 1
        from public.app_user_permissions_staff_type ups1
        where ups1.user_permission_id = p.id
          and ups1.staff_type_id = p_staff_type_id
          and ups1.is_deleted = false
      )
      -- otherwise only show if NOT assigned to any role
      or not exists (
        select 1
        from public.app_user_permissions_role upr_any
        where upr_any.user_permission_id = p.id
          and upr_any.is_deleted = false
      )
    )
  order by p.user_permissions asc;
end;
$fn$;

-- 6) Set role permissions in one shot (idempotent upsert / prune)
CREATE OR REPLACE FUNCTION public.set_role_permissions(p_role_id uuid, p_permission_ids uuid[])
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  current_user_id uuid := auth.uid();
BEGIN
  IF NOT public.current_user_has_admin_role() THEN
    RETURN json_build_object('success', false, 'message', 'Access denied. Admin or owner role required.');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.app_user_roles WHERE id = p_role_id AND is_deleted = false
  ) THEN
    RETURN json_build_object('success', false, 'message', 'Role not found.');
  END IF;

  -- Soft delete links not in new list
  UPDATE public.app_user_permissions_role upr
  SET is_deleted = true,
      deleted_by = current_user_id,
      deleted_at = now()
  WHERE upr.user_role_id = p_role_id
    AND upr.is_deleted = false
    AND NOT (upr.user_permission_id = ANY (p_permission_ids));

  -- Insert missing links
  INSERT INTO public.app_user_permissions_role (user_role_id, user_permission_id, created_by, updated_by)
  SELECT p_role_id, pid, current_user_id, current_user_id
  FROM UNNEST(p_permission_ids) AS pid
  WHERE NOT EXISTS (
    SELECT 1 FROM public.app_user_permissions_role upr
    WHERE upr.user_role_id = p_role_id
      AND upr.user_permission_id = pid
      AND upr.is_deleted = false
  );

  RETURN json_build_object('success', true, 'message', 'Permissions updated for role');
END;
$fn$;

-- 7) Set staff type permissions in one shot (idempotent upsert / prune)
CREATE OR REPLACE FUNCTION public.set_staff_type_permissions(p_staff_type_id uuid, p_permission_ids uuid[])
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  current_user_id uuid := auth.uid();
BEGIN
  IF NOT public.current_user_has_admin_role() THEN
    RETURN json_build_object('success', false, 'message', 'Access denied. Admin or owner role required.');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.app_user_staff_types WHERE id = p_staff_type_id AND is_deleted = false
  ) THEN
    RETURN json_build_object('success', false, 'message', 'Staff type not found.');
  END IF;

  -- Soft delete links not in new list
  UPDATE public.app_user_permissions_staff_type ups
  SET is_deleted = true,
      deleted_by = current_user_id,
      deleted_at = now()
  WHERE ups.staff_type_id = p_staff_type_id
    AND ups.is_deleted = false
    AND NOT (ups.user_permission_id = ANY (p_permission_ids));

  -- Insert missing links
  INSERT INTO public.app_user_permissions_staff_type (staff_type_id, user_permission_id, created_by, updated_by)
  SELECT p_staff_type_id, pid, current_user_id, current_user_id
  FROM UNNEST(p_permission_ids) AS pid
  WHERE NOT EXISTS (
    SELECT 1 FROM public.app_user_permissions_staff_type ups
    WHERE ups.staff_type_id = p_staff_type_id
      AND ups.user_permission_id = pid
      AND ups.is_deleted = false
  );

  RETURN json_build_object('success', true, 'message', 'Permissions updated for staff type');
END;
$fn$;

