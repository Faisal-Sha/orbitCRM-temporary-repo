-- Fix the ambiguous person_id reference in update_organization_with_admin function
CREATE OR REPLACE FUNCTION public.update_organization_with_admin(org_id uuid, organization_name text, organization_state text, organization_status organization_status_enum, admin_first_name text, admin_last_name text, admin_email text, updated_by_user_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  admin_person_id UUID;
  result JSON;
BEGIN
  -- Update organization with organization_state
  UPDATE public.app_organizations 
  SET 
    organization_name = update_organization_with_admin.organization_name,
    organization_state = update_organization_with_admin.organization_state,
    status = organization_status,
    updated_by = updated_by_user_id,
    updated_at = now()
  WHERE id = org_id;

  -- Get the admin person_id
  SELECT oa.person_id INTO admin_person_id
  FROM public.app_organization_admins oa
  WHERE oa.organization_id = org_id AND oa.is_deleted = false
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
    WHERE people_contacts.person_id = admin_person_id;
  END IF;

  -- Return result
  SELECT json_build_object(
    'organization_id', org_id,
    'person_id', admin_person_id,
    'success', true
  ) INTO result;

  RETURN result;
END;
$function$;