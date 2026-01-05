import { toast } from "sonner";
import { API_BASE_URL } from "./api-config";

// Types for OTP helper parameters
interface OtpState {
  setOtpEmail: (email: string) => void;
  setShowOtpInput: (show: boolean) => void;
  setCountdown: (value: number | ((prev: number) => number)) => void;
  setLoading: (loading: boolean) => void;
  setError?: (error: string) => void;
}

interface VerifyOtpParams {
  otpCode: string;
  otpEmail: string;
  studentForm: { studentId: string; password: string };
  loginUser: (credentials: {
    studentId: string;
    password: string;
  }) => Promise<{ success: boolean; message?: string }>;
  onNavigate: (page: string) => void;
}

// Helper to request OTP via email
export const handleRequestOtp = async (email: string, state: OtpState) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to send OTP");
    }

    state.setOtpEmail(email);
    state.setShowOtpInput(true);
    state.setCountdown(60); // 60 second cooldown
    toast.success("Verification code sent to your email!");

    // Start countdown timer
    const timer = setInterval(() => {
      state.setCountdown((prev: number) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  } catch (error: any) {
    toast.error(error.message || "Failed to send verification code");
    throw error;
  }
};

// Handle OTP verification
export const handleVerifyOtp = async (
  params: VerifyOtpParams,
  state: OtpState
) => {
  const { otpCode, otpEmail, studentForm, loginUser, onNavigate } = params;

  if (otpCode.length !== 6) {
    toast.error("Please enter a 6-digit code");
    return;
  }

  state.setLoading(true);
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: otpEmail, otp: otpCode }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Invalid verification code");
    }

    toast.success("Email verified successfully!");
    state.setShowOtpInput(false);

    // Now proceed with actual login
    const loginResponse = await loginUser({
      studentId: studentForm.studentId,
      password: studentForm.password,
    });

    if (loginResponse.success) {
      toast.success("Login successful!");
      const intended = localStorage.getItem("intendedDestination");
      if (intended) {
        localStorage.removeItem("intendedDestination");
        onNavigate(intended);
      } else {
        onNavigate("home");
      }
    } else {
      if (state.setError) {
        state.setError(loginResponse.message || "Login failed");
      }
    }
  } catch (error: any) {
    toast.error(error.message || "Verification failed");
  } finally {
    state.setLoading(false);
  }
};

// Resend OTP
export const handleResendOtp = async (
  countdown: number,
  otpEmail: string,
  state: OtpState
) => {
  if (countdown > 0) return;
  await handleRequestOtp(otpEmail, state);
};
