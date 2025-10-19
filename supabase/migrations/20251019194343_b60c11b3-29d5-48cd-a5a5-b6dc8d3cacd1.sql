-- Backfill rescheduled_by_email from schedule_appointment_trigger_log
-- This updates appointments that were rescheduled but don't have rescheduled_by_email populated

UPDATE schedule_appointments sa
SET rescheduled_by_email = (slt.raw_event_payload->'payload'->>'rescheduledBy')
FROM schedule_appointment_trigger_log slt
WHERE sa.id = slt.appointment_id
  AND slt.trigger_event = 'BOOKING_RESCHEDULED'
  AND sa.rescheduled_by_email IS NULL
  AND (slt.raw_event_payload->'payload'->>'rescheduledBy') IS NOT NULL;