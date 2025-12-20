-- MySQL Migration for Burch Contracting Database
-- Create lead_activities table for tracking all lead interactions

CREATE TABLE IF NOT EXISTS lead_activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NOT NULL,
  activity_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  created_by VARCHAR(255),
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (lead_id) REFERENCES contact_leads(id) ON DELETE CASCADE,
  INDEX idx_lead_id (lead_id),
  INDEX idx_created_at (created_at),
  INDEX idx_activity_type (activity_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
