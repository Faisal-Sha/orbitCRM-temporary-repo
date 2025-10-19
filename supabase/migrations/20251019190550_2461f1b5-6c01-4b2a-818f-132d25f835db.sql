-- Add columns to track who rescheduled/canceled appointments
ALTER TABLE public.schedule_appointments 
ADD COLUMN rescheduled_by_email TEXT,
ADD COLUMN canceled_by_email TEXT;

-- Backfill existing data from booking_details JSONB
UPDATE public.schedule_appointments
SET canceled_by_email = booking_details->>'cancelledBy'
WHERE booking_details->>'cancelledBy' IS NOT NULL;

UPDATE public.schedule_appointments
SET rescheduled_by_email = booking_details->>'rescheduledBy'
WHERE booking_details->>'rescheduledBy' IS NOT NULL;