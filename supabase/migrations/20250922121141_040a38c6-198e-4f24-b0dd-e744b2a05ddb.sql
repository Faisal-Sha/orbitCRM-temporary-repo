-- Drop existing get_leads_data function
DROP FUNCTION IF EXISTS public.get_leads_data();

-- Recreate get_leads_data function without status = 'active' requirement
CREATE OR REPLACE FUNCTION public.get_leads_data()
RETURNS TABLE (
    lead_id uuid,
    person_id uuid,
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
    pl.id as lead_id,
    p.id as person_id,
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
  JOIN app_agencies_people aap ON p.id = aap.person_id
  LEFT JOIN people_contacts pc ON p.id = pc.person_id AND pc.is_deleted = false
  WHERE p.role = 'Lead'
      AND p.is_deleted = FALSE
      AND pl.is_deleted = FALSE
      AND NOT EXISTS (
          SELECT 1 FROM people_referrals pr 
          WHERE pr.person_id = p.id AND pr.is_deleted = FALSE
      )
      AND aap.agency_id = current_agency_id
  ORDER BY pl.created_at DESC;
END;
$$;