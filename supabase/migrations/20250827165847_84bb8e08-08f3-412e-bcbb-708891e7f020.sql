
-- Update the database schema to ensure global_users table exists with correct structure
-- This will regenerate the TypeScript types to match the current database

-- First, let's ensure the global_users table has the correct structure
-- (This should already exist based on your description, but we're confirming the schema)

-- If for some reason the table doesn't exist or needs to be recreated:
-- DROP TABLE IF EXISTS public.global_users CASCADE;

CREATE TABLE IF NOT EXISTS public.global_users (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  deleted_by_user_id uuid,
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  is_owner boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active',
  created_by_user_id uuid,
  updated_by_user_id uuid,
  first_name text,
  last_name text,
  profile_image_url text
);

-- Ensure RLS is enabled
ALTER TABLE public.global_users ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies for global_users (in case they were lost)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.global_users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.global_users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.global_users;

CREATE POLICY "Users can view their own profile" 
  ON public.global_users 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.global_users 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.global_users 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Ensure the trigger function exists and references global_users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.global_users (user_id, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'first_name', 
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
