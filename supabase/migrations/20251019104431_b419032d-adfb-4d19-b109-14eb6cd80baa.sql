-- Create function to log canceled outcomes
CREATE OR REPLACE FUNCTION public.log_canceled_outcome()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- When appointment_status changes to 'canceled', log it as an outcome
  IF NEW.appointment_status = 'canceled' 
     AND (OLD.appointment_status IS DISTINCT FROM 'canceled') THEN
    -- Avoid duplicates: only insert if no existing 'Canceled' log exists
    IF NOT EXISTS (
      SELECT 1 FROM schedule_appointment_outcomes_log
      WHERE appointment_id = NEW.id AND outcome = 'Canceled'
    ) THEN
      INSERT INTO schedule_appointment_outcomes_log (appointment_id, person_id, outcome)
      VALUES (NEW.id, COALESCE(NEW.canceled_by, NEW.calendar_owner_id), 'Canceled');
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

-- Create trigger on schedule_appointments table
DROP TRIGGER IF EXISTS trg_log_canceled_outcome ON public.schedule_appointments;
CREATE TRIGGER trg_log_canceled_outcome
AFTER UPDATE ON public.schedule_appointments
FOR EACH ROW
EXECUTE FUNCTION public.log_canceled_outcome();

-- Backfill existing canceled appointments that lack a log
INSERT INTO schedule_appointment_outcomes_log (appointment_id, person_id, outcome)
SELECT s.id, COALESCE(s.canceled_by, s.calendar_owner_id), 'Canceled'
FROM schedule_appointments s
WHERE s.appointment_status = 'canceled'
  AND NOT EXISTS (
    SELECT 1 FROM schedule_appointment_outcomes_log l
    WHERE l.appointment_id = s.id AND l.outcome = 'Canceled'
  );