-- Drop the existing function first
DROP FUNCTION IF EXISTS public.get_organizations_with_admins();

-- Create the new function with JSON aggregation
CREATE OR REPLACE FUNCTION public.get_organizations_with_admins()
 RETURNS TABLE(id uuid, organization_name text, organization_state text, status organization_status_enum, created_at timestamp with time zone, admins json, user_count bigint, storage_used text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.organization_name,
    o.organization_state,
    o.status,
    o.created_at,
    COALESCE(
      json_agg(
        CASE 
          WHEN p.id IS NOT NULL THEN
            json_build_object(
              'first_name', p.first_name,
              'last_name', p.last_name,
              'email', pc.email
            )
          ELSE NULL
        END
      ) FILTER (WHERE p.id IS NOT NULL), 
      '[]'::json
    ) as admins,
    COALESCE(user_counts.count, 0) as user_count,
    '0 MB'::TEXT as storage_used
  FROM public.app_organizations o
  LEFT JOIN public.app_organization_admins oa ON o.id = oa.organization_id AND oa.is_deleted = false
  LEFT JOIN public.people p ON oa.person_id = p.id AND p.is_deleted = false
  LEFT JOIN public.people_contacts pc ON p.id = pc.person_id AND pc.is_deleted = false
  LEFT JOIN (
    SELECT 
      op.organization_id,
      COUNT(*) as count
    FROM public.app_organization_people op
    WHERE op.is_deleted = false
    GROUP BY op.organization_id
  ) user_counts ON o.id = user_counts.organization_id
  WHERE o.is_deleted = false
  GROUP BY o.id, o.organization_name, o.organization_state, o.status, o.created_at, user_counts.count
  ORDER BY o.created_at DESC;
END;
$function$