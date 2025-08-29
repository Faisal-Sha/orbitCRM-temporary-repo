-- Fix the get_organizations_with_admins function to properly return organization_state
DROP FUNCTION IF EXISTS public.get_organizations_with_admins();

CREATE OR REPLACE FUNCTION public.get_organizations_with_admins()
 RETURNS TABLE(
   id uuid, 
   organization_name text, 
   organization_state text, 
   status organization_status_enum, 
   created_at timestamp with time zone, 
   admin_first_name text, 
   admin_last_name text, 
   admin_email text, 
   user_count bigint, 
   storage_used text
 )
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
    p.first_name as admin_first_name,
    p.last_name as admin_last_name,
    pc.email as admin_email,
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
  ORDER BY o.created_at DESC;
END;
$function$;