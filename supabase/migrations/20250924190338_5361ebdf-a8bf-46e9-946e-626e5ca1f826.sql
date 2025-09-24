-- Remove created_by and deleted_by columns from forms_submissions table
ALTER TABLE public.forms_submissions 
DROP COLUMN IF EXISTS created_by,
DROP COLUMN IF EXISTS deleted_by;