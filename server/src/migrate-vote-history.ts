/**
 * Migration: Fix vote_history UUID columns
 * Changes category_id and candidate_id from UUID to TEXT
 * to accept blockchain integer IDs
 */

import { query } from "./db";

async function migrateVoteHistoryColumns() {
  console.log("🔧 Starting migration: Fix vote_history UUID columns...");

  try {
    console.log("Step 1: Dropping foreign key constraints...");

    // Drop foreign key constraints
    await query(`
      ALTER TABLE vote_history 
      DROP CONSTRAINT IF EXISTS vote_history_category_id_fkey,
      DROP CONSTRAINT IF EXISTS vote_history_candidate_id_fkey;
    `);

    console.log("✅ Foreign key constraints dropped");
    console.log("");
    console.log("Step 2: Changing column types...");

    // Change category_id and candidate_id from UUID to TEXT
    await query(`
      ALTER TABLE vote_history 
      ALTER COLUMN category_id TYPE TEXT,
      ALTER COLUMN candidate_id TYPE TEXT;
    `);

    console.log("✅ Migration successful!");
    console.log("   - category_id: UUID → TEXT");
    console.log("   - candidate_id: UUID → TEXT");
    console.log("");
    console.log("🎉 Votes can now be saved with blockchain IDs!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrateVoteHistoryColumns();
