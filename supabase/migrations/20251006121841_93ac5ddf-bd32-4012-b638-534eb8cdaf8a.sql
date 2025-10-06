-- Add calendar_url column to cal_calendar_users table
ALTER TABLE public.cal_calendar_users
ADD COLUMN calendar_url TEXT;