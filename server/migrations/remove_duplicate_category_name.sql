-- Migration: Remove duplicate 'name' column from categories table
-- Keep only 'category_name' as the standard column

-- Step 1: Check if 'name' column exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'categories' 
    AND column_name = 'name'
  ) THEN
    -- Step 2: Copy data from 'name' to 'category_name' if name has any unique data
    UPDATE categories 
    SET category_name = name 
    WHERE category_name IS NULL AND name IS NOT NULL;
    
    -- Step 3: Drop the 'name' column
    ALTER TABLE categories DROP COLUMN name;
    
    RAISE NOTICE 'Dropped duplicate "name" column from categories table';
  ELSE
    RAISE NOTICE 'Column "name" does not exist in categories table';
  END IF;
END $$;

-- Verify the change
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'categories'
ORDER BY ordinal_position;
