-- Update people_referrals table structure 
-- Step 1: Add person_id column as nullable initially
ALTER TABLE public.people_referrals 
ADD COLUMN person_id uuid;

-- Step 2: Add foreign key constraint for person_id (to people.id)
ALTER TABLE public.people_referrals
ADD CONSTRAINT fk_people_referrals_person_id 
FOREIGN KEY (person_id) REFERENCES public.people(id);

-- Step 3: Make person_id NOT NULL (after data migration would be done)
-- For now, we'll make it NOT NULL immediately since this appears to be development
ALTER TABLE public.people_referrals 
ALTER COLUMN person_id SET NOT NULL;

-- Step 4: Remove the old columns that are no longer needed
ALTER TABLE public.people_referrals 
DROP COLUMN first_name,
DROP COLUMN last_name,
DROP COLUMN email,
DROP COLUMN phone_number;

-- Step 5: Enable RLS on people_referrals table
ALTER TABLE public.people_referrals ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies for people_referrals
-- Users can view referrals in their organization
CREATE POLICY "Users can view referrals in their organization" 
ON public.people_referrals 
FOR SELECT 
USING (EXISTS (
  SELECT 1
  FROM public.people p
  JOIN public.app_users au ON p.user_account_id = au.id
  JOIN public.app_agencies_people op ON p.id = op.person_id
  WHERE au.user_id = auth.uid() 
    AND p.is_deleted = false 
    AND op.is_deleted = false
));

-- Users can create referrals in their organization
CREATE POLICY "Users can create referrals in their organization" 
ON public.people_referrals 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1
  FROM public.people p
  JOIN public.app_users au ON p.user_account_id = au.id
  JOIN public.app_agencies_people op ON p.id = op.person_id
  WHERE au.user_id = auth.uid() 
    AND p.is_deleted = false 
    AND op.is_deleted = false
));

-- Users can update referrals in their organization
CREATE POLICY "Users can update referrals in their organization" 
ON public.people_referrals 
FOR UPDATE 
USING (EXISTS (
  SELECT 1
  FROM public.people p
  JOIN public.app_users au ON p.user_account_id = au.id
  JOIN public.app_agencies_people op ON p.id = op.person_id
  WHERE au.user_id = auth.uid() 
    AND p.is_deleted = false 
    AND op.is_deleted = false
));

-- Users can delete referrals in their organization
CREATE POLICY "Users can delete referrals in their organization" 
ON public.people_referrals 
FOR DELETE 
USING (EXISTS (
  SELECT 1
  FROM public.people p
  JOIN public.app_users au ON p.user_account_id = au.id
  JOIN public.app_agencies_people op ON p.id = op.person_id
  WHERE au.user_id = auth.uid() 
    AND p.is_deleted = false 
    AND op.is_deleted = false
));