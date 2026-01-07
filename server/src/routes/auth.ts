import { Router } from "express";
import { query } from "../db";
import { hashPassword, verifyPassword } from "../utils/crypto";
import { generateOtp, hashOtp, verifyOtp } from "../utils/otp";
import { sendOtpEmail } from "../utils/mail";
import {
  generateToken,
  verifyToken,
  extractTokenFromHeader,
} from "../utils/jwt";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

const OTP_TTL_MIN = Number(process.env.OTP_TTL_MINUTES || 10);
const OTP_RESEND_COOLDOWN = Number(
  process.env.OTP_RESEND_COOLDOWN_SECONDS || 60
);
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);

/**
 * POST /api/auth/check-student-id
 * Check if student ID already exists (for real-time validation)
 */
router.post("/check-student-id", async (req, res) => {
  try {
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    // Check if student ID exists
    const existing = await query(
      "SELECT id FROM voters WHERE student_id = $1 LIMIT 1",
      [studentId]
    );

    if (existing.rows.length > 0) {
      return res.json({
        success: false,
        exists: true,
        message: `This Student ID (${studentId}) is already registered.`,
      });
    }

    return res.json({
      success: true,
      exists: false,
      message: "Student ID is available",
    });
  } catch (error) {
    console.error("Check student ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check student ID",
    });
  }
});

/**
 * POST /api/auth/check-email
 * Check if email already exists (for real-time validation)
 */
router.post("/check-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if email exists
    const existing = await query(
      "SELECT id FROM voters WHERE email = $1 LIMIT 1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.json({
        success: false,
        exists: true,
        message: `This email is already registered.`,
      });
    }

    return res.json({
      success: true,
      exists: false,
      message: "Email is available",
    });
  } catch (error) {
    console.error("Check email error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check email",
    });
  }
});

/**
 * POST /api/auth/register
 * Register new user with email/password
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password, fullName, studentId, department, year } = req.body;

    if (!email || !password || !studentId) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and student ID are required",
      });
    }

    // Check if student ID already exists
    const existingStudentId = await query(
      "SELECT id, student_id FROM voters WHERE student_id = $1 LIMIT 1",
      [studentId]
    );

    if (existingStudentId.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: `This Student ID (${studentId}) is already registered. Each TP number can only be used once.`,
        field: "studentId",
      });
    }

    // Check if email already exists
    const existingEmail = await query(
      "SELECT id, email FROM voters WHERE email = $1 LIMIT 1",
      [email]
    );

    if (existingEmail.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: `This email (${email}) is already registered. Please use a different email or login to your existing account.`,
        field: "email",
      });
    }

    // Hash the password before storing
    const hashedPassword = await hashPassword(password);

    const studentDepartment = department || "Pending";
    const studentYear = year ? Number(year) : 1; // Use provided year or default to 1

    const result = await query(
      `INSERT INTO voters (student_id, email, password_hash, wallet_address, department, year_of_study, full_name, has_voted, email_verified, registration_date, created_at, updated_at)
       VALUES ($1, $2, $3, NULL, $4, $5, $6, false, false, NOW(), NOW(), NOW())
       RETURNING id, student_id, email`,
      [
        studentId,
        email,
        hashedPassword,
        studentDepartment,
        studentYear,
        fullName || "",
      ]
    );

    console.log("✅ User registered:", result.rows[0].student_id);

    res.json({
      success: true,
      message: "Registration successful",
      user: result.rows[0],
    });
  } catch (error: any) {
    console.error("❌ Registration error:");
    console.error("  Error message:", error.message);
    console.error("  Error stack:", error.stack);
    console.error("  Error code:", error.code);
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * POST /api/auth/request-otp
 * Generate and send OTP to voter's email
 */
router.post("/request-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if voter exists (case-insensitive)
    const voterResult = await query(
      `SELECT id, email, email_verified, otp_last_sent_at, full_name 
       FROM voters 
       WHERE LOWER(email) = LOWER($1)`,
      [email]
    );

    if (voterResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    const voter = voterResult.rows[0];

    // Check resend cooldown
    if (voter.otp_last_sent_at) {
      const lastSent = new Date(voter.otp_last_sent_at).getTime();
      const now = Date.now();
      const diffSeconds = Math.floor((now - lastSent) / 1000);

      if (diffSeconds < OTP_RESEND_COOLDOWN) {
        const waitTime = OTP_RESEND_COOLDOWN - diffSeconds;
        return res.status(429).json({
          success: false,
          message: `Please wait ${waitTime} seconds before requesting a new code`,
          waitTime,
        });
      }
    }

    // Generate OTP
    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + OTP_TTL_MIN * 60 * 1000);

    // Update voter with OTP
    await query(
      `UPDATE voters 
       SET email_otp_hash = $1,
           email_otp_expires_at = $2,
           otp_attempts = 0,
           otp_last_sent_at = NOW()
       WHERE LOWER(email) = LOWER($3)`,
      [otpHash, expiresAt, email]
    );

    console.log("🔐 OTP:", otp, " for", email);
    await sendOtpEmail(email, otp, voter.full_name);

    res.json({
      success: true,
      message: "Verification code sent to your email",
      expiresIn: OTP_TTL_MIN * 60, // seconds
    });
  } catch (error) {
    console.error("Request OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send verification code",
    });
  }
});

