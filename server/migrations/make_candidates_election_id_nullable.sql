-- Make election_id nullable in candidates table
-- Run this in pgAdmin Query Tool

ALTER TABLE candidates 
ALTER COLUMN election_id DROP NOT NULL;

-- Verify the change
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'candidates' 
AND column_name = 'election_id';
