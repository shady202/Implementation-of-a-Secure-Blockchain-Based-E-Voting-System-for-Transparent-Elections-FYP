-- Fix year_of_study column to accept text
-- First, find and drop any CHECK constraints
-- Run this in pgAdmin Query Tool

-- Step 1: Find the constraint name (run this first to see what constraints exist)
SELECT conname, contype, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'voters'::regclass 
AND contype = 'c';

-- Step 2: Drop the constraint (replace 'constraint_name' with the actual name from Step 1)
-- Example: ALTER TABLE voters DROP CONSTRAINT voters_year_of_study_check;
-- Uncomment and run this after finding the constraint name:
-- ALTER TABLE voters DROP CONSTRAINT your_constraint_name_here;

-- Step 3: Change column type to VARCHAR
ALTER TABLE voters 
ALTER COLUMN year_of_study TYPE VARCHAR(50);

-- Step 4: Verify the change
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'voters' 
AND column_name = 'year_of_study';
