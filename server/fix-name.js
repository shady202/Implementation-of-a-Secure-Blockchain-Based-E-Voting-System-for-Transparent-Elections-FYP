const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "postgres",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
});

async function fixUserName() {
  // Fix TP000010's name
  const result = await pool.query(
    "UPDATE voters SET full_name = 'Student Shady Omar' WHERE student_id = 'TP000010' RETURNING student_id, full_name"
  );

  if (result.rows.length > 0) {
    console.log("✅ Fixed user name:", result.rows[0]);
  } else {
    console.log("❌ User TP000010 not found");
  }

  await pool.end();
}

fixUserName().catch(console.error);
