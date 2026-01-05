const fetch = require("node-fetch");

async function testAPIs() {
  const API_URL = "http://localhost:3001";

  console.log("\n🧪 TESTING API ENDPOINTS\n");
  console.log("=".repeat(60));

  try {
    // Test 1: /api/elections/current
    console.log("\n1️⃣  Testing GET /api/elections/current");
    const electionRes = await fetch(`${API_URL}/api/elections/current`);
    const electionData = await electionRes.json();
    console.log("   Status:", electionRes.status);
    console.log("   Response:", JSON.stringify(electionData, null, 2));

    // Test 2: /api/categories
    console.log("\n2️⃣  Testing GET /api/categories");
    const categoriesRes = await fetch(`${API_URL}/api/categories`);
    const categoriesData = await categoriesRes.json();
    console.log("   Status:", categoriesRes.status);
    console.log("   Response:", JSON.stringify(categoriesData, null, 2));

    // Test 3: /api/candidates
    console.log("\n3️⃣  Testing GET /api/candidates");
    const candidatesRes = await fetch(`${API_URL}/api/candidates`);
    const candidatesData = await candidatesRes.json();
    console.log("   Status:", candidatesRes.status);
    console.log("   Response:", JSON.stringify(candidatesData, null, 2));

    console.log("\n" + "=".repeat(60));
    console.log("✅ API TESTS COMPLETE\n");
  } catch (error) {
    console.error("\n❌ API TEST ERROR:", error.message);
  }
}

testAPIs();
