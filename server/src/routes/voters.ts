import { Router } from "express";
import { query } from "../db";
import { AuthRequest, requireAuth, requireAdmin } from "../middleware/auth";
import { verifyPassword } from "../utils/crypto";

const router = Router();

// Register a new voter or update wallet for existing account
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
    const existing = await query(
      "SELECT id, wallet_address FROM voters WHERE student_id = $1 LIMIT 1",
      [studentId]
    );

    if (existing.rows.length > 0) {
      const voter = existing.rows[0];

      // Check if current wallet is a placeholder (starts with 0x + hash of studentId)
      const crypto = require("crypto");
      const expectedPlaceholder = `0x${crypto
        .createHash("sha256")
        .update(studentId)
        .digest("hex")
        .substring(0, 40)}`;

      if (voter.wallet_address === expectedPlaceholder) {
        // Update placeholder wallet with real wallet
        console.log("✅ Updating placeholder wallet with real wallet");
        const result = await query(
          `UPDATE voters 
           SET wallet_address = $1, department = $2, year_of_study = $3, updated_at = NOW()
           WHERE student_id = $4
           RETURNING *`,
          [walletAddress, department, year, studentId]
        );

        console.log("✅ Wallet updated for:", studentId);
        return res.json({ success: true, voter: result.rows[0] });
      } else {
        // Already has a real wallet
        return res
          .status(400)
          .json({ error: "Voter already registered with wallet" });
      }
    }

    // New voter - insert
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

// POST /api/voters/register-voter - Register new voter to database
router.post("/register-voter", async (req: AuthRequest, res) => {
  try {
    const { studentId, walletAddress, department, year } = req.body;

    console.log("📝 Registering voter to database:");
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
      return res.status(400).json({
        success: false,
        message: "Voter already registered",
      });
    }

    // Insert new voter
    const result = await query(
      `INSERT INTO voters (student_id, wallet_address, department, year_of_study, has_voted, registration_date, created_at, updated_at)
       VALUES ($1, $2, $3, $4, false, NOW(), NOW(), NOW())
       RETURNING *`,
      [studentId, walletAddress, department, year]
    );

    console.log("✅ Voter registered:", result.rows[0].id);

    res.json({ success: true, voter: result.rows[0] });
  } catch (error: any) {
    console.error("❌ Error registering voter:", error);
    res.status(500).json({
      success: false,
      error: "Failed to register voter",
      details: error?.message || "Unknown error",
    });
  }
});

// Login voter (email/password)
router.post("/login", async (req, res) => {
  try {
    const { studentId, password } = req.body;

    if (!studentId || !password) {
      return res.status(400).json({
        success: false,
        message: "Student ID and password are required",
      });
    }

    // Get voter from database with password hash
    const result = await query(
      `SELECT id, student_id, email, wallet_address, department, year_of_study, email_verified, password_hash, full_name
       FROM voters 
       WHERE student_id = $1
       LIMIT 1`,
      [studentId]
    );

    if (result.rows.length === 0) {
      console.log("❌ Voter not found for Student ID:", studentId);
      return res.status(401).json({
        success: false,
        message: "Invalid student ID or password",
      });
    }

    const voter = result.rows[0];
    console.log("✅ Voter found:", voter.student_id, "-", voter.email);

    // Verify password
    if (!voter.password_hash) {
      console.log("❌ No password set for:", studentId);
      return res.status(401).json({
        success: false,
        message: "Account not properly configured. Please contact support.",
      });
    }

    const isPasswordValid = await verifyPassword(password, voter.password_hash);
    if (!isPasswordValid) {
      console.log("❌ Password mismatch for:", studentId);
      return res.status(401).json({
        success: false,
        message: "Invalid student ID or password",
      });
    }

    console.log("✅ Login successful for:", voter.student_id);

    // Parse full_name into firstName and lastName
    const fullName = voter.full_name || "";
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Return voter data for OTP verification
    res.json({
      success: true,
      user: {
        id: voter.id,
        studentId: voter.student_id,
        email: voter.email,
        department: voter.department,
        yearOfStudy: voter.year_of_study,
        walletAddress: voter.wallet_address,
        emailVerified: voter.email_verified,
        firstName,
        lastName,
        role: "student",
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
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
router.post("/mark-voted", async (req: AuthRequest, res) => {
  try {
    const { walletAddress } = req.body;

    console.log("🔔 MARK-VOTED endpoint called for wallet:", walletAddress);

    if (!walletAddress) {
      console.log("❌ No wallet address provided");
      return res.status(400).json({ error: "Wallet address required" });
    }

    // Use case-insensitive wallet address matching
    const voter = await query(
      "SELECT id, student_id, has_voted FROM voters WHERE LOWER(wallet_address) = LOWER($1) LIMIT 1",
      [walletAddress]
    );

    if (voter.rows.length === 0) {
      console.log("❌ Voter not found for wallet:", walletAddress);
      return res.status(404).json({ error: "Voter not found" });
    }

    const voterData = voter.rows[0];
    console.log("📋 Found voter:", {
      id: voterData.id,
      studentId: voterData.student_id,
      previouslyVoted: voterData.has_voted,
    });

    if (voterData.has_voted) {
      console.log("⚠️  Voter already marked as voted!");
    }

    await query(
      "UPDATE voters SET has_voted = true, voted_at = NOW() WHERE id = $1",
      [voterData.id]
    );

    console.log("✅ Successfully marked voter as voted:", voterData.student_id);

    // Log audit activity with masked student ID
    const maskedId =
      voterData.student_id.slice(0, 2) +
      voterData.student_id.slice(2).replace(/./g, "*");
    await query(
      `INSERT INTO audit_logs (action, description, created_at)
       VALUES ('vote_cast', $1, NOW())`,
      [`${maskedId} has voted`]
    );

    console.log("✅ Audit log created for vote cast");

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error marking voter as voted:", error);
    res.status(500).json({ error: "Failed to mark voter as voted" });
  }
});

// Check if wallet is registered and eligible to vote
router.post("/check-registration", async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address required" });
    }

    // Check if wallet exists in database
    const result = await query(
      "SELECT student_id, has_voted, full_name FROM voters WHERE LOWER(wallet_address) = LOWER($1) LIMIT 1",
      [walletAddress]
    );

    if (result.rows.length === 0) {
      return res.json({
        registered: false,
        message:
          "Wallet not registered. Please complete voter registration first.",
      });
    }

    const voter = result.rows[0];

    res.json({
      registered: true,
      studentId: voter.student_id,
      fullName: voter.full_name,
      hasVoted: voter.has_voted,
    });
  } catch (error) {
    console.error("Error checking registration:", error);
    res.status(500).json({ error: "Failed to check registration" });
  }
});

export default router;
