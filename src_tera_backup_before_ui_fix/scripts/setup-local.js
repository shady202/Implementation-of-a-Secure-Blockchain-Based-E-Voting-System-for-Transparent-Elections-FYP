const hre = require("hardhat");

/**
 * Local development setup script
 * This script deploys the contract and sets up initial data for testing
 */
async function main() {
  console.log("🔧 Setting up local development environment...\n");

  // Get signers
  const [admin, voter1, voter2, voter3] = await hre.ethers.getSigners();
  
  console.log("📋 Accounts:");
  console.log("   Admin:", admin.address);
  console.log("   Voter 1:", voter1.address);
  console.log("   Voter 2:", voter2.address);
  console.log("   Voter 3:", voter3.address);
  console.log("");

  // Deploy contract
  console.log("📝 Deploying VotingSystem contract...");
  const VotingSystem = await hre.ethers.getContractFactory("VotingSystem");
  const votingSystem = await VotingSystem.deploy();
  await votingSystem.waitForDeployment();
  const contractAddress = await votingSystem.getAddress();
  console.log("✅ Contract deployed to:", contractAddress, "\n");

  // Create election
  console.log("🗳️  Creating election...");
  const now = Math.floor(Date.now() / 1000);
  const startTime = now + 60; // Start in 1 minute
  const endTime = now + 86400 * 7; // End in 7 days
  
  await votingSystem.createElection("APU Student Union Election 2025", startTime, endTime);
  console.log("✅ Election created\n");

  // Add candidates for President
  console.log("👥 Adding candidates for President...");
  await votingSystem.addCandidate("Emmy Lopez", "President", "Progress Party");
  await votingSystem.addCandidate("Maria Garcia", "President", "Student Voice");
  await votingSystem.addCandidate("David Kim", "President", "Independent");
  console.log("✅ Added 3 presidential candidates\n");

  // Add candidates for Vice President
  console.log("👥 Adding candidates for Vice President...");
  await votingSystem.addCandidate("Sarah Williams", "Vice President", "Progress Party");
  await votingSystem.addCandidate("James Wilson", "Vice President", "Student Voice");
  await votingSystem.addCandidate("Emily Chen", "Vice President", "Independent");
  console.log("✅ Added 3 vice presidential candidates\n");

  // Add candidates for Secretary
  console.log("👥 Adding candidates for Secretary...");
  await votingSystem.addCandidate("Michael Brown", "Secretary", "Progress Party");
  await votingSystem.addCandidate("Jessica Lee", "Secretary", "Student Voice");
  console.log("✅ Added 2 secretary candidates\n");

  // Register voters
  console.log("📝 Registering sample voters...");
  await votingSystem.connect(voter1).registerVoter("TP12345", "Computer Science", 3);
  await votingSystem.connect(voter2).registerVoter("TP12346", "Engineering", 2);
  await votingSystem.connect(voter3).registerVoter("TP12347", "Business", 4);
  console.log("✅ Registered 3 voters\n");

  // Start election
  console.log("▶️  Starting election...");
  await votingSystem.startElection();
  console.log("✅ Election started\n");

  console.log("=".repeat(60));
  console.log("🎉 LOCAL SETUP COMPLETE!");
  console.log("=".repeat(60));
  console.log("\n📌 Contract Details:");
  console.log("   Address:", contractAddress);
  console.log("   Admin:", admin.address);
  console.log("\n📊 Test Data:");
  console.log("   Positions: President, Vice President, Secretary");
  console.log("   Total Candidates: 8");
  console.log("   Registered Voters: 3");
  console.log("\n🔐 Test Accounts:");
  console.log("   Admin Login:");
  console.log("      Email: admin@apu.edu.my");
  console.log("      Password: admin123");
  console.log("\n   Student Login:");
  console.log("      Student ID: TP12345");
  console.log("      Password: password123");
  console.log("\n🌐 Frontend URL: http://localhost:3000");
  console.log("   Update lib/blockchain.ts with contract address:", contractAddress);
  console.log("\n" + "=".repeat(60) + "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  });
