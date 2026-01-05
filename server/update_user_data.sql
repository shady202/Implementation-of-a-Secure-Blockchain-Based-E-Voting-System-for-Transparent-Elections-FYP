-- Update user TP00003 with faculty and year of study data
UPDATE voters 
SET 
  department = 'School of Computing',
  year_of_study = 1
WHERE student_id = 'TP00003';

-- Verify the update
SELECT student_id, full_name, department, year_of_study, email 
FROM voters 
WHERE student_id = 'TP00003';
