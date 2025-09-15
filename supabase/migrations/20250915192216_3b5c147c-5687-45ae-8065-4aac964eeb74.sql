-- Get leads data with joined person and contact information
CREATE OR REPLACE FUNCTION public.get_leads_data()
RETURNS TABLE(
  lead_id uuid,
  first_name text,
  last_name text,
  email text,
  phone text,
  created_at timestamp with time zone,
  lead_goals text,
  preferences text,
  expectation text,
  note text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pl.id as lead_id,
    p.first_name,
    p.last_name, 
    pc.email,
    pc.phone,
    pl.created_at,
    pl.lead_goals,
    pl.preferences,
    pl.expectation,
    pl.note
  FROM people_leads pl
  JOIN people p ON pl.person_id = p.id
  JOIN people_assign_user_role paur ON p.id = paur.person_id
  JOIN app_user_roles aur ON paur.user_role_id = aur.id
  LEFT JOIN people_contacts pc ON p.id = pc.person_id AND pc.is_deleted = false
  WHERE pl.is_deleted = false 
    AND p.is_deleted = false 
    AND p.status = 'active'::people_status_enum
    AND paur.is_deleted = false
    AND aur.role_name = 'lead'::user_roles_enum
  ORDER BY pl.created_at DESC;
END;
$$;