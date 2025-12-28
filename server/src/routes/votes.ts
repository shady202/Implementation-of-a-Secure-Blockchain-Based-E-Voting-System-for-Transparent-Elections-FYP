import express, { Request, Response } from "express";
import { query } from "../db";
import { sendVoteConfirmationEmail } from "../utils/mail";

const router = express.Router();

// =====================================================
// Save votes to database for lifetime history
// =====================================================
router.post("/save", async (req: Request, res: Response) => {
  try {
    const { walletAddress, electionId, votes } = req.body;

    if (!walletAddress || !votes || !Array.isArray(votes)) {
      return res.status(400).json({
        error: "Missing required fields: walletAddress, votes",
      });
    }

    // Get election details (if exists)
    let electionTitle = "General Election";
    if (electionId) {
      const electionResult = await query(
        "SELECT title FROM elections WHERE id = $1",
        [electionId]
      );
      if (electionResult.rows.length > 0) {
        electionTitle = electionResult.rows[0].title;
      }
    }

    // Get voter details
    const voterResult = await query(
      "SELECT student_id, email, full_name FROM voters WHERE LOWER(wallet_address) = LOWER($1)",
      [walletAddress]
    );

    const voterStudentId = voterResult.rows[0]?.student_id || null;
    const voterName =
      voterResult.rows[0]?.full_name ||
      voterResult.rows[0]?.email?.split("@")[0] ||
      "Anonymous";

    // Save each vote
    let savedCount = 0;
    for (const vote of votes) {
      try {
        // Extract names directly from frontend request!
        const {
          categoryId,
          categoryName,
          candidateId,
          candidateName,
          transactionHash,
        } = vote;

        console.log(
          `✅ Saving vote: ${categoryName || `Category ${categoryId}`} → ${
            candidateName || `Candidate ${candidateId}`
          }`
        );

        // Insert vote history
        await query(
          `INSERT INTO vote_history (
          voter_wallet_address,
          voter_student_id,
          voter_name,
          election_id,
          election_title,
          category_id,
          category_name,
          candidate_id,
          candidate_name,
          candidate_party,
          blockchain_tx_hash
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            walletAddress,
            voterStudentId,
            voterName,
            electionId,
            electionTitle,
            categoryId, // Save blockchain category ID
            categoryName || `Category ${categoryId}`,
            candidateId, // Save blockchain candidate ID
            candidateName || `Candidate ${candidateId}`,
            null, // candidate_party - not provided from frontend yet
            transactionHash,
          ]
        );

        savedCount++;
        console.log(`✅ Saved vote: ${categoryName} -> ${candidateName}`);
      } catch (voteErr) {
        console.error("Error saving individual vote:", voteErr);
        // Continue with next vote  instead of failing completely
      }
    }

    // Send confirmation email (async, don't wait)
    if (savedCount > 0 && voterResult.rows.length > 0) {
      const voterEmail = voterResult.rows[0]?.email;
      if (voterEmail) {
        sendVoteConfirmationEmail(
          voterEmail,
          voterName,
          votes.map((v) => ({
            categoryName: v.categoryName || `Category ${v.categoryId}`,
            candidateName: v.candidateName || `Candidate ${v.candidateId}`,
          })),
          votes[0]?.transactionHash || "N/A"
        ).catch((err) =>
          console.error("Email send error (non-critical):", err)
        );
      }
    }

    return res.json({
      success: true,
      votesSaved: savedCount,
      message: `Saved ${savedCount} vote(s) to history`,
    });
  } catch (error) {
    console.error("Error saving vote history:", error);
    return res.status(500).json({
      error: "Failed to save vote history",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// =====================================================
// Get vote history for a wallet (all elections)
// =====================================================
router.get("/history/:walletAddress", async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;

    if (!walletAddress || !walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({
        error: "Invalid wallet address format",
      });
    }

    // Get all votes for this wallet, ordered by date (newest first)
    const result = await query(
      `SELECT 
        id,
        election_id,
        election_title,
        category_id,
        category_name,
        candidate_id,
        candidate_name,
        candidate_party,
        blockchain_tx_hash,
        voted_at,
        created_at
      FROM vote_history
      WHERE voter_wallet_address = $1
      ORDER BY voted_at DESC`,
      [walletAddress]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        votes: [],
        message: "No vote history found",
      });
    }

    // Group votes by election
    const votesByElection: Record<string, any> = {};

    for (const vote of result.rows) {
      const electionKey = vote.election_id || "unknown";

      if (!votesByElection[electionKey]) {
        votesByElection[electionKey] = {
          electionId: vote.election_id,
          electionTitle: vote.election_title,
          votedAt: vote.voted_at,
          votes: [],
        };
      }

      votesByElection[electionKey].votes.push({
        categoryName: vote.category_name,
        candidateName: vote.candidate_name,
        candidateParty: vote.candidate_party,
        transactionHash: vote.blockchain_tx_hash,
        timestamp: vote.voted_at,
      });
    }

    // Convert to array
    const elections = Object.values(votesByElection);

    return res.json({
      success: true,
      totalVotes: result.rows.length,
      elections,
    });
  } catch (error) {
    console.error("Error fetching vote history:", error);
    return res.status(500).json({
      error: "Failed to fetch vote history",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
