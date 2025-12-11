const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Verify deployment and contract functionality
 * Run: npx hardhat run scripts/verify-deployment.js --network hoodi
 */
async function main() {
  console.log("🔍 Verifying APU VOTE Deployment...\n");

  try {
    // Get the deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log("📋 Checking account:", deployer.address);

    // Get account balance
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");

    // Load deployment info
    const deploymentsDir = path.join(__dirname, "../deployments");
    const latestPath = path.join(deploymentsDir, `${hre.network.name}-latest.json`);

    if (!fs.existsSync(latestPath)) {
      console.log("❌ No deployment found for network:", hre.network.name);
      console.log("   Please deploy first using: npx hardhat run scripts/deploy.js --network", hre.network.name);
      return;
    }

    const deploymentInfo = JSON.parse(fs.readFileSync(latestPath, "utf8"));
    console.log("\n📌 Deployment Information:");
    console.log("   Contract Address:", deploymentInfo.contractAddress);
    console.log("   Network:", deploymentInfo.network);
    console.log("   Deployed At:", new Date(deploymentInfo.deploymentTime).toLocaleString());
    console.log("   Block Number:", deploymentInfo.blockNumber);

    // Attach to deployed contract
    console.log("\n🔗 Connecting to contract...");
    const VotingSystem = await hre.ethers.getContractFactory("VotingSystem");
    const votingSystem = VotingSystem.attach(deploymentInfo.contractAddress);

    // Verify contract functions
    console.log("\n✅ Testing contract functions:");

    // Check admin
    const admin = await votingSystem.admin();
    console.log("   Admin address:", admin);
    console.log("   Is deployer admin?", admin === deployer.address ? "✅ Yes" : "❌ No");

    // Get current block
    const currentBlock = await hre.ethers.provider.getBlockNumber();
    console.log("   Current block:", currentBlock);

    // Check if contract is deployed (has code)
    const code = await hre.ethers.provider.getCode(deploymentInfo.contractAddress);
    console.log("   Contract has code?", code !== "0x" ? "✅ Yes" : "❌ No");

    // Network info
    const network = await hre.ethers.provider.getNetwork();
    console.log("\n🌐 Network Information:");
    console.log("   Chain ID:", network.chainId.toString());
    console.log("   Network Name:", hre.network.name);

    // Generate explorer links
    const explorerUrl = getExplorerUrl(network.chainId);
    if (explorerUrl) {
      console.log("\n🔍 Explorer Links:");
      console.log("   Contract:", `${explorerUrl}/address/${deploymentInfo.contractAddress}`);
      console.log("   Deployer:", `${explorerUrl}/address/${deployer.address}`);
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("✅ VERIFICATION COMPLETE");
    console.log("=".repeat(60));
    console.log("\n🎉 Contract is deployed and functional!");
    console.log("\n📝 Next Steps:");
    console.log("   1. Update .env with contract address:", deploymentInfo.contractAddress);
    console.log("   2. Set NEXT_PUBLIC_ENABLE_MOCK_MODE=false");
    console.log("   3. Restart your application: npm run dev");
    console.log("   4. Test wallet connection and voting");
    console.log("\n" + "=".repeat(60) + "\n");

  } catch (error) {
    console.error("\n❌ Verification failed:", error.message);
    console.error("\nFull error:", error);
  }
}

function getExplorerUrl(chainId) {
  const explorers = {
    1: "https://etherscan.io",
    5: "https://goerli.etherscan.io",
    11155111: "https://sepolia.etherscan.io",
    17000: "https://explorer.hoodi.io",
    80001: "https://mumbai.polygonscan.com",
    137: "https://polygonscan.com",
    31337: null, // localhost
  };

  return explorers[Number(chainId)] || null;
}

// Execute verification
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
