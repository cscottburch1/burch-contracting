-- MySQL Migration for Burch Contracting Database
-- Create lead_notes table for tracking communication with leads

CREATE TABLE IF NOT EXISTS lead_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NOT NULL,
  note_type VARCHAR(50) DEFAULT 'general',
  content TEXT NOT NULL,
  created_by VARCHAR(255),
  is_important BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (lead_id) REFERENCES contact_leads(id) ON DELETE CASCADE,
  INDEX idx_lead_id (lead_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
