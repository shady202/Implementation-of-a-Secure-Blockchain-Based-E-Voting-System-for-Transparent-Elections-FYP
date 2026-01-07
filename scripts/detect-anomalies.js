/**
 * Anomaly Detection Script
 *
 * This script detects suspicious patterns that might indicate tampering attempts:
 * 1. Burst voting (multiple votes in very short time periods)
 * 2. Unusual voting patterns
 * 3. Statistical anomalies in vote distribution
 * 4. Suspicious wallet activity
 *
 * Usage: node scripts/detect-anomalies.js
 */

require("dotenv").config();
const { Pool } = require("pg");

const DATABASE_URL = process.env.DATABASE_URL;
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

async function detectAnomalies() {
  console.log("\n" + "=".repeat(60));
  log("ANOMALY DETECTION - TAMPERING ATTEMPT ANALYSIS", "cyan");
  console.log("=".repeat(60) + "\n");

  let anomalyCount = 0;

  try {
    // ============================================================
    // ANOMALY 1: Burst Voting Detection
    // ============================================================
    log("[ANOMALY 1] Detecting Burst Voting Patterns...", "blue");
    console.log("-".repeat(60));

    const votes = await db.query(`
            SELECT id, voter_wallet, voted_at, transaction_hash
            FROM vote_history
            ORDER BY voted_at
        `);

    let burstCount = 0;
    const burstThreshold = 1000; // 1 second in milliseconds
    const burstGroups = [];

    for (let i = 1; i < votes.rows.length; i++) {
      const prevTime = new Date(votes.rows[i - 1].voted_at).getTime();
      const currTime = new Date(votes.rows[i].voted_at).getTime();
      const timeDiff = currTime - prevTime;

      if (timeDiff < burstThreshold) {
        burstCount++;
        burstGroups.push({
          vote1: votes.rows[i - 1],
          vote2: votes.rows[i],
          timeDiff: timeDiff,
        });
      }
    }

    if (burstCount > 10) {
      log(
        `⚠️  ANOMALY DETECTED: ${burstCount} votes cast within 1 second of each other`,
        "yellow"
      );
      log("   This could indicate automated voting or bot activity", "yellow");

      console.log("\n   Top 5 fastest consecutive votes:");
      burstGroups
        .sort((a, b) => a.timeDiff - b.timeDiff)
        .slice(0, 5)
        .forEach((group, idx) => {
          console.log(`   ${idx + 1}. ${group.timeDiff}ms gap between votes`);
          console.log(
            `      Voter 1: ${group.vote1.voter_wallet.substring(0, 10)}...`
          );
          console.log(
            `      Voter 2: ${group.vote2.voter_wallet.substring(0, 10)}...`
          );
        });

      anomalyCount++;
    } else {
      log(
        `✅ No burst voting detected (${burstCount} rapid votes is normal)`,
        "green"
      );
    }

    // ============================================================
    // ANOMALY 2: Same Wallet Multiple Votes Detection
    // ============================================================
    log("\n[ANOMALY 2] Detecting Multiple Votes from Same Wallet...", "blue");
    console.log("-".repeat(60));

    const multipleVotes = await db.query(`
            SELECT voter_wallet, COUNT(*) as vote_count
            FROM vote_history
            GROUP BY voter_wallet
            HAVING COUNT(*) > (SELECT COUNT(*) FROM categories WHERE is_active = true)
        `);

    if (multipleVotes.rows.length > 0) {
      log(
        `⚠️  ANOMALY DETECTED: ${multipleVotes.rows.length} wallets with excessive votes`,
        "yellow"
      );
      multipleVotes.rows.forEach((wallet) => {
        console.log(
          `   Wallet: ${wallet.voter_wallet}, Votes: ${wallet.vote_count}`
        );
      });
      anomalyCount++;
    } else {
      log("✅ No wallets with excessive votes detected", "green");
    }

    // ============================================================
    // ANOMALY 3: Voting Outside Election Hours
    // ============================================================
    log("\n[ANOMALY 3] Detecting Votes Outside Election Timeframe...", "blue");
    console.log("-".repeat(60));

    const electionInfo = await db.query(`
            SELECT start_date, end_date FROM elections WHERE id = 1
        `);

    if (electionInfo.rows.length > 0) {
      const startDate = electionInfo.rows[0].start_date;
      const endDate = electionInfo.rows[0].end_date;

      const outsideVotes = await db.query(
        `
                SELECT id, voter_wallet, voted_at
                FROM vote_history
                WHERE voted_at < $1 OR voted_at > $2
            `,
        [startDate, endDate]
      );

      if (outsideVotes.rows.length > 0) {
        log(
          `⚠️  ANOMALY DETECTED: ${outsideVotes.rows.length} votes cast outside election timeframe`,
          "yellow"
        );
        outsideVotes.rows.forEach((vote) => {
          console.log(`   Vote ID: ${vote.id}, Time: ${vote.voted_at}`);
        });
        anomalyCount++;
      } else {
        log("✅ All votes cast within election timeframe", "green");
      }
    } else {
      log("⚠️  No election data found in database", "yellow");
    }

    // ============================================================
    // ANOMALY 4: Statistical Vote Distribution Analysis
    // ============================================================
    log("\n[ANOMALY 4] Analyzing Vote Distribution Patterns...", "blue");
    console.log("-".repeat(60));

    const categories = await db.query(`
            SELECT id, name FROM categories WHERE is_active = true
        `);

    for (const category of categories.rows) {
      const candidateVotes = await db.query(
        `
                SELECT c.name, COUNT(vh.id) as vote_count
                FROM candidates c
                LEFT JOIN vote_history vh ON c.id = vh.candidate_id AND vh.category_id = $1
                WHERE c.category_id = $1 AND c.is_active = true
                GROUP BY c.id, c.name
                ORDER BY vote_count DESC
            `,
        [category.id]
      );

      if (candidateVotes.rows.length > 0) {
        const votes = candidateVotes.rows.map((c) => parseInt(c.vote_count));
        const totalVotes = votes.reduce((sum, v) => sum + v, 0);
        const avgVotes = totalVotes / votes.length;

        // Calculate standard deviation
        const variance =
          votes.reduce((sum, v) => sum + Math.pow(v - avgVotes, 2), 0) /
          votes.length;
        const stdDev = Math.sqrt(variance);

        console.log(`\nCategory: ${category.name}`);
        console.log(`  Total Votes: ${totalVotes}`);
        console.log(`  Average per Candidate: ${avgVotes.toFixed(2)}`);
        console.log(`  Standard Deviation: ${stdDev.toFixed(2)}`);

        // Check for extreme outliers (votes > 3 standard deviations from mean)
        const outliers = candidateVotes.rows.filter((c) => {
          const voteCount = parseInt(c.vote_count);
          return Math.abs(voteCount - avgVotes) > 3 * stdDev;
        });

        if (outliers.length > 0 && totalVotes > 10) {
          log(
            `  ⚠️  ANOMALY: ${outliers.length} candidates with extreme vote counts`,
            "yellow"
          );
          outliers.forEach((candidate) => {
            console.log(
              `     ${candidate.name}: ${candidate.vote_count} votes (${(
                (candidate.vote_count / totalVotes) *
                100
              ).toFixed(1)}%)`
            );
          });
          anomalyCount++;
        } else {
          log(`  ✅ Vote distribution appears normal`, "green");
        }
      }
    }

    // ============================================================
    // ANOMALY 5: Duplicate Transaction Hashes
    // ============================================================
    log("\n[ANOMALY 5] Checking for Duplicate Transaction Hashes...", "blue");
    console.log("-".repeat(60));

    const duplicateTxs = await db.query(`
            SELECT transaction_hash, COUNT(*) as count
            FROM vote_history
            WHERE transaction_hash IS NOT NULL
            GROUP BY transaction_hash
            HAVING COUNT(*) > 1
        `);

    if (duplicateTxs.rows.length > 0) {
      log(
        `⚠️  ANOMALY DETECTED: ${duplicateTxs.rows.length} duplicate transaction hashes`,
        "yellow"
      );
      log(
        "   This indicates possible replay attack or database corruption",
        "yellow"
      );
      duplicateTxs.rows.forEach((tx) => {
        console.log(`   TX: ${tx.transaction_hash}, Count: ${tx.count}`);
      });
      anomalyCount++;
    } else {
      log("✅ All transaction hashes are unique", "green");
    }

    // ============================================================
    // ANOMALY 6: Unregistered Voter Detection
    // ============================================================
    log("\n[ANOMALY 6] Detecting Votes from Unregistered Wallets...", "blue");
    console.log("-".repeat(60));

    const unregisteredVotes = await db.query(`
            SELECT vh.id, vh.voter_wallet, vh.voted_at
            FROM vote_history vh
            LEFT JOIN voters v ON vh.voter_wallet = v.wallet_address
            WHERE v.id IS NULL
        `);

    if (unregisteredVotes.rows.length > 0) {
      log(
        `⚠️  ANOMALY DETECTED: ${unregisteredVotes.rows.length} votes from unregistered wallets`,
        "red"
      );
      log("   This is a CRITICAL security issue!", "red");
      unregisteredVotes.rows.forEach((vote) => {
        console.log(`   Vote ID: ${vote.id}, Wallet: ${vote.voter_wallet}`);
      });
      anomalyCount++;
    } else {
      log("✅ All votes are from registered wallets", "green");
    }

    // ============================================================
    // ANOMALY 7: Voting Pattern Timeline Analysis
    // ============================================================
    log("\n[ANOMALY 7] Analyzing Voting Timeline Patterns...", "blue");
    console.log("-".repeat(60));

    const hourlyVotes = await db.query(`
            SELECT 
                EXTRACT(HOUR FROM voted_at) as hour,
                COUNT(*) as vote_count
            FROM vote_history
            GROUP BY EXTRACT(HOUR FROM voted_at)
            ORDER BY hour
        `);

    if (hourlyVotes.rows.length > 0) {
      console.log("\n  Votes by Hour:");
      const voteCounts = hourlyVotes.rows.map((h) => parseInt(h.vote_count));
      const maxVotes = Math.max(...voteCounts);
      const avgVotes =
        voteCounts.reduce((sum, v) => sum + v, 0) / voteCounts.length;

      hourlyVotes.rows.forEach((hour) => {
        const voteCount = parseInt(hour.vote_count);
        const bar = "█".repeat(Math.round((voteCount / maxVotes) * 30));
        const anomaly = voteCount > avgVotes * 3 ? " ⚠️" : "";
        console.log(
          `  ${String(hour.hour).padStart(
            2,
            "0"
          )}:00 | ${bar} ${voteCount}${anomaly}`
        );
      });

      const suspiciousHours = hourlyVotes.rows.filter(
        (h) => parseInt(h.vote_count) > avgVotes * 3
      );
      if (suspiciousHours.length > 0) {
        log(
          `\n  ⚠️  ${suspiciousHours.length} hours with unusually high voting activity`,
          "yellow"
        );
        anomalyCount++;
      } else {
        log("\n  ✅ Voting timeline appears normal", "green");
      }
    }

    // ============================================================
    // SUMMARY
    // ============================================================
    console.log("\n" + "=".repeat(60));
    log("ANOMALY DETECTION SUMMARY", "cyan");
    console.log("=".repeat(60));
    console.log(`Total Anomalies Detected: ${anomalyCount}`);

    if (anomalyCount === 0) {
      log("\n✅ NO ANOMALIES DETECTED", "green");
      log(
        "   System appears to be operating normally with no signs of tampering",
        "green"
      );
    } else if (anomalyCount <= 2) {
      log(`\n⚠️  ${anomalyCount} MINOR ANOMALIES DETECTED`, "yellow");
      log("   Review recommended but not critical", "yellow");
    } else {
      log(`\n❌ ${anomalyCount} ANOMALIES DETECTED`, "red");
      log("   Immediate investigation required!", "red");
    }

    console.log("=".repeat(60) + "\n");
  } catch (error) {
    log("\n❌ ANOMALY DETECTION FAILED: Unexpected error occurred", "red");
    console.error(error);
  } finally {
    await db.end();
  }
}

// Run the detection
detectAnomalies()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
