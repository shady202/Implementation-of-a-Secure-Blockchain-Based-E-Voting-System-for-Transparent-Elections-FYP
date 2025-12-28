import crypto from "crypto";

/**
 * Generate a 6-digit OTP code
 */
export function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Hash OTP using SHA-256 (to avoid storing plaintext OTPs)
 */
export function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp.trim()).digest("hex");
}

/**
 * Verify if provided OTP matches the hash
 */
export function verifyOtp(otp: string, hash: string): boolean {
  const otpHash = hashOtp(otp);
  return otpHash === hash;
}
