-- Update get_leads_data function to remove columns we're about to delete
CREATE OR REPLACE FUNCTION public.get_leads_data()
 RETURNS TABLE(lead_id uuid, person_id uuid, first_name text, last_name text, email text, phone text, created_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    pl.id AS lead_id,
    p.id  AS person_id,
    p.first_name,
    p.last_name, 
    pc.email,
    pc.phone,
    pl.created_at
  FROM public.people_leads pl
  JOIN public.people p ON pl.person_id = p.id
  JOIN public.people_assign_user_role paur ON p.id = paur.person_id
  JOIN public.app_user_roles aur ON paur.user_role_id = aur.id
  LEFT JOIN public.people_contacts pc ON p.id = pc.person_id AND pc.is_deleted = false
  WHERE pl.is_deleted = false 
    AND p.is_deleted = false 
    AND p.status = 'active'
    AND paur.is_deleted = false
    AND aur.is_deleted = false
    AND aur.role_name = 'lead'
  ORDER BY pl.created_at DESC;
END;
$function$;

-- Update update_people_leads_field function to remove preferred_language handling
CREATE OR REPLACE FUNCTION public.update_people_leads_field(p_person_id uuid, p_field_name text, p_field_value text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  lead_record_id UUID;
  result JSON;
BEGIN
  -- Find existing leads record
  SELECT id INTO lead_record_id
  FROM public.people_leads
  WHERE person_id = p_person_id AND is_deleted = false
  LIMIT 1;

  -- If no leads record exists, create one
  IF lead_record_id IS NULL THEN
    INSERT INTO public.people_leads (
      person_id,
      agency_id,
      created_by,
      updated_by
    ) VALUES (
      p_person_id,
      (SELECT op.agency_id FROM public.app_agencies_people op WHERE op.person_id = p_person_id AND op.is_deleted = false LIMIT 1),
      current_user_id,
      current_user_id
    ) RETURNING id INTO lead_record_id;
  END IF;

  -- No valid field names remain for this function
  RETURN json_build_object('success', false, 'message', 'Invalid field name');
END;
$function$;

-- Drop the columns from people_leads table
ALTER TABLE public.people_leads 
DROP COLUMN IF EXISTS service_id,
DROP COLUMN IF EXISTS lead_source,
DROP COLUMN IF EXISTS lead_goals,
DROP COLUMN IF EXISTS preferences,
DROP COLUMN IF EXISTS expectation,
DROP COLUMN IF EXISTS preferred_language,
DROP COLUMN IF EXISTS note;