-- CRM Integration Schema
-- Adds lead management, notes, status tracking, and activity logging

-- Update contact_leads table with additional CRM fields
ALTER TABLE contact_leads ADD COLUMN IF NOT EXISTS assigned_to text;
ALTER TABLE contact_leads ADD COLUMN IF NOT EXISTS priority text DEFAULT 'medium';
ALTER TABLE contact_leads ADD COLUMN IF NOT EXISTS estimated_value numeric;
ALTER TABLE contact_leads ADD COLUMN IF NOT EXISTS scheduled_date timestamptz;
ALTER TABLE contact_leads ADD COLUMN IF NOT EXISTS last_contact_date timestamptz;
ALTER TABLE contact_leads ADD COLUMN IF NOT EXISTS source_url text;
ALTER TABLE contact_leads ADD COLUMN IF NOT EXISTS tags text[];

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_leads_status ON contact_leads(status);
CREATE INDEX IF NOT EXISTS idx_contact_leads_created ON contact_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_leads_assigned ON contact_leads(assigned_to);

-- Create lead_notes table for tracking communication
CREATE TABLE IF NOT EXISTS lead_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES contact_leads(id) ON DELETE CASCADE,
  note_type text DEFAULT 'general',
  content text NOT NULL,
  created_by text,
  created_at timestamptz DEFAULT now(),
  is_important boolean DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON lead_notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_notes_created ON lead_notes(created_at DESC);

ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access to lead_notes"
  ON lead_notes
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create lead_activities table for tracking all lead interactions
CREATE TABLE IF NOT EXISTS lead_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES contact_leads(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  description text NOT NULL,
  created_by text,
  created_at timestamptz DEFAULT now(),
  metadata jsonb
);

CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_created ON lead_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_activities_type ON lead_activities(activity_type);

ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access to lead_activities"
  ON lead_activities
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create function to automatically log status changes
CREATE OR REPLACE FUNCTION log_lead_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO lead_activities (lead_id, activity_type, description, metadata)
    VALUES (
      NEW.id,
      'status_change',
      'Status changed from ' || COALESCE(OLD.status, 'none') || ' to ' || NEW.status,
      jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
    );
  END IF;
  
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for status changes
DROP TRIGGER IF EXISTS trigger_lead_status_change ON contact_leads;
CREATE TRIGGER trigger_lead_status_change
  BEFORE UPDATE ON contact_leads
  FOR EACH ROW
  EXECUTE FUNCTION log_lead_status_change();

-- Create view for lead statistics
CREATE OR REPLACE VIEW lead_statistics AS
SELECT
  status,
  COUNT(*) as count,
  AVG(estimated_value) as avg_value,
  SUM(estimated_value) as total_value
FROM contact_leads
GROUP BY status;
