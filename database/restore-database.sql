-- =====================================================
-- DATABASE RESTORATION SCRIPT
-- Run this to restore missing tables and data
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. VOTERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS voters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255),
  student_id VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT,
  wallet_address VARCHAR(42) UNIQUE,
  department VARCHAR(255) NOT NULL,
  year_of_study INTEGER CHECK (year_of_study BETWEEN 1 AND 5),
  full_name VARCHAR(255),
  has_voted BOOLEAN DEFAULT FALSE,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  voted_at TIMESTAMP WITH TIME ZONE,
  
  -- Email OTP verification fields
  email_verified BOOLEAN DEFAULT FALSE,
  email_otp_hash TEXT,
  email_otp_expires_at TIMESTAMP WITH TIME ZONE,
  otp_attempts INTEGER DEFAULT 0,
  otp_last_sent_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_wallet_address CHECK (wallet_address IS NULL OR wallet_address ~ '^0x[a-fA-F0-9]{40}$')
);

-- =====================================================
-- 2. ELECTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS elections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  results_published BOOLEAN DEFAULT FALSE,
  max_voters INTEGER,
  current_voters INTEGER DEFAULT 0,
  created_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_election_period CHECK (end_time > start_time),
  CONSTRAINT valid_voter_limit CHECK (max_voters IS NULL OR max_voters > 0),
  CONSTRAINT valid_current_voters CHECK (current_voters >= 0)
);

-- =====================================================
-- 3. CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  election_id UUID NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
  category_name VARCHAR(100) NOT NULL,
  name VARCHAR(100),
  description TEXT,
  max_votes INTEGER DEFAULT 1 CHECK (max_votes >= 1),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(election_id, category_name)
);

-- =====================================================
-- 4. CANDIDATES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  election_id UUID NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
  candidate_name VARCHAR(255) NOT NULL,
  party VARCHAR(100),
  manifesto TEXT,
  photo_url TEXT,
  vote_count INTEGER DEFAULT 0 CHECK (vote_count >= 0),
  candidate_number INTEGER,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. VOTE HISTORY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS vote_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    voter_wallet_address VARCHAR(42) NOT NULL,
    voter_student_id VARCHAR(50),
    voter_name VARCHAR(255),
    election_id UUID REFERENCES elections(id) ON DELETE SET NULL,
    election_title VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    category_name VARCHAR(255) NOT NULL,
    candidate_id UUID REFERENCES candidates(id) ON DELETE SET NULL,
    candidate_name VARCHAR(255) NOT NULL,
    candidate_party VARCHAR(100),
    blockchain_tx_hash VARCHAR(255),
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_vote_history_wallet CHECK (voter_wallet_address ~ '^0x[a-fA-F0-9]{40}$')
);

-- =====================================================
-- 6. VOTES TABLE (Legacy)
-- =====================================================
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  election_id UUID NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
  blockchain_tx_hash VARCHAR(66),
  blockchain_verified BOOLEAN DEFAULT FALSE,
  voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, category_id, election_id),
  CONSTRAINT valid_tx_hash CHECK (blockchain_tx_hash IS NULL OR blockchain_tx_hash ~ '^0x[a-fA-F0-9]{64}$')
);

-- =====================================================
-- 7. ADMINS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  wallet_address VARCHAR(42) UNIQUE,
  role VARCHAR(50) DEFAULT 'election_admin',
  permissions TEXT[],
  assigned_by VARCHAR(255),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_admin_wallet_address CHECK (wallet_address IS NULL OR wallet_address ~ '^0x[a-fA-F0-9]{40}$')
);

-- =====================================================
-- 8. AUDIT LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  details JSONB,
  type VARCHAR(100),
  description TEXT,
  meta JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. SYSTEM SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS system_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by VARCHAR(255),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. SESSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Voters table indexes
CREATE INDEX IF NOT EXISTS idx_voters_student_id ON voters(student_id);
CREATE INDEX IF NOT EXISTS idx_voters_wallet_address ON voters(wallet_address);
CREATE INDEX IF NOT EXISTS idx_voters_has_voted ON voters(has_voted);
CREATE INDEX IF NOT EXISTS idx_voters_email ON voters(email);

-- Elections table indexes
CREATE INDEX IF NOT EXISTS idx_elections_active ON elections(is_active);
CREATE INDEX IF NOT EXISTS idx_elections_dates ON elections(start_time, end_time);

-- Categories table indexes
CREATE INDEX IF NOT EXISTS idx_categories_election ON categories(election_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

-- Candidates table indexes
CREATE INDEX IF NOT EXISTS idx_candidates_category ON candidates(category_id);
CREATE INDEX IF NOT EXISTS idx_candidates_election ON candidates(election_id);

-- Votes table indexes
CREATE INDEX IF NOT EXISTS idx_votes_user ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_election ON votes(election_id);

-- Vote history indexes
CREATE INDEX IF NOT EXISTS idx_vote_history_wallet ON vote_history(voter_wallet_address);
CREATE INDEX IF NOT EXISTS idx_vote_history_election ON vote_history(election_id);
CREATE INDEX IF NOT EXISTS idx_vote_history_voted_at ON vote_history(voted_at DESC);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- Sessions indexes
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- =====================================================
-- INSERT DEFAULT ADMIN USER
-- Password: Admin@123 (bcrypt hashed)
-- =====================================================

-- First, check if admin exists, if not, create one
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admins WHERE email = 'admin@apu.edu.my' LIMIT 1) THEN
    INSERT INTO admins (
      user_id,
      email,
      password_hash,
      wallet_address,
      role,
      permissions,
      is_active
    ) VALUES (
      'admin001',
      'admin@apu.edu.my',
      '$2b$10$EIXvC6dN8Z5zYf5K4fJ4LOGqGqN8yqHqZ.H4sVQxN3fN8F2Z0Y8gK', -- Admin@123
      '0x30D336E13fac19C61c116431d44adbD98c386d5d',
      'super_admin',
      ARRAY['all'],
      true
    );
    RAISE NOTICE 'Default admin created: admin@apu.edu.my / Admin@123';
  ELSE
    RAISE NOTICE 'Admin already exists';
  END IF;
END $$;

-- =====================================================
-- INSERT SAMPLE SYSTEM SETTINGS
-- =====================================================

INSERT INTO system_settings (key, value, description) VALUES
  ('election_settings', 
   '{"requireIdVerification": true, "showResultsDuringVoting": false}',
   'Global election configuration settings'
  )
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

INSERT INTO system_settings (key, value, description) VALUES
  ('capacity_testing', 
   '{"enabled": false, "maxConcurrentUsers": 10}',
   'Capacity testing and load management settings'
  )
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Database restoration complete!';
  RAISE NOTICE '✅ All tables created successfully';
  RAISE NOTICE '✅ Default admin user ready: admin@apu.edu.my';
  RAISE NOTICE '✅ Password: Admin@123';
  RAISE NOTICE '⚠️  Please change the admin password after first login!';
END $$;
