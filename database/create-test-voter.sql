-- Create test voter with email for OTP testing
-- Password will be 'test123' (bcrypt hash provided)

INSERT INTO voters (
  student_id, 
  email, 
  password_hash, 
  wallet_address, 
  department, 
  year_of_study,
  has_voted
) VALUES (
  'TP073549',
  'TP073549@mail.apu.edu.my',  -- ⚠️ CHANGE THIS TO YOUR REAL EMAIL!
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',  -- password: test123
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
  'IT',
  3,
  FALSE
)
ON CONFLICT (student_id) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash;

-- Verify the voter was created
SELECT student_id, email, email_verified, department 
FROM voters 
WHERE student_id = 'TP073549';
