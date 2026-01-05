import { Request, Response, NextFunction } from "express";
import { query } from "../db";
import { verifyToken, extractTokenFromHeader } from "../utils/jwt";

// Extend Express Request to include user info
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    studentId?: string;
    isAdmin?: boolean;
  };
}

/**
 * Middleware to require JWT authentication
 */
export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Authentication required. No token provided.",
      });
    }

    // Verify and decode the token
    const decoded = verifyToken(token);

    // Attach user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      studentId: decoded.studentId,
      isAdmin: decoded.isAdmin || false,
    };

    next();
  } catch (error: any) {
    console.error("Auth error:", error.message);
    return res.status(401).json({
      success: false,
      error: error.message || "Invalid authentication",
    });
  }
}

/**
 * Middleware to check if user is admin
 */
export async function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // First, ensure user is authenticated
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Attach user info if not already set
    if (!req.user) {
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        studentId: decoded.studentId,
        isAdmin: decoded.isAdmin || false,
      };
    }

    // Check if user is admin in database
    const result = await query(
      "SELECT id, user_id, role FROM admins WHERE user_id = $1 AND is_active = true",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: "Admin access required",
      });
    }

    req.user.isAdmin = true;
    next();
  } catch (error: any) {
    console.error("Admin check error:", error);
    return res.status(error.message?.includes("Token") ? 401 : 500).json({
      success: false,
      error: error.message || "Failed to verify admin status",
    });
  }
}

/**
 * Optional auth - doesn't fail if no user
 */
export function optionalAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const decoded = verifyToken(token);
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        studentId: decoded.studentId,
        isAdmin: decoded.isAdmin || false,
      };
    }
  } catch (error) {
    // Silently fail for optional auth
    console.log("Optional auth failed:", error);
  }

  next();
}
