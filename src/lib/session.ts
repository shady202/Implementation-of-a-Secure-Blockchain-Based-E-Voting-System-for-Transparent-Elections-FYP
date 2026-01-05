"use client";

import { SESSION_KEY as ENV_SESSION_KEY } from "./env";

/**
 * Session Management Utility
 * Provides secure session handling with expiry and encryption
 */

interface SessionData {
  user: any;
  token: string;
  expiresAt: number;
  createdAt: number;
}

const SESSION_KEY = "userSession";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Simple XOR encryption for demo purposes
// In production, use a proper encryption library
function simpleEncrypt(text: string, key: string): string {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(
      text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return btoa(result);
}

function simpleDecrypt(encoded: string, key: string): string {
  const text = atob(encoded);
  let result = "";
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(
      text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return result;
}

// Get encryption key (in production, this should be more secure)
function getEncryptionKey(): string {
  return ENV_SESSION_KEY;
}

/**
 * Create a new session
 */
export function createSession(user: any, token: string): void {
  if (typeof window === "undefined") return;

  const now = Date.now();
  const sessionData: SessionData = {
    user,
    token,
    expiresAt: now + SESSION_DURATION,
    createdAt: now,
  };

  try {
    const encrypted = simpleEncrypt(
      JSON.stringify(sessionData),
      getEncryptionKey()
    );
    localStorage.setItem(SESSION_KEY, encrypted);

    // Also set a flag for hasVoted if needed
    localStorage.setItem("currentUser", JSON.stringify(user));
  } catch (error) {
    console.error("Error creating session:", error);
  }
}

/**
 * Get current session data
 */
export function getSession(): SessionData | null {
  if (typeof window === "undefined") return null;

  try {
    const encrypted = localStorage.getItem(SESSION_KEY);
    if (!encrypted) return null;

    const decrypted = simpleDecrypt(encrypted, getEncryptionKey());
    const sessionData: SessionData = JSON.parse(decrypted);

    // Check if session has expired
    if (Date.now() > sessionData.expiresAt) {
      destroySession();
      return null;
    }

    return sessionData;
  } catch (error) {
    console.error("Error getting session:", error);
    // If session is corrupted, destroy it
    destroySession();
    return null;
  }
}

/**
 * Get current user from session
 */
export function getCurrentUser(): any | null {
  const session = getSession();
  return session?.user || null;
}

/**
 * Get session token
 */
export function getSessionToken(): string | null {
  const session = getSession();
  return session?.token || null;
}

/**
 * Check if user is logged in
 */
export function isLoggedIn(): boolean {
  return getSession() !== null;
}

/**
 * Check if user is admin
 */
export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === "admin";
}

/**
 * Update session (refresh expiry)
 */
export function refreshSession(): void {
  if (typeof window === "undefined") return;

  const session = getSession();
  if (!session) return;

  try {
    const updatedSession: SessionData = {
      ...session,
      expiresAt: Date.now() + SESSION_DURATION,
    };

    const encrypted = simpleEncrypt(
      JSON.stringify(updatedSession),
      getEncryptionKey()
    );
    localStorage.setItem(SESSION_KEY, encrypted);
  } catch (error) {
    console.error("Error refreshing session:", error);
  }
}

/**
 * Destroy session (logout)
 */
export function destroySession(): void {
  if (typeof window === "undefined") return;

  // Get user before clearing session
  const user = getCurrentUser();

  // Call backend logout endpoint to clear session timestamp
  if (user?.studentId) {
    fetch(
      `${window.location.protocol}//${window.location.hostname}:3001/api/voters/logout`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: user.studentId }),
      }
    )
      .then(() => console.log("✅ Backend session cleared"))
      .catch((err) => console.error("❌ Logout API error:", err));
  }

  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("currentUser");
  localStorage.removeItem("hasVoted");
  // Clear voter registration status on logout
  localStorage.removeItem("voterRegistrationCompleted");
}

/**
 * Get session expiry time
 */
export function getSessionExpiry(): Date | null {
  const session = getSession();
  if (!session) return null;

  return new Date(session.expiresAt);
}

/**
 * Get time until session expires (in milliseconds)
 */
export function getTimeUntilExpiry(): number | null {
  const session = getSession();
  if (!session) return null;

  return Math.max(0, session.expiresAt - Date.now());
}

/**
 * Check if session will expire soon (within 1 hour)
 */
export function isSessionExpiringSoon(): boolean {
  const timeLeft = getTimeUntilExpiry();
  if (timeLeft === null) return false;

  const oneHour = 60 * 60 * 1000;
  return timeLeft < oneHour;
}

/**
 * Update user data in session
 */
export function updateSessionUser(userData: Partial<any>): void {
  if (typeof window === "undefined") return;

  const session = getSession();
  if (!session) return;

  try {
    const updatedSession: SessionData = {
      ...session,
      user: { ...session.user, ...userData },
    };

    const encrypted = simpleEncrypt(
      JSON.stringify(updatedSession),
      getEncryptionKey()
    );
    localStorage.setItem(SESSION_KEY, encrypted);
    localStorage.setItem("currentUser", JSON.stringify(updatedSession.user));
  } catch (error) {
    console.error("Error updating session user:", error);
  }
}

/**
 * Auto-refresh session periodically
 * Returns cleanup function
 */
export function startSessionRefresh(): () => void {
  if (typeof window === "undefined") return () => {};

  // Refresh session every 15 minutes
  const interval = setInterval(() => {
    if (isLoggedIn()) {
      refreshSession();
    }
  }, 15 * 60 * 1000);

  return () => clearInterval(interval);
}
