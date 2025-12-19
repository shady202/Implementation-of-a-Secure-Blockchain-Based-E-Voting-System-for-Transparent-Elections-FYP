const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "evoting",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
});

async function migrate() {
  console.log("🔄 Running database migration...\n");

  try {
    // Test connection
    await pool.query("SELECT NOW()");
    console.log("✅ Database connection successful");

    // Read schema file
    const schemaPath = path.join(__dirname, "../schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    console.log("📝 Executing schema...");
    await pool.query(schema);

    console.log("\n✅ Migration completed successfully!");
    console.log("\n📊 Database tables created:");
    console.log("   - voters");
    console.log("   - elections");
    console.log("   - categories");
    console.log("   - candidates");
    console.log("   - votes");
    console.log("   - admins");
    console.log("   - audit_logs");
    console.log("   - system_settings");

    console.log("\n🎯 Next step: Start the server with: npm run dev\n");
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    console.error("\nPlease check:");
    console.error("  1. PostgreSQL is running");
    console.error("  2. Database credentials in .env are correct");
    console.error('  3. Database "evoting" exists\n');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
