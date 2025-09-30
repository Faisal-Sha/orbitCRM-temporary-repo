-- Add reschedule_id column to schedule_appointments if it doesn't exist
ALTER TABLE public.schedule_appointments 
ADD COLUMN IF NOT EXISTS reschedule_id TEXT;

-- First, update existing NULL triggered_by_user_id records with a default value
-- We'll use the first admin user or system user as fallback
UPDATE public.schedule_appointment_trigger_log 
SET triggered_by_user_id = (
  SELECT p.id FROM public.people p 
  JOIN public.app_users au ON p.user_account_id = au.id 
  JOIN public.app_user_roles aur ON p.user_role_id = aur.id 
  WHERE aur.role_name = 'admin' AND p.is_deleted = false 
  LIMIT 1
)
WHERE triggered_by_user_id IS NULL;

-- If no admin found, use the first available person
UPDATE public.schedule_appointment_trigger_log 
SET triggered_by_user_id = (
  SELECT p.id FROM public.people p 
  WHERE p.is_deleted = false 
  LIMIT 1
)
WHERE triggered_by_user_id IS NULL;

-- Now make the column NOT NULL
ALTER TABLE public.schedule_appointment_trigger_log 
ALTER COLUMN triggered_by_user_id SET NOT NULL;