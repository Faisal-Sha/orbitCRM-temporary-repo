-- Step 1: Drop existing foreign key constraints first
ALTER TABLE public.cal_calendar_users
DROP CONSTRAINT IF EXISTS cal_calendar_users_created_by_fkey;

ALTER TABLE public.cal_calendar_users
DROP CONSTRAINT IF EXISTS cal_calendar_users_updated_by_fkey;

-- Step 2: Update existing records to use auth.users.id instead of app_users.id
UPDATE public.cal_calendar_users ccu
SET created_by = au.user_id
FROM public.app_users au
WHERE ccu.created_by = au.id;

UPDATE public.cal_calendar_users ccu
SET updated_by = au.user_id
FROM public.app_users au
WHERE ccu.updated_by = au.id;

-- Step 3: Add new foreign key constraints pointing to auth.users
ALTER TABLE public.cal_calendar_users
ADD CONSTRAINT cal_calendar_users_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES auth.users(id);

ALTER TABLE public.cal_calendar_users
ADD CONSTRAINT cal_calendar_users_updated_by_fkey 
FOREIGN KEY (updated_by) REFERENCES auth.users(id);