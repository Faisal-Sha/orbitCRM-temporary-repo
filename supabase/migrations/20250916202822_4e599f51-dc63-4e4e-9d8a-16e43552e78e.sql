-- Add preferred_language column to people_leads table
ALTER TABLE public.people_leads 
ADD COLUMN preferred_language text;