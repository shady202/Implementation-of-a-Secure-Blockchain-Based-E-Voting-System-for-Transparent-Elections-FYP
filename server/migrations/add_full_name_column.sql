-- Add missing full_name column to voters table
-- Run this in pgAdmin Query Tool

ALTER TABLE voters 
ADD COLUMN full_name VARCHAR(255);

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'voters' 
AND column_name = 'full_name';
