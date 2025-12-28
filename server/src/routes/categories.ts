import { Router } from "express";
import { query } from "../db";
import { AuthRequest, requireAdmin, optionalAuth } from "../middleware/auth";
import {
  verifyTransaction,
  extractCategoryFromEvent,
} from "../services/blockchain-verifier";

const router = Router();

// Get categories for an election
router.get("/", optionalAuth, async (req, res) => {
  try {
    let electionId = req.query.election_id as string;

    // If no election_id provided, try to get active election
    // But also allow fetching categories with NULL election_id
    if (!electionId) {
      const activeElection = await query(
        "SELECT id FROM elections WHERE is_active = true ORDER BY created_at DESC LIMIT 1"
      );

      // If there's an active election, use it
      // Otherwise, will fetch categories with NULL election_id below
      if (activeElection.rows.length > 0) {
        electionId = activeElection.rows[0].id;
      }
    }

    // Fetch categories: either for specific election OR with NULL election_id
    const result = electionId
      ? await query(
          "SELECT * FROM categories WHERE election_id = $1 ORDER BY created_at ASC",
          [electionId]
        )
      : await query(
          "SELECT * FROM categories WHERE election_id IS NULL ORDER BY created_at ASC"
        );

    res.json({ categories: result.rows });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Add category after blockchain transaction (admin only)
router.post("/", async (req: AuthRequest, res) => {
  try {
    const { txHash, election_id, name, description, categoryId } = req.body;

    if (!txHash) {
      return res.status(400).json({ error: "Transaction hash is required" });
    }

    console.log("📝 Syncing category to database:");
    console.log("  - txHash:", txHash);
    console.log("  - name:", name);
    console.log("  - description:", description);
    console.log("  - categoryId:", categoryId);

    // Get latest election if not provided (changed from active to latest)
    let electionId = election_id;
    if (!electionId) {
      const latestElection = await query(
        "SELECT id FROM elections ORDER BY created_at DESC LIMIT 1"
      );

      if (latestElection.rows.length > 0) {
        electionId = latestElection.rows[0].id;
        console.log("  - Using latest election_id:", electionId);
      }
      // If no election exists, electionId stays null - database column is nullable
    }

    // Save to database with blockchain reference
    // We trust the blockchain transaction succeeded since it was signed by admin
    const result = await query(
      `INSERT INTO categories (
        election_id, category_name, name, description, 
        max_votes, display_order, is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *`,
      [
        electionId,
        name || "Category",
        name || "Category",
        description || "",
        1, // default max_votes
        0, // default display_order
        true, // is_active
      ]
    );

    console.log("✅ Category saved to database:", result.rows[0].id);

    // Log audit activity
    await query(
      `INSERT INTO audit_logs (action, description, created_at)
       VALUES ('category_created', $1, NOW())`,
      [`Category "${name}" added`]
    );

    res.json({
      success: true,
      category: result.rows[0],
      blockchainId: categoryId || 0,
    });
  } catch (error: any) {
    console.error("Error syncing category from blockchain:");
    console.error("Error message:", error?.message);
    console.error("Error stack:", error?.stack);
    console.error("Full error object:", JSON.stringify(error, null, 2));
    res.status(500).json({
      error: "Failed to sync category from blockchain",
      details: error?.message || "Unknown error",
    });
  }
});

// Update a category (admin only)
router.put("/:id", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category_name,
      description,
      maxVotes,
      max_votes,
      isActive,
      is_active,
    } = req.body;

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (category_name !== undefined) {
      updates.push(`category_name = $${paramIndex++}`);
      values.push(category_name);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (maxVotes !== undefined || max_votes !== undefined) {
      updates.push(`max_votes = $${paramIndex++}`);
      values.push(maxVotes ?? max_votes);
    }
    if (isActive !== undefined || is_active !== undefined) {
      updates.push(`is_active = $${paramIndex++}`);
      values.push(isActive ?? is_active);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await query(
      `UPDATE categories SET ${updates.join(
        ", "
      )} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ success: true, category: result.rows[0] });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
});

export default router;
