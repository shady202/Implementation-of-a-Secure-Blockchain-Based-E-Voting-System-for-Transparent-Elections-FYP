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

// POST /api/elections/create - Create new election in database
router.post("/create", async (req, res) => {
  try {
    const { title, description, startDate, endDate, showResultsDuringVoting } =
      req.body;

    if (!title || !startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Title, start date, and end date are required" });
    }

    // Insert into elections table with CORRECT column names
    const result = await query(
      `INSERT INTO elections (
        title,
        description,
        start_time,
        end_time,
        is_active,
        created_at
      ) VALUES ($1, $2, $3, $4, false, NOW())
      RETURNING *`,
      [title, description || null, startDate, endDate]
    );

    const election = result.rows[0];

    // Log audit activity
    await query(
      `INSERT INTO audit_logs (action, description, created_at)
       VALUES ('election_created', $1, NOW())`,
      [`Election "${title}" created`]
    );

    res.json({
      success: true,
      election: {
        id: election.id,
        title: election.title,
        startTime: election.start_time,
        endTime: election.end_time,
        isActive: election.is_active,
      },
    });
  } catch (error) {
    console.error("Error creating election:", error);
    res.status(500).json({ error: "Failed to create election" });
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

// Start election - set is_active = true in database
router.post("/start", async (req, res) => {
  try {
    // Set the most recent election to active
    await query(
      `UPDATE elections 
       SET is_active = true 
       WHERE id = (SELECT id FROM elections ORDER BY created_at DESC LIMIT 1)`
    );

    res.json({ success: true, message: "Election activated in database" });
  } catch (error) {
    console.error("Error starting election:", error);
    res.status(500).json({ error: "Failed to start election" });
  }
});

// End election - set is_active = false in database
router.post("/end", async (req, res) => {
  try {
    // Set all elections to inactive
    await query(`UPDATE elections SET is_active = false`);

    res.json({ success: true, message: "Election deactivated in database" });
  } catch (error) {
    console.error("Error ending election:", error);
    res.status(500).json({ error: "Failed to end election" });
  }
});

// Get active election
router.get("/active", optionalAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, title, description, start_time, end_time, is_active, created_at
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

// Get current/active election (alias for /active)
router.get("/current", optionalAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, title, description, start_time, end_time, is_active, created_at
       FROM elections
       WHERE is_active = true
       ORDER BY created_at DESC
       LIMIT 1`
    );

    if (result.rows.length === 0) {
      return res.json({ election: null });
    }

    res.json({
      election: {
        id: result.rows[0].id,
        title: result.rows[0].title,
        description: result.rows[0].description,
        startTime: result.rows[0].start_time,
        endTime: result.rows[0].end_time,
        isActive: result.rows[0].is_active,
      },
    });
  } catch (error) {
    console.error("Error fetching current election:", error);
    res.status(500).json({ error: "Failed to fetch current election" });
  }
});

// Get latest election (including Setup Phase) - for mobile devices
router.get("/latest", optionalAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, title, description, start_time, end_time, is_active, created_at
       FROM elections
       ORDER BY created_at DESC
       LIMIT 1`
    );

    if (result.rows.length === 0) {
      return res.json({ election: null });
    }

    const election = result.rows[0];

    // Determine status based on is_active and dates
    let status = "Setup Phase";
    if (election.is_active) {
      const now = new Date();
      const endTime = new Date(election.end_time);
      status = now > endTime ? "Ended" : "Active";
    }

    res.json({
      election: {
        id: election.id,
        title: election.title,
        description: election.description,
        startTime: election.start_time,
        endTime: election.end_time,
        isActive: election.is_active,
        status: status,
      },
    });
  } catch (error) {
    console.error("Error fetching latest election:", error);
    res.status(500).json({ error: "Failed to fetch latest election" });
  }
});

export default router;
