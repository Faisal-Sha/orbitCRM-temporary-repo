-- Update get_leads_data function to remove status = 'active' requirement
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
BEGIN
    RETURN QUERY
    SELECT 
        pl.id as lead_id,
        p.id as person_id,
        p.first_name,
        p.last_name,
        p.email,
        p.phone,
        pl.created_at,
        pl.lead_goals,
        pl.preferences,
        pl.expectation,
        pl.note
    FROM people_leads pl
    JOIN people p ON pl.person_id = p.id
    JOIN app_agencies_people aap ON p.id = aap.person_id
    WHERE p.role = 'Lead'
        AND p.is_deleted = FALSE
        AND pl.is_deleted = FALSE
        AND NOT EXISTS (
            SELECT 1 FROM people_referrals pr 
            WHERE pr.person_id = p.id AND pr.is_deleted = FALSE
        )
        AND aap.agency_id = (
            SELECT agency_id FROM app_agencies_people 
            WHERE person_id = auth.uid() 
            LIMIT 1
        );
END;
$$;