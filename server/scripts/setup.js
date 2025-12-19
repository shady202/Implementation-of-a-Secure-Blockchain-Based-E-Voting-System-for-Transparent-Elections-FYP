const fs = require("fs");
const path = require("path");
require("dotenv").config();

const envExample = path.join(__dirname, "../.env.example");
const envFile = path.join(__dirname, "../.env");

console.log("🔧 Setting up server environment...\n");

// Copy .env.example to .env if it doesn't exist
if (!fs.existsSync(envFile)) {
  console.log("📝 Creating .env file from .env.example...");
  fs.copyFileSync(envExample, envFile);
  console.log("✅ .env file created");
  console.log(
    "\n⚠️  IMPORTANT: Please update .env with your PostgreSQL credentials!"
  );
  console.log("   Edit: server/.env\n");
} else {
  console.log("✅ .env file already exists");
}

// Check if DATABASE_URL is configured
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl || dbUrl.includes("your_password_here")) {
  console.log("\n❌ Database not configured!");
  console.log(
    "   Please update DATABASE_URL in server/.env with your PostgreSQL credentials"
  );
  process.exit(1);
}

console.log("\n✅ Environment configured");
console.log("\n📊 Next steps:");
console.log("   1. Make sure PostgreSQL is running");
console.log("   2. Run: cd server && npm install");
console.log("   3. Run migration: node scripts/migrate.js");
console.log("   4. Start server: npm run dev\n");
