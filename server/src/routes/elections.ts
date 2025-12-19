import { Router } from "express";
import { query } from "../db";
import { AuthRequest, requireAdmin, optionalAuth } from "../middleware/auth";

const router = Router();

// Get election settings from system_settings table
router.get("/election-settings", async (req, res) => {
  try {
    const result = await query(
      "SELECT value FROM system_settings WHERE key = 'election_settings'"
    );

    const defaults = {
      title: "Student Council Election",
      startDate: "",
      endDate: "",
      requireIdVerification: true,
      showResultsDuringVoting: false,
      status: "Not Started",
      updatedAt: "",
    };

    const settings = result.rows[0]?.value || {};
    res.json({ ...defaults, ...settings });
  } catch (error) {
    console.error("Error fetching election settings:", error);
    res.status(500).json({ error: "Failed to fetch election settings" });
  }
});

// Update election settings (admin only)
router.post(
  "/election-settings",
  requireAdmin,
  async (req: AuthRequest, res) => {
    try {
      const {
        title,
        startDate,
        endDate,
        requireIdVerification,
        showResultsDuringVoting,
      } = req.body;

      // Get current settings
      const current = await query(
        "SELECT value FROM system_settings WHERE key = 'election_settings'"
      );
      const prev = current.rows[0]?.value || {};

      const next = {
        ...prev,
        title: title ?? prev.title,
        startDate: startDate ?? prev.startDate,
        endDate: endDate ?? prev.endDate,
        requireIdVerification:
          requireIdVerification ?? prev.requireIdVerification ?? true,
        showResultsDuringVoting:
          showResultsDuringVoting ?? prev.showResultsDuringVoting ?? false,
        updatedAt: new Date().toISOString(),
      };

      // Upsert settings
      await query(
        `INSERT INTO system_settings (key, value, updated_at)
       VALUES ('election_settings', $1, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
        [JSON.stringify(next)]
      );

      res.json({ success: true, settings: next });
    } catch (error) {
      console.error("Error updating election settings:", error);
      res.status(500).json({ error: "Failed to update election settings" });
    }
  }
);

// Update election status (admin only)
router.post("/election-status", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    // Get current settings
    const current = await query(
      "SELECT value FROM system_settings WHERE key = 'election_settings'"
    );
    const prev = current.rows[0]?.value || {};

    const next = {
      ...prev,
      status,
      updatedAt: new Date().toISOString(),
    };

    await query(
      `INSERT INTO system_settings (key, value, updated_at)
       VALUES ('election_settings', $1, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
      [JSON.stringify(next)]
    );

    res.json({ success: true, status });
  } catch (error) {
    console.error("Error updating election status:", error);
    res.status(500).json({ error: "Failed to update election status" });
  }
});

// Get active election
router.get("/active", optionalAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, title, start_time, end_time, is_active, created_at
       FROM elections
       WHERE is_active = true
       ORDER BY created_at DESC
       LIMIT 1`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No active election found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching active election:", error);
    res.status(500).json({ error: "Failed to fetch active election" });
  }
});

export default router;
