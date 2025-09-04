-- Update get_user_roles_with_counts to include role label data
CREATE OR REPLACE FUNCTION public.get_user_roles_with_counts()
RETURNS TABLE(
  id uuid, 
  role_name text, 
  user_count bigint, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone,
  role_label_id uuid,
  label_name text,
  label_color text,
  text_color text,
  font_weight text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
    ur.updated_at,
    ur.role_label_id,
    dl.label_name,
    dl.label_color,
    dl.text_color,
    dl.font_weight
  FROM public.app_user_roles ur
  LEFT JOIN (
    SELECT 
      op.user_role_id,
      COUNT(*) as count
    FROM public.app_organization_people op
    WHERE op.is_deleted = false
    GROUP BY op.user_role_id
  ) role_counts ON ur.id = role_counts.user_role_id
  LEFT JOIN public.app_data_labels dl ON ur.role_label_id = dl.id
  WHERE ur.is_deleted = false
  ORDER BY ur.created_at DESC;
END;
$function$;

-- Update add_user_role to accept role_label_id
CREATE OR REPLACE FUNCTION public.add_user_role(p_role_name text, p_role_label_id uuid DEFAULT NULL)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
  INSERT INTO public.app_user_roles (role_name, role_label_id, created_by, updated_by)
  VALUES (p_role_name::user_roles_enum, p_role_label_id, current_user_id, current_user_id)
  RETURNING id INTO new_role_id;

  RETURN json_build_object(
    'success', true,
    'message', 'Role created successfully',
    'role_id', new_role_id
  );
END;
$function$;

-- Update update_user_role to accept role_label_id
CREATE OR REPLACE FUNCTION public.update_user_role(p_role_id uuid, p_role_name text, p_role_label_id uuid DEFAULT NULL)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
    role_label_id = p_role_label_id,
    updated_by = current_user_id,
    updated_at = now()
  WHERE id = p_role_id;

  RETURN json_build_object(
    'success', true,
    'message', 'Role updated successfully'
  );
END;
$function$;