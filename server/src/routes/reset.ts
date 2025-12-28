import { Router } from "express";
import { query } from "../db";
import { AuthRequest, requireAdmin } from "../middleware/auth";

const router = Router();

// Reset entire system - clears all data from database
router.post("/", async (req: AuthRequest, res) => {
  try {
    console.log("🔄 Resetting entire system database...");

    // Delete in correct order (foreign key constraints)
    await query("DELETE FROM candidates");
    await query("DELETE FROM categories");
    await query("DELETE FROM voters");
    await query("DELETE FROM elections");

    console.log("Database reset complete!");

    res.json({
      success: true,
      message: "Database reset successfully",
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
