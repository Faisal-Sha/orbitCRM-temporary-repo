-- Update database schema to reflect the renamed table and new column structure
-- This ensures the TypeScript types are regenerated correctly

-- Ensure app_users table exists with the correct structure including account_email
CREATE TABLE IF NOT EXISTS public.app_users (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  account_email text NOT NULL,
  first_name text,
  last_name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  is_owner boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active',
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  deleted_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies for app_users
DROP POLICY IF EXISTS "Users can view their own profile" ON public.app_users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.app_users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.app_users;

CREATE POLICY "Users can view their own profile" 
  ON public.app_users 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.app_users 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.app_users 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Update the trigger function to insert into app_users with account_email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.app_users (user_id, account_email, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name', 
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$;