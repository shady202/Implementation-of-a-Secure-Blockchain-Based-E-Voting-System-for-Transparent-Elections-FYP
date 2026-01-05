import { Router } from "express";
import { query } from "../db";
import { AuthRequest, requireAdmin } from "../middleware/auth";

const router = Router();

// Reset entire system - clears all data from database
router.post("/", async (req: AuthRequest, res) => {
  try {
    console.log("🔄 Resetting entire system database...");

    // Delete in correct order (foreign key constraints)
    await query("DELETE FROM vote_history");
    await query("DELETE FROM candidates");
    await query("DELETE FROM categories");
    await query("DELETE FROM elections");

    // Delete all voters completely
    await query("DELETE FROM voters");

    console.log("✅ Database reset complete!");
    console.log("✅ All voters, elections, categories, and candidates deleted");

    res.json({
      success: true,
      message: "Database reset successfully - all data cleared",
    });
  } catch (error: any) {
    console.error("❌ Error resetting database:", error?.message);
    res.status(500).json({
      error: "Failed to reset database",
      details: error?.message,
    });
  }
});

export default router;
