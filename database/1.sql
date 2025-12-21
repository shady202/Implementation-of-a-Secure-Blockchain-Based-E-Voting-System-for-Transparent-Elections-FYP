SELECT 
  'Voters' as table_name, COUNT(*) as count FROM voters
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Candidates', COUNT(*) FROM candidates
UNION ALL
SELECT 'Audit Logs', COUNT(*) FROM audit_logs;



DELETE FROM elections WHERE title = 'Student Council Election 2025';



ALTER TABLE categories 
ALTER COLUMN election_id DROP NOT NULL;


ALTER TABLE voters DROP CONSTRAINT voters_year_of_study_check;
ALTER TABLE voters ALTER COLUMN year_of_study TYPE VARCHAR(50);




ALTER TABLE voters 
ALTER COLUMN year_of_study TYPE VARCHAR(50);



DELETE FROM voters;




ALTER TABLE voters ADD COLUMN full_name VARCHAR(255);




DELETE FROM voters;
DELETE FROM candidates;
DELETE FROM categories;
DELETE FROM elections;

