-- =====================================================
-- APU VOTE - Blockchain E-Voting Platform
-- Database Schema Migration
-- =====================================================
-- Description: Complete database schema with authentication,
-- elections, candidates, votes, and admin management
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS/PROFILES TABLE
-- =====================================================
-- Linked to Supabase Auth (auth.users)
-- Stores extended user profile information
-- =====================================================

CREATE TYPE user_role AS ENUM ('admin', 'voter', 'candidate');
CREATE TYPE department_type AS ENUM (
  'School of Computing',
  'School of Engineering',
  'School of Business',
  'School of Media',
  'School of Hospitality',
  'School of Technology'
);

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  tp_number VARCHAR(20) UNIQUE NOT NULL, -- APU Student ID format: TP123456
  wallet_address VARCHAR(42) UNIQUE, -- Ethereum wallet address (0x...)
  department department_type NOT NULL,
  year_of_study INTEGER CHECK (year_of_study BETWEEN 1 AND 4),
  role user_role DEFAULT 'voter' NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE, -- Email verification status
  is_active BOOLEAN DEFAULT TRUE, -- Account active status
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_tp_number CHECK (tp_number ~ '^TP[0-9]{6}$'),
  CONSTRAINT valid_wallet_address CHECK (wallet_address IS NULL OR wallet_address ~ '^0x[a-fA-F0-9]{40}$')
);

-- Add comments
COMMENT ON TABLE public.users IS 'Extended user profiles linked to Supabase Auth';
COMMENT ON COLUMN public.users.tp_number IS 'APU student ID in format TP123456';
COMMENT ON COLUMN public.users.wallet_address IS 'Ethereum wallet address for blockchain voting';
COMMENT ON COLUMN public.users.is_verified IS 'Email verification status from Supabase Auth';

-- =====================================================
-- 2. ELECTIONS TABLE
-- =====================================================
-- Stores election configurations and schedules
-- =====================================================

CREATE TABLE public.elections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  results_published BOOLEAN DEFAULT FALSE,
  max_voters INTEGER, -- Visitor limit control
  current_voters INTEGER DEFAULT 0, -- Current vote count
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_election_period CHECK (end_time > start_time),
  CONSTRAINT valid_voter_limit CHECK (max_voters IS NULL OR max_voters > 0),
  CONSTRAINT valid_current_voters CHECK (current_voters >= 0)
);

COMMENT ON TABLE public.elections IS 'Election configurations and schedules';
COMMENT ON COLUMN public.elections.max_voters IS 'Maximum number of allowed voters (visitor limit)';
COMMENT ON COLUMN public.elections.current_voters IS 'Current number of voters who have participated';

-- =====================================================
-- 3. CATEGORIES TABLE
-- =====================================================
-- Voting categories/positions (max 3 as per requirements)
-- Examples: President, Vice President, Secretary
-- =====================================================

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  category_name VARCHAR(100) NOT NULL,
  description TEXT,
  max_votes INTEGER DEFAULT 1 CHECK (max_votes >= 1), -- Maximum votes allowed per user
  display_order INTEGER DEFAULT 0, -- For sorting categories
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(election_id, category_name),
  CONSTRAINT max_categories_per_election CHECK (
    (SELECT COUNT(*) FROM public.categories WHERE election_id = categories.election_id) <= 3
  )
);

COMMENT ON TABLE public.categories IS 'Voting categories/positions (max 3 per election)';
COMMENT ON COLUMN public.categories.max_votes IS 'Maximum votes a user can cast in this category';

-- =====================================================
-- 4. CANDIDATES TABLE
-- =====================================================
-- Candidates running for election positions
-- =====================================================

CREATE TABLE public.candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  candidate_name VARCHAR(255) NOT NULL,
  party VARCHAR(100),
  manifesto TEXT, -- Candidate's campaign manifesto
  photo_url TEXT, -- Candidate photo
  vote_count INTEGER DEFAULT 0 CHECK (vote_count >= 0),
  is_approved BOOLEAN DEFAULT FALSE, -- Admin approval required
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, category_id, election_id) -- One candidacy per category per election
);

COMMENT ON TABLE public.candidates IS 'Candidates registered for election positions';
COMMENT ON COLUMN public.candidates.is_approved IS 'Admin must approve candidate registration';
COMMENT ON COLUMN public.candidates.vote_count IS 'Cache of total votes (synced from votes table)';

-- =====================================================
-- 5. VOTES TABLE
-- =====================================================
-- Individual vote records (one vote per user per category)
-- =====================================================

CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  blockchain_tx_hash VARCHAR(66), -- Ethereum transaction hash (0x...)
  blockchain_verified BOOLEAN DEFAULT FALSE,
  voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, category_id, election_id), -- One vote per user per category per election
  CONSTRAINT valid_tx_hash CHECK (blockchain_tx_hash IS NULL OR blockchain_tx_hash ~ '^0x[a-fA-F0-9]{64}$')
);

COMMENT ON TABLE public.votes IS 'Individual vote records with blockchain verification';
COMMENT ON COLUMN public.votes.blockchain_tx_hash IS 'Ethereum transaction hash for vote verification';

-- =====================================================
-- 6. ADMINS TABLE
-- =====================================================
-- System administrators with elevated permissions
-- =====================================================

CREATE TYPE admin_permission AS ENUM (
  'manage_elections',
  'manage_candidates',
  'manage_categories',
  'manage_users',
  'view_results',
  'publish_results',
  'system_settings',
  'super_admin'
);

