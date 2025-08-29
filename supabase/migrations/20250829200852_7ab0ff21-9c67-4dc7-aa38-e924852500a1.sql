-- Drop existing policies and create proper ones for soft delete functionality

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view organizations" ON public.app_organizations;
DROP POLICY IF EXISTS "Authenticated users can create organizations" ON public.app_organizations;  
DROP POLICY IF EXISTS "Authenticated users can update organizations" ON public.app_organizations;

-- Create new policies that properly handle soft deletes

-- Allow viewing non-deleted organizations
CREATE POLICY "Users can view active organizations" 
ON public.app_organizations 
FOR SELECT 
TO authenticated
USING (is_deleted = false);

-- Allow creating organizations
CREATE POLICY "Users can create organizations"
ON public.app_organizations
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow updating organizations (including soft delete operations)
CREATE POLICY "Users can update organizations"
ON public.app_organizations  
FOR UPDATE
TO authenticated
USING (true);