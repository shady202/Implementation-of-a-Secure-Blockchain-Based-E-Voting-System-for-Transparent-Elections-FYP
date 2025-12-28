require("dotenv").config();
const { Pool } = require("pg");

// Try multiple connection formats
const configs = [
  {
    name: "URL with password",
    connectionString: "postgresql://postgres:apuv@localhost:5432/postgres",
  },
  {
    name: "URL without password",
    connectionString: "postgresql://postgres@localhost:5432/postgres",
  },
  {
    name: "Object format",
    config: {
      host: "localhost",
      port: 5432,
      database: "postgres",
      user: "postgres",
      password: "apuv",
    },
  },
  {
    name: "Object no password",
    config: {
      host: "localhost",
      port: 5432,
      database: "postgres",
      user: "postgres",
    },
  },
];

async function testConnection(config) {
  console.log(`\n🔍 Testing: ${config.name}`);
  const pool = new Pool(
    config.connectionString
      ? { connectionString: config.connectionString }
      : config.config
  );

  try {
    const result = await pool.query("SELECT NOW()");
    console.log(`✅ SUCCESS! Connected at:`, result.rows[0].now);
    await pool.end();
    return true;
  } catch (error) {
    console.log(`❌ FAILED:`, error.message);
    await pool.end();
    return false;
  }
}

(async () => {
  for (const config of configs) {
    const success = await testConnection(config);
    if (success) {
      console.log(`\n🎉 Working connection found!`);
      console.log("Use this format in your .env file\n");
      break;
    }
  }
})();
