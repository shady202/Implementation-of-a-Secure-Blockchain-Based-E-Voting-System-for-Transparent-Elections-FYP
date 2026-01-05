const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "postgres",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
});

async function removeCapacitySetting() {
  try {
    console.log("🗑️  Removing max_concurrent_users setting from database...\n");

    const result = await pool.query(
      "DELETE FROM system_settings WHERE key = 'max_concurrent_users'"
    );

    if (result.rowCount > 0) {
      console.log("✅ Successfully removed max_concurrent_users setting");
    } else {
      console.log(
        "ℹ️  No max_concurrent_users setting found (already removed)"
      );
    }

    // Verify it's gone
    const checkResult = await pool.query(
      "SELECT * FROM system_settings WHERE key = 'max_concurrent_users'"
    );

    if (checkResult.rows.length === 0) {
      console.log("✅ Verified: max_concurrent_users setting is removed\n");
    } else {
      console.log("⚠️  Warning: Setting still exists in database\n");
    }
  } catch (error) {
    console.error("❌ Error removing capacity setting:", error);
  } finally {
    await pool.end();
  }
}

removeCapacitySetting();