CREATE TABLE public.admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'election_admin',
  permissions admin_permission[] DEFAULT ARRAY['manage_elections']::admin_permission[],
  assigned_by UUID REFERENCES public.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.admins IS 'System administrators with granular permissions';
COMMENT ON COLUMN public.admins.permissions IS 'Array of permission flags for role-based access control';

-- =====================================================
-- 7. AUDIT LOG TABLE (Bonus: Track all important actions)
-- =====================================================

CREATE TYPE audit_action AS ENUM (
  'user_registered',
  'user_verified',
  'election_created',
  'election_started',
  'election_ended',
  'candidate_registered',
  'candidate_approved',
  'vote_cast',
  'results_published',
  'admin_action'
);

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action audit_action NOT NULL,
  entity_type VARCHAR(50), -- e.g., 'election', 'candidate', 'vote'
  entity_id UUID, -- Reference to affected entity
  details JSONB, -- Additional context data
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.audit_logs IS 'Audit trail for all important system actions';

-- =====================================================
-- 8. SYSTEM SETTINGS TABLE
-- =====================================================
-- Store global system configuration
-- =====================================================

CREATE TABLE public.system_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES public.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.system_settings IS 'Global system configuration key-value store';

-- Insert default settings
INSERT INTO public.system_settings (key, value, description) VALUES
  ('max_categories_per_election', '3', 'Maximum number of categories allowed per election'),
  ('require_wallet_connection', 'true', 'Require MetaMask wallet connection for voting'),
  ('enable_email_verification', 'true', 'Require email verification before voting'),
  ('results_locked', 'false', 'Lock results from being viewed by users'),
  ('visitor_limit_enabled', 'false', 'Enable visitor limit control for elections'),
  ('default_visitor_limit', '1000', 'Default maximum voters per election');

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users table indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_tp_number ON public.users(tp_number);
CREATE INDEX idx_users_wallet_address ON public.users(wallet_address);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_is_verified ON public.users(is_verified);

-- Elections table indexes
CREATE INDEX idx_elections_is_active ON public.elections(is_active);
CREATE INDEX idx_elections_dates ON public.elections(start_time, end_time);
CREATE INDEX idx_elections_created_by ON public.elections(created_by);

-- Categories table indexes
CREATE INDEX idx_categories_election_id ON public.categories(election_id);
CREATE INDEX idx_categories_is_active ON public.categories(is_active);

-- Candidates table indexes
CREATE INDEX idx_candidates_user_id ON public.candidates(user_id);
CREATE INDEX idx_candidates_category_id ON public.candidates(category_id);
CREATE INDEX idx_candidates_election_id ON public.candidates(election_id);
CREATE INDEX idx_candidates_is_approved ON public.candidates(is_approved);
CREATE INDEX idx_candidates_vote_count ON public.candidates(vote_count DESC);

-- Votes table indexes
CREATE INDEX idx_votes_user_id ON public.votes(user_id);
CREATE INDEX idx_votes_candidate_id ON public.votes(candidate_id);
CREATE INDEX idx_votes_category_id ON public.votes(category_id);
CREATE INDEX idx_votes_election_id ON public.votes(election_id);
CREATE INDEX idx_votes_voted_at ON public.votes(voted_at);
CREATE INDEX idx_votes_blockchain_tx_hash ON public.votes(blockchain_tx_hash);

-- Admins table indexes
CREATE INDEX idx_admins_user_id ON public.admins(user_id);
CREATE INDEX idx_admins_is_active ON public.admins(is_active);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);

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
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_elections_updated_at BEFORE UPDATE ON public.elections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON public.candidates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON public.admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Sync is_verified status from auth.users
CREATE OR REPLACE FUNCTION sync_user_email_verification()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET is_verified = (NEW.email_confirmed_at IS NOT NULL)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Sync email verification from auth.users
CREATE TRIGGER on_auth_user_email_verified
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at)
  EXECUTE FUNCTION sync_user_email_verification();

-- Function: Increment candidate vote count when vote is cast
CREATE OR REPLACE FUNCTION increment_candidate_votes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.candidates
  SET vote_count = vote_count + 1
  WHERE id = NEW.candidate_id;
  
  UPDATE public.elections
  SET current_voters = current_voters + 1
  WHERE id = NEW.election_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-increment vote count
CREATE TRIGGER on_vote_cast
  AFTER INSERT ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION increment_candidate_votes();

-- Function: Decrement vote count when vote is deleted
CREATE OR REPLACE FUNCTION decrement_candidate_votes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.candidates
  SET vote_count = vote_count - 1
  WHERE id = OLD.candidate_id;
  
  UPDATE public.elections
  SET current_voters = current_voters - 1
  WHERE id = OLD.election_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-decrement vote count
CREATE TRIGGER on_vote_deleted
  AFTER DELETE ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_candidate_votes();

-- Function: Create user profile automatically on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    full_name,
    tp_number,
    department,
    year_of_study,
    is_verified
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'tp_number', 'TP000000'),
    COALESCE(NEW.raw_user_meta_data->>'department', 'School of Computing')::department_type,
    COALESCE((NEW.raw_user_meta_data->>'year_of_study')::INTEGER, 1),
    (NEW.email_confirmed_at IS NOT NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Auto-create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- COMPLETED: Initial Schema Migration
-- =====================================================
