-- MySQL Migration for Burch Contracting Database
-- Create contact leads table for storing contact form submissions

CREATE TABLE IF NOT EXISTS contact_leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  service_type VARCHAR(100),
  budget_range VARCHAR(50),
  timeframe VARCHAR(100),
  referral_source VARCHAR(100),
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  assigned_to VARCHAR(255),
  priority VARCHAR(20) DEFAULT 'medium',
  estimated_value DECIMAL(10, 2),
  scheduled_date DATETIME,
  last_contact_date DATETIME,
  source_url VARCHAR(500),
  tags JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_assigned_to (assigned_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
