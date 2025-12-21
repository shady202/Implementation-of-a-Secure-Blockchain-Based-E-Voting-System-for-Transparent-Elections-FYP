import { Router } from "express";
import { query } from "../db";

const router = Router();

// GET /api/admin/activities - Fetch recent activities (last hour by default)
router.get("/activities", async (req, res) => {
  try {
    const hours = parseInt(req.query.hours as string) || 1;
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hours);

    // Fetch recent audit logs from the last hour
    const result = await query(
      `SELECT 
        id, 
        action as type, 
        COALESCE(description, details->>'description', action) as description,
        created_at as timestamp
       FROM audit_logs
       WHERE created_at >= $1
       ORDER BY created_at DESC
       LIMIT 30`,
      [cutoffTime]
    );

    const activities = result.rows.map((row) => ({
      id: row.id,
      type: row.type || "event",
      description: row.description || "Activity",
      timestamp: row.timestamp,
    }));

    res.json({ activities });
  } catch (error) {
    console.error("Error fetching activities:", error);
    // Return empty array on error to prevent UI crashes
    res.json({ activities: [] });
  }
});

// GET /api/admin/voters - Fetch all registered voters with vote status
router.get("/voters", async (req, res) => {
  try {
    const result = await query(
      `SELECT 
        id,
        student_id,
        wallet_address,
        department,
        registration_date,
        has_voted
       FROM voters
       ORDER BY registration_date DESC`
    );

    const voters = result.rows.map((row) => ({
      id: row.id,
      studentId: row.student_id,
      walletAddress: row.wallet_address,
      department: row.department,
      registrationDate: row.registration_date,
      hasVoted: row.has_voted,
    }));

    res.json({ voters });
  } catch (error) {
    console.error("Error fetching voters:", error);
    res.status(500).json({ error: "Failed to fetch voters" });
  }
});

export default router;
