-- Create function to get active clients data
CREATE OR REPLACE FUNCTION public.get_active_clients_data()
RETURNS TABLE(
  person_id uuid,
  first_name text,
  last_name text,
  email text,
  phone text,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_agency_id uuid;
BEGIN
  -- Get the current user's agency ID
  SELECT current_user_agency_id() INTO current_agency_id;
  
  IF current_agency_id IS NULL THEN
    -- Return empty result if user has no agency access
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    p.id as person_id,
    p.first_name,
    p.last_name,
    pc.email,
    pc.phone,
    pc.created_at
  FROM people p
  JOIN people_clients pcl ON p.id = pcl.person_id
  JOIN app_agencies_people aap ON p.id = aap.person_id
  JOIN people_assign_user_role paur ON p.id = paur.person_id
  JOIN app_user_roles aur ON paur.user_role_id = aur.id
  LEFT JOIN people_contacts pc ON p.id = pc.person_id AND pc.is_deleted = false
  WHERE p.is_deleted = FALSE
    AND pcl.is_deleted = FALSE
    AND aap.is_deleted = FALSE
    AND paur.is_deleted = FALSE
    AND aur.is_deleted = FALSE
    AND aur.role_name = 'client'
    AND LOWER(p.status) IN ('active', 'on hold', 'inactive')
    AND aap.agency_id = current_agency_id
    AND pcl.agency_id = current_agency_id
  ORDER BY pc.created_at DESC NULLS LAST, p.created_at DESC;
END;
$$;