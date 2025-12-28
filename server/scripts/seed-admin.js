"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = seedAdmin;
const db_1 = require("../src/db");
const crypto_1 = require("../src/utils/crypto");
/**
 * Seed initial admin account with wallet authentication
 */
async function seedAdmin() {
    try {
        console.log("🔐 Seeding admin account...");
        // Admin credentials
        const adminEmail = "admin@apu.edu.my";
        const adminPassword = "admin123";
        const adminWallet = "0x30D336E13fac19C61c116431d44adbD98c386d5d";
        // Hash the password
        const passwordHash = await (0, crypto_1.hashPassword)(adminPassword);
        // Check if admin already exists
        const existingAdmin = await (0, db_1.query)("SELECT id FROM admins WHERE email = $1 OR wallet_address = $2", [adminEmail, adminWallet]);
        if (existingAdmin.rows.length > 0) {
            console.log("⚠️  Admin already exists, updating credentials...");
            // Update existing admin
            await (0, db_1.query)(`UPDATE admins 
         SET email = $1, 
             password_hash = $2, 
             wallet_address = $3,
             updated_at = NOW()
         WHERE email = $1 OR wallet_address = $3`, [adminEmail, passwordHash, adminWallet]);
            console.log("✅ Admin credentials updated successfully!");
        }
        else {
            console.log("➕ Creating new admin account...");
            // Insert new admin
            await (0, db_1.query)(`INSERT INTO admins (
          user_id, 
          email, 
          password_hash, 
          wallet_address, 
          role, 
          is_active
        ) VALUES ($1, $2, $3, $4, $5, $6)`, [
                "admin-001",
                adminEmail,
                passwordHash,
                adminWallet,
                "election_admin",
                true,
            ]);
            console.log("✅ Admin account created successfully!");
        }
        console.log("📧 Email:", adminEmail);
        console.log("🔑 Password: admin123 (hashed in database)");
        console.log("💼 Wallet:", adminWallet);
        return { success: true };
    }
    catch (error) {
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
//# sourceMappingURL=seed-admin.js.map