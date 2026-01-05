const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "evoting_db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "admin",
});

async function diagnose() {
  try {
    console.log("\n🔍 DIAGNOSTIC REPORT FOR VOTE PAGE ISSUE\n");
    console.log("=".repeat(60));

    // 1. Check if elections table exists and has data
    console.log("\n1️⃣  CHECKING ELECTIONS TABLE:");
    const electionsResult = await pool.query(
      "SELECT id, title, description, is_active, start_time, end_time FROM elections ORDER BY created_at DESC LIMIT 1"
    );

    if (electionsResult.rows.length === 0) {
      console.log("   ❌ NO ELECTIONS FOUND IN DATABASE!");
    } else {
      const election = electionsResult.rows[0];
      console.log("   ✅ Election found:");
      console.log("      - ID:", election.id);
      console.log("      - Title:", election.title);
      console.log("      - Description:", election.description);
      console.log("      - is_active:", election.is_active);
      console.log("      - Start:", election.start_time);
      console.log("      - End:", election.end_time);
    }

    // 2. Check categories
    console.log("\n2️⃣  CHECKING CATEGORIES TABLE:");
    const categoriesResult = await pool.query(
      "SELECT id, name, category_name, election_id FROM categories ORDER BY created_at ASC"
    );

    if (categoriesResult.rows.length === 0) {
      console.log("   ❌ NO CATEGORIES FOUND!");
    } else {
      console.log(`   ✅ Found ${categoriesResult.rows.length} categories:`);
      categoriesResult.rows.forEach((cat) => {
        console.log(
          `      - ${cat.name || cat.category_name} (ID: ${cat.id}, Election: ${
            cat.election_id
          })`
        );
      });
    }

    // 3. Check candidates
    console.log("\n3️⃣  CHECKING CANDIDATES TABLE:");
    const candidatesResult = await pool.query(
      "SELECT id, candidate_name, category_id, election_id FROM candidates ORDER BY created_at ASC"
    );

    if (candidatesResult.rows.length === 0) {
      console.log("   ❌ NO CANDIDATES FOUND!");
    } else {
      console.log(`   ✅ Found ${candidatesResult.rows.length} candidates:`);
      candidatesResult.rows.forEach((cand) => {
        console.log(
          `      - ${cand.candidate_name} (Category: ${cand.category_id}, Election: ${cand.election_id})`
        );
      });
    }

    // 4. Check voters
    console.log("\n4️⃣  CHECKING VOTERS TABLE:");
    const votersResult = await pool.query(
      "SELECT student_id, email, wallet_address, has_voted FROM voters ORDER BY created_at DESC LIMIT 5"
    );

    if (votersResult.rows.length === 0) {
      console.log("   ❌ NO VOTERS FOUND!");
    } else {
      console.log(`   ✅ Found ${votersResult.rows.length} recent voters:`);
      votersResult.rows.forEach((voter) => {
        console.log(`      - ${voter.student_id} (${voter.email})`);
        console.log(
          `        Wallet: ${voter.wallet_address || "NOT REGISTERED"}`
        );
        console.log(`        Voted: ${voter.has_voted}`);
      });
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ DIAGNOSTIC COMPLETE\n");
  } catch (error) {
    console.error("\n❌ DIAGNOSTIC ERROR:", error);
  } finally {
    await pool.end();
  }
}

diagnose();
