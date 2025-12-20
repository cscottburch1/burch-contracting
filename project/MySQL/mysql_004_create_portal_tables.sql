-- Create customer portal tables

CREATE TABLE IF NOT EXISTS portal_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NOT NULL,
  email VARCHAR(255) NOT NULL,
  access_code VARCHAR(64) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_email_code (email, access_code),
  CONSTRAINT fk_portal_users_lead FOREIGN KEY (lead_id) REFERENCES contact_leads(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS portal_documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  portal_user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_portal_docs_user FOREIGN KEY (portal_user_id) REFERENCES portal_users(id) ON DELETE CASCADE,
  INDEX idx_portal_user (portal_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
