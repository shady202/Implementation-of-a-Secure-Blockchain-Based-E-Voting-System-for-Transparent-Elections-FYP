import { Router } from "express";
import { query } from "../db";
import { hashPassword, verifyPassword } from "../utils/crypto";
import { generateOtp, hashOtp, verifyOtp } from "../utils/otp";
import { sendOtpEmail } from "../utils/mail";

const router = Router();

const OTP_TTL_MIN = Number(process.env.OTP_TTL_MINUTES || 10);
const OTP_RESEND_COOLDOWN = Number(
  process.env.OTP_RESEND_COOLDOWN_SECONDS || 60
);
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);

/**
 * POST /api/auth/register
 * Register new user with email/password
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password, fullName, studentId, department } = req.body;

    if (!email || !password || !studentId) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and student ID are required",
      });
    }

    // Check if user already exists
    const existing = await query(
      "SELECT id FROM voters WHERE student_id = $1 OR email = $2 LIMIT 1",
      [studentId, email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    // Hash the password before storing
    const hashedPassword = await hashPassword(password);

    // Generate a unique placeholder wallet address for this user
    // Use crypto to create a valid hex string from studentId
    const crypto = require("crypto");
    const hash = crypto.createHash("sha256").update(studentId).digest("hex");
    const walletPlaceholder = `0x${hash.substring(0, 40)}`;

    const studentDepartment = department || "Pending"; // Use provided department or default to 'Pending'

    const result = await query(
      `INSERT INTO voters (student_id, email, password_hash, wallet_address, department, year_of_study, full_name, has_voted, email_verified, registration_date, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 1, $6, false, false, NOW(), NOW(), NOW())
       RETURNING id, student_id, email`,
      [
        studentId,
        email,
        hashedPassword,
        walletPlaceholder,
        studentDepartment,
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

    // ✅ FIX: If already verified, just return success (skip OTP check)
    if (voter.email_verified) {
      return res.json({
        success: true,
        message: "Email already verified",
      });
    }

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
    await query(
      `UPDATE voters 
       SET email_verified = true,
           email_otp_hash = NULL,
           email_otp_expires_at = NULL,
           otp_attempts = 0
       WHERE LOWER(email) = LOWER($1)`,
      [email]
    );

    res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify code",
    });
  }
});

export default router;
