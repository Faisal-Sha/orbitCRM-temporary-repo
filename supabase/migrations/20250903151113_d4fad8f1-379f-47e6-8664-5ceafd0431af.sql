-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view user roles" ON public.app_user_roles;
DROP POLICY IF EXISTS "Authenticated users can insert user roles" ON public.app_user_roles;
DROP POLICY IF EXISTS "Authenticated users can update user roles" ON public.app_user_roles;

-- Create security definer function to check if user has admin/owner role
CREATE OR REPLACE FUNCTION public.current_user_has_admin_role()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  user_role_name TEXT;
BEGIN
  -- Get the current user's role through the chain of relationships
  SELECT ur.role_name INTO user_role_name
  FROM public.app_user_roles ur
  JOIN public.app_organization_people op ON ur.id = op.user_role_id
  JOIN public.people p ON op.person_id = p.id
  JOIN public.app_users au ON p.user_account_id = au.id
  WHERE au.user_id = auth.uid() 
    AND p.is_deleted = false 
    AND op.is_deleted = false
    AND ur.is_deleted = false
  LIMIT 1;

  -- Return true if user has admin or owner role
  RETURN COALESCE(user_role_name IN ('admin', 'owner'), false);
END;
$$;

-- Create new RLS policies for admin/owner only access
CREATE POLICY "Admin/Owner users can view user roles" 
ON public.app_user_roles 
FOR SELECT 
TO authenticated
USING (public.current_user_has_admin_role());

CREATE POLICY "Admin/Owner users can insert user roles" 
ON public.app_user_roles 
FOR INSERT 
TO authenticated
WITH CHECK (public.current_user_has_admin_role());

CREATE POLICY "Admin/Owner users can update user roles" 
ON public.app_user_roles 
FOR UPDATE 
TO authenticated
USING (public.current_user_has_admin_role())
WITH CHECK (public.current_user_has_admin_role());

-- Create function to get user roles with user counts for admin/owner users
CREATE OR REPLACE FUNCTION public.get_user_roles_with_counts()
RETURNS TABLE(
  id UUID,
  role_name TEXT,
  user_count BIGINT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if current user has admin role
  IF NOT public.current_user_has_admin_role() THEN
    RAISE EXCEPTION 'Access denied. Admin or owner role required.';
  END IF;

  RETURN QUERY
  SELECT 
    ur.id,
    ur.role_name::TEXT,
    COALESCE(role_counts.count, 0) as user_count,
    ur.created_at,
    ur.updated_at
  FROM public.app_user_roles ur
  LEFT JOIN (
    SELECT 
      op.user_role_id,
      COUNT(*) as count
    FROM public.app_organization_people op
    WHERE op.is_deleted = false
    GROUP BY op.user_role_id
  ) role_counts ON ur.id = role_counts.user_role_id
  WHERE ur.is_deleted = false
  ORDER BY ur.created_at DESC;
END;
$$;

-- Create function to add new user role
CREATE OR REPLACE FUNCTION public.add_user_role(p_role_name TEXT)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_role_id UUID;
  current_user_id UUID := auth.uid();
  result JSON;
BEGIN
  -- Check if current user has admin role
  IF NOT public.current_user_has_admin_role() THEN
    RETURN json_build_object('success', false, 'message', 'Access denied. Admin or owner role required.');
  END IF;

  -- Check if role name already exists
  IF EXISTS (SELECT 1 FROM public.app_user_roles WHERE role_name = p_role_name::user_roles_enum AND is_deleted = false) THEN
    RETURN json_build_object('success', false, 'message', 'Role name already exists.');
  END IF;

  -- Insert new role
  INSERT INTO public.app_user_roles (role_name, created_by, updated_by)
  VALUES (p_role_name::user_roles_enum, current_user_id, current_user_id)
  RETURNING id INTO new_role_id;

  RETURN json_build_object(
    'success', true,
    'message', 'Role created successfully',
    'role_id', new_role_id
  );
END;
$$;

-- Create function to update user role
CREATE OR REPLACE FUNCTION public.update_user_role(p_role_id UUID, p_role_name TEXT)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID := auth.uid();
  result JSON;
BEGIN
  -- Check if current user has admin role
  IF NOT public.current_user_has_admin_role() THEN
    RETURN json_build_object('success', false, 'message', 'Access denied. Admin or owner role required.');
  END IF;

  -- Check if role exists
  IF NOT EXISTS (SELECT 1 FROM public.app_user_roles WHERE id = p_role_id AND is_deleted = false) THEN
    RETURN json_build_object('success', false, 'message', 'Role not found.');
  END IF;

  -- Check if new role name already exists (excluding current role)
  IF EXISTS (SELECT 1 FROM public.app_user_roles WHERE role_name = p_role_name::user_roles_enum AND id != p_role_id AND is_deleted = false) THEN
    RETURN json_build_object('success', false, 'message', 'Role name already exists.');
  END IF;

  -- Update role
  UPDATE public.app_user_roles 
  SET 
    role_name = p_role_name::user_roles_enum,
    updated_by = current_user_id,
    updated_at = now()
  WHERE id = p_role_id;

  RETURN json_build_object(
    'success', true,
    'message', 'Role updated successfully'
  );
END;
$$;

-- Create function to delete user role (soft delete)
CREATE OR REPLACE FUNCTION public.delete_user_role(p_role_id UUID)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID := auth.uid();
  role_in_use BOOLEAN;
  result JSON;
BEGIN
  -- Check if current user has admin role
  IF NOT public.current_user_has_admin_role() THEN
    RETURN json_build_object('success', false, 'message', 'Access denied. Admin or owner role required.');
  END IF;

  -- Check if role exists
  IF NOT EXISTS (SELECT 1 FROM public.app_user_roles WHERE id = p_role_id AND is_deleted = false) THEN
    RETURN json_build_object('success', false, 'message', 'Role not found.');
  END IF;

  -- Check if role is in use
  SELECT EXISTS (
    SELECT 1 FROM public.app_organization_people 
    WHERE user_role_id = p_role_id AND is_deleted = false
  ) INTO role_in_use;

  IF role_in_use THEN
    RETURN json_build_object('success', false, 'message', 'Cannot delete role that is assigned to users.');
  END IF;

  -- Soft delete role
  UPDATE public.app_user_roles 
  SET 
    is_deleted = true,
    deleted_by = current_user_id,
    deleted_at = now()
  WHERE id = p_role_id;

  RETURN json_build_object(
    'success', true,
    'message', 'Role deleted successfully'
  );
END;
$$;