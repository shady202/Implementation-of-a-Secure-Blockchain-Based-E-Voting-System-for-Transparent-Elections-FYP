-- Migration: Remove unused columns from candidates table
-- Created: 2025-12-28

-- Step 1: Remove user_id column
ALTER TABLE candidates 
DROP COLUMN IF EXISTS user_id;

-- Step 2: Remove candidate_number column
ALTER TABLE candidates 
DROP COLUMN IF EXISTS candidate_number;

-- Step 3: Remove manifesto column
ALTER TABLE candidates 
DROP COLUMN IF EXISTS manifesto;

-- Step 4: Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'candidates'
ORDER BY ordinal_position;
