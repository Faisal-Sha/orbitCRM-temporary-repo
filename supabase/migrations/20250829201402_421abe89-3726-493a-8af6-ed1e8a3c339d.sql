-- Fix the UPDATE policy to include WITH CHECK clause for soft delete operations
DROP POLICY IF EXISTS "Users can update organizations" ON public.app_organizations;

CREATE POLICY "Users can update organizations"
ON public.app_organizations  
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);