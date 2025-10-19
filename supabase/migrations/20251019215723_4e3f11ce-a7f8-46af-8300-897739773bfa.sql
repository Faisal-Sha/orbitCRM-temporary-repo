-- Fix alert_metrics_for_people RPC to:
-- 1. Remove non-existent saa.is_deleted filter
-- 2. Add agency_id scoping to appointment counts
-- 3. Make client status check case-insensitive

CREATE OR REPLACE FUNCTION public.alert_metrics_for_people(
  p_person_ids uuid[],
  p_agency_id uuid
)
RETURNS TABLE(
  person_id uuid,
  total_appointments bigint,
  total_rescheduled bigint,
  is_client boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Authorization check
  IF NOT user_can_access_agency(p_agency_id) THEN
    RAISE EXCEPTION 'Access denied to agency';
  END IF;

  RETURN QUERY
  WITH appointment_counts AS (
    SELECT 
      COALESCE(
        (sa.booking_details->'responses'->'attendee_id'->>'value')::uuid,
        saa.attendee_id
      ) AS attendee_person_id,
      COUNT(*) FILTER (
        WHERE satl.trigger_event IN ('BOOKING_CREATED', 'BOOKING_RESCHEDULED')
      ) AS total_appts,
      COUNT(*) FILTER (
        WHERE satl.trigger_event = 'BOOKING_RESCHEDULED'
      ) AS total_resched
    FROM schedule_appointment_trigger_log satl
    INNER JOIN schedule_appointments sa ON satl.appointment_id = sa.id
    LEFT JOIN schedule_appointment_attendees saa 
      ON sa.id = saa.appointment_id
    WHERE satl.trigger_event IN ('BOOKING_CREATED', 'BOOKING_RESCHEDULED')
      AND sa.agency_id = p_agency_id
    GROUP BY attendee_person_id
  ),
  client_status AS (
    SELECT 
      p.id AS person_id,
      (
        LOWER(p.status) IN ('active', 'on hold', 'on_hold') 
        AND aur.role_name = 'client'
      ) AS is_active_client
    FROM people p
    LEFT JOIN app_user_roles aur ON p.user_role_id = aur.id AND aur.is_deleted = false
    INNER JOIN app_agencies_people aap ON p.id = aap.person_id AND aap.is_deleted = false
    WHERE p.id = ANY(p_person_ids)
      AND p.is_deleted = false
      AND aap.agency_id = p_agency_id
  )
  SELECT 
    cs.person_id,
    COALESCE(ac.total_appts, 0) AS total_appointments,
    COALESCE(ac.total_resched, 0) AS total_rescheduled,
    COALESCE(cs.is_active_client, false) AS is_client
  FROM client_status cs
  LEFT JOIN appointment_counts ac ON cs.person_id = ac.attendee_person_id;
END;
$$;