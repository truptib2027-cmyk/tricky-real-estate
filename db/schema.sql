-- ==============================================================================
-- TRICKY REAL ESTATE - NEON POSTGRESQL DATABASE SCHEMA (UPDATED)
-- ==============================================================================

-- 1. DEVELOPERS
CREATE TABLE IF NOT EXISTS developers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  established_year INT NOT NULL,
  headquarters VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  total_projects INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. STAFF LOGINS (Master Admin + 3 Agents)
CREATE TABLE IF NOT EXISTS staff_logins (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'agent', -- 'admin' or 'agent'
  phone VARCHAR(50) NOT NULL,
  bio TEXT,
  avatar_url VARCHAR(500),
  monthly_target_aed NUMERIC(15, 2) DEFAULT 25000000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. OFF-PLAN PROJECTS
CREATE TABLE IF NOT EXISTS off_plan_projects (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  developer_id INT REFERENCES developers(id) ON DELETE SET NULL,
  community VARCHAR(100) NOT NULL,
  starting_price_aed NUMERIC(15, 2) NOT NULL,
  handover_date VARCHAR(50) NOT NULL,
  payment_plan_summary VARCHAR(100) NOT NULL,
  down_payment_pct INT NOT NULL DEFAULT 20,
  during_construction_pct INT NOT NULL DEFAULT 40,
  on_handover_pct INT NOT NULL DEFAULT 40,
  description TEXT NOT NULL,
  bedrooms_available VARCHAR(100) NOT NULL,
  roi_estimate VARCHAR(50),
  image_url VARCHAR(500) NOT NULL,
  featured BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. READY PROPERTIES
CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  property_type VARCHAR(50) NOT NULL,
  community VARCHAR(100) NOT NULL,
  sub_community VARCHAR(100),
  price_aed NUMERIC(15, 2) NOT NULL,
  bedrooms INT NOT NULL,
  bathrooms INT NOT NULL,
  built_up_sqft INT NOT NULL,
  status VARCHAR(50) DEFAULT 'Ready', -- 'Ready', 'Sold'
  featured BOOLEAN DEFAULT false,
  description TEXT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  agent_id INT REFERENCES staff_logins(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. BUYER LEADS (With Score 0-100, HOT/WARM/COLD, Stages & Source Form)
CREATE TABLE IF NOT EXISTS buyer_leads (
  id SERIAL PRIMARY KEY,
  reference_no VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  lead_type VARCHAR(100) NOT NULL,
  source_form VARCHAR(255) DEFAULT 'General Web Form',
  property_id INT REFERENCES properties(id) ON DELETE SET NULL,
  project_id INT REFERENCES off_plan_projects(id) ON DELETE SET NULL,
  budget_aed VARCHAR(100),
  preferred_community VARCHAR(100),
  message TEXT,
  score INT DEFAULT 50,
  score_label VARCHAR(20) DEFAULT 'WARM', -- 'HOT', 'WARM', 'COLD'
  is_cash_buyer BOOLEAN DEFAULT false,
  purchase_timeframe VARCHAR(100) DEFAULT 'Within 1-3 Months',
  stage VARCHAR(50) DEFAULT 'New', -- 'New', 'Contacted', 'Viewing', 'Offer', 'Won', 'Lost'
  assigned_agent_id INT REFERENCES staff_logins(id) ON DELETE SET NULL,
  last_activity_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. NOTES
CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  lead_id INT REFERENCES buyer_leads(id) ON DELETE CASCADE,
  staff_id INT REFERENCES staff_logins(id) ON DELETE SET NULL,
  staff_name VARCHAR(255),
  note_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. VIEWINGS
CREATE TABLE IF NOT EXISTS viewings (
  id SERIAL PRIMARY KEY,
  lead_id INT REFERENCES buyer_leads(id) ON DELETE CASCADE,
  property_id INT REFERENCES properties(id) ON DELETE CASCADE,
  staff_id INT REFERENCES staff_logins(id) ON DELETE SET NULL,
  viewing_date DATE NOT NULL,
  viewing_time VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'Scheduled', -- 'Scheduled', 'Completed', 'Cancelled'
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. COMPLETED SALES
CREATE TABLE IF NOT EXISTS completed_sales (
  id SERIAL PRIMARY KEY,
  property_id INT REFERENCES properties(id) ON DELETE SET NULL,
  property_title VARCHAR(255) NOT NULL,
  community VARCHAR(100) NOT NULL,
  buyer_name VARCHAR(255) NOT NULL,
  staff_id INT REFERENCES staff_logins(id) ON DELETE SET NULL,
  sale_price_aed NUMERIC(15, 2) NOT NULL,
  commission_aed NUMERIC(15, 2) NOT NULL, -- 2% commission
  sale_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
