-- Create the cal_calendar_users table
CREATE TABLE public.cal_calendar_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_owner_id TEXT,
  appointment_type TEXT,
  created_by UUID NOT NULL REFERENCES public.app_users(id),
  updated_by UUID NOT NULL REFERENCES public.app_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cal_calendar_users ENABLE ROW LEVEL SECURITY;

-- Create open policies for authenticated users
CREATE POLICY "Authenticated users can view calendar users"
ON public.cal_calendar_users
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create calendar users"
ON public.cal_calendar_users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update calendar users"
ON public.cal_calendar_users
FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL);