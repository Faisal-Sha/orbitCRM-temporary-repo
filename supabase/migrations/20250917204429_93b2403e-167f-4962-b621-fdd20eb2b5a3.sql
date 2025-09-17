-- Add missing RLS policies for people tables
CREATE POLICY "Users can view identifiers in their organization" 
ON public.people_identifiers 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
      AND p.id = people_identifiers.person_id
  )
);

CREATE POLICY "Users can create identifiers in their organization" 
ON public.people_identifiers 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
      AND p.id = people_identifiers.person_id
  )
);

CREATE POLICY "Users can update identifiers in their organization" 
ON public.people_identifiers 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
      AND p.id = people_identifiers.person_id
  )
);

-- RLS Policies for people_contacts
CREATE POLICY "Users can view contacts in their organization" 
ON public.people_contacts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
      AND p.id = people_contacts.person_id
  )
);

CREATE POLICY "Users can create contacts in their organization" 
ON public.people_contacts 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
      AND p.id = people_contacts.person_id
  )
);

CREATE POLICY "Users can update contacts in their organization" 
ON public.people_contacts 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
      AND p.id = people_contacts.person_id
  )
);

-- RLS Policies for people_emergency
CREATE POLICY "Users can view emergency contacts in their organization" 
ON public.people_emergency 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
      AND p.id = people_emergency.person_id
  )
);

CREATE POLICY "Users can create emergency contacts in their organization" 
ON public.people_emergency 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
      AND p.id = people_emergency.person_id
  )
);

CREATE POLICY "Users can update emergency contacts in their organization" 
ON public.people_emergency 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.people p
    JOIN public.app_users au ON p.user_account_id = au.id
    JOIN public.app_agencies_people op ON p.id = op.person_id
    WHERE au.user_id = auth.uid() 
      AND p.is_deleted = false 
      AND op.is_deleted = false
      AND p.id = people_emergency.person_id
  )
);

-- Functions for updating additional information fields
CREATE OR REPLACE FUNCTION public.update_people_identifiers_field(
  p_person_id uuid,
  p_field_name text,
  p_field_value text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_id UUID := auth.uid();
  identifier_record_id UUID;
  result JSON;
BEGIN
  -- Find existing identifiers record
  SELECT id INTO identifier_record_id
  FROM public.people_identifiers
  WHERE person_id = p_person_id AND is_deleted = false
  LIMIT 1;

  -- If no identifiers record exists, create one
  IF identifier_record_id IS NULL THEN
    INSERT INTO public.people_identifiers (
      person_id,
      created_by,
      updated_by
    ) VALUES (
      p_person_id,
      current_user_id,
      current_user_id
    ) RETURNING id INTO identifier_record_id;
  END IF;

  -- Update the specific field
  CASE p_field_name
    WHEN 'date_of_birth' THEN
      UPDATE public.people_identifiers SET date_of_birth = p_field_value::date, updated_by = current_user_id, updated_at = now() WHERE id = identifier_record_id;
    WHEN 'ssn_number' THEN
      UPDATE public.people_identifiers SET ssn_number = p_field_value, updated_by = current_user_id, updated_at = now() WHERE id = identifier_record_id;
    WHEN 'npi_number' THEN
      UPDATE public.people_identifiers SET npi_number = p_field_value, updated_by = current_user_id, updated_at = now() WHERE id = identifier_record_id;
    WHEN 'insurance_provider' THEN
      UPDATE public.people_identifiers SET insurance_provider = p_field_value, updated_by = current_user_id, updated_at = now() WHERE id = identifier_record_id;
    WHEN 'insurance_number' THEN
      UPDATE public.people_identifiers SET insurance_number = p_field_value, updated_by = current_user_id, updated_at = now() WHERE id = identifier_record_id;
    WHEN 'insurance_expiration_date' THEN
      UPDATE public.people_identifiers SET insurance_expiration_date = p_field_value::date, updated_by = current_user_id, updated_at = now() WHERE id = identifier_record_id;
    WHEN 'gender_identity' THEN
      UPDATE public.people_identifiers SET gender_identity = p_field_value, updated_by = current_user_id, updated_at = now() WHERE id = identifier_record_id;
    WHEN 'ethnicity_identity' THEN
      UPDATE public.people_identifiers SET ethnicity_identity = p_field_value, updated_by = current_user_id, updated_at = now() WHERE id = identifier_record_id;
    WHEN 'marital_status' THEN
      UPDATE public.people_identifiers SET marital_status = p_field_value, updated_by = current_user_id, updated_at = now() WHERE id = identifier_record_id;
    WHEN 'living_situation' THEN
      UPDATE public.people_identifiers SET living_situation = p_field_value, updated_by = current_user_id, updated_at = now() WHERE id = identifier_record_id;
    ELSE
      RETURN json_build_object('success', false, 'message', 'Invalid field name');
  END CASE;

  SELECT json_build_object(
    'success', true,
    'message', 'Identifier field updated successfully'
  ) INTO result;

  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_people_leads_field(
  p_person_id uuid,
  p_field_name text,
  p_field_value text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_id UUID := auth.uid();
  lead_record_id UUID;
  result JSON;
BEGIN
  -- Find existing leads record
  SELECT id INTO lead_record_id
  FROM public.people_leads
  WHERE person_id = p_person_id AND is_deleted = false
  LIMIT 1;

  -- If no leads record exists, create one
  IF lead_record_id IS NULL THEN
    INSERT INTO public.people_leads (
      person_id,
      agency_id,
      created_by,
      updated_by
    ) VALUES (
      p_person_id,
      (SELECT op.agency_id FROM public.app_agencies_people op WHERE op.person_id = p_person_id AND op.is_deleted = false LIMIT 1),
      current_user_id,
      current_user_id
    ) RETURNING id INTO lead_record_id;
  END IF;

  -- Update the specific field
  CASE p_field_name
    WHEN 'preferred_language' THEN
      UPDATE public.people_leads SET preferred_language = p_field_value, updated_by = current_user_id, updated_at = now() WHERE id = lead_record_id;
    ELSE
      RETURN json_build_object('success', false, 'message', 'Invalid field name');
  END CASE;

  SELECT json_build_object(
    'success', true,
    'message', 'Lead field updated successfully'
  ) INTO result;

  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_people_referrals_field(
  p_person_id uuid,
  p_field_name text,
  p_field_value text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_id UUID := auth.uid();
  referral_record_id UUID;
  result JSON;
BEGIN
  -- Find existing referrals record
  SELECT id INTO referral_record_id
  FROM public.people_referrals
  WHERE person_id = p_person_id AND is_deleted = false
  LIMIT 1;

  -- If no referrals record exists, create one
  IF referral_record_id IS NULL THEN
    INSERT INTO public.people_referrals (
      person_id,
      created_by,
      updated_by
    ) VALUES (
      p_person_id,
      current_user_id,
      current_user_id
    ) RETURNING id INTO referral_record_id;
  END IF;

  -- Update the specific field
  CASE p_field_name
    WHEN 'referred_by_name' THEN
      UPDATE public.people_referrals SET referred_by_name = p_field_value, updated_by = current_user_id, updated_at = now() WHERE id = referral_record_id;
    ELSE
      RETURN json_build_object('success', false, 'message', 'Invalid field name');
  END CASE;

  SELECT json_build_object(
    'success', true,
    'message', 'Referral field updated successfully'
  ) INTO result;

  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_people_additional_field(
  p_person_id uuid,
  p_field_name text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_id UUID := auth.uid();
  result JSON;
BEGIN
  -- Clear the specific field based on table
  IF p_field_name IN ('date_of_birth', 'ssn_number', 'npi_number', 'insurance_provider', 'insurance_number', 'insurance_expiration_date', 'gender_identity', 'ethnicity_identity', 'marital_status', 'living_situation') THEN
    CASE p_field_name
      WHEN 'date_of_birth' THEN
        UPDATE public.people_identifiers SET date_of_birth = NULL, updated_by = current_user_id, updated_at = now() WHERE person_id = p_person_id AND is_deleted = false;
      WHEN 'ssn_number' THEN
        UPDATE public.people_identifiers SET ssn_number = NULL, updated_by = current_user_id, updated_at = now() WHERE person_id = p_person_id AND is_deleted = false;
      WHEN 'npi_number' THEN
        UPDATE public.people_identifiers SET npi_number = NULL, updated_by = current_user_id, updated_at = now() WHERE person_id = p_person_id AND is_deleted = false;
      WHEN 'insurance_provider' THEN
        UPDATE public.people_identifiers SET insurance_provider = NULL, updated_by = current_user_id, updated_at = now() WHERE person_id = p_person_id AND is_deleted = false;
      WHEN 'insurance_number' THEN
        UPDATE public.people_identifiers SET insurance_number = NULL, updated_by = current_user_id, updated_at = now() WHERE person_id = p_person_id AND is_deleted = false;
      WHEN 'insurance_expiration_date' THEN
        UPDATE public.people_identifiers SET insurance_expiration_date = NULL, updated_by = current_user_id, updated_at = now() WHERE person_id = p_person_id AND is_deleted = false;
      WHEN 'gender_identity' THEN
        UPDATE public.people_identifiers SET gender_identity = NULL, updated_by = current_user_id, updated_at = now() WHERE person_id = p_person_id AND is_deleted = false;
      WHEN 'ethnicity_identity' THEN
        UPDATE public.people_identifiers SET ethnicity_identity = NULL, updated_by = current_user_id, updated_at = now() WHERE person_id = p_person_id AND is_deleted = false;
      WHEN 'marital_status' THEN
        UPDATE public.people_identifiers SET marital_status = NULL, updated_by = current_user_id, updated_at = now() WHERE person_id = p_person_id AND is_deleted = false;
      WHEN 'living_situation' THEN
        UPDATE public.people_identifiers SET living_situation = NULL, updated_by = current_user_id, updated_at = now() WHERE person_id = p_person_id AND is_deleted = false;
    END CASE;
  ELSIF p_field_name = 'preferred_language' THEN
    UPDATE public.people_leads SET preferred_language = NULL, updated_by = current_user_id, updated_at = now() WHERE person_id = p_person_id AND is_deleted = false;
  ELSIF p_field_name = 'referred_by_name' THEN
    UPDATE public.people_referrals SET referred_by_name = NULL, updated_by = current_user_id, updated_at = now() WHERE person_id = p_person_id AND is_deleted = false;
  ELSE
    RETURN json_build_object('success', false, 'message', 'Invalid field name');
  END IF;

  SELECT json_build_object(
    'success', true,
    'message', 'Field cleared successfully'
  ) INTO result;

  RETURN result;
END;
$$;