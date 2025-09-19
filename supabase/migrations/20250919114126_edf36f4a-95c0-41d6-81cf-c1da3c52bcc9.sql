-- Create enum for emergency contact relationships
CREATE TYPE public.emergency_contact_relationship_enum AS ENUM (
  'spouse',
  'parent',
  'child',
  'sibling',
  'friend',
  'colleague',
  'neighbor',
  'relative',
  'partner',
  'other'
);