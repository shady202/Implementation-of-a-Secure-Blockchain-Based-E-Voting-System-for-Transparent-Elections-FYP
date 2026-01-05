// Quick script to check blockchain state
import {
  getAllCategories,
  getCandidatesForCategory,
} from "./src/lib/blockchain.ts";

async function checkBlockchainState() {
  try {
    console.log("📊 Checking blockchain state...\n");

    const categories = await getAllCategories();
    console.log("Categories on blockchain:", categories);

    for (const cat of categories) {
      console.log(`\n📁 Category ${cat.id}: ${cat.name}`);
      const candidates = await getCandidatesForCategory(cat.id);
      console.log("  Candidates:", candidates);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

checkBlockchainState();
