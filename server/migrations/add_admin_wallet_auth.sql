-- =====================================================
-- Add Admin Wallet Authentication
-- Migration to add wallet_address and password_hash to admins table
-- =====================================================

-- Add wallet_address column
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS wallet_address VARCHAR(42) UNIQUE;

-- Add password_hash column
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Add email column if it doesn't exist
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;

-- Add constraint to validate Ethereum wallet address format
ALTER TABLE admins
ADD CONSTRAINT valid_admin_wallet_address 
CHECK (wallet_address ~ '^0x[a-fA-F0-9]{40}$');

-- Add NOT NULL constraint after populating data
-- (Will be applied after data migration in seed script)

SELECT 'Admin wallet authentication schema updated!' as message;
