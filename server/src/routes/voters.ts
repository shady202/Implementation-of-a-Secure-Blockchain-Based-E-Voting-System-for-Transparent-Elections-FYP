import { Router } from "express";
import { query } from "../db";
import { AuthRequest, requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

// Register a new voter
router.post("/register-voter", async (req: AuthRequest, res) => {
  try {
    const { studentId, walletAddress, department, year, fullName } = req.body;

    console.log("📝 Registering voter:");
    console.log("  - studentId:", studentId);
    console.log("  - walletAddress:", walletAddress);
    console.log("  - department:", department);
    console.log("  - year:", year);

    if (!studentId || !walletAddress || !department || year === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if voter already exists
    const exists = await query(
      "SELECT id FROM voters WHERE student_id = $1 OR wallet_address = $2 LIMIT 1",
      [studentId, walletAddress]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ error: "Voter already registered" });
    }

    // Insert new voter (matching actual database schema)
    const result = await query(
      `INSERT INTO voters (student_id, wallet_address, department, year_of_study, full_name, has_voted, registration_date, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, false, NOW(), NOW(), NOW())
       RETURNING *`,
      [studentId, walletAddress, department, year, fullName || ""]
    );

    console.log("✅ Voter registered:", result.rows[0].id);

    res.json({ success: true, voter: result.rows[0] });
  } catch (error: any) {
    console.error("❌ Error registering voter:");
    console.error("Error message:", error?.message);
    console.error("Error detail:", error?.detail);
    console.error("Error column:", error?.column);
    console.error("Error constraint:", error?.constraint);
    console.error("Error stack:", error?.stack);
    res.status(500).json({
      error: "Failed to register voter",
      details: error?.message || "Unknown error",
      column: error?.column,
      constraint: error?.constraint,
    });
  }
});

// Get all voters (admin only)
router.get("/", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const result = await query(
      "SELECT * FROM voters ORDER BY registration_date DESC"
    );

    res.json({ voters: result.rows });
  } catch (error) {
    console.error("Error fetching voters:", error);
    res.status(500).json({ error: "Failed to fetch voters" });
  }
});

// Check voter registration by wallet address
router.get("/:walletAddress", async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const result = await query(
      "SELECT * FROM voters WHERE LOWER(wallet_address) = LOWER($1) LIMIT 1",
      [walletAddress]
    );

    if (result.rows.length === 0) {
      return res.json({ registered: false });
    }

    res.json({ registered: true, voter: result.rows[0] });
  } catch (error) {
    console.error("Error checking voter:", error);
    res.status(500).json({ error: "Failed to check voter registration" });
  }
});

// Mark voter as voted
router.post("/mark-voted", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address required" });
    }

    const voter = await query(
      "SELECT id, student_id, has_voted FROM voters WHERE wallet_address = $1 LIMIT 1",
      [walletAddress]
    );

    if (voter.rows.length === 0) {
      return res.status(404).json({ error: "Voter not found" });
    }

    await query(
      "UPDATE voters SET has_voted = true, voted_at = NOW() WHERE id = $1",
      [voter.rows[0].id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Error marking voter as voted:", error);
    res.status(500).json({ error: "Failed to mark voter as voted" });
  }
});

export default router;
