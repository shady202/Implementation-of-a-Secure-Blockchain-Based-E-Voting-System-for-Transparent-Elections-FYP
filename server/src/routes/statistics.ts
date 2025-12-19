import { Router } from "express";
import { query } from "../db";

const router = Router();

// Get dashboard statistics
router.get("/", async (req, res) => {
  try {
    // Get election settings
    const settingsResult = await query(
      "SELECT value FROM system_settings WHERE key = 'election_settings'"
    );
    const settings = settingsResult.rows[0]?.value || {};

    // Get active election
    const activeElection = await query(
      "SELECT id, title, start_time, end_time FROM elections WHERE is_active = true ORDER BY created_at DESC LIMIT 1"
    );

    // Get voter counts
    const votersCount = await query("SELECT COUNT(*) FROM voters");
    const votedCount = await query(
      "SELECT COUNT(*) FROM voters WHERE has_voted = true"
    );
    const candidatesCount = await query("SELECT COUNT(*) FROM candidates");

    const stats = {
      totalVoters: 500, // Fixed total as per original
      registeredVoters: parseInt(votersCount.rows[0].count),
      votesCount: parseInt(votedCount.rows[0].count),
      candidatesCount: parseInt(candidatesCount.rows[0].count),
      electionStatus: settings.status || "Not Started",
      electionTitle:
        settings.title || activeElection.rows[0]?.title || "Election",
      startDate: settings.startDate || activeElection.rows[0]?.start_time || "",
      endDate: settings.endDate || activeElection.rows[0]?.end_time || "",
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// Get recent activities from audit logs
router.get("/activities", async (req, res) => {
  try {
    const result = await query(
      `SELECT id, action as type, details->>'description' as description, created_at as timestamp
       FROM audit_logs
       ORDER BY created_at DESC
       LIMIT 20`
    );

    const activities = result.rows.map((row) => ({
      id: row.id,
      type: row.type || "event",
      description: row.description || "",
      timestamp: row.timestamp,
    }));

    res.json({ activities });
  } catch (error) {
    console.error("Error fetching activities:", error);
    // Return empty array on error
    res.json({ activities: [] });
  }
});

export default router;
