-- =====================================================
-- Add OTP Email Verification to Voters
-- Migration to add email, password, and OTP fields
-- =====================================================

-- Add email column
ALTER TABLE voters 
ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;

-- Add password_hash column
ALTER TABLE voters 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Add OTP verification columns
ALTER TABLE voters
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

ALTER TABLE voters
ADD COLUMN IF NOT EXISTS email_otp_hash TEXT;

ALTER TABLE voters
ADD COLUMN IF NOT EXISTS email_otp_expires_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE voters
ADD COLUMN IF NOT EXISTS otp_attempts INTEGER DEFAULT 0;

ALTER TABLE voters
ADD COLUMN IF NOT EXISTS otp_last_sent_at TIMESTAMP WITH TIME ZONE;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_voters_email ON voters(email);

SELECT 'OTP email verification schema updated!' as message;
