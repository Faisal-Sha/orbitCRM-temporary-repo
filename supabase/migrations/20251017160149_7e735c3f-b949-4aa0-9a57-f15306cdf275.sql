-- Create mailerlite_events table to store raw webhook calls
CREATE TABLE public.mailerlite_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES public.app_agencies(id),
  webhook_id UUID NOT NULL REFERENCES public.settings_integrations_webhooks(id),
  event_type TEXT NOT NULL,
  is_batch BOOLEAN NOT NULL DEFAULT false,
  batch_size INTEGER DEFAULT 1,
  raw_payload JSONB NOT NULL,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processing_status TEXT NOT NULL DEFAULT 'pending' CHECK (processing_status IN ('pending', 'completed', 'partial', 'failed')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mailerlite_event_items table to store individual events
CREATE TABLE public.mailerlite_event_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mailerlite_event_id UUID NOT NULL REFERENCES public.mailerlite_events(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  subscriber_email TEXT NOT NULL,
  subscriber_mailerlite_id TEXT,
  person_id UUID REFERENCES public.people(id),
  campaign_id TEXT,
  group_id TEXT,
  automation_id TEXT,
  event_data JSONB,
  matched_to_person BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_mailerlite_events_agency_id ON public.mailerlite_events(agency_id);
CREATE INDEX idx_mailerlite_events_webhook_id ON public.mailerlite_events(webhook_id);
CREATE INDEX idx_mailerlite_events_received_at ON public.mailerlite_events(received_at DESC);
CREATE INDEX idx_mailerlite_events_processing_status ON public.mailerlite_events(processing_status);

CREATE INDEX idx_mailerlite_event_items_mailerlite_event_id ON public.mailerlite_event_items(mailerlite_event_id);
CREATE INDEX idx_mailerlite_event_items_subscriber_email ON public.mailerlite_event_items(subscriber_email);
CREATE INDEX idx_mailerlite_event_items_person_id ON public.mailerlite_event_items(person_id);
CREATE INDEX idx_mailerlite_event_items_event_type ON public.mailerlite_event_items(event_type);
CREATE INDEX idx_mailerlite_event_items_event_timestamp ON public.mailerlite_event_items(event_timestamp DESC);

-- Enable Row Level Security
ALTER TABLE public.mailerlite_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mailerlite_event_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mailerlite_events
CREATE POLICY "Users can view events in their agency"
  ON public.mailerlite_events
  FOR SELECT
  USING (user_can_access_agency(agency_id));

CREATE POLICY "System can insert events"
  ON public.mailerlite_events
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update events"
  ON public.mailerlite_events
  FOR UPDATE
  USING (true);

-- RLS Policies for mailerlite_event_items
CREATE POLICY "Users can view event items in their agency"
  ON public.mailerlite_event_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.mailerlite_events me
      WHERE me.id = mailerlite_event_items.mailerlite_event_id
      AND user_can_access_agency(me.agency_id)
    )
  );

CREATE POLICY "System can insert event items"
  ON public.mailerlite_event_items
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update event items"
  ON public.mailerlite_event_items
  FOR UPDATE
  USING (true);

-- Helper function to get MailerLite event summary
CREATE OR REPLACE FUNCTION public.get_mailerlite_event_summary(
  p_agency_id UUID DEFAULT NULL,
  p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
  event_type TEXT,
  total_events BIGINT,
  matched_subscribers BIGINT,
  unmatched_subscribers BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mei.event_type,
    COUNT(*)::BIGINT as total_events,
    COUNT(CASE WHEN mei.matched_to_person THEN 1 END)::BIGINT as matched_subscribers,
    COUNT(CASE WHEN NOT mei.matched_to_person THEN 1 END)::BIGINT as unmatched_subscribers
  FROM public.mailerlite_event_items mei
  JOIN public.mailerlite_events me ON mei.mailerlite_event_id = me.id
  WHERE (p_agency_id IS NULL OR me.agency_id = p_agency_id)
    AND (p_start_date IS NULL OR mei.event_timestamp >= p_start_date)
    AND (p_end_date IS NULL OR mei.event_timestamp <= p_end_date)
  GROUP BY mei.event_type
  ORDER BY total_events DESC;
END;
$$;