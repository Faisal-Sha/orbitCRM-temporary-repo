-- Create schedule_appointments table
CREATE TABLE public.schedule_appointments (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    agency_id uuid NOT NULL REFERENCES public.app_agencies(id),
    calendar_owner_id uuid NOT NULL REFERENCES public.people(id),
    cal_booking_id text,
    appointment_status varchar(50) NOT NULL DEFAULT 'active',
    start_time timestamptz NOT NULL,
    end_time timestamptz NOT NULL,
    booking_details jsonb NOT NULL,
    reschedule_id text,
    cancellation_reason text,
    rejection_reason text,
    appointment_type text,
    location text NOT NULL,
    location_details text,
    created_by uuid NOT NULL REFERENCES public.people(id),
    updated_by uuid NOT NULL REFERENCES public.people(id),
    canceled_by uuid REFERENCES public.people(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    canceled_at timestamptz
);

-- Create schedule_appointment_attendees table
CREATE TABLE public.schedule_appointment_attendees (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    appointment_id uuid NOT NULL REFERENCES public.schedule_appointments(id),
    attendee_id uuid NOT NULL REFERENCES public.people(id),
    created_by uuid NOT NULL REFERENCES public.people(id),
    updated_by uuid NOT NULL REFERENCES public.people(id),
    removed_by uuid REFERENCES public.people(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    removed_at timestamptz,
    UNIQUE(appointment_id, attendee_id)
);

-- Create schedule_appointment_trigger_log table
CREATE TABLE public.schedule_appointment_trigger_log (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    appointment_id uuid NOT NULL REFERENCES public.schedule_appointments(id),
    triggered_by_user_id uuid REFERENCES public.people(id),
    trigger_event varchar(100) NOT NULL,
    event_source varchar(100) NOT NULL,
    raw_event_payload jsonb NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.schedule_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_appointment_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_appointment_trigger_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for schedule_appointments
CREATE POLICY "Users can view appointments in their agency" 
    ON public.schedule_appointments 
    FOR SELECT 
    USING (user_can_access_agency(agency_id));

CREATE POLICY "Users can create appointments in their agency" 
    ON public.schedule_appointments 
    FOR INSERT 
    WITH CHECK (user_can_access_agency(agency_id));

CREATE POLICY "Users can update appointments in their agency" 
    ON public.schedule_appointments 
    FOR UPDATE 
    USING (user_can_access_agency(agency_id));

-- RLS Policies for schedule_appointment_attendees
CREATE POLICY "Users can view attendees in their agency" 
    ON public.schedule_appointment_attendees 
    FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.schedule_appointments sa 
        WHERE sa.id = appointment_id 
        AND user_can_access_agency(sa.agency_id)
    ));

CREATE POLICY "Users can create attendees in their agency" 
    ON public.schedule_appointment_attendees 
    FOR INSERT 
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.schedule_appointments sa 
        WHERE sa.id = appointment_id 
        AND user_can_access_agency(sa.agency_id)
    ));

CREATE POLICY "Users can update attendees in their agency" 
    ON public.schedule_appointment_attendees 
    FOR UPDATE 
    USING (EXISTS (
        SELECT 1 FROM public.schedule_appointments sa 
        WHERE sa.id = appointment_id 
        AND user_can_access_agency(sa.agency_id)
    ));

-- RLS Policies for schedule_appointment_trigger_log
CREATE POLICY "Users can view trigger logs in their agency" 
    ON public.schedule_appointment_trigger_log 
    FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.schedule_appointments sa 
        WHERE sa.id = appointment_id 
        AND user_can_access_agency(sa.agency_id)
    ));

CREATE POLICY "Users can create trigger logs in their agency" 
    ON public.schedule_appointment_trigger_log 
    FOR INSERT 
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.schedule_appointments sa 
        WHERE sa.id = appointment_id 
        AND user_can_access_agency(sa.agency_id)
    ));

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_schedule_appointments_updated_at
    BEFORE UPDATE ON public.schedule_appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schedule_appointment_attendees_updated_at
    BEFORE UPDATE ON public.schedule_appointment_attendees
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();