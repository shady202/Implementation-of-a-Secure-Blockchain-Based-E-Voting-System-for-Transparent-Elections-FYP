import { Request, Response, NextFunction } from "express";
import { query } from "../db";

// Extend Express Request to include user info
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    isAdmin?: boolean;
  };
}

// Temporary: Simple auth middleware (we'll replace with session auth later)
// For now, we'll accept any request and optionally check for a user_id header
export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Temporary: Get user_id from header (for testing)
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    req.user = { id: userId };
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: "Invalid authentication" });
  }
}

// Middleware to check if user is admin
export async function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Check if user is admin in database
    const result = await query(
      "SELECT id, user_id, role FROM admins WHERE user_id = $1 AND is_active = true",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "Admin access required" });
    }

    req.user.isAdmin = true;
    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({ error: "Failed to verify admin status" });
  }
}

// Optional auth - doesn't fail if no user
export function optionalAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.headers["x-user-id"] as string;
  if (userId) {
    req.user = { id: userId };
  }
  next();
}
