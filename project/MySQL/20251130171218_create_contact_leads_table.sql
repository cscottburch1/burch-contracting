-- Create contact leads table
-- Stores all contact form submissions and estimate requests

CREATE TABLE IF NOT EXISTS contact_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  address text,
  service_type text,
  budget_range text,
  timeframe text,
  referral_source text,
  description text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contact_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert for new leads"
  ON contact_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow service role full access"
  ON contact_leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
