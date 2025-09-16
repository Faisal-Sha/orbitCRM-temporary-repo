-- Add user_role_id column to people table
-- First, add the column as nullable
ALTER TABLE public.people ADD COLUMN user_role_id uuid;

-- Get the 'general' role ID and update all existing people records
UPDATE public.people 
SET user_role_id = (
  SELECT id FROM public.app_user_roles 
  WHERE role_name = 'general'::user_roles_enum 
  LIMIT 1
)
WHERE user_role_id IS NULL;

-- Now make the column NOT NULL and add foreign key constraint
ALTER TABLE public.people 
  ALTER COLUMN user_role_id SET NOT NULL,
  ADD CONSTRAINT people_user_role_id_fkey FOREIGN KEY (user_role_id) REFERENCES public.app_user_roles(id);

-- Remove user_role_id column from people_leads table
-- First drop the foreign key constraint
ALTER TABLE public.people_leads DROP CONSTRAINT people_leads_user_role_id_fkey;

-- Then drop the column
ALTER TABLE public.people_leads DROP COLUMN user_role_id;