-- Backfill canceled_by using canceled_by_email
UPDATE schedule_appointments sa
SET canceled_by = pc.person_id
FROM people_contacts pc
JOIN people p ON p.id = pc.person_id
JOIN app_agencies_people ap ON ap.person_id = p.id
WHERE sa.canceled_by_email IS NOT NULL
  AND pc.email = sa.canceled_by_email
  AND ap.agency_id = sa.agency_id
  AND pc.is_deleted = false
  AND p.is_deleted = false
  AND ap.is_deleted = false
  AND sa.canceled_by = sa.calendar_owner_id;

-- Backfill updated_by using rescheduled_by_email for rescheduled appointments
UPDATE schedule_appointments sa
SET updated_by = pc.person_id
FROM people_contacts pc
JOIN people p ON p.id = pc.person_id
JOIN app_agencies_people ap ON ap.person_id = p.id
WHERE sa.rescheduled_by_email IS NOT NULL
  AND sa.appointment_status = 'rescheduled'
  AND pc.email = sa.rescheduled_by_email
  AND ap.agency_id = sa.agency_id
  AND pc.is_deleted = false
  AND p.is_deleted = false
  AND ap.is_deleted = false
  AND sa.updated_by = sa.calendar_owner_id;