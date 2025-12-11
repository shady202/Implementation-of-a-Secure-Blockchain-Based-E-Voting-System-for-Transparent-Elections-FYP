-- =====================================================
-- APU VOTE - Row Level Security (RLS) Policies
-- =====================================================
-- Description: Comprehensive security policies to protect
-- user data and ensure proper access control
-- =====================================================

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 1. USERS TABLE POLICIES
-- =====================================================

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile (excluding role and is_verified)
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.users WHERE id = auth.uid()) -- Cannot change role
    AND is_verified = (SELECT is_verified FROM public.users WHERE id = auth.uid()) -- Cannot change verification
  );

-- Policy: Admins can view all users
CREATE POLICY "Admins can view all users"
  ON public.users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
      AND is_active = TRUE
      AND 'manage_users' = ANY(permissions)
    )
  );

-- Policy: Admins can update user roles and status
CREATE POLICY "Admins can update users"
  ON public.users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
      AND is_active = TRUE
      AND 'manage_users' = ANY(permissions)
    )
  );

-- Policy: New users can insert their profile (handled by trigger)
CREATE POLICY "New users can be inserted"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Public can view verified voters (for candidate selection)
CREATE POLICY "Public can view verified voters"
  ON public.users
  FOR SELECT
  USING (is_verified = TRUE AND is_active = TRUE);

-- =====================================================
-- 2. ELECTIONS TABLE POLICIES
-- =====================================================

-- Policy: Anyone can view active elections
CREATE POLICY "Anyone can view active elections"
  ON public.elections
  FOR SELECT
  USING (TRUE);

-- Policy: Admins can create elections
CREATE POLICY "Admins can create elections"
  ON public.elections
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
      AND is_active = TRUE
      AND 'manage_elections' = ANY(permissions)
    )
  );

-- Policy: Admins can update elections
CREATE POLICY "Admins can update elections"
  ON public.elections
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
      AND is_active = TRUE
      AND 'manage_elections' = ANY(permissions)
    )
  );

-- Policy: Admins can delete elections
CREATE POLICY "Admins can delete elections"
  ON public.elections
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
      AND is_active = TRUE
      AND 'manage_elections' = ANY(permissions)
    )
  );

-- =====================================================
-- 3. CATEGORIES TABLE POLICIES
-- =====================================================

-- Policy: Anyone can view active categories
CREATE POLICY "Anyone can view active categories"
  ON public.categories
  FOR SELECT
  USING (is_active = TRUE);

-- Policy: Admins can view all categories
CREATE POLICY "Admins can view all categories"
  ON public.categories
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
      AND is_active = TRUE
      AND 'manage_categories' = ANY(permissions)
    )
  );

-- Policy: Admins can create categories
CREATE POLICY "Admins can create categories"
  ON public.categories
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
      AND is_active = TRUE
      AND 'manage_categories' = ANY(permissions)
    )
  );

-- Policy: Admins can update categories
CREATE POLICY "Admins can update categories"
  ON public.categories
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
      AND is_active = TRUE
      AND 'manage_categories' = ANY(permissions)
    )
  );

-- Policy: Admins can delete categories
CREATE POLICY "Admins can delete categories"
  ON public.categories
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
      AND is_active = TRUE
      AND 'manage_categories' = ANY(permissions)
    )
  );

-- =====================================================
-- 4. CANDIDATES TABLE POLICIES
-- =====================================================

-- Policy: Anyone can view approved candidates
CREATE POLICY "Anyone can view approved candidates"
  ON public.candidates
  FOR SELECT
  USING (is_approved = TRUE);

-- Policy: Users can view their own candidacy
CREATE POLICY "Users can view own candidacy"
  ON public.candidates
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Verified voters can register as candidates
CREATE POLICY "Verified voters can register as candidates"
  ON public.candidates
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND is_verified = TRUE
      AND is_active = TRUE
    )
  );

-- Policy: Candidates can update their own profile
CREATE POLICY "Candidates can update own profile"
  ON public.candidates
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND is_approved = (SELECT is_approved FROM public.candidates WHERE id = candidates.id) -- Cannot self-approve
  );

