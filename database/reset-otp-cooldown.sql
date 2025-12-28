-- Clear OTP cooldown timer for testing
UPDATE voters 
SET otp_last_sent_at = NULL,
    otp_attempts = 0
WHERE student_id = 'TP073549';

-- Verify
SELECT student_id, email, otp_last_sent_at, otp_attempts 
FROM voters 
WHERE student_id = 'TP073549';
