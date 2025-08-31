-- Enable realtime for key tables by adding them to the publication
ALTER PUBLICATION supabase_realtime ADD TABLE app_organizations;
ALTER PUBLICATION supabase_realtime ADD TABLE people;
ALTER PUBLICATION supabase_realtime ADD TABLE people_contacts;

-- Set REPLICA IDENTITY FULL to capture complete row data during updates
ALTER TABLE app_organizations REPLICA IDENTITY FULL;
ALTER TABLE people REPLICA IDENTITY FULL;
ALTER TABLE people_contacts REPLICA IDENTITY FULL;