const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

/**
 * Pre-deployment checklist
 * Run before deploying: node scripts/pre-deploy-check.js
 */

console.log("🔍 APU VOTE Pre-Deployment Checklist\n");
console.log("=".repeat(60) + "\n");

let hasErrors = false;
let hasWarnings = false;

// Check 1: .env file exists
console.log("1️⃣  Checking .env file...");
if (fs.existsSync(".env")) {
  console.log("   ✅ .env file found");
  
  // Parse .env
  const envContent = fs.readFileSync(".env", "utf8");
  const envVars = {};
  
  envContent.split("\n").forEach(line => {
    const [key, ...valueParts] = line.split("=");
    if (key && !key.startsWith("#")) {
      envVars[key.trim()] = valueParts.join("=").trim();
    }
  });
  
  // Check private key
  console.log("\n2️⃣  Checking private key...");
  if (envVars.PRIVATE_KEY && envVars.PRIVATE_KEY !== "your_private_key_here_without_0x_prefix") {
    if (envVars.PRIVATE_KEY.startsWith("0x")) {
      console.log("   ⚠️  Warning: Private key has '0x' prefix - remove it!");
      hasWarnings = true;
    } else if (envVars.PRIVATE_KEY.length === 64) {
      console.log("   ✅ Private key format looks correct (64 characters)");
    } else {
      console.log("   ❌ Private key length incorrect (should be 64 characters)");
      hasErrors = true;
    }
  } else {
    console.log("   ❌ Private key not set in .env file");
    hasErrors = true;
  }
  
  // Check RPC URL
  console.log("\n3️⃣  Checking RPC URL...");
  if (envVars.HOODI_RPC_URL) {
    console.log("   ✅ RPC URL set:", envVars.HOODI_RPC_URL);
  } else {
    console.log("   ⚠️  Warning: HOODI_RPC_URL not set, will use default");
    hasWarnings = true;
  }
  
  // Check chain ID
  console.log("\n4️⃣  Checking chain configuration...");
  if (envVars.NEXT_PUBLIC_CHAIN_ID === "17000") {
    console.log("   ✅ Chain ID set to 17000 (Hoodi)");
  } else {
    console.log("   ⚠️  Warning: Chain ID not 17000, current:", envVars.NEXT_PUBLIC_CHAIN_ID);
    hasWarnings = true;
  }
  
  if (envVars.NEXT_PUBLIC_NETWORK_NAME === "hoodi") {
    console.log("   ✅ Network name set to 'hoodi'");
  } else {
    console.log("   ⚠️  Warning: Network name not 'hoodi', current:", envVars.NEXT_PUBLIC_NETWORK_NAME);
    hasWarnings = true;
  }
  
  // Check mock mode
  console.log("\n5️⃣  Checking mock mode...");
  if (envVars.NEXT_PUBLIC_ENABLE_MOCK_MODE === "false") {
    console.log("   ✅ Mock mode disabled (real blockchain transactions)");
  } else {
    console.log("   ⚠️  Warning: Mock mode enabled - transactions won't be real!");
    console.log("      Set NEXT_PUBLIC_ENABLE_MOCK_MODE=false for real deployment");
    hasWarnings = true;
  }
  
} else {
  console.log("   ❌ .env file not found!");
  console.log("   Run: cp .env.example .env");
  hasErrors = true;
}

// Check 2: Contract file exists
console.log("\n6️⃣  Checking contract file...");
if (fs.existsSync("contracts/VotingSystem.sol")) {
  console.log("   ✅ VotingSystem.sol found");
} else {
  console.log("   ❌ VotingSystem.sol not found!");
  hasErrors = true;
}

// Check 3: Hardhat config
console.log("\n7️⃣  Checking Hardhat configuration...");
if (fs.existsSync("hardhat.config.js")) {
  console.log("   ✅ hardhat.config.js found");
  
  const configContent = fs.readFileSync("hardhat.config.js", "utf8");
  if (configContent.includes("hoodi")) {
    console.log("   ✅ Hoodi network configured");
  } else {
    console.log("   ❌ Hoodi network not found in hardhat.config.js");
    hasErrors = true;
  }
} else {
  console.log("   ❌ hardhat.config.js not found!");
  hasErrors = true;
}

// Check 4: Dependencies
console.log("\n8️⃣  Checking dependencies...");
if (fs.existsSync("node_modules")) {
  console.log("   ✅ node_modules folder exists");
  
  const requiredPackages = [
    "hardhat",
    "@nomicfoundation/hardhat-toolbox",
    "ethers"
  ];
  
  let allPackagesInstalled = true;
  requiredPackages.forEach(pkg => {
    if (fs.existsSync(`node_modules/${pkg}`)) {
      console.log(`   ✅ ${pkg} installed`);
    } else {
      console.log(`   ❌ ${pkg} NOT installed`);
      allPackagesInstalled = false;
      hasErrors = true;
    }
  });
  
  if (!allPackagesInstalled) {
    console.log("\n   Run: npm install");
  }
} else {
  console.log("   ❌ node_modules not found!");
  console.log("   Run: npm install");
  hasErrors = true;
}

// Check 5: Deployment script
console.log("\n9️⃣  Checking deployment script...");
if (fs.existsSync("scripts/deploy.js")) {
  console.log("   ✅ deploy.js found");
} else {
  console.log("   ❌ deploy.js not found!");
  hasErrors = true;
}

// Final summary
console.log("\n" + "=".repeat(60));
console.log("📊 SUMMARY");
console.log("=".repeat(60) + "\n");

if (hasErrors) {
  console.log("❌ ERRORS FOUND - Cannot deploy yet!");
  console.log("\nPlease fix the errors above before deploying.\n");
  process.exit(1);
} else if (hasWarnings) {
  console.log("⚠️  WARNINGS FOUND - Review before deploying");
  console.log("\nYou can deploy, but please review the warnings above.\n");
  console.log("📝 To deploy, run:");
  console.log("   npx hardhat run scripts/deploy.js --network hoodi\n");
  process.exit(0);
} else {
  console.log("✅ ALL CHECKS PASSED!");
  console.log("\n🎉 Ready to deploy to Ethereum Hoodi!\n");
  console.log("📝 Next steps:");
  console.log("   1. Make sure you have test ETH: https://faucet.hoodi.io");
  console.log("   2. Compile contract: npx hardhat compile");
  console.log("   3. Deploy: npx hardhat run scripts/deploy.js --network hoodi\n");
  process.exit(0);
}
