-- Drop and recreate the get_leads_data function to include person status
DROP FUNCTION IF EXISTS get_leads_data();

CREATE OR REPLACE FUNCTION get_leads_data()
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
  note text,
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pr.id as lead_id,
    p.id as person_id,
    p.first_name,
    p.last_name,
    pc.email,
    pc.phone,
    pr.created_at,
    pr.referral_goals as lead_goals,
    pr.preferences,
    pr.expectation,
    pr.note,
    p.status
  FROM people_referrals pr
  JOIN people p ON pr.person_id = p.id
  LEFT JOIN people_contacts pc ON p.id = pc.person_id
  WHERE pr.is_deleted = false 
    AND p.is_deleted = false
    AND (pc.is_deleted = false OR pc.is_deleted IS NULL)
  ORDER BY pr.created_at DESC;
END;
$$;