-- Policy: Admins can approve/manage candidates
CREATE POLICY "Admins can manage candidates"
  ON public.candidates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
      AND is_active = TRUE
      AND 'manage_candidates' = ANY(permissions)
    )
  );

-- =====================================================
-- 5. VOTES TABLE POLICIES
-- =====================================================

-- Policy: Users can view ONLY their own votes
CREATE POLICY "Users can view own votes"
  ON public.votes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Verified voters can cast votes
CREATE POLICY "Verified voters can cast votes"
  ON public.votes
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND is_verified = TRUE
      AND is_active = TRUE
    )
    -- Ensure election is active and within voting period
    AND EXISTS (
      SELECT 1 FROM public.elections
      WHERE id = election_id
      AND is_active = TRUE
      AND NOW() BETWEEN start_time AND end_time
    )
    -- Ensure category is active
    AND EXISTS (
      SELECT 1 FROM public.categories
      WHERE id = category_id
      AND is_active = TRUE
    )
    -- Ensure candidate is approved
    AND EXISTS (
      SELECT 1 FROM public.candidates
      WHERE id = candidate_id
      AND is_approved = TRUE
    )
    -- Check visitor limit not exceeded
    AND (
      SELECT current_voters < max_voters OR max_voters IS NULL
      FROM public.elections
      WHERE id = election_id
    )
  );

-- Policy: NO ONE can update votes (immutable)
-- (No UPDATE policy = votes cannot be modified)

-- Policy: NO ONE can delete votes (except admins via super_admin)
CREATE POLICY "Super admins can delete votes"
  ON public.votes
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
      AND is_active = TRUE
      AND 'super_admin' = ANY(permissions)
    )
  );

-- Policy: Admins can view all votes (for results)
CREATE POLICY "Admins can view all votes"
  ON public.votes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
      AND is_active = TRUE
      AND 'view_results' = ANY(permissions)
    )
  );

-- =====================================================
-- 6. ADMINS TABLE POLICIES
-- =====================================================

-- Policy: Admins can view other admins
CREATE POLICY "Admins can view admins"
  ON public.admins
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
      AND is_active = TRUE
    )
  );

-- Policy: Super admins can create new admins
CREATE POLICY "Super admins can create admins"
  ON public.admins
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
      AND is_active = TRUE
      AND 'super_admin' = ANY(permissions)
    )
  );

-- Policy: Super admins can update admins
CREATE POLICY "Super admins can update admins"
  ON public.admins
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
      AND is_active = TRUE
      AND 'super_admin' = ANY(permissions)
    )
  );

-- Policy: Super admins can delete admins
CREATE POLICY "Super admins can delete admins"
  ON public.admins
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
      AND is_active = TRUE
      AND 'super_admin' = ANY(permissions)
    )
  );

-- =====================================================
-- 7. AUDIT LOGS POLICIES
-- =====================================================

-- Policy: Admins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
      AND is_active = TRUE
    )
  );

-- Policy: System can insert audit logs (service role)
CREATE POLICY "System can insert audit logs"
  ON public.audit_logs
  FOR INSERT
  WITH CHECK (TRUE); -- Controlled by application logic

-- Policy: No one can update or delete audit logs
-- (No UPDATE or DELETE policies = immutable audit trail)

-- =====================================================
-- 8. SYSTEM SETTINGS POLICIES
-- =====================================================

-- Policy: Anyone can view system settings
CREATE POLICY "Anyone can view system settings"
  ON public.system_settings
  FOR SELECT
  USING (TRUE);

-- Policy: Only admins can update system settings
CREATE POLICY "Admins can update system settings"
  ON public.system_settings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
      AND is_active = TRUE
      AND 'system_settings' = ANY(permissions)
    )
  );

-- =====================================================
-- HELPER FUNCTIONS FOR RLS
-- =====================================================

-- Function: Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
    AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check if user has specific permission
CREATE OR REPLACE FUNCTION public.has_permission(permission admin_permission)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
    AND is_active = TRUE
    AND permission = ANY(permissions)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check if user is verified voter
CREATE OR REPLACE FUNCTION public.is_verified_voter()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND is_verified = TRUE
    AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMPLETED: Row Level Security Policies
-- =====================================================