/**
 * POST /api/auth/verify-otp
 * Verify OTP code
 */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP code are required",
      });
    }

    // Get voter with OTP data (case-insensitive)
    const voterResult = await query(
      `SELECT id, email, email_verified, email_otp_hash, 
              email_otp_expires_at, otp_attempts
       FROM voters 
       WHERE LOWER(email) = LOWER($1)`,
      [email]
    );

    if (voterResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    const voter = voterResult.rows[0];

    // Check if OTP exists
    if (!voter.email_otp_hash || !voter.email_otp_expires_at) {
      return res.status(400).json({
        success: false,
        message: "No verification code found. Please request a new code",
      });
    }

    // Check attempt limit
    if (voter.otp_attempts >= OTP_MAX_ATTEMPTS) {
      return res.status(429).json({
        success: false,
        message: "Too many failed attempts. Please request a new code",
      });
    }

    // Check expiration
    const expiresAt = new Date(voter.email_otp_expires_at).getTime();
    if (Date.now() > expiresAt) {
      return res.status(400).json({
        success: false,
        message: "Verification code expired. Please request a new code",
      });
    }

    // Verify OTP
    const isValid = verifyOtp(otp, voter.email_otp_hash);

    if (!isValid) {
      // Increment attempts
      await query(
        `UPDATE voters 
         SET otp_attempts = otp_attempts + 1 
         WHERE LOWER(email) = LOWER($1)`,
        [email]
      );

      return res.status(401).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    // Mark as verified and clear OTP data
    const updateResult = await query(
      `UPDATE voters 
       SET email_verified = true,
           email_otp_hash = NULL,
           email_otp_expires_at = NULL,
           otp_attempts = 0
       WHERE LOWER(email) = LOWER($1)
       RETURNING id, email, student_id, full_name, department, year_of_study`,
      [email]
    );

    const updatedVoter = updateResult.rows[0];
    console.log("✅ OTP Verified for user:", updatedVoter.email);

    // Check if user is admin
    const adminCheck = await query(
      "SELECT id FROM admins WHERE user_id = $1 AND is_active = true",
      [updatedVoter.id]
    );
    const isAdmin = adminCheck.rows.length > 0;
    console.log("🔐 User is admin:", isAdmin);

    // Split full_name into firstName and lastName for frontend compatibility
    const fullName = updatedVoter.full_name || "";
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Generate JWT token
    const token = generateToken({
      userId: updatedVoter.id,
      email: updatedVoter.email,
      studentId: updatedVoter.student_id,
      isAdmin,
    });
    console.log("🎫 JWT Token generated successfully");
    console.log("📦 Token length:", token.length);

    const responseData = {
      success: true,
      message: "Email verified successfully",
      token,
      user: {
        id: updatedVoter.id,
        email: updatedVoter.email,
        studentId: updatedVoter.student_id,
        fullName: updatedVoter.full_name,
        firstName,
        lastName,
        department: updatedVoter.department,
        year: updatedVoter.year_of_study,
        yearOfStudy: updatedVoter.year_of_study,
        role: "student",
        isAdmin,
      },
    };

    console.log("📤 Sending response with token to frontend");
    res.json(responseData);
  } catch (error) {
    console.error("❌ Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify code",
    });
  }
});

/**
 * GET /api/auth/verify
 * Verify JWT token and return user info
 */
router.get("/verify", requireAuth, async (req: AuthRequest, res) => {
  try {
    // Token is already verified by requireAuth middleware
    // User info is attached to req.user

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Fetch fresh user data from database
    const userResult = await query(
      `SELECT id, email, student_id, full_name, department, year_of_study, 
              wallet_address, email_verified, has_voted
       FROM voters 
       WHERE id = $1`,
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userResult.rows[0];

    // Check if user is admin
    const adminCheck = await query(
      "SELECT id, role FROM admins WHERE user_id = $1 AND is_active = true",
      [user.id]
    );
    const isAdmin = adminCheck.rows.length > 0;

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        studentId: user.student_id,
        fullName: user.full_name,
        department: user.department,
        yearOfStudy: user.year_of_study,
        walletAddress: user.wallet_address,
        emailVerified: user.email_verified,
        hasVoted: user.has_voted,
        isAdmin,
      },
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify token",
    });
  }
});

export default router;
