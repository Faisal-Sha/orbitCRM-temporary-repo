-- Create RLS policies for app_organizations table to allow CRUD operations for authenticated users

-- Policy for SELECT operations (view organizations)
CREATE POLICY "Authenticated users can view organizations" 
ON public.app_organizations 
FOR SELECT 
TO authenticated
USING (is_deleted = false);

-- Policy for INSERT operations (create organizations)  
CREATE POLICY "Authenticated users can create organizations"
ON public.app_organizations
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy for UPDATE operations (edit and soft-delete organizations)
CREATE POLICY "Authenticated users can update organizations"
ON public.app_organizations  
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);