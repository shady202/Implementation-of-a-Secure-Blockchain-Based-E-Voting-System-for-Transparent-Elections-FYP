import { query } from "./db";
import { generateOtp, hashOtp } from "./utils/otp";

async function runMigration() {
  console.log("🔄 Running OTP verification migration...\n");

  try {
    // Add email column
    console.log("📝 Adding email column...");
    await query(`
      ALTER TABLE voters 
      ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;
    `);

    // Add password_hash column
    console.log("📝 Adding password_hash column...");
    await query(`
      ALTER TABLE voters 
      ADD COLUMN IF NOT EXISTS password_hash TEXT;
    `);

    // Add OTP verification columns
    console.log("📝 Adding OTP verification columns...");

    await query(`
      ALTER TABLE voters
      ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
    `);

    await query(`
      ALTER TABLE voters
      ADD COLUMN IF NOT EXISTS email_otp_hash TEXT;
    `);

    await query(`
      ALTER TABLE voters
      ADD COLUMN IF NOT EXISTS email_otp_expires_at TIMESTAMP WITH TIME ZONE;
    `);

    await query(`
      ALTER TABLE voters
      ADD COLUMN IF NOT EXISTS otp_attempts INTEGER DEFAULT 0;
    `);

    await query(`
      ALTER TABLE voters
      ADD COLUMN IF NOT EXISTS otp_last_sent_at TIMESTAMP WITH TIME ZONE;
    `);

    // Create index on email
    console.log("📝 Creating email index...");
    await query(`
      CREATE INDEX IF NOT EXISTS idx_voters_email ON voters(email);
    `);

    console.log("\n✅ Migration completed successfully!");
    console.log("\n📌 OTP Email Verification System Ready");
    console.log("  - Email field added for voter login");
    console.log("  - OTP verification columns added");
    console.log("  - Ready to send verification codes!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
