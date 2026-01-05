// Debug helper to check what API URL is being used
import { API_BASE_URL } from "./api-config";

export function logApiUrl() {
  console.log("=== API URL DEBUG ===");
  console.log("Current hostname:", window.location.hostname);
  console.log("Current protocol:", window.location.protocol);
  console.log("Detected API_BASE_URL:", API_BASE_URL);
  console.log("===================");
}

// Auto-log on import
logApiUrl();
