-- Add unique constraint to prevent duplicate event processing
CREATE UNIQUE INDEX IF NOT EXISTS idx_mailerlite_event_items_unique 
ON public.mailerlite_event_items (
  subscriber_mailerlite_id, 
  event_type, 
  COALESCE(group_id, ''), 
  event_timestamp
);

-- Add comment explaining the constraint
COMMENT ON INDEX idx_mailerlite_event_items_unique IS 
'Ensures idempotency: prevents duplicate processing of the same MailerLite event for a subscriber';