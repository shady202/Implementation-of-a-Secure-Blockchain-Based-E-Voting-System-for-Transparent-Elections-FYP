import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db";

// Import routes
import electionsRouter from "./routes/elections";
import votersRouter from "./routes/voters";
import categoriesRouter from "./routes/categories";
import candidatesRouter from "./routes/candidates";
import statisticsRouter from "./routes/statistics";
import resetRouter from "./routes/reset";
import adminRouter from "./routes/admin";
import authRouter from "./routes/auth";
import votesRouter from "./routes/votes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:3003",
        "http://localhost:3000",
        "http://localhost:5173",
      ];
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/elections", electionsRouter);
app.use("/api/voters", votersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/candidates", candidatesRouter);
app.use("/api/statistics", statisticsRouter);
app.use("/api/reset", resetRouter);
app.use("/api/admin", adminRouter);
app.use("/api/auth", authRouter);
app.use("/api/votes", votesRouter);

// Legacy routes (for backward compatibility with frontend)
app.get("/api/election-settings", electionsRouter);
app.post("/api/election-settings", electionsRouter);
app.post("/api/election-status", electionsRouter);
app.post("/api/register-voter", votersRouter);
app.post("/api/mark-voted", votersRouter);
app.get("/api/voter/:walletAddress", votersRouter);
app.get("/api/activities", statisticsRouter);

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
      error: err.message || "Internal server error",
    });
  }
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
async function startServer() {
  try {
    // Test database connection
    await pool.query("SELECT NOW()");
    console.log("✅ Database connected successfully");

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔌 API endpoints: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
