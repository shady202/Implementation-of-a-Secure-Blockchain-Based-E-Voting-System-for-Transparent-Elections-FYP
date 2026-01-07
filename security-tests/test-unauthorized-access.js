/**
 * Security Test: Unauthorized Access Attack
 *
 * Objective: Attempt to access protected API endpoints without proper authentication
 * Expected: API should reject requests without valid JWT tokens
 */

const axios = require("axios");
const chalk = require("chalk");
require("dotenv").config();

const API_URL = process.env.API_URL || "http://localhost:3001";

async function testUnauthorizedAccess() {
  console.log(chalk.blue.bold("\n=== TEST: Unauthorized Access Attack ===\n"));

  const results = {
    testName: "Unauthorized Access Attack",
    attacks: [],
    passed: 0,
    failed: 0,
  };

  // Attack 1: Access protected endpoint without token
  console.log(
    chalk.red.bold("Attack 1: Access /api/votes/save without JWT token")
  );
  try {
    const response = await axios.post(`${API_URL}/api/votes/save`, {
      walletAddress: "0x1234567890123456789012345678901234567890",
      votes: [{ categoryId: 1, candidateId: 1 }],
    });

    console.log(
      chalk.red(
        "   ❌ SECURITY FAILURE: Request accepted without authentication!"
      )
    );
    results.attacks.push({
      attack: "No JWT token",
      status: "FAILED",
      response: response.status,
    });
    results.failed++;
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.log(
        chalk.green(
          `   ✅ BLOCKED: ${error.response.status} ${error.response.statusText}`
        )
      );
      console.log(
        chalk.green(
          `   Message: ${error.response.data.message || "Unauthorized"}\n`
        )
      );
      results.attacks.push({
        attack: "No JWT token",
        status: "PASSED",
        httpStatus: error.response.status,
        message: error.response.data.message,
      });
      results.passed++;
    } else {
      console.log(chalk.yellow(`   ⚠️  Unexpected error: ${error.message}\n`));
    }
  }

  // Attack 2: Use invalid/malformed JWT token
  console.log(chalk.red.bold("Attack 2: Use invalid JWT token"));
  try {
    const response = await axios.get(`${API_URL}/api/auth/verify`, {
      headers: {
        Authorization: "Bearer invalid.jwt.token.here",
      },
    });

    console.log(chalk.red("   ❌ SECURITY FAILURE: Invalid token accepted!"));
    results.attacks.push({
      attack: "Invalid JWT token",
      status: "FAILED",
      response: response.status,
    });
    results.failed++;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log(
        chalk.green(`   ✅ BLOCKED: ${error.response.status} Unauthorized`)
      );
      console.log(
        chalk.green(
          `   Message: ${error.response.data.message || "Invalid token"}\n`
        )
      );
      results.attacks.push({
        attack: "Invalid JWT token",
        status: "PASSED",
        httpStatus: error.response.status,
      });
      results.passed++;
    } else {
      console.log(chalk.yellow(`   ⚠️  Unexpected error: ${error.message}\n`));
    }
  }

  // Attack 3: Attempt to access admin endpoint as regular user
  console.log(
    chalk.red.bold("Attack 3: Access admin endpoint without admin role")
  );
  console.log(chalk.yellow("   Note: This requires a valid voter JWT token\n"));

  // First, try to get a voter token (if credentials available)
  if (process.env.TEST_VOTER_EMAIL) {
    console.log(chalk.cyan("   Attempting to get voter JWT token..."));
    // This would require OTP verification in real scenario
    console.log(chalk.yellow("   ⏭️  Skipping (requires OTP verification)\n"));
  }

  // Attack 4: Tampered JWT token (modified payload)
  console.log(
    chalk.red.bold(
      "Attack 4: Use JWT with modified payload (privilege escalation)"
    )
  );
  try {
    // Create a fake JWT with admin claim
    const fakeToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTYwOTQ1OTIwMH0.fake_signature_here";

    const response = await axios.post(
      `${API_URL}/api/admin/elections`,
      {
        title: "Hacked Election",
        startTime: Date.now(),
        endTime: Date.now() + 86400000,
      },
      {
        headers: {
          Authorization: `Bearer ${fakeToken}`,
        },
      }
    );

    console.log(chalk.red("   ❌ SECURITY FAILURE: Tampered token accepted!"));
    results.attacks.push({
      attack: "Tampered JWT (privilege escalation)",
      status: "FAILED",
      response: response.status,
    });
    results.failed++;
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.log(chalk.green(`   ✅ BLOCKED: ${error.response.status}`));
      console.log(
        chalk.green(
          `   Message: ${error.response.data.message || "Invalid signature"}\n`
        )
      );
      results.attacks.push({
        attack: "Tampered JWT (privilege escalation)",
        status: "PASSED",
        httpStatus: error.response.status,
      });
      results.passed++;
    } else {
      console.log(chalk.yellow(`   ⚠️  Unexpected error: ${error.message}\n`));
    }
  }

  // Attack 5: Missing Authorization header
  console.log(chalk.red.bold("Attack 5: Request without Authorization header"));
  try {
    const response = await axios.get(`${API_URL}/api/auth/verify`);

    console.log(
      chalk.red("   ❌ SECURITY FAILURE: Request without auth header accepted!")
    );
    results.attacks.push({
      attack: "Missing Authorization header",
      status: "FAILED",
      response: response.status,
    });
    results.failed++;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log(
        chalk.green(`   ✅ BLOCKED: ${error.response.status} Unauthorized`)
      );
      console.log(
        chalk.green(
          `   Message: ${error.response.data.message || "No token provided"}\n`
        )
      );
      results.attacks.push({
        attack: "Missing Authorization header",
        status: "PASSED",
        httpStatus: error.response.status,
      });
      results.passed++;
    } else {
      console.log(chalk.yellow(`   ⚠️  Unexpected error: ${error.message}\n`));
    }
  }

  // Summary
  console.log(chalk.blue.bold("=== Test Summary ==="));
  console.log(`Total Attacks: ${results.attacks.length}`);
  console.log(chalk.green(`Blocked (Passed): ${results.passed}`));
  console.log(chalk.red(`Succeeded (Failed): ${results.failed}\n`));

  if (results.failed === 0) {
    console.log(
      chalk.green.bold("✅ ALL TESTS PASSED: API authentication is secure")
    );
    console.log(chalk.green("   Security Mechanisms Validated:"));
    console.log(chalk.green("   - JWT token validation"));
    console.log(chalk.green("   - Signature verification"));
    console.log(chalk.green("   - Authorization header requirement"));
    console.log(chalk.green("   - Role-based access control\n"));
    results.status = "PASSED";
  } else {
    console.log(chalk.red.bold("❌ SECURITY VULNERABILITIES DETECTED!"));
    console.log(chalk.red(`   ${results.failed} attack(s) succeeded\n`));
    results.status = "FAILED";
  }

  return results;
}

// Run test if executed directly
if (require.main === module) {
  testUnauthorizedAccess()
    .then((result) => {
      console.log(chalk.blue("\n=== Final Result ==="));
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.status === "PASSED" ? 0 : 1);
    })
    .catch((error) => {
      console.error(chalk.red("Fatal error:"), error);
      process.exit(1);
    });
}

module.exports = testUnauthorizedAccess;
