-- Create schedule_appointment_notes table
CREATE TABLE IF NOT EXISTS public.schedule_appointment_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.schedule_appointments(id),
  person_id UUID NOT NULL REFERENCES public.people(id),
  appointment_note TEXT,
  call_log_1 TEXT,
  call_log_2 TEXT,
  call_log_3 TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on schedule_appointment_notes
ALTER TABLE public.schedule_appointment_notes ENABLE ROW LEVEL SECURITY;

-- RLS policies for schedule_appointment_notes
CREATE POLICY "notes_select_same_agency"
ON public.schedule_appointment_notes
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.schedule_appointments sa
    WHERE sa.id = schedule_appointment_notes.appointment_id
      AND user_can_access_agency(sa.agency_id)
  )
);

CREATE POLICY "notes_insert_same_agency"
ON public.schedule_appointment_notes
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.schedule_appointments sa
    WHERE sa.id = schedule_appointment_notes.appointment_id
      AND user_can_access_agency(sa.agency_id)
  )
);

CREATE POLICY "notes_update_same_agency"
ON public.schedule_appointment_notes
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.schedule_appointments sa
    WHERE sa.id = schedule_appointment_notes.appointment_id
      AND user_can_access_agency(sa.agency_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.schedule_appointments sa
    WHERE sa.id = schedule_appointment_notes.appointment_id
      AND user_can_access_agency(sa.agency_id)
  )
);

-- Indexes for schedule_appointment_notes
CREATE INDEX IF NOT EXISTS idx_schedule_appointment_notes_appointment_id
  ON public.schedule_appointment_notes (appointment_id);
CREATE INDEX IF NOT EXISTS idx_schedule_appointment_notes_person_id
  ON public.schedule_appointment_notes (person_id);

-- Trigger for updated_at
CREATE TRIGGER set_updated_at_schedule_appointment_notes
BEFORE UPDATE ON public.schedule_appointment_notes
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create schedule_appointment_outcomes_log table
CREATE TABLE IF NOT EXISTS public.schedule_appointment_outcomes_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.schedule_appointments(id),
  person_id UUID NOT NULL REFERENCES public.people(id),
  outcome TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on schedule_appointment_outcomes_log
ALTER TABLE public.schedule_appointment_outcomes_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for schedule_appointment_outcomes_log
CREATE POLICY "outcomes_select_same_agency"
ON public.schedule_appointment_outcomes_log
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.schedule_appointments sa
    WHERE sa.id = schedule_appointment_outcomes_log.appointment_id
      AND user_can_access_agency(sa.agency_id)
  )
);

CREATE POLICY "outcomes_insert_same_agency"
ON public.schedule_appointment_outcomes_log
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.schedule_appointments sa
    WHERE sa.id = schedule_appointment_outcomes_log.appointment_id
      AND user_can_access_agency(sa.agency_id)
  )
);

-- Indexes for schedule_appointment_outcomes_log
CREATE INDEX IF NOT EXISTS idx_schedule_appointment_outcomes_log_appointment_id
  ON public.schedule_appointment_outcomes_log (appointment_id);
CREATE INDEX IF NOT EXISTS idx_schedule_appointment_outcomes_log_created_at
  ON public.schedule_appointment_outcomes_log (created_at);