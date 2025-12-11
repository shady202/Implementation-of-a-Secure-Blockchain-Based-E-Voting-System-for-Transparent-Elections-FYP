-- =====================================================
-- APU VOTE - Seed Data for Testing
-- =====================================================
-- Description: Sample data for development and testing
-- WARNING: Only run in development environment!
-- =====================================================

-- =====================================================
-- 1. CREATE SAMPLE ELECTION
-- =====================================================

INSERT INTO public.elections (
  id,
  title,
  description,
  start_time,
  end_time,
  is_active,
  max_voters,
  current_voters
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'APU Student Council Election 2025',
  'Annual election for the Asia Pacific University Student Council leadership positions. Vote for your preferred candidates to represent the student body.',
  NOW() - INTERVAL '1 day',
  NOW() + INTERVAL '7 days',
  TRUE,
  1000,
  0
);

-- =====================================================
-- 2. CREATE SAMPLE CATEGORIES (MAX 3)
-- =====================================================

INSERT INTO public.categories (
  id,
  election_id,
  category_name,
  description,
  max_votes,
  display_order,
  is_active
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440001',
    'President',
    'Head of student council - leads all student initiatives',
    1,
    1,
    TRUE
  ),
  (
    '550e8400-e29b-41d4-a716-446655440012',
    '550e8400-e29b-41d4-a716-446655440001',
    'Vice President',
    'Supports the president and manages internal affairs',
    1,
    2,
    TRUE
  ),
  (
    '550e8400-e29b-41d4-a716-446655440013',
    '550e8400-e29b-41d4-a716-446655440001',
    'Secretary',
    'Manages documentation and communications',
    1,
    3,
    FALSE
  );

-- =====================================================
-- 3. SAMPLE ADMIN USER (You need to create this in Supabase Auth first)
-- =====================================================
-- After creating the admin user in Supabase Auth Dashboard,
-- insert their admin record here:

-- EXAMPLE (Replace with actual user ID after creating in Auth):
-- INSERT INTO public.admins (
--   user_id,
--   role,
--   permissions,
--   is_active
-- ) VALUES (
--   'YOUR-ADMIN-USER-UUID-HERE',
--   'super_admin',
--   ARRAY[
--     'manage_elections',
--     'manage_candidates',
--     'manage_categories',
--     'manage_users',
--     'view_results',
--     'publish_results',
--     'system_settings',
--     'super_admin'
--   ]::admin_permission[],
--   TRUE
-- );

-- =====================================================
-- 4. SAMPLE USERS (For development only)
-- =====================================================
-- NOTE: In production, users are created via Supabase Auth signup
-- This is just for testing the database structure

-- You can manually create users in Supabase Auth Dashboard, or use the following SQL:
-- (This requires service role access)

/*
-- Example insert into auth.users (requires service_role key):
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data
) VALUES (
  '550e8400-e29b-41d4-a716-446655440021',
  'student1@mail.apu.edu.my',
  crypt('password123', gen_salt('bf')),
  NOW(),
  '{"full_name": "John Doe", "tp_number": "TP123456", "department": "School of Computing", "year_of_study": 3}'::jsonb
);
*/

-- Corresponding profile will be auto-created by trigger

-- =====================================================
-- 5. SAMPLE CANDIDATES
-- =====================================================
-- NOTE: Requires actual user IDs from auth.users
-- Update these UUIDs after creating real users

/*
INSERT INTO public.candidates (
  id,
  user_id,
  category_id,
  election_id,
  candidate_name,
  party,
  manifesto,
  vote_count,
  is_approved
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440031',
    '550e8400-e29b-41d4-a716-446655440021', -- Replace with actual user_id
    '550e8400-e29b-41d4-a716-446655440011', -- President category
    '550e8400-e29b-41d4-a716-446655440001',
    'Sarah Chen',
    'Progressive Student Alliance',
    'I will fight for better campus facilities, mental health support, and inclusive student events.',
    0,
    TRUE
  ),
  (
    '550e8400-e29b-41d4-a716-446655440032',
    '550e8400-e29b-41d4-a716-446655440022', -- Replace with actual user_id
    '550e8400-e29b-41d4-a716-446655440011', -- President category
    '550e8400-e29b-41d4-a716-446655440001',
    'Michael Tan',
    'Student Unity Party',
    'Together we will enhance academic resources, expand internship opportunities, and build stronger alumni networks.',
    0,
    TRUE
  ),
  (
    '550e8400-e29b-41d4-a716-446655440033',
    '550e8400-e29b-41d4-a716-446655440023', -- Replace with actual user_id
    '550e8400-e29b-41d4-a716-446655440012', -- Vice President category
    '550e8400-e29b-41d4-a716-446655440001',
    'Priya Kumar',
    'Independent',
    'My focus is on transparency, accountability, and empowering student voices in university decisions.',
    0,
    TRUE
  );
*/

-- =====================================================
-- COMPLETED: Seed Data
-- =====================================================
-- Next steps:
-- 1. Create users via Supabase Auth Dashboard or signup flow
-- 2. Update sample data with actual user IDs
-- 3. Test the voting flow end-to-end
-- =====================================================
