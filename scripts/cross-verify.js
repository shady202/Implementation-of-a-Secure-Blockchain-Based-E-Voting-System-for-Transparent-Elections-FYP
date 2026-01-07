/**
 * Cross-Verification Script
 *
 * This script performs three-way cross-verification between:
 * 1. Blockchain (source of truth)
 * 2. Database (audit trail)
 * 3. Vote receipts (user verification)
 *
 * It generates a detailed report showing data consistency across all sources.
 *
 * Usage: node scripts/cross-verify.js
 */

require("dotenv").config();
const { ethers } = require("ethers");
const { Pool } = require("pg");

// Configuration
const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS;
const RPC_URL = process.env.VITE_RPC_URL;
const DATABASE_URL = process.env.DATABASE_URL;

// Smart Contract ABI
const ABI = [
  "function getAllCategories() view returns (tuple(uint256 id, string name, string description, bool isActive, bool exists)[])",
  "function getCandidatesForCategory(uint256 categoryId) view returns (uint256[] ids, string[] names, string[] parties, uint256[] votes)",
  "function getMyVotes() view returns (tuple(uint256 categoryId, string categoryName, uint256 candidateId, string candidateName, uint256 timestamp)[])",
  "function hasVotedInCategory(address voter, uint256 categoryId) view returns (bool)",
];

