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

export default router;
