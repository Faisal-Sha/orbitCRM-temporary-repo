-- Drop the existing CHECK constraint that only allowed 3 status values
ALTER TABLE public.mailerlite_sync_log 
DROP CONSTRAINT IF EXISTS mailerlite_sync_log_sync_status_check;

-- Add new CHECK constraint that includes all 5 status values used by the trigger
ALTER TABLE public.mailerlite_sync_log 
ADD CONSTRAINT mailerlite_sync_log_sync_status_check 
CHECK (sync_status IN ('success', 'failed', 'pending', 'error', 'initiated'));