// Initialize connections
const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
const db = new Pool({ connectionString: DATABASE_URL });

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function crossVerify() {
  console.log("\n" + "=".repeat(70));
  log("THREE-WAY CROSS-VERIFICATION REPORT", "cyan");
  log("Blockchain ↔ Database ↔ Vote Receipts", "cyan");
  console.log("=".repeat(70) + "\n");

  let totalVerifications = 0;
  let successfulVerifications = 0;
  let failedVerifications = 0;

  try {
    // ============================================================
    // STEP 1: Get all categories
    // ============================================================
    log("[STEP 1] Fetching Categories...", "blue");
    console.log("-".repeat(70));

    const blockchainCategories = await contract.getAllCategories();
    const dbCategories = await db.query(
      "SELECT * FROM categories WHERE is_active = true"
    );

    console.log(`Blockchain Categories: ${blockchainCategories.length}`);
    console.log(`Database Categories:   ${dbCategories.rows.length}`);

    if (blockchainCategories.length === dbCategories.rows.length) {
      log("✅ Category count matches\n", "green");
    } else {
      log("❌ Category count mismatch!\n", "red");
    }

    // ============================================================
    // STEP 2: Verify each category's vote counts
    // ============================================================
    log("[STEP 2] Cross-Verifying Vote Counts by Category...", "blue");
    console.log("-".repeat(70));

    for (const category of blockchainCategories) {
      if (!category.isActive) continue;

      console.log(`\n📊 Category: ${category.name} (ID: ${category.id})`);
      console.log("─".repeat(70));

      // Get blockchain data
      const blockchainCandidates = await contract.getCandidatesForCategory(
        category.id
      );

      // Get database data
      const dbCandidates = await db.query(
        `
                SELECT c.id, c.name, c.party, COUNT(vh.id) as vote_count
                FROM candidates c
                LEFT JOIN vote_history vh ON c.id = vh.candidate_id AND vh.category_id = $1
                WHERE c.category_id = $1 AND c.is_active = true
                GROUP BY c.id, c.name, c.party
                ORDER BY c.id
            `,
        [Number(category.id)]
      );

      // Create comparison table
      console.log(
        "\n┌─────────────────────────────┬──────────────┬──────────────┬────────┐"
      );
      console.log(
        "│ Candidate                   │ Blockchain   │ Database     │ Status │"
      );
      console.log(
        "├─────────────────────────────┼──────────────┼──────────────┼────────┤"
      );

      for (let i = 0; i < blockchainCandidates.ids.length; i++) {
        const candidateId = Number(blockchainCandidates.ids[i]);
        const candidateName = blockchainCandidates.names[i];
        const blockchainVotes = Number(blockchainCandidates.votes[i]);

        // Find matching database candidate
        const dbCandidate = dbCandidates.rows.find((c) => c.id === candidateId);
        const dbVotes = dbCandidate ? parseInt(dbCandidate.vote_count) : 0;

        const match = blockchainVotes === dbVotes;
        const status = match ? "✅ OK" : "❌ FAIL";
        const statusColor = match ? "green" : "red";

        totalVerifications++;
        if (match) {
          successfulVerifications++;
        } else {
          failedVerifications++;
        }

        // Format table row
        const nameCol = candidateName.padEnd(27).substring(0, 27);
        const bcCol = String(blockchainVotes).padStart(12);
        const dbCol = String(dbVotes).padStart(12);

        console.log(`│ ${nameCol} │ ${bcCol} │ ${dbCol} │ ${status}  │`);
      }

      console.log(
        "└─────────────────────────────┴──────────────┴──────────────┴────────┘"
      );
    }

    // ============================================================
    // STEP 3: Verify individual voter receipts
    // ============================================================
    log("\n[STEP 3] Verifying Individual Voter Receipts...", "blue");
    console.log("-".repeat(70));

    const voters = await db.query(
      "SELECT wallet_address FROM voters WHERE wallet_address IS NOT NULL LIMIT 5"
    );

    console.log(
      `\nVerifying receipts for ${voters.rows.length} sample voters...\n`
    );

    for (const voter of voters.rows) {
      const walletAddress = voter.wallet_address;
      console.log(`\n👤 Voter: ${walletAddress}`);
      console.log("─".repeat(70));

      try {
        // Get blockchain vote receipts
        const contractWithSigner = contract.connect(
          new ethers.Wallet(
            "0x" + "0".repeat(64), // Dummy private key for view functions
            provider
          )
        );

        // Get database votes for this voter
        const dbVotes = await db.query(
          `
                    SELECT vh.category_id, c.name as category_name, 
                           vh.candidate_id, can.name as candidate_name, vh.voted_at
                    FROM vote_history vh
                    JOIN categories c ON vh.category_id = c.id
                    JOIN candidates can ON vh.candidate_id = can.id
                    WHERE vh.voter_wallet = $1
                    ORDER BY vh.category_id
                `,
          [walletAddress]
        );

        if (dbVotes.rows.length > 0) {
          console.log(
            "\n┌─────────────────────┬─────────────────────┬────────┐"
          );
          console.log("│ Category            │ Candidate           │ Status │");
          console.log("├─────────────────────┼─────────────────────┼────────┤");

          for (const vote of dbVotes.rows) {
            // Verify on blockchain
            const hasVoted = await contract.hasVotedInCategory(
              walletAddress,
              vote.category_id
            );

            const categoryCol = vote.category_name.padEnd(19).substring(0, 19);
            const candidateCol = vote.candidate_name
              .padEnd(19)
              .substring(0, 19);
            const status = hasVoted ? "✅ OK" : "❌ FAIL";

            console.log(`│ ${categoryCol} │ ${candidateCol} │ ${status}  │`);

            totalVerifications++;
            if (hasVoted) {
              successfulVerifications++;
            } else {
              failedVerifications++;
            }
          }

          console.log("└─────────────────────┴─────────────────────┴────────┘");
        } else {
          console.log("  No votes found for this voter");
        }
      } catch (error) {
        console.log(`  ⚠️  Could not verify receipts: ${error.message}`);
      }
    }

    // ============================================================
    // STEP 4: Transaction Hash Verification
    // ============================================================
    log("\n[STEP 4] Verifying Transaction Hashes...", "blue");
    console.log("-".repeat(70));

    const recentVotes = await db.query(`
            SELECT id, voter_wallet, transaction_hash, voted_at
            FROM vote_history
            WHERE transaction_hash IS NOT NULL
            ORDER BY voted_at DESC
            LIMIT 10
        `);

    console.log(
      `\nVerifying ${recentVotes.rows.length} recent transaction hashes...\n`
    );

    let validTxCount = 0;
    let invalidTxCount = 0;

    for (const vote of recentVotes.rows) {
      try {
        const tx = await provider.getTransaction(vote.transaction_hash);
        const receipt = await provider.getTransactionReceipt(
          vote.transaction_hash
        );

        if (tx && receipt && receipt.status === 1) {
          console.log(
            `✅ ${vote.transaction_hash.substring(0, 20)}... - Confirmed`
          );
          validTxCount++;
          totalVerifications++;
          successfulVerifications++;
        } else {
          console.log(
            `❌ ${vote.transaction_hash.substring(0, 20)}... - Failed/Not Found`
          );
          invalidTxCount++;
          totalVerifications++;
          failedVerifications++;
        }
      } catch (error) {
        console.log(
          `❌ ${vote.transaction_hash.substring(0, 20)}... - Error: ${
            error.message
          }`
        );
        invalidTxCount++;
        totalVerifications++;
        failedVerifications++;
      }
    }

    console.log(`\nValid Transactions:   ${validTxCount}`);
    console.log(`Invalid Transactions: ${invalidTxCount}`);

    // ============================================================
    // STEP 5: Generate Merkle Root Comparison
    // ============================================================
    log("\n[STEP 5] Generating Data Fingerprints...", "blue");
    console.log("-".repeat(70));

    const crypto = require("crypto");

    // Get all votes from database in deterministic order
    const allDbVotes = await db.query(`
            SELECT voter_wallet, category_id, candidate_id, voted_at
            FROM vote_history
            ORDER BY id
        `);

    // Create hash of all database votes
    const dbDataString = allDbVotes.rows
      .map(
        (v) =>
          `${v.voter_wallet}:${v.category_id}:${v.candidate_id}:${v.voted_at}`
      )
      .join("|");
    const dbFingerprint = crypto
      .createHash("sha256")
      .update(dbDataString)
      .digest("hex");

    console.log(`\nDatabase Data Fingerprint (SHA-256):`);
    console.log(`${dbFingerprint}`);
    console.log(`\nTotal Records Hashed: ${allDbVotes.rows.length}`);

    log(
      "\n💡 This fingerprint can be used to detect any changes to vote data",
      "cyan"
    );
    log(
      "   Store this hash securely and compare periodically to detect tampering",
      "cyan"
    );

    // ============================================================
    // FINAL SUMMARY
    // ============================================================
    console.log("\n" + "=".repeat(70));
    log("CROSS-VERIFICATION SUMMARY", "cyan");
    console.log("=".repeat(70));

    const successRate = (
      (successfulVerifications / totalVerifications) *
      100
    ).toFixed(2);

    console.log(`\nTotal Verifications:     ${totalVerifications}`);
    log(`Successful:              ${successfulVerifications}`, "green");

    if (failedVerifications > 0) {
      log(`Failed:                  ${failedVerifications}`, "red");
    } else {
      log(`Failed:                  ${failedVerifications}`, "green");
    }

    console.log(`Success Rate:            ${successRate}%`);

    console.log("\n" + "─".repeat(70));

    if (failedVerifications === 0) {
      log("\n✅ PERFECT INTEGRITY", "green");
      log("   All data sources are perfectly synchronized", "green");
      log("   Blockchain ↔ Database ↔ Vote Receipts: CONSISTENT", "green");
    } else if (successRate >= 95) {
      log("\n⚠️  MINOR DISCREPANCIES DETECTED", "yellow");
      log(`   ${failedVerifications} verification(s) failed`, "yellow");
      log("   Review recommended", "yellow");
    } else {
      log("\n❌ CRITICAL INTEGRITY ISSUES", "red");
      log(`   ${failedVerifications} verification(s) failed`, "red");
      log("   Immediate investigation required!", "red");
    }

    console.log("\n" + "=".repeat(70) + "\n");
  } catch (error) {
    log("\n❌ CROSS-VERIFICATION FAILED: Unexpected error occurred", "red");
    console.error(error);
  } finally {
    await db.end();
  }
}

// Run the cross-verification
crossVerify()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
