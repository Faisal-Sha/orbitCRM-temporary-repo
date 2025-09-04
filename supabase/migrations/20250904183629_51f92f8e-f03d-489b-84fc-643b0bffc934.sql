-- Fix the get_programs_with_goals function to properly handle GROUP BY
CREATE OR REPLACE FUNCTION public.get_programs_with_goals()
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  programs_data JSON;
BEGIN
  -- Check if user has access
  IF NOT EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_organization_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  ) THEN
    RETURN json_build_object('success', false, 'message', 'Access denied');
  END IF;

  SELECT json_agg(
    json_build_object(
      'id', p.id,
      'name', p.program_name,
      'goals', COALESCE(goals_array.goals, '[]'::json)
    )
  ) INTO programs_data
  FROM public.app_data_programs p
  LEFT JOIN (
    SELECT 
      pg.program_id,
      json_agg(pg.goal_name ORDER BY pg.created_at) as goals
    FROM public.app_data_programs_goals pg
    WHERE pg.is_deleted = false
    GROUP BY pg.program_id
  ) goals_array ON p.id = goals_array.program_id
  WHERE p.is_deleted = false
  ORDER BY p.created_at DESC;

  RETURN COALESCE(programs_data, '[]'::json);
END;
$function$