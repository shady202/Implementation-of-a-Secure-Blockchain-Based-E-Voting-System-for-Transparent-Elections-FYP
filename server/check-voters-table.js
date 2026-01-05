const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "evoting",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
});

async function checkTable() {
  try {
    console.log("🔍 Checking voters table structure...\n");

    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'voters'
      ORDER BY ordinal_position;
    `);

    console.log("Current columns in voters table:");
    console.log("================================");
    result.rows.forEach((col) => {
      console.log(
        `- ${col.column_name} (${col.data_type}) ${
          col.is_nullable === "NO" ? "NOT NULL" : "NULL"
        }`
      );
    });

    console.log("\n\nExpected columns based on schema.sql:");
    console.log("=====================================");
    const expectedColumns = [
      "id",
      "user_id",
      "student_id",
      "email",
      "password_hash",
      "full_name",
      "wallet_address",
      "department",
      "year_of_study",
      "has_voted",
      "registration_date",
      "voted_at",
      "email_verified",
      "email_otp_hash",
      "email_otp_expires_at",
      "otp_attempts",
      "otp_last_sent_at",
      "last_login_at",
      "created_at",
      "updated_at",
    ];

    const currentColumns = result.rows.map((r) => r.column_name);
    const missing = expectedColumns.filter(
      (col) => !currentColumns.includes(col)
    );

    if (missing.length > 0) {
      console.log("\n⚠️  MISSING COLUMNS:");
      missing.forEach((col) => console.log(`   - ${col}`));
    } else {
      console.log("\n✅ All expected columns are present!");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await pool.end();
  }
}

checkTable();
