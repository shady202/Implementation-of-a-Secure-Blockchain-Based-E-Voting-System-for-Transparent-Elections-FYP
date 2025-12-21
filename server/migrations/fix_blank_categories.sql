-- Fix: Sync existing categories so both name and category_name have values
-- Run this in pgAdmin to fix the blank tabs issue

-- Step 1: Fill the 'name' column with category_name values
UPDATE categories 
SET name = category_name 
WHERE name IS NULL OR name = '';

-- Step 2: Also ensure category_name is filled from name if needed
UPDATE categories 
SET category_name = name 
WHERE category_name IS NULL OR category_name = '';

-- Step 3: Verify both columns have data now
SELECT 
  id,
  category_name,
  name,
  description
FROM categories
ORDER BY created_at;
