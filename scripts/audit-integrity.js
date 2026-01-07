/**
 * Integrity Audit Script
 *
 * This script performs comprehensive integrity checks to verify that:
 * 1. Blockchain vote counts match database vote counts
 * 2. All database votes exist on blockchain
 * 3. No double votes exist
 * 4. Election results are consistent across all sources
 *
 * Usage: node scripts/audit-integrity.js
 */

require("dotenv").config();
const { ethers } = require("ethers");
const { Pool } = require("pg");

// Configuration
const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS;
const RPC_URL = process.env.VITE_RPC_URL;
const DATABASE_URL = process.env.DATABASE_URL;

// Smart Contract ABI (minimal - only functions we need)
const ABI = [
  "function currentElection() view returns (string title, uint256 startTime, uint256 endTime, uint8 state, uint256 totalVoters, uint256 totalVotes)",
  "function getAllCategories() view returns (tuple(uint256 id, string name, string description, bool isActive, bool exists)[])",
  "function getCandidatesForCategory(uint256 categoryId) view returns (uint256[] ids, string[] names, string[] parties, uint256[] votes)",
  "function hasVotedInCategory(address voter, uint256 categoryId) view returns (bool)",
  "function getVoterInfo(address voterAddress) view returns (string studentId, string department, uint256 yearOfStudy, bool isRegistered, uint256 votedCategoriesCount)",
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
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function auditSystemIntegrity() {
  console.log("\n" + "=".repeat(60));
  log("BLOCKCHAIN E-VOTING SYSTEM - INTEGRITY AUDIT", "cyan");
  console.log("=".repeat(60) + "\n");

  const startTime = Date.now();
  let totalChecks = 0;
  let passedChecks = 0;
  let failedChecks = 0;

  try {
    // ============================================================
    // CHECK 1: Verify Vote Count Consistency
    // ============================================================
    log("\n[CHECK 1] Verifying Vote Count Consistency...", "blue");
    console.log("-".repeat(60));
    totalChecks++;

    const election = await contract.currentElection();
    const blockchainTotalVotes = Number(election.totalVotes);

    const dbVoteCountResult = await db.query(
      "SELECT COUNT(*) FROM vote_history"
    );
    const dbTotalVotes = parseInt(dbVoteCountResult.rows[0].count);

    console.log(`Blockchain Total Votes: ${blockchainTotalVotes}`);
    console.log(`Database Total Votes:   ${dbTotalVotes}`);

    if (blockchainTotalVotes === dbTotalVotes) {
      log("✅ PASS: Vote counts are consistent", "green");
      passedChecks++;
    } else {
      log("❌ FAIL: Vote count mismatch detected!", "red");
      log(
        `   Discrepancy: ${Math.abs(
          blockchainTotalVotes - dbTotalVotes
        )} votes`,
        "red"
      );
      failedChecks++;
    }

    // ============================================================
    // CHECK 2: Verify All Database Votes Exist on Blockchain
    // ============================================================
    log("\n[CHECK 2] Verifying Database Votes on Blockchain...", "blue");
    console.log("-".repeat(60));
    totalChecks++;

    const dbVotes = await db.query(
      "SELECT transaction_hash FROM vote_history WHERE transaction_hash IS NOT NULL"
    );
    console.log(`Total database votes to verify: ${dbVotes.rows.length}`);

    let missingTxCount = 0;
    for (const vote of dbVotes.rows) {
      try {
        const tx = await provider.getTransaction(vote.transaction_hash);
        if (!tx) {
          log(`❌ Missing transaction: ${vote.transaction_hash}`, "red");
          missingTxCount++;
        }
      } catch (error) {
        log(`❌ Error fetching transaction: ${vote.transaction_hash}`, "red");
        missingTxCount++;
      }
    }

    if (missingTxCount === 0) {
      log("✅ PASS: All database votes verified on blockchain", "green");
      passedChecks++;
    } else {
      log(
        `❌ FAIL: ${missingTxCount} database votes not found on blockchain`,
        "red"
      );
      failedChecks++;
    }

    // ============================================================
    // CHECK 3: Verify No Double Votes
    // ============================================================
    log("\n[CHECK 3] Checking for Double Votes...", "blue");
    console.log("-".repeat(60));
    totalChecks++;

    const doubleVotes = await db.query(`
            SELECT voter_wallet, category_id, COUNT(*) as vote_count
            FROM vote_history
            GROUP BY voter_wallet, category_id
            HAVING COUNT(*) > 1
        `);

    if (doubleVotes.rows.length === 0) {
      log("✅ PASS: No double votes detected", "green");
      passedChecks++;
    } else {
      log(
        `❌ FAIL: ${doubleVotes.rows.length} double vote instances detected!`,
        "red"
      );
      doubleVotes.rows.forEach((dv) => {
        log(
          `   Voter: ${dv.voter_wallet}, Category: ${dv.category_id}, Votes: ${dv.vote_count}`,
          "red"
        );
      });
      failedChecks++;
    }

    // ============================================================
    // CHECK 4: Verify Candidate Vote Counts
    // ============================================================
    log("\n[CHECK 4] Verifying Candidate Vote Counts...", "blue");
    console.log("-".repeat(60));
    totalChecks++;

    const categories = await contract.getAllCategories();
    let candidateMismatchCount = 0;

    for (const category of categories) {
      if (!category.isActive) continue;

      console.log(`\nCategory: ${category.name} (ID: ${category.id})`);

      // Get blockchain vote counts
      const candidates = await contract.getCandidatesForCategory(category.id);

      // Get database vote counts
      const dbCandidateVotes = await db.query(
        `
                SELECT candidate_id, COUNT(*) as vote_count
                FROM vote_history
                WHERE category_id = $1
                GROUP BY candidate_id
            `,
        [Number(category.id)]
      );

      // Create map for easy lookup
      const dbVoteMap = {};
      dbCandidateVotes.rows.forEach((row) => {
        dbVoteMap[row.candidate_id] = parseInt(row.vote_count);
      });

      // Compare each candidate
      for (let i = 0; i < candidates.ids.length; i++) {
        const candidateId = Number(candidates.ids[i]);
        const blockchainVotes = Number(candidates.votes[i]);
        const dbVotes = dbVoteMap[candidateId] || 0;

        const match = blockchainVotes === dbVotes;
        const status = match ? "✅" : "❌";

        console.log(
          `  ${status} ${candidates.names[i]}: Blockchain=${blockchainVotes}, DB=${dbVotes}`
        );

        if (!match) {
          candidateMismatchCount++;
        }
      }
    }

    if (candidateMismatchCount === 0) {
      log("\n✅ PASS: All candidate vote counts match", "green");
      passedChecks++;
    } else {
      log(
        `\n❌ FAIL: ${candidateMismatchCount} candidate vote count mismatches`,
        "red"
      );
      failedChecks++;
    }

    // ============================================================
    // CHECK 5: Verify Voter Registration Consistency
    // ============================================================
    log("\n[CHECK 5] Verifying Voter Registration Consistency...", "blue");
    console.log("-".repeat(60));
    totalChecks++;

    const blockchainTotalVoters = Number(election.totalVoters);
    const dbVoterCount = await db.query(
      "SELECT COUNT(*) FROM voters WHERE wallet_address IS NOT NULL"
    );
    const dbTotalVoters = parseInt(dbVoterCount.rows[0].count);

    console.log(`Blockchain Registered Voters: ${blockchainTotalVoters}`);
    console.log(`Database Registered Voters:   ${dbTotalVoters}`);

    if (blockchainTotalVoters === dbTotalVoters) {
      log("✅ PASS: Voter registration counts match", "green");
      passedChecks++;
    } else {
      log("❌ FAIL: Voter registration count mismatch", "red");
      failedChecks++;
    }

    // ============================================================
    // CHECK 6: Verify Vote Timestamps
    // ============================================================
    log("\n[CHECK 6] Verifying Vote Timestamps...", "blue");
    console.log("-".repeat(60));
    totalChecks++;

    const electionStartTime = Number(election.startTime);
    const electionEndTime = Number(election.endTime);

    const invalidTimestamps = await db.query(
      `
            SELECT id, voted_at, transaction_hash
            FROM vote_history
            WHERE EXTRACT(EPOCH FROM voted_at) < $1 OR EXTRACT(EPOCH FROM voted_at) > $2
        `,
      [electionStartTime, electionEndTime]
    );

    if (invalidTimestamps.rows.length === 0) {
      log("✅ PASS: All votes cast within election timeframe", "green");
      passedChecks++;
    } else {
      log(
        `❌ FAIL: ${invalidTimestamps.rows.length} votes with invalid timestamps`,
        "red"
      );
      invalidTimestamps.rows.forEach((vote) => {
        log(`   Vote ID: ${vote.id}, Timestamp: ${vote.voted_at}`, "red");
      });
      failedChecks++;
    }

    // ============================================================
    // SUMMARY
    // ============================================================
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log("\n" + "=".repeat(60));
    log("AUDIT SUMMARY", "cyan");
    console.log("=".repeat(60));
    console.log(`Total Checks:  ${totalChecks}`);
    log(`Passed:        ${passedChecks}`, "green");
    if (failedChecks > 0) {
      log(`Failed:        ${failedChecks}`, "red");
    } else {
      log(`Failed:        ${failedChecks}`, "green");
    }
    console.log(`Duration:      ${duration}s`);
    console.log("=".repeat(60));

    if (failedChecks === 0) {
      log("\n✅ INTEGRITY VERIFIED: System is tamper-free!", "green");
    } else {
      log("\n❌ INTEGRITY COMPROMISED: Discrepancies detected!", "red");
      log("   Immediate investigation required.", "yellow");
    }
  } catch (error) {
    log("\n❌ AUDIT FAILED: Unexpected error occurred", "red");
    console.error(error);
  } finally {
    await db.end();
  }
}

// Run the audit
auditSystemIntegrity()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
