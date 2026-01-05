import { Router } from "express";
import { query } from "../db";
import { AuthRequest, requireAuth, requireAdmin } from "../middleware/auth";
import { verifyPassword } from "../utils/crypto";

const router = Router();

// Register a new voter or update wallet for existing account
router.post("/register-voter", async (req: AuthRequest, res) => {
  try {
    const { studentId, walletAddress, department, year, fullName, email } =
      req.body;

    console.log("📝 Registering voter with wallet-identity binding:");
    console.log("  - studentId:", studentId);
    console.log("  - walletAddress:", walletAddress);
    console.log("  - email:", email);
    console.log("  - department:", department);
    console.log("  - year:", year);

    if (!studentId || !walletAddress) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // CRITICAL SECURITY CHECK: Verify wallet-identity binding
    // Check if TP number already exists with a DIFFERENT wallet
    const existingByStudentId = await query(
      "SELECT id, wallet_address, email, full_name FROM voters WHERE student_id = $1 LIMIT 1",
      [studentId]
    );

    if (existingByStudentId.rows.length > 0) {
      const voter = existingByStudentId.rows[0];

      // Check if wallet_address is NULL - this means user created account but hasn't registered wallet yet
      if (!voter.wallet_address || voter.wallet_address === null) {
        console.log(
          "✅ User exists with NULL wallet - updating with new wallet address"
        );
        const result = await query(
          `UPDATE voters 
           SET wallet_address = $1, updated_at = NOW()
           WHERE student_id = $2
           RETURNING *`,
          [walletAddress, studentId]
        );

        console.log("✅ Wallet address updated for:", studentId);
        return res.json({ success: true, voter: result.rows[0] });
      }

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
           SET wallet_address = $1, updated_at = NOW()
           WHERE student_id = $2
           RETURNING *`,
          [walletAddress, studentId]
        );

        console.log("✅ Wallet updated for:", studentId);
        return res.json({ success: true, voter: result.rows[0] });
      } else if (
        voter.wallet_address &&
        voter.wallet_address.toLowerCase() !== walletAddress.toLowerCase()
      ) {
        // TP number exists with DIFFERENT wallet - PREVENT MULTIPLE VOTES
        console.log(
          "❌ SECURITY ALERT: Attempt to register TP",
          studentId,
          "with different wallet"
        );
        console.log("   Registered wallet:", voter.wallet_address);
        console.log("   Attempted wallet:", walletAddress);
        return res.status(400).json({
          success: false,
          error: "Wallet address mismatch",
          message: `This TP number is already registered with a different wallet address. Each student can only register one wallet address. Please use your registered wallet.`,
        });
      } else {
        // Same wallet - already registered
        console.log("✅ Voter already registered with same wallet");
        return res.json({
          success: true,
          voter: voter,
          alreadyRegistered: true,
        });
      }
    }

    // Check if email already exists with a DIFFERENT wallet (if email provided)
    if (email) {
      const existingByEmail = await query(
        "SELECT id, wallet_address, student_id FROM voters WHERE email = $1 LIMIT 1",
        [email]
      );

      if (existingByEmail.rows.length > 0) {
        const voter = existingByEmail.rows[0];
        if (
          voter.wallet_address &&
          voter.wallet_address.toLowerCase() !== walletAddress.toLowerCase()
        ) {
          console.log(
            "❌ SECURITY ALERT: Attempt to register email",
            email,
            "with different wallet"
          );
          return res.status(400).json({
            success: false,
            error: "Wallet address mismatch",
            message: `This email (${email}) is already registered with a different wallet address. Please use your registered wallet.`,
          });
        }
      }
    }

    // Check if wallet already exists with DIFFERENT TP number
    const existingByWallet = await query(
      "SELECT id, student_id, email FROM voters WHERE LOWER(wallet_address) = LOWER($1) LIMIT 1",
      [walletAddress]
    );

    if (existingByWallet.rows.length > 0) {
      const voter = existingByWallet.rows[0];
      if (voter.student_id !== studentId) {
        console.log(
          "❌ SECURITY ALERT: Wallet",
          walletAddress,
          "already registered to different TP"
        );
        return res.status(400).json({
          success: false,
          error: "Wallet already registered",
          message: `This wallet address has already been used for registration. Each wallet can only be used once.`,
        });
      }
    }

    // New voter - insert with wallet-identity binding
    console.log("✅ Creating new voter with permanent wallet-identity binding");
    const result = await query(
      `INSERT INTO voters (student_id, wallet_address, department, year_of_study, full_name, email, has_voted, registration_date, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, false, NOW(), NOW(), NOW())
       RETURNING *`,
      [
        studentId,
        walletAddress,
        department || null,
        year || null,
        fullName || "",
        email || "",
      ]
    );

    console.log("✅ Voter registered with wallet binding:", result.rows[0].id);
    console.log("   TP:", studentId, "→ Wallet:", walletAddress);

    res.json({ success: true, voter: result.rows[0] });
  } catch (error: any) {
    console.error("❌ Error registering voter:");
    console.error("Error message:", error?.message);
    console.error("Error detail:", error?.detail);
    console.error("Error column:", error?.column);
    console.error("Error constraint:", error?.constraint);

    // Handle specific database constraint violations
    if (error?.constraint === "voters_student_id_key") {
      return res.status(400).json({
        success: false,
        error: "TP number already registered",
        message:
          "This TP number is already registered. Please use your registered account.",
      });
    } else if (error?.constraint === "voters_wallet_address_key") {
      return res.status(400).json({
        success: false,
        error: "Wallet already registered",
        message:
          "This wallet address is already registered to another student.",
      });
    } else if (error?.constraint === "voters_email_key") {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
        message:
          "This email is already registered. Please use your registered account.",
      });
    }

    res.status(500).json({
      error: "Failed to register voter",
      details: error?.message || "Unknown error",
      column: error?.column,
      constraint: error?.constraint,
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

    // Check capacity testing settings
    const capacitySettings = await query(
      `SELECT key, value FROM system_settings 
       WHERE key IN ('capacity_testing_enabled', 'max_concurrent_users')`
    );

    let capacityTestingEnabled = false;
    let maxConcurrentUsers = 10;

    capacitySettings.rows.forEach((row) => {
      if (row.key === "capacity_testing_enabled") {
        // Handle both string "true" and boolean true
        capacityTestingEnabled = row.value === "true" || row.value === true;
      } else if (row.key === "max_concurrent_users") {
        maxConcurrentUsers = parseInt(row.value, 10);
      }
    });

    console.log("🔍 Capacity Settings:", {
      enabled: capacityTestingEnabled,
      maxUsers: maxConcurrentUsers,
    });

    // If capacity testing is enabled, check active sessions BEFORE allowing login
    if (capacityTestingEnabled) {
      // Count ALL active sessions (logged in within last 24 hours)
      // Do NOT exclude current user - they haven't logged in yet!
      const activeSessionsResult = await query(
        `SELECT COUNT(*) as count FROM voters 
         WHERE last_login_at > NOW() - INTERVAL '24 hours'`
      );

      const activeSessions = parseInt(
        activeSessionsResult.rows[0]?.count || "0",
        10
      );

      console.log(
        `🔍 Capacity check: ${activeSessions}/${maxConcurrentUsers} active sessions`
      );

      // Block if we're AT or ABOVE capacity
      // This check happens BEFORE updating last_login_at, so:
      // - If 2 users are logged in and max is 2, activeSessions = 2
      // - 2 >= 2 is TRUE, so block the 3rd user ✅
      if (activeSessions >= maxConcurrentUsers) {
        console.log("❌ System at maximum capacity - blocking login");
        console.log(
          `   Current: ${activeSessions}, Max: ${maxConcurrentUsers}`
        );
        return res.status(429).json({
          success: false,
          message:
            "System is currently at maximum capacity. Please try again later.",
          capacityReached: true,
        });
      }

      console.log("✅ Capacity available - allowing login");
    }

    // Update last login time for session tracking
    await query(`UPDATE voters SET last_login_at = NOW() WHERE id = $1`, [
      voter.id,
    ]);

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

// Logout voter - clear session timestamp
router.post("/logout", async (req, res) => {
  try {
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    console.log("👋 Logging out user:", studentId);

    // Clear last_login_at to remove from active sessions count
    await query(
      `UPDATE voters SET last_login_at = NULL WHERE student_id = $1`,
      [studentId]
    );

    console.log("✅ Logout successful - session cleared for:", studentId);

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("❌ Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
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

    // Log audit activity with masked student ID (show last 3 digits)
    const maskedId =
      voterData.student_id.slice(0, 2) +
      voterData.student_id.slice(2, -3).replace(/./g, "*") +
      voterData.student_id.slice(-3);
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

// Check if voter is registered (by wallet address OR student ID)
router.post("/check-registration", async (req, res) => {
  try {
    const { walletAddress, studentId } = req.body;

    if (!walletAddress && !studentId) {
      return res.status(400).json({
        error: "Either walletAddress or studentId is required",
      });
    }

    let voter;

    // Check by student ID first if provided
    if (studentId) {
      const result = await query(
        "SELECT wallet_address, has_voted, student_id FROM voters WHERE student_id = $1 LIMIT 1",
        [studentId]
      );
      voter = result.rows[0];
    } else if (walletAddress) {
      // Check by wallet address
      const result = await query(
        "SELECT wallet_address, has_voted, student_id FROM voters WHERE LOWER(wallet_address) = LOWER($1) LIMIT 1",
        [walletAddress]
      );
      voter = result.rows[0];
    }

    if (!voter) {
      return res.json({
        registered: false,
        hasVoted: false,
        walletAddress: null,
      });
    }

    res.json({
      registered: !!voter.wallet_address, // Only registered if wallet_address is not null
      hasVoted: voter.has_voted || false,
      walletAddress: voter.wallet_address,
      studentId: voter.student_id,
    });
  } catch (error: any) {
    console.error("Error checking registration:", error?.message);
    res.status(500).json({ error: "Failed to check registration" });
  }
});

// SECURITY: Validate wallet-identity binding before voting
router.post("/validate-wallet", async (req, res) => {
  try {
    const { walletAddress, studentId, email } = req.body;

    console.log("🔒 Validating wallet-identity binding:");
    console.log("  - Wallet:", walletAddress);
    console.log("  - TP:", studentId);
    console.log("  - Email:", email);

    if (!walletAddress) {
      return res.status(400).json({
        valid: false,
        error: "Wallet address required",
      });
    }

    // Get voter by wallet address
    const result = await query(
      "SELECT student_id, email, full_name, wallet_address, has_voted FROM voters WHERE LOWER(wallet_address) = LOWER($1) LIMIT 1",
      [walletAddress]
    );

    if (result.rows.length === 0) {
      console.log("❌ Wallet not registered in database");

      // Check if this student ID exists but with NULL wallet (needs registration)
      if (studentId) {
        const studentCheck = await query(
          "SELECT student_id, wallet_address FROM voters WHERE student_id = $1 LIMIT 1",
          [studentId]
        );

        if (
          studentCheck.rows.length > 0 &&
          !studentCheck.rows[0].wallet_address
        ) {
          console.log(
            "⚠️  Student exists but wallet is NULL - needs wallet registration"
          );
          return res.json({
            valid: false,
            registered: false,
            needsRegistration: true,
            message: "Please complete wallet registration first.",
          });
        }
      }

      return res.json({
        valid: false,
        registered: false,
        message:
          "This wallet address does not match your registered wallet. Please connect the original wallet used during voter registration.",
      });
    }

    const voter = result.rows[0];

    // If studentId or email provided, verify they match
    if (studentId && voter.student_id !== studentId) {
      console.log("❌ SECURITY ALERT: Wallet-TP mismatch");
      console.log("   Wallet belongs to:", voter.student_id);
      console.log("   Attempted TP:", studentId);
      return res.json({
        valid: false,
        mismatch: true,
        message: `This wallet address doesn't match your registered account. Please use the wallet you registered with.`,
      });
    }

    if (
      email &&
      voter.email &&
      voter.email.toLowerCase() !== email.toLowerCase()
    ) {
      console.log("❌ SECURITY ALERT: Wallet-email mismatch");
      return res.json({
        valid: false,
        mismatch: true,
        message: `This wallet is registered to a different email address. Please use your registered wallet.`,
      });
    }

    // All checks passed
    console.log("✅ Wallet-identity binding validated");
    console.log("   TP:", voter.student_id, "✓");
    console.log("   Email:", voter.email, "✓");
    console.log("   Wallet:", voter.wallet_address, "✓");

    res.json({
      valid: true,
      registered: true,
      studentId: voter.student_id,
      email: voter.email,
      fullName: voter.full_name,
      walletAddress: voter.wallet_address,
      hasVoted: voter.has_voted,
      message:
        "Wallet successfully validated and matches your registered identity.",
    });
  } catch (error) {
    console.error("❌ Error validating wallet:", error);
    res.status(500).json({
      valid: false,
      error: "Failed to validate wallet",
    });
  }
});

