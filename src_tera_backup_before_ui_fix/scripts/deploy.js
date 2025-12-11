const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting APU VOTE deployment...\n");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📋 Deploying contracts with account:", deployer.address);

  // Get account balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy VotingSystem contract
  console.log("📝 Deploying VotingSystem contract...");
  const VotingSystem = await hre.ethers.getContractFactory("VotingSystem");
  const votingSystem = await VotingSystem.deploy();

  await votingSystem.waitForDeployment();
  const contractAddress = await votingSystem.getAddress();

  console.log("✅ VotingSystem deployed to:", contractAddress);
  console.log("👤 Admin address:", deployer.address);

  // Wait for block confirmations
  console.log("\n⏳ Waiting for block confirmations...");
  await votingSystem.deploymentTransaction().wait(5);
  console.log("✅ Confirmed!\n");

  // Update the blockchain.ts file with the new contract address
  updateBlockchainConfig(contractAddress);

  // Save deployment info
  saveDeploymentInfo({
    network: hre.network.name,
    contractAddress: contractAddress,
    adminAddress: deployer.address,
    deploymentTime: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
  });

  // Verify contract on Etherscan (if not on localhost/hardhat)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("🔍 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan!");
    } catch (error) {
      console.log("⚠️  Verification failed:", error.message);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  console.log("\n📌 Important Information:");
  console.log("   Contract Address:", contractAddress);
  console.log("   Network:", hre.network.name);
  console.log("   Admin:", deployer.address);
  console.log("\n📝 Next Steps:");
  console.log("   1. Update .env with NEXT_PUBLIC_CONTRACT_ADDRESS");
  console.log("   2. Configure voting categories in admin dashboard");
  console.log("   3. Add candidates for each position");
  console.log("   4. Set up election parameters");
  console.log("   5. Test voter registration and voting flow");
  console.log("\n" + "=".repeat(60) + "\n");
}

function updateBlockchainConfig(contractAddress) {
  const blockchainPath = path.join(__dirname, "../lib/blockchain.ts");

  try {
    let content = fs.readFileSync(blockchainPath, "utf8");
    
    // Update CONTRACT_ADDRESS
    content = content.replace(
      /const CONTRACT_ADDRESS = "[^"]*"/,
      `const CONTRACT_ADDRESS = "${contractAddress}"`
    );

    fs.writeFileSync(blockchainPath, content);
    console.log("✅ Updated lib/blockchain.ts with new contract address");
  } catch (error) {
    console.log("⚠️  Could not update blockchain.ts:", error.message);
    console.log("   Please manually update CONTRACT_ADDRESS to:", contractAddress);
  }
}

function saveDeploymentInfo(info) {
  const deploymentsDir = path.join(__dirname, "../deployments");
  
  // Create deployments directory if it doesn't exist
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  // Save deployment info
  const filename = `${info.network}-${Date.now()}.json`;
  const filepath = path.join(deploymentsDir, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(info, null, 2));
  console.log(`✅ Deployment info saved to: deployments/${filename}`);

  // Also save as latest
  const latestPath = path.join(deploymentsDir, `${info.network}-latest.json`);
  fs.writeFileSync(latestPath, JSON.stringify(info, null, 2));
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
