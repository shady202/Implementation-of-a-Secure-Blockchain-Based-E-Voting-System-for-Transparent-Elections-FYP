/**
 * Script to automatically generate TypeScript ABI from compiled Solidity contracts
 * Run this after compiling contracts with: npm run compile
 * Then run: node scripts/generate-abi.js
 */

const fs = require("fs");
const path = require("path");

// Paths
const ARTIFACTS_PATH = path.join(__dirname, "../artifacts/contracts");
const OUTPUT_PATH = path.join(__dirname, "../lib");
const CONTRACT_NAME = "VotingSystem";

function main() {
  console.log("🔄 Generating ABI from compiled contracts...\n");

  // Read the compiled contract artifact
  const artifactPath = path.join(
    ARTIFACTS_PATH,
    `${CONTRACT_NAME}.sol`,
    `${CONTRACT_NAME}.json`
  );

  if (!fs.existsSync(artifactPath)) {
    console.error(`❌ Contract artifact not found at: ${artifactPath}`);
    console.error(
      "   Please compile contracts first with: npm run compile\n"
    );
    process.exit(1);
  }

  try {
    // Read and parse the artifact
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const abi = artifact.abi;

    console.log(`✅ Found ${CONTRACT_NAME} contract`);
    console.log(`   Functions: ${abi.filter((item) => item.type === "function").length}`);
    console.log(`   Events: ${abi.filter((item) => item.type === "event").length}`);
    console.log(`   Constructor: ${abi.filter((item) => item.type === "constructor").length}\n`);

    // Generate TypeScript file content
    const tsContent = `// ABI for the ${CONTRACT_NAME} smart contract
// Auto-generated from compiled artifacts
// DO NOT EDIT MANUALLY - Run 'node scripts/generate-abi.js' to regenerate

const ${CONTRACT_NAME}ABI = ${JSON.stringify(abi, null, 2)}

export default ${CONTRACT_NAME}ABI
`;

    // Write to output file
    const outputFile = path.join(OUTPUT_PATH, `${CONTRACT_NAME}ABI.ts`);
    fs.writeFileSync(outputFile, tsContent);

    console.log(`✅ Generated ABI file: ${outputFile}`);
    console.log(`   File size: ${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB\n`);

    // Also generate a summary file
    generateSummary(abi);

    console.log("✅ Done! ABI generation complete.\n");
    console.log("📝 Next steps:");
    console.log("   1. Update CONTRACT_ADDRESS in lib/blockchain.ts");
    console.log("   2. Update .env with deployment details");
    console.log("   3. Test the contract integration\n");
  } catch (error) {
    console.error("❌ Error generating ABI:", error.message);
    process.exit(1);
  }
}

function generateSummary(abi) {
  const summaryPath = path.join(OUTPUT_PATH, `${CONTRACT_NAME}ABI.md`);

  let summary = `# ${CONTRACT_NAME} Contract ABI\n\n`;
  summary += `Auto-generated on: ${new Date().toISOString()}\n\n`;

  // Functions
  const functions = abi.filter((item) => item.type === "function");
  if (functions.length > 0) {
    summary += `## Functions (${functions.length})\n\n`;
    functions.forEach((fn) => {
      const inputs = fn.inputs.map((i) => `${i.type} ${i.name}`).join(", ");
      const outputs = fn.outputs?.map((o) => o.type).join(", ") || "void";
      summary += `### ${fn.name}\n`;
      summary += `- **Inputs**: ${inputs || "none"}\n`;
      summary += `- **Outputs**: ${outputs}\n`;
      summary += `- **State Mutability**: ${fn.stateMutability}\n\n`;
    });
  }

  // Events
  const events = abi.filter((item) => item.type === "event");
  if (events.length > 0) {
    summary += `## Events (${events.length})\n\n`;
    events.forEach((event) => {
      const inputs = event.inputs
        .map((i) => `${i.indexed ? "indexed " : ""}${i.type} ${i.name}`)
        .join(", ");
      summary += `### ${event.name}\n`;
      summary += `- **Parameters**: ${inputs}\n\n`;
    });
  }

  fs.writeFileSync(summaryPath, summary);
  console.log(`✅ Generated summary: ${summaryPath}`);
}

// Run the script
main();
