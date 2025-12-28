import { Router } from "express";
import { query } from "../db";
import { AuthRequest, requireAdmin, optionalAuth } from "../middleware/auth";
import {
  verifyTransaction,
  extractCandidateFromEvent,
} from "../services/blockchain-verifier";

const router = Router();

// Get candidates by election
router.get("/", optionalAuth, async (req, res) => {
  try {
    let electionId = req.query.election_id as string;

    // If no election_id provided, try to get active election
    // But also allow fetching candidates with NULL election_id
    if (!electionId) {
      const activeElection = await query(
        "SELECT id FROM elections WHERE is_active = true ORDER BY created_at DESC LIMIT 1"
      );

      // If there's an active election, use it
      // Otherwise, will fetch candidates with NULL election_id below
      if (activeElection.rows.length > 0) {
        electionId = activeElection.rows[0].id;
      }
    }

    // Fetch candidates: either for specific election OR with NULL election_id
    const result = electionId
      ? await query(
          "SELECT * FROM candidates WHERE election_id = $1 ORDER BY created_at ASC",
          [electionId]
        )
      : await query(
          "SELECT * FROM candidates WHERE election_id IS NULL ORDER BY created_at ASC"
        );

    res.json({ candidates: result.rows });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
});

// Add candidate after blockchain transaction
router.post("/", async (req: AuthRequest, res) => {
  try {
    const { txHash, election_id, name, party, candidateId, categoryName } =
      req.body;

    if (!txHash) {
      return res.status(400).json({ error: "Transaction hash is required" });
    }

    console.log("📝 Syncing candidate to database:");
    console.log("  - txHash:", txHash);
    console.log("  - name:", name);
    console.log("  - party:", party);
    console.log("  - candidateId:", candidateId);
    console.log("  - categoryName:", categoryName);

    // Get latest election if available (changed from active to latest)
    let electionId = election_id || null;
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

    // Find the category by name (handle NULL election_id)
    const categoryQuery = electionId
      ? "SELECT id FROM categories WHERE name = $1 AND election_id = $2"
      : "SELECT id FROM categories WHERE name = $1 AND election_id IS NULL";

    const categoryParams = electionId
      ? [categoryName, electionId]
      : [categoryName];

    const categoryResult = await query(categoryQuery, categoryParams);

    if (categoryResult.rows.length === 0) {
      return res.status(400).json({
        error: `Category "${categoryName}" not found in database.`,
      });
    }

    const dbCategoryId = categoryResult.rows[0].id;

    // Save to database (matching actual schema)
    const result = await query(
      `INSERT INTO candidates (
        category_id, election_id, candidate_name, party,
        vote_count, is_approved, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, 0, true, NOW(), NOW())
      RETURNING *`,
      [dbCategoryId, electionId, name || "Candidate", party || ""]
    );

    console.log("✅ Candidate saved to database:", result.rows[0].id);

    // Log audit activity
    await query(
      `INSERT INTO audit_logs (action, description, created_at)
       VALUES ('candidate_created', $1, NOW())`,
      [`Candidate "${name}" added to ${categoryName}`]
    );

    res.json({
      success: true,
      candidate: result.rows[0],
      blockchainId: candidateId || 0,
    });
  } catch (error: any) {
    console.error("❌ Error syncing candidate from blockchain:");
    console.error("Error message:", error?.message);
    console.error("Error detail:", error?.detail);
    console.error("Error column:", error?.column);
    console.error("Error constraint:", error?.constraint);
    console.error("Error stack:", error?.stack);
    res.status(500).json({
      error: "Failed to sync candidate from blockchain",
      details: error?.message || "Unknown error",
      column: error?.column,
      constraint: error?.constraint,
    });
  }
});

// Update candidate (admin)
router.put("/:id", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { candidate_name, party, manifesto, photo_url, is_approved } =
      req.body;

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (candidate_name !== undefined) {
      updates.push(`candidate_name = $${paramIndex++}`);
      values.push(candidate_name);
    }
    if (party !== undefined) {
      updates.push(`party = $${paramIndex++}`);
      values.push(party);
    }
    if (manifesto !== undefined) {
      updates.push(`manifesto = $${paramIndex++}`);
      values.push(manifesto);
    }
    if (photo_url !== undefined) {
      updates.push(`photo_url = $${paramIndex++}`);
      values.push(photo_url);
    }
    if (is_approved !== undefined) {
      updates.push(`is_approved = $${paramIndex++}`);
      values.push(is_approved);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await query(
      `UPDATE candidates SET ${updates.join(
        ", "
      )} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    res.json({ success: true, candidate: result.rows[0] });
  } catch (error) {
    console.error("Error updating candidate:", error);
    res.status(500).json({ error: "Failed to update candidate" });
  }
});

// Delete candidate (admin)
router.delete("/:id", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      "DELETE FROM candidates WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    res.status(500).json({ error: "Failed to delete candidate" });
  }
});

export default router;
