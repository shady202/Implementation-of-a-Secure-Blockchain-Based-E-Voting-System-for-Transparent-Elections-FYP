import { Router } from "express";
import { query } from "../db";
import { verifyPassword } from "../utils/crypto";

const router = Router();

// POST /api/admin/login - Authenticate admin with email and password
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find admin by email
    const result = await query(
      `SELECT 
        id, 
        user_id, 
        email, 
        password_hash, 
        wallet_address, 
        role, 
        is_active 
       FROM admins 
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const admin = result.rows[0];

    // Check if admin is active
    if (!admin.is_active) {
      return res.status(403).json({
        success: false,
        message: "Admin account is deactivated",
      });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, admin.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Return admin info (without password hash)
    res.json({
      success: true,
      admin: {
        id: admin.id,
        userId: admin.user_id,
        email: admin.email,
        walletAddress: admin.wallet_address,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// POST /api/admin/verify-wallet - Verify wallet address matches admin
router.post("/verify-wallet", async (req, res) => {
  try {
    const { email, walletAddress } = req.body;

    if (!email || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: "Email and wallet address are required",
      });
    }

    // Type validation
    if (typeof email !== "string" || typeof walletAddress !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid input types",
      });
    }

    // Find admin and verify wallet
    const result = await query(
      `SELECT 
        id, 
        email, 
        wallet_address 
       FROM admins 
       WHERE email = $1 AND is_active = true`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const admin = result.rows[0];

    // Compare wallet addresses (case-insensitive)
    const isWalletValid =
      admin.wallet_address.toLowerCase() === walletAddress.toLowerCase();

    if (!isWalletValid) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized wallet address",
        expectedWallet: admin.wallet_address.substring(0, 10) + "...", // Hint without revealing full address
      });
    }

    res.json({
      success: true,
      message: "Wallet verified successfully",
    });
  } catch (error) {
    console.error("Wallet verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

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

// POST /api/admin/log-activity - Log activity to audit logs
router.post("/log-activity", async (req, res) => {
  try {
    const { action, description } = req.body;

    if (!action || !description) {
      return res.status(400).json({
        error: "Action and description are required",
      });
    }

    await query(
      `INSERT INTO audit_logs (action, description, created_at)
       VALUES ($1, $2, NOW())`,
      [action, description]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Error logging activity:", error);
    res.status(500).json({ error: "Failed to log activity" });
  }
});

// GET /api/admin/active-users - Get count and list of currently active users
router.get("/active-users", async (req, res) => {
  try {
    // Get capacity settings
    const settingsResult = await query(
      "SELECT value FROM system_settings WHERE key = 'capacity_testing_enabled' OR key = 'max_concurrent_users'"
    );

    let capacityEnabled = false;
    let maxUsers = 0;

    settingsResult.rows.forEach((row) => {
      if (row.value?.capacity_testing_enabled !== undefined) {
        capacityEnabled = row.value.capacity_testing_enabled;
      }
      if (row.value?.max_concurrent_users !== undefined) {
        maxUsers = row.value.max_concurrent_users;
      }
    });

    // Get active users (logged in within last 15 minutes for real-time tracking)
    const activeUsersResult = await query(
      `SELECT 
        student_id,
        email,
        full_name,
        last_login_at,
        has_voted
       FROM voters 
       WHERE last_login_at > NOW() - INTERVAL '15 minutes'
       ORDER BY last_login_at DESC`
    );

    const activeCount = activeUsersResult.rows.length;
    const activeUsers = activeUsersResult.rows.map((user) => ({
      studentId: user.student_id,
      email: user.email,
      fullName: user.full_name,
      lastLoginAt: user.last_login_at,
      hasVoted: user.has_voted,
    }));

    res.json({
      success: true,
      capacityEnabled,
      maxUsers,
      activeCount,
      availableSlots: capacityEnabled
        ? Math.max(0, maxUsers - activeCount)
        : null,
      isAtCapacity: capacityEnabled ? activeCount >= maxUsers : false,
      activeUsers,
    });
  } catch (error) {
    console.error("Error fetching active users:", error);
    res.status(500).json({ error: "Failed to fetch active users" });
  }
});

// GET /api/admin/capacity-status - Quick capacity status check
router.get("/capacity-status", async (req, res) => {
  try {
    // Get capacity settings
    const settingsResult = await query(
      "SELECT value FROM system_settings WHERE key = 'capacity_testing_enabled' OR key = 'max_concurrent_users'"
    );

    let capacityEnabled = false;
    let maxUsers = 0;

    settingsResult.rows.forEach((row) => {
      if (row.value?.capacity_testing_enabled !== undefined) {
        capacityEnabled = row.value.capacity_testing_enabled;
      }
      if (row.value?.max_concurrent_users !== undefined) {
        maxUsers = row.value.max_concurrent_users;
      }
    });

    // Count active users
    const countResult = await query(
      `SELECT COUNT(*) as count 
       FROM voters 
       WHERE last_login_at > NOW() - INTERVAL '24 hours'`
    );

    const activeCount = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      enabled: capacityEnabled,
      maxUsers,
      activeCount,
      availableSlots: capacityEnabled
        ? Math.max(0, maxUsers - activeCount)
        : null,
      isAtCapacity: capacityEnabled ? activeCount >= maxUsers : false,
      utilizationPercent:
        capacityEnabled && maxUsers > 0
          ? Math.round((activeCount / maxUsers) * 100)
          : 0,
    });
  } catch (error) {
    console.error("Error fetching capacity status:", error);
    res.status(500).json({ error: "Failed to fetch capacity status" });
  }
});

// GET /api/admin/capacity-settings - Get capacity testing settings
router.get("/capacity-settings", async (req, res) => {
  try {
    const result = await query(
      "SELECT key, value FROM system_settings WHERE key IN ('capacity_testing_enabled', 'max_concurrent_users')"
    );

    let capacityEnabled = false;
    let maxUsers = 2;

    result.rows.forEach((row) => {
      if (row.key === "capacity_testing_enabled") {
        capacityEnabled = row.value === "true" || row.value === true;
      } else if (row.key === "max_concurrent_users") {
        maxUsers = parseInt(row.value, 10);
      }
    });

    res.json({
      success: true,
      capacityTestingEnabled: capacityEnabled,
      maxConcurrentUsers: maxUsers,
    });
  } catch (error) {
    console.error("Error fetching capacity settings:", error);
    res.status(500).json({ error: "Failed to fetch capacity settings" });
  }
});

// POST /api/admin/capacity-settings - Save capacity testing settings
router.post("/capacity-settings", async (req, res) => {
  try {
    const { capacityTestingEnabled, maxConcurrentUsers } = req.body;

    console.log("💾 Saving capacity settings:", {
      capacityTestingEnabled,
      maxConcurrentUsers,
    });

    // Upsert capacity_testing_enabled
    await query(
      `INSERT INTO system_settings (key, value, updated_at)
       VALUES ('capacity_testing_enabled', $1, NOW())
       ON CONFLICT (key) 
       DO UPDATE SET value = $1, updated_at = NOW()`,
      [capacityTestingEnabled ? "true" : "false"]
    );

    // Upsert max_concurrent_users
    await query(
      `INSERT INTO system_settings (key, value, updated_at)
       VALUES ('max_concurrent_users', $1, NOW())
       ON CONFLICT (key) 
       DO UPDATE SET value = $1, updated_at = NOW()`,
      [maxConcurrentUsers.toString()]
    );

    console.log("✅ Capacity settings saved successfully");

    res.json({
      success: true,
      message: "Capacity settings saved successfully",
    });
  } catch (error) {
    console.error("❌ Error saving capacity settings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save capacity settings",
    });
  }
});

// POST /api/admin/clear-sessions - Clear all active login sessions (for capacity testing)
router.post("/clear-sessions", async (req, res) => {
  try {
    console.log("🔄 Clearing all active login sessions...");

    // Clear all last_login_at timestamps
    await query("UPDATE voters SET last_login_at = NULL");

    console.log("✅ All active sessions cleared!");

    res.json({
      success: true,
      message: "All active sessions cleared successfully",
    });
  } catch (error) {
    console.error("❌ Error clearing sessions:", error);
    res.status(500).json({
      success: false,
      error: "Failed to clear sessions",
    });
  }
});

export default router;
