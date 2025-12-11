/**
 * Environment variable helper for client-side code
 * Safely access environment variables in both server and client contexts
 */

// Helper function to safely get environment variables
function getEnvVar(key: string, defaultValue: string = ""): string {
  if (typeof window === "undefined") {
    // Server-side
    return process.env[key] || defaultValue
  }

  // Client-side - access from window.__ENV__ or use defaults
  // Next.js injects NEXT_PUBLIC_ variables at build time
  const value = (window as any).__ENV__?.[key]
  return value !== undefined ? value : defaultValue
}

// Export environment variables as constants
export const ENV = {
  // Blockchain Configuration
  CONTRACT_ADDRESS: "0x47049d39b8629eC5Cf4b54dB2C6194c8c98e85e8",

  CHAIN_ID:
    typeof process !== 'undefined'
      ? process.env.NEXT_PUBLIC_CHAIN_ID || "560048"
      : "560048",

  NETWORK_NAME:
    typeof process !== 'undefined'
      ? process.env.NEXT_PUBLIC_NETWORK_NAME || "hoodi"
      : "hoodi",

  // Application Configuration
  APP_URL:
    typeof process !== 'undefined'
      ? process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      : "http://localhost:3000",

  // Feature Flags
  ENABLE_MOCK_MODE: false,


  // Session Configuration
  SESSION_KEY:
    typeof process !== 'undefined'
      ? process.env.NEXT_PUBLIC_SESSION_KEY || "apu-vote-session-key-2025"
      : "apu-vote-session-key-2025",
} as const

// Type-safe environment variable getter
export function getEnv<K extends keyof typeof ENV>(key: K): typeof ENV[K] {
  return ENV[key]
}

// Check if we're in development mode
export const isDevelopment =
  typeof process !== 'undefined'
    ? process.env.NODE_ENV === "development"
    : true

// Check if we're in production mode
export const isProduction =
  typeof process !== 'undefined'
    ? process.env.NODE_ENV === "production"
    : false

// Export individual variables for convenience
export const CONTRACT_ADDRESS = ENV.CONTRACT_ADDRESS
export const CHAIN_ID = ENV.CHAIN_ID
export const NETWORK_NAME = ENV.NETWORK_NAME
export const ENABLE_MOCK_MODE = ENV.ENABLE_MOCK_MODE
export const SESSION_KEY = ENV.SESSION_KEY