import { query } from "../src/db";
import { hashPassword } from "../src/utils/crypto";

/**
 * Seed initial admin account with wallet authentication
 */
export async function seedAdmin() {
  try {
    console.log("🔐 Seeding admin account...");

    // Admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL || "admin@apu.edu.my";
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminWallet = process.env.ADMIN_WALLET || "0x30D336E13fac19C61c116431d44adbD98c386d5d";

    if (!adminPassword) {
      throw new Error("ADMIN_PASSWORD environment variable is required");
    }

    // Hash the password
    const passwordHash = await hashPassword(adminPassword);

    // Check if admin already exists
    const existingAdmin = await query(
      "SELECT id FROM admins WHERE email = $1 OR wallet_address = $2",
      [adminEmail, adminWallet]
    );

    if (existingAdmin.rows.length > 0) {
      console.log("⚠️  Admin already exists, updating credentials...");

      // Update existing admin
      await query(
        `UPDATE admins 
         SET email = $1, 
             password_hash = $2, 
             wallet_address = $3,
             updated_at = NOW()
         WHERE email = $1 OR wallet_address = $3`,
        [adminEmail, passwordHash, adminWallet]
      );

      console.log("✅ Admin credentials updated successfully!");
    } else {
      console.log("➕ Creating new admin account...");

      // Insert new admin
      await query(
        `INSERT INTO admins (
          user_id, 
          email, 
          password_hash, 
          wallet_address, 
          role, 
          is_active
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          "admin-001",
          adminEmail,
          passwordHash,
          adminWallet,
          "election_admin",
          true,
        ]
      );

      console.log("✅ Admin account created successfully!");
    }

    console.log("📧 Email:", adminEmail);
    console.log("🔑 Password: admin123 (hashed in database)");
    console.log("💼 Wallet:", adminWallet);

    return { success: true };
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedAdmin()
    .then(() => {
      console.log("✅ Admin seeding complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Admin seeding failed:", error);
      process.exit(1);
    });
}
