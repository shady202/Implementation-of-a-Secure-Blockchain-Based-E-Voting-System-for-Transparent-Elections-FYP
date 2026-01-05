const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "evoting",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
});

async function migrate() {
  const client = await pool.connect();

  try {
    console.log("🔧 Starting capacity testing migration...\n");

    // Step 1: Add last_login_at column to voters table
    console.log("1️⃣  Adding last_login_at column to voters table...");
    await client.query(`
      ALTER TABLE voters 
      ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;
    `);
    console.log("✅ Column added successfully\n");

    // Step 2: Create capacity testing settings
    console.log("2️⃣  Creating capacity testing settings...");
    await client.query(`
      INSERT INTO system_settings (key, value, updated_at)
      VALUES 
        ('capacity_testing_enabled', 'false', NOW()),
        ('max_concurrent_users', '10', NOW())
      ON CONFLICT (key) DO NOTHING;
    `);
    console.log("✅ Settings created successfully\n");

    // Step 3: Verify settings
    console.log("3️⃣  Verifying settings...");
    const result = await client.query(`
      SELECT key, value FROM system_settings 
      WHERE key IN ('capacity_testing_enabled', 'max_concurrent_users')
      ORDER BY key;
    `);

    console.log("📋 Current capacity settings:");
    result.rows.forEach((row) => {
      console.log(`   - ${row.key}: ${row.value}`);
    });

    console.log("\n✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
