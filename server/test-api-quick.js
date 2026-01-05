const fetch = require("node-fetch");

async function testAPI() {
  try {
    const response = await fetch(
      "http://localhost:3001/api/system/capacity/status"
    );
    const data = await response.json();

    console.log("📊 API Response:");
    console.log(JSON.stringify(data, null, 2));

    if (data.maxUsers === 0) {
      console.log("\n✅ SUCCESS: API returns maxUsers = 0 (system closed)");
    } else {
      console.log(`\n❌ FAILED: Expected maxUsers = 0, got ${data.maxUsers}`);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testAPI();
