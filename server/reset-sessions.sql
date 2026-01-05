-- Reset all active sessions for capacity testing
-- This clears the last_login_at timestamps so you can start fresh

UPDATE voters SET last_login_at = NULL;

-- Verify the reset
SELECT student_id, last_login_at FROM voters ORDER BY student_id;
