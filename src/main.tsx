import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { API_BASE_URL } from "./lib/api-config";

// Debug: Show API URL immediately on app load
console.log("🚀 APP STARTUP DEBUG");
console.log("🔍 Current URL:", window.location.href);
console.log("🔍 Hostname:", window.location.hostname);
console.log("🔍 Detected API_BASE_URL:", API_BASE_URL);
console.log("===================");

createRoot(document.getElementById("root")!).render(<App />);
