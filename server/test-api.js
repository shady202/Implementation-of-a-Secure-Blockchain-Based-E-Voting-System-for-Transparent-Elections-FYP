const fetch = require("node-fetch");

async function testAPI() {
  try {
    console.log("🧪 Testing API endpoint...\n");

    const response = await fetch(
      "http://localhost:3001/api/system/capacity/status"
    );
    const data = await response.json();

    console.log("📊 API Response:");
    console.log("   Active Users:", data.activeUsers);
    console.log("   Max Users:", data.maxUsers);
    console.log("   Percent Used:", data.percentUsed);
    console.log("   At Capacity:", data.atCapacity);
    console.log("");

    if (data.maxUsers === 2) {
      console.log("✅ SUCCESS: API is returning maxUsers = 2");
    } else {
      console.log(
        "❌ FAILED: API is returning maxUsers =",
        data.maxUsers,
        "instead of 2"
      );
      console.log("⚠️  The server needs to be restarted to load the new code!");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testAPI();
