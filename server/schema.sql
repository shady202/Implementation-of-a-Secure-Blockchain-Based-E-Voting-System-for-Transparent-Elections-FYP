-- =====================================================
-- E-Voting System - PostgreSQL Schema
-- Adapted from Supabase schema for standalone PostgreSQL
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. VOTERS TABLE (Simplified from users table)
-- =====================================================
CREATE TABLE IF NOT EXISTS voters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255), -- For future session-based auth
  student_id VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT,
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  department VARCHAR(255) NOT NULL,
  year_of_study INTEGER CHECK (year_of_study BETWEEN 1 AND 4),
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
  
  CONSTRAINT valid_wallet_address CHECK (wallet_address ~ '^0x[a-fA-F0-9]{40}$')
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
  name VARCHAR(100), -- Alias for category_name
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
  user_id VARCHAR(255), -- For tracking who added
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
-- 5. VOTE HISTORY TABLE (Lifetime vote records)
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

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_vote_history_wallet ON vote_history(voter_wallet_address);
CREATE INDEX IF NOT EXISTS idx_vote_history_election ON vote_history(election_id);
CREATE INDEX IF NOT EXISTS idx_vote_history_voted_at ON vote_history(voted_at DESC);

-- =====================================================
-- 6. VOTES TABLE (Legacy - can be removed later)
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
-- 6. ADMINS TABLE
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
-- 7. AUDIT LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  details JSONB,
  type VARCHAR(100), -- Alias for action
  description TEXT,
  meta JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. SYSTEM SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS system_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by VARCHAR(255),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Voters table indexes
CREATE INDEX IF NOT EXISTS idx_voters_student_id ON voters(student_id);
CREATE INDEX IF NOT EXISTS idx_voters_wallet_address ON voters(wallet_address);
CREATE INDEX IF NOT EXISTS idx_voters_has_voted ON voters(has_voted);

-- Elections table indexes
CREATE INDEX IF NOT EXISTS idx_elections_is_active ON elections(is_active);
CREATE INDEX IF NOT EXISTS idx_elections_dates ON elections(start_time, end_time);

-- Categories table indexes
CREATE INDEX IF NOT EXISTS idx_categories_election_id ON categories(election_id);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);

-- Candidates table indexes
CREATE INDEX IF NOT EXISTS idx_candidates_category_id ON candidates(category_id);
CREATE INDEX IF NOT EXISTS idx_candidates_election_id ON candidates(election_id);
CREATE INDEX IF NOT EXISTS idx_candidates_is_approved ON candidates(is_approved);
CREATE INDEX IF NOT EXISTS idx_candidates_vote_count ON candidates(vote_count DESC);

-- Votes table indexes
CREATE INDEX IF NOT EXISTS idx_votes_candidate_id ON votes(candidate_id);
CREATE INDEX IF NOT EXISTS idx_votes_category_id ON votes(category_id);
CREATE INDEX IF NOT EXISTS idx_votes_election_id ON votes(election_id);
CREATE INDEX IF NOT EXISTS idx_votes_voted_at ON votes(voted_at);
CREATE INDEX IF NOT EXISTS idx_votes_blockchain_tx_hash ON votes(blockchain_tx_hash);

-- Admins table indexes
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);
CREATE INDEX IF NOT EXISTS idx_admins_is_active ON admins(is_active);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- =====================================================
-- TRIGGERS & FUNCTIONS
-- =====================================================

-- Function: Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at
DROP TRIGGER IF EXISTS update_voters_updated_at ON voters;
CREATE TRIGGER update_voters_updated_at BEFORE UPDATE ON voters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_elections_updated_at ON elections;
CREATE TRIGGER update_elections_updated_at BEFORE UPDATE ON elections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_candidates_updated_at ON candidates;
CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DEFAULT DATA
-- =====================================================

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
  ('max_categories_per_election', '3', 'Maximum number of categories allowed per election'),
  ('require_wallet_connection', 'true', 'Require MetaMask wallet connection for voting'),
  ('enable_email_verification', 'true', 'Require email verification before voting'),
  ('results_locked', 'false', 'Lock results from being viewed by users'),
  ('visitor_limit_enabled', 'false', 'Enable visitor limit control for elections'),
  ('default_visitor_limit', '1000', 'Default maximum voters per election'),
  ('election_settings', '{"title":"Student Council Election","startDate":"","endDate":"","requireIdVerification":true,"showResultsDuringVoting":false,"status":"Not Started","updatedAt":""}'::jsonb, 'Current election settings')
ON CONFLICT (key) DO NOTHING;

-- Create a default election
INSERT INTO elections (id, title, description, start_time, end_time, is_active)
VALUES (
  uuid_generate_v4(),
  'Student Council Election 2025',
  'Annual student council election',
  NOW(),
  NOW() + INTERVAL '30 days',
  true
) ON CONFLICT DO NOTHING;

-- =====================================================
-- COMPLETED: Schema Migration
-- =====================================================

SELECT 'Database schema created successfully!' as message;