// Refresh user session data
router.post("/refresh-session", async (req, res) => {
  try {
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ error: "Student ID required" });
    }

    // Get fresh user data from database
    const result = await query(
      `SELECT id, student_id, email, wallet_address, department, year_of_study, full_name, has_voted
       FROM voters WHERE student_id = $1 LIMIT 1`,
      [studentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const voter = result.rows[0];
    const fullName = voter.full_name || "";
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    console.log("✅ Refreshed session data for:", studentId);
    console.log("   Department:", voter.department);
    console.log("   Year:", voter.year_of_study);

    res.json({
      success: true,
      user: {
        id: voter.id,
        studentId: voter.student_id,
        email: voter.email,
        department: voter.department,
        year: voter.year_of_study,
        yearOfStudy: voter.year_of_study,
        walletAddress: voter.wallet_address,
        firstName,
        lastName,
        fullName: voter.full_name,
        hasVoted: voter.has_voted,
        role: "student",
      },
    });
  } catch (error) {
    console.error("Error refreshing session:", error);
    res.status(500).json({ error: "Failed to refresh session" });
  }
});

// Temporary endpoint to fix user data
router.post("/fix-user-data", async (req, res) => {
  try {
    const { studentId, department, year } = req.body;
    if (!studentId) {
      return res.status(400).json({ error: "Student ID required" });
    }
    const result = await query(
      `UPDATE voters SET department = $1, year_of_study = $2, updated_at = NOW() WHERE student_id = $3 RETURNING student_id, full_name, department, year_of_study, email`,
      [department || "School of Computing", year || 1, studentId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("✅ Updated user data:", result.rows[0]);
    res.json({
      success: true,
      message: "User data updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({ error: "Failed to update user data" });
  }
});

export default router;
