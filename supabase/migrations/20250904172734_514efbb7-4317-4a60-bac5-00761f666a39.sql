-- Enable RLS for programs and goals tables
ALTER TABLE public.app_data_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_data_programs_goals ENABLE ROW LEVEL SECURITY;

-- RLS policies for app_data_programs
CREATE POLICY "Users can view programs in their organization"
ON public.app_data_programs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_organization_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  )
);

CREATE POLICY "Users can create programs in their organization"
ON public.app_data_programs FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_organization_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  )
);

CREATE POLICY "Users can update programs in their organization"
ON public.app_data_programs FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_organization_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  )
);

CREATE POLICY "Users can delete programs in their organization"
ON public.app_data_programs FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_organization_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  )
);

-- RLS policies for app_data_programs_goals
CREATE POLICY "Users can view goals in their organization"
ON public.app_data_programs_goals FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_organization_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  )
);

CREATE POLICY "Users can create goals in their organization"
ON public.app_data_programs_goals FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_organization_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  )
);

CREATE POLICY "Users can update goals in their organization"
ON public.app_data_programs_goals FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_organization_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  )
);

CREATE POLICY "Users can delete goals in their organization"
ON public.app_data_programs_goals FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_organization_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  )
);

-- Function to get programs with their goals
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
$function$;

-- Function to add a program with goals
CREATE OR REPLACE FUNCTION public.add_program_with_goals(
  p_program_name text,
  p_goals jsonb
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_program_id UUID;
  current_user_id UUID := auth.uid();
  goal_item jsonb;
  result JSON;
BEGIN
  -- Check if user has access
  IF NOT EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_organization_people op ON p.id = op.person_id
    WHERE au.user_id = current_user_id 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  ) THEN
    RETURN json_build_object('success', false, 'message', 'Access denied');
  END IF;

  -- Insert new program
  INSERT INTO public.app_data_programs (
    program_name,
    created_by,
    updated_by
  ) VALUES (
    p_program_name,
    current_user_id,
    current_user_id
  ) RETURNING id INTO new_program_id;

  -- Insert goals if provided
  IF p_goals IS NOT NULL THEN
    FOR goal_item IN SELECT * FROM jsonb_array_elements(p_goals)
    LOOP
      IF goal_item->>'name' IS NOT NULL AND trim(goal_item->>'name') != '' THEN
        INSERT INTO public.app_data_programs_goals (
          program_id,
          goal_name,
          created_by,
          updated_by
        ) VALUES (
          new_program_id,
          trim(goal_item->>'name'),
          current_user_id,
          current_user_id
        );
      END IF;
    END LOOP;
  END IF;

  RETURN json_build_object(
    'success', true,
    'message', 'Program created successfully',
    'program_id', new_program_id
  );
END;
$function$;

-- Function to update a program with goals
CREATE OR REPLACE FUNCTION public.update_program_with_goals(
  p_program_id uuid,
  p_program_name text,
  p_goals jsonb
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  goal_item jsonb;
  result JSON;
BEGIN
  -- Check if user has access
  IF NOT EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_organization_people op ON p.id = op.person_id
    WHERE au.user_id = current_user_id 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  ) THEN
    RETURN json_build_object('success', false, 'message', 'Access denied');
  END IF;

  -- Update program
  UPDATE public.app_data_programs 
  SET 
    program_name = p_program_name,
    updated_by = current_user_id,
    updated_at = now()
  WHERE id = p_program_id AND is_deleted = false;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Program not found');
  END IF;

  -- Delete existing goals
  DELETE FROM public.app_data_programs_goals 
  WHERE program_id = p_program_id;

  -- Insert new goals
  IF p_goals IS NOT NULL THEN
    FOR goal_item IN SELECT * FROM jsonb_array_elements(p_goals)
    LOOP
      IF goal_item->>'name' IS NOT NULL AND trim(goal_item->>'name') != '' THEN
        INSERT INTO public.app_data_programs_goals (
          program_id,
          goal_name,
          created_by,
          updated_by
        ) VALUES (
          p_program_id,
          trim(goal_item->>'name'),
          current_user_id,
          current_user_id
        );
      END IF;
    END LOOP;
  END IF;

  RETURN json_build_object(
    'success', true,
    'message', 'Program updated successfully'
  );
END;
$function$;

-- Function to delete a program and its goals
CREATE OR REPLACE FUNCTION public.delete_program_with_goals(p_program_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  result JSON;
BEGIN
  -- Check if user has access
  IF NOT EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_organization_people op ON p.id = op.person_id
    WHERE au.user_id = current_user_id 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  ) THEN
    RETURN json_build_object('success', false, 'message', 'Access denied');
  END IF;

  -- Soft delete goals
  UPDATE public.app_data_programs_goals 
  SET 
    is_deleted = true,
    deleted_by = current_user_id,
    deleted_at = now()
  WHERE program_id = p_program_id AND is_deleted = false;

  -- Soft delete program
  UPDATE public.app_data_programs 
  SET 
    is_deleted = true,
    deleted_by = current_user_id,
    deleted_at = now()
  WHERE id = p_program_id AND is_deleted = false;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Program not found');
  END IF;

  RETURN json_build_object(
    'success', true,
    'message', 'Program deleted successfully'
  );
END;
$function$;