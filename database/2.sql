-- Migration: Add back 'name' column and sync it with 'category_name'
-- This allows frontend to use either column name

-- Step 1: Add 'name' column back if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'categories' 
    AND column_name = 'name'
  ) THEN
    ALTER TABLE categories ADD COLUMN name VARCHAR(100);
    RAISE NOTICE 'Added "name" column back to categories table';
  ELSE
    RAISE NOTICE 'Column "name" already exists';
  END IF;
END $$;

-- Step 2: Sync 'name' with 'category_name' for existing records
UPDATE categories 
SET name = category_name 
WHERE name IS NULL OR name = '';

-- Step 3: Create trigger to keep both columns in sync
CREATE OR REPLACE FUNCTION sync_category_name()
RETURNS TRIGGER AS $$
BEGIN
  -- When category_name is set, copy to name
  IF NEW.category_name IS NOT NULL THEN
    NEW.name := NEW.category_name;
  END IF;
  
  -- When name is set, copy to category_name
  IF NEW.name IS NOT NULL AND NEW.category_name IS NULL THEN
    NEW.category_name := NEW.name;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS sync_category_name_trigger ON categories;
CREATE TRIGGER sync_category_name_trigger
  BEFORE INSERT OR UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION sync_category_name();

-- Verify the change
SELECT 
  column_name, 
  data_type
FROM information_schema.columns
WHERE table_name = 'categories'
AND column_name IN ('name', 'category_name')
ORDER BY column_name;
