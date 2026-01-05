// Quick script to reset active sessions for capacity testing
import { query } from "./src/db.js";

async function resetSessions() {
  try {
    console.log("🔄 Resetting all active sessions...");

    // Clear all last_login_at timestamps
    await query("UPDATE voters SET last_login_at = NULL");

    console.log("✅ All sessions cleared!");
    console.log("📊 You can now test capacity limiting from scratch");

    // Show current state
    const result = await query(
      "SELECT student_id, last_login_at FROM voters ORDER BY student_id"
    );
    console.log("\n📋 Current voters:");
    result.rows.forEach((row) => {
      console.log(
        `  - ${row.student_id}: ${row.last_login_at || "No active session"}`
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

resetSessions();
