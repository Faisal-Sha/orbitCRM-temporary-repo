-- Drop the incorrectly created enum
DROP TYPE IF EXISTS public.emergency_contact_relationship_enum;

-- Update the function to use the correct enum type
CREATE OR REPLACE FUNCTION public.update_people_emergency_field(
  p_person_id UUID,
  p_field_name TEXT,
  p_field_value TEXT
)
RETURNS VOID AS $$
BEGIN
  IF p_field_name = 'relationship' THEN
    UPDATE public.people_emergency 
    SET relationship = p_field_value::emergency_relationship_enum,
        updated_at = now()
    WHERE person_id = p_person_id;
  ELSIF p_field_name = 'first_name' THEN
    UPDATE public.people_emergency 
    SET first_name = p_field_value,
        updated_at = now()
    WHERE person_id = p_person_id;
  ELSIF p_field_name = 'last_name' THEN
    UPDATE public.people_emergency 
    SET last_name = p_field_value,
        updated_at = now()
    WHERE person_id = p_person_id;
  ELSIF p_field_name = 'phone_number' THEN
    UPDATE public.people_emergency 
    SET phone_number = p_field_value,
        updated_at = now()
    WHERE person_id = p_person_id;
  ELSIF p_field_name = 'email' THEN
    UPDATE public.people_emergency 
    SET email = p_field_value,
        updated_at = now()
    WHERE person_id = p_person_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;