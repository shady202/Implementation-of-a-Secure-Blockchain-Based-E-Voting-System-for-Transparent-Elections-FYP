/**
 * Security Test: Double Voting Attack
 *
 * Objective: Attempt to vote multiple times in the same category
 * Expected: Smart contract should reject duplicate votes
 */

const { ethers } = require("ethers");
const chalk = require("chalk");
require("dotenv").config();

// Import contract ABI (simplified for testing)
const VOTING_ABI = [
  "function vote(uint256 categoryId, uint256 candidateId) external",
  "function batchVote((uint256 categoryId, uint256 candidateId)[] votes) external",
  "function hasVotedInCategory(address voter, uint256 categoryId) external view returns (bool)",
  "function getVoterInfo(address voterAddress) external view returns (string studentId, string department, uint256 yearOfStudy, bool isRegistered, uint256 votedCategoriesCount)",
];

async function testDoubleVoting() {
  console.log(chalk.blue.bold("\n=== TEST: Double Voting Attack ===\n"));

  try {
    // Setup
    const provider = new ethers.JsonRpcProvider(
      process.env.RPC_URL || "https://rpc-testnet.hoodinetwork.io"
    );
    const wallet = new ethers.Wallet(
      process.env.TEST_VOTER_PRIVATE_KEY,
      provider
    );
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      VOTING_ABI,
      wallet
    );

    console.log(chalk.yellow("📋 Test Configuration:"));
    console.log(`   Voter Address: ${wallet.address}`);
    console.log(`   Contract: ${process.env.CONTRACT_ADDRESS}`);
    console.log(`   Network: Hoodi Testnet\n`);

    // Test parameters
    const categoryId = 1;
    const candidateId1 = 1;
    const candidateId2 = 2;

    // Step 1: Check if already voted
    console.log(chalk.cyan("Step 1: Checking initial vote status..."));
    const hasVoted = await contract.hasVotedInCategory(
      wallet.address,
      categoryId
    );
    console.log(`   Already voted in category ${categoryId}: ${hasVoted}\n`);

    if (hasVoted) {
      console.log(
        chalk.yellow("⚠️  Voter has already voted in this category.")
      );
      console.log(
        chalk.yellow(
          "   This test validates that the system prevents further votes.\n"
        )
      );
    }

    // Step 2: First vote attempt
    console.log(chalk.cyan("Step 2: Attempting first vote..."));
    console.log(`   Category: ${categoryId}, Candidate: ${candidateId1}`);

    try {
      if (!hasVoted) {
        const tx1 = await contract.vote(categoryId, candidateId1);
        console.log(chalk.green(`   ✅ Transaction submitted: ${tx1.hash}`));

        console.log(chalk.cyan("   Waiting for confirmation..."));
        const receipt1 = await tx1.wait();
        console.log(
          chalk.green(
            `   ✅ First vote confirmed in block ${receipt1.blockNumber}\n`
          )
        );
      } else {
        console.log(
          chalk.yellow("   ⏭️  Skipping first vote (already voted)\n")
        );
      }
    } catch (error) {
      console.log(chalk.red(`   ❌ First vote failed: ${error.message}\n`));
    }

    // Step 3: Second vote attempt (ATTACK)
    console.log(
      chalk.red.bold(
        "Step 3: 🚨 ATTACK - Attempting second vote in same category..."
      )
    );
    console.log(`   Category: ${categoryId}, Candidate: ${candidateId2}`);
    console.log(chalk.yellow("   Expected: Transaction should REVERT\n"));

    try {
      const tx2 = await contract.vote(categoryId, candidateId2);
      console.log(chalk.yellow(`   Transaction submitted: ${tx2.hash}`));

      const receipt2 = await tx2.wait();

      // If we reach here, the attack succeeded (BAD!)
      console.log(
        chalk.red.bold("\n❌ SECURITY FAILURE: Double vote was accepted!")
      );
      console.log(
        chalk.red(`   Transaction confirmed in block ${receipt2.blockNumber}`)
      );
      console.log(chalk.red("   🚨 CRITICAL VULNERABILITY DETECTED!\n"));

      return {
        testName: "Double Voting Attack",
        status: "FAILED",
        vulnerability: "System allows multiple votes in same category",
        severity: "CRITICAL",
      };
    } catch (error) {
      // Attack failed (GOOD!)
      console.log(chalk.green.bold("   ✅ ATTACK BLOCKED!"));
      console.log(chalk.green(`   Reason: ${error.reason || error.message}`));

      // Check for expected error message
      const errorMsg = error.message.toLowerCase();
      if (
        errorMsg.includes("already voted") ||
        errorMsg.includes("already voted in category")
      ) {
        console.log(
          chalk.green(
            '   ✅ Correct error message: "Already voted in category"'
          )
        );
      }

      console.log(
        chalk.green(
          "\n✅ TEST PASSED: Smart contract successfully prevented double voting"
        )
      );
      console.log(
        chalk.green(
          "   Security Mechanism: votedInCategory mapping enforcement\n"
        )
      );

      return {
        testName: "Double Voting Attack",
        status: "PASSED",
        securityMechanism: "Smart contract votedInCategory mapping",
        errorMessage: error.reason || error.message,
      };
    }

    // Step 4: Verify vote count
    console.log(chalk.cyan("Step 4: Verifying final vote count..."));
    const voterInfo = await contract.getVoterInfo(wallet.address);
    console.log(`   Total categories voted: ${voterInfo.votedCategoriesCount}`);
    console.log(`   Expected: 1 (only first vote counted)\n`);
  } catch (error) {
    console.log(chalk.red.bold("\n❌ TEST ERROR:"));
    console.log(chalk.red(`   ${error.message}\n`));

    return {
      testName: "Double Voting Attack",
      status: "ERROR",
      error: error.message,
    };
  }
}

// Run test if executed directly
if (require.main === module) {
  testDoubleVoting()
    .then((result) => {
      console.log(chalk.blue("\n=== Test Result ==="));
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.status === "PASSED" ? 0 : 1);
    })
    .catch((error) => {
      console.error(chalk.red("Fatal error:"), error);
      process.exit(1);
    });
}

module.exports = testDoubleVoting;
