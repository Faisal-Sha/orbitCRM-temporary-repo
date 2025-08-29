-- Create SECURITY DEFINER function to handle organization soft deletion
-- This bypasses RLS policies entirely and ensures proper soft delete
CREATE OR REPLACE FUNCTION public.soft_delete_organization(
  org_id UUID,
  deleting_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Update organization with soft delete fields
  UPDATE public.app_organizations 
  SET 
    status = 'deleted'::organization_status_enum,
    is_deleted = true,
    deleted_by = deleting_user_id,
    deleted_at = now(),
    updated_by = deleting_user_id,
    updated_at = now()
  WHERE id = org_id AND is_deleted = false;

  -- Check if update was successful
  IF FOUND THEN
    SELECT json_build_object(
      'organization_id', org_id,
      'success', true,
      'message', 'Organization soft deleted successfully'
    ) INTO result;
  ELSE
    SELECT json_build_object(
      'organization_id', org_id,
      'success', false,
      'message', 'Organization not found or already deleted'
    ) INTO result;
  END IF;

  RETURN result;
END;
$$;