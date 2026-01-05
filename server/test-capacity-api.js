const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log("🔍 Testing capacity API endpoint...\n");
    
    const response = await fetch("http://localhost:3001/api/system/capacity/status");
    const data = await response.json();
    
    console.log("📊 API Response:");
    console.log(JSON.stringify(data, null, 2));
    
    console.log("\n🔬 Analysis:");
    console.log("   activeUsers:", data.activeUsers, typeof data.activeUsers);
    console.log("   maxUsers:", data.maxUsers, typeof data.maxUsers);
    console.log("   atCapacity:", data.atCapacity);
    console.log("   percentUsed:", data.percentUsed);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testAPI();
