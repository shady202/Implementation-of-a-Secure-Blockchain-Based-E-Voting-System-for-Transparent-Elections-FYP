/**
 * Dynamic API URL Configuration
 *
 * Auto-detects the correct API URL based on the current hostname.
 * Works seamlessly across:
 * - localhost development
 * - Network IP access (phone, other devices)
 * - No manual .env updates needed!
 */

/**
 * Get the dynamic API base URL
 * Priority:
 * 1. VITE_API_URL env variable (if explicitly set and not localhost)
 * 2. Auto-detect from current hostname + backend port (3001)
 */
export const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;

  // If env var is set and it's not the default localhost, use it
  if (envUrl && envUrl !== "http://localhost:3001/api") {
    return envUrl;
  }

  // Auto-detect: use current hostname with backend port
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  // Backend runs on port 3001
  return `${protocol}//${hostname}:3001/api`;
};

/**
 * Get the API base URL without the /api suffix
 * Used in AdminDashboard and other components
 */
export const getApiBaseUrlWithoutSuffix = (): string => {
  return getApiBaseUrl().replace(/\/api$/, "");
};

// Export the dynamic API URL
export const API_BASE_URL = getApiBaseUrl();

/**
 * Example usage:
 *
 * On localhost:
 * - Frontend: http://localhost:3000
 * - API_BASE_URL: http://localhost:3001/api
 *
 * On network (phone accessing via IP):
 * - Frontend: http://192.168.1.100:3000
 * - API_BASE_URL: http://192.168.1.100:3001/api
 *
 * No .env updates needed! 🎉
 */
