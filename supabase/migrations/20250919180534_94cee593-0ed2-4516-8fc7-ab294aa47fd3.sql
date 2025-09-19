-- 1) Add staff_type_id column to people, with FK to app_user_staff_types
ALTER TABLE public.people
  ADD COLUMN IF NOT EXISTS staff_type_id uuid;

-- Add the foreign key constraint if it doesn't exist yet
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM   pg_constraint
    WHERE  conname = 'people_staff_type_id_fkey'
    AND    conrelid = 'public.people'::regclass
  ) THEN
    ALTER TABLE public.people
      ADD CONSTRAINT people_staff_type_id_fkey
      FOREIGN KEY (staff_type_id)
      REFERENCES public.app_user_staff_types(id);
  END IF;
END $$;

-- Helpful index
CREATE INDEX IF NOT EXISTS idx_people_staff_type_id ON public.people(staff_type_id);

-- 2) Update function to only update people and app_agencies_people
CREATE OR REPLACE FUNCTION public.update_people_staff_type(p_person_id uuid, p_staff_type text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  v_staff_type_id UUID;
  result JSON;
BEGIN
  -- Find staff type ID
  SELECT id INTO v_staff_type_id
  FROM public.app_user_staff_types
  WHERE staff_type::text = p_staff_type
    AND is_deleted = false
  LIMIT 1;

  IF v_staff_type_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Staff type not found');
  END IF;

  -- Update people table only (do not touch people_assign_staff_type here)
  UPDATE public.people
  SET staff_type_id = v_staff_type_id,
      updated_by = current_user_id,
      updated_at = now()
  WHERE id = p_person_id
    AND is_deleted = false;

  -- Update app_agencies_people table's user_staff_type_id
  UPDATE public.app_agencies_people
  SET user_staff_type_id = v_staff_type_id,
      updated_by = current_user_id,
      updated_at = now()
  WHERE person_id = p_person_id
    AND is_deleted = false;

  SELECT json_build_object(
    'success', true,
    'message', 'Staff type updated successfully'
  ) INTO result;

  RETURN result;
END;
$function$;