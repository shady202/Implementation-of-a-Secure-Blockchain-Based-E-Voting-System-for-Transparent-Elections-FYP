import {
  getCurrentUser,
  createSession as setSession,
  destroySession,
  isAdmin as checkIsAdmin,
  isLoggedIn,
} from "./session";
import { getApiBaseUrlWithoutSuffix } from "./api-config";

// API URL - now automatically detects correct IP!
const API_URL = getApiBaseUrlWithoutSuffix();

// Debug: Log the detected API URL
console.log("🔍 AUTH DEBUG - Detected API_URL:", API_URL);
console.log("🔍 AUTH DEBUG - Current hostname:", window.location.hostname);
console.log("🔍 AUTH DEBUG - Current full URL:", window.location.href);

export type Role = "student" | "admin";
export type Provider = "local" | "google" | "microsoft";

export interface User {
  id: string;
  studentId?: string;
  email: string;
  firstName: string;
  lastName: string;
  department: string;
  level: string;
  role: Role;
  provider: Provider;
  profilePicture?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
  admin?: any; // Full admin data when logging in as admin
}

// Re-export session functions
export const clearSession = destroySession;
export const getUser = getCurrentUser;
export { getCurrentUser, isLoggedIn };
export const isAdmin = checkIsAdmin;

// Login function - calls real backend API
export const loginUser = async (credentials: {
  studentId: string;
  password: string;
}): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/voters/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId: credentials.studentId,
        password: credentials.password,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Invalid credentials",
      };
    }

    const user: User = {
      id: data.user.id,
      studentId: data.user.studentId,
      email: data.user.email,
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      department: data.user.department,
      level: `Year ${data.user.yearOfStudy}`,
      role: "student",
      provider: "local",
    };

    const token = `student_token_${data.user.id}_${Date.now()}`;
    // DO NOT CREATE SESSION YET - wait for OTP verification
    // Session will be created in LoginPage after OTP is verified

    return {
      success: true,
      user,
      token,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Failed to connect to server",
    };
  }
};

export const loginAdmin = async (credentials: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Invalid credentials",
      };
    }

    const user: User = {
      id: data.admin.userId || data.admin.user_id, // Use userId (admin-001) not database id
      email: data.admin.email,
      firstName: data.admin.firstName || "Admin",
      lastName: data.admin.lastName || "User",
      department: data.admin.department || "Administration",
      level: "Staff",
      role: "admin",
      provider: "local",
    };

    // Add wallet address to user object for dashboard access
    const userWithWallet = {
      ...user,
      wallet_address: data.admin.walletAddress,
      walletAddress: data.admin.walletAddress,
    };

    const token =
      data.token || `admin_token_${data.admin.userId}_${Date.now()}`;
    setSession(userWithWallet as any, token); // Store with wallet address

    return {
      success: true,
      user,
      token,
      admin: data.admin, // Include full admin data
    };
  } catch (error) {
    console.error("Admin login error:", error);
    return {
      success: false,
      message: "Failed to connect to server",
    };
  }
};

// Stub functions for compatibility
export const registerUser = async (data: any): Promise<AuthResponse> => {
  try {
    // Combine firstName and lastName into fullName for backend
    const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();

    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        studentId: data.studentId,
        fullName,
        department: data.faculty, // Map 'faculty' to 'department' for backend
        year: data.year, // Send year of study to backend
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Registration failed",
      };
    }

    return {
      success: true,
      message: "Registration successful",
      user: result.user,
    };
  } catch (error: any) {
    console.error("Register error:", error);
    return { success: false, message: error.message || "Network error" };
  }
};

export const updateUserProfile = async (data: any): Promise<AuthResponse> => {
  console.warn("updateUserProfile not yet implemented");
  return { success: false, message: "Update profile not implemented" };
};

export const logout = destroySession;
