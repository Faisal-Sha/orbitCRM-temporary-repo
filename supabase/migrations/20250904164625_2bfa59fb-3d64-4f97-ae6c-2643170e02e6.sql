-- Enable RLS on app_data_labels table
ALTER TABLE public.app_data_labels ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for app_data_labels
CREATE POLICY "Users can view labels in their organization" 
ON public.app_data_labels 
FOR SELECT 
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

CREATE POLICY "Users can create labels in their organization" 
ON public.app_data_labels 
FOR INSERT 
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

CREATE POLICY "Users can update labels in their organization" 
ON public.app_data_labels 
FOR UPDATE 
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

CREATE POLICY "Users can delete labels in their organization" 
ON public.app_data_labels 
FOR DELETE 
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

-- Function to get all labels for the user's organization
CREATE OR REPLACE FUNCTION public.get_data_labels()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  labels_data JSON;
BEGIN
  SELECT json_agg(
    json_build_object(
      'id', dl.id,
      'name', dl.label_name,
      'category', dl.label_category,
      'color', dl.label_color,
      'textColor', dl.text_color,
      'fontWeight', dl.font_weight
    )
  ) INTO labels_data
  FROM public.app_data_labels dl
  WHERE EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_organization_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
  );

  RETURN COALESCE(labels_data, '[]'::json);
END;
$function$;

-- Function to add a new label
CREATE OR REPLACE FUNCTION public.add_data_label(
  p_label_name text,
  p_label_category text,
  p_label_color text,
  p_text_color text,
  p_font_weight text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_label_id UUID;
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

  -- Insert new label
  INSERT INTO public.app_data_labels (
    label_name,
    label_category,
    label_color,
    text_color,
    font_weight,
    created_by,
    updated_by
  ) VALUES (
    p_label_name,
    p_label_category,
    p_label_color,
    p_text_color,
    p_font_weight,
    current_user_id,
    current_user_id
  ) RETURNING id INTO new_label_id;

  RETURN json_build_object(
    'success', true,
    'message', 'Label created successfully',
    'label_id', new_label_id
  );
END;
$function$;

-- Function to update an existing label
CREATE OR REPLACE FUNCTION public.update_data_label(
  p_label_id uuid,
  p_label_name text,
  p_label_category text,
  p_label_color text,
  p_text_color text,
  p_font_weight text
)
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

  -- Update label
  UPDATE public.app_data_labels 
  SET 
    label_name = p_label_name,
    label_category = p_label_category,
    label_color = p_label_color,
    text_color = p_text_color,
    font_weight = p_font_weight,
    updated_by = current_user_id,
    updated_at = now()
  WHERE id = p_label_id;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Label not found');
  END IF;

  RETURN json_build_object(
    'success', true,
    'message', 'Label updated successfully'
  );
END;
$function$;

-- Function to delete a label
CREATE OR REPLACE FUNCTION public.delete_data_label(p_label_id uuid)
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

  -- Delete label
  DELETE FROM public.app_data_labels 
  WHERE id = p_label_id;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Label not found');
  END IF;

  RETURN json_build_object(
    'success', true,
    'message', 'Label deleted successfully'
  );
END;
$function$;