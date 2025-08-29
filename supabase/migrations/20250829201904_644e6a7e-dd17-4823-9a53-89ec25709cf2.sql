-- DEFINITIVE FIX for organization deletion RLS issue
-- Drop all existing policies completely
DROP POLICY IF EXISTS "Users can view active organizations" ON public.app_organizations;
DROP POLICY IF EXISTS "Users can create organizations" ON public.app_organizations;  
DROP POLICY IF EXISTS "Users can update organizations" ON public.app_organizations;

-- Create new comprehensive policies that handle soft delete properly

-- 1. SELECT: Only show active (non-deleted) organizations
CREATE POLICY "View active organizations only" 
ON public.app_organizations 
FOR SELECT 
TO authenticated
USING (is_deleted = false);

-- 2. INSERT: Allow creating new organizations
CREATE POLICY "Allow organization creation"
ON public.app_organizations
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. UPDATE: Allow updating organizations that are currently active, and allow any new values (including soft delete)
CREATE POLICY "Allow organization updates and soft deletes"
ON public.app_organizations  
FOR UPDATE
TO authenticated
USING (is_deleted = false)  -- Can only update currently active organizations
WITH CHECK (true);          -- But allow setting any new values (including is_deleted = true)