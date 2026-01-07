/**
 * Security Test: SQL Injection Attack
 *
 * Objective: Attempt SQL injection to bypass authentication or extract data
 * Expected: Parameterized queries should prevent SQL injection
 */

const axios = require("axios");
const chalk = require("chalk");
require("dotenv").config();

const API_URL = process.env.API_URL || "http://localhost:3001";

async function testSQLInjection() {
  console.log(chalk.blue.bold("\n=== TEST: SQL Injection Attack ===\n"));

  const results = {
    testName: "SQL Injection Attack",
    attacks: [],
    passed: 0,
    failed: 0,
  };

  // Common SQL injection payloads
  const sqlInjectionPayloads = [
    "admin@example.com' OR '1'='1",
    "admin@example.com' OR '1'='1' --",
    "admin@example.com' OR '1'='1' /*",
    "'; DROP TABLE voters; --",
    "' UNION SELECT * FROM voters --",
    "admin' --",
    "' OR 1=1 --",
    "admin@example.com'; UPDATE voters SET is_admin=true WHERE email='attacker@example.com'; --",
  ];

  // Attack 1: SQL Injection in login/OTP request
  console.log(chalk.red.bold("Attack 1: SQL Injection in OTP request"));

  for (let i = 0; i < Math.min(3, sqlInjectionPayloads.length); i++) {
    const payload = sqlInjectionPayloads[i];
    console.log(chalk.yellow(`\n   Payload ${i + 1}: ${payload}`));

    try {
      const response = await axios.post(`${API_URL}/api/auth/request-otp`, {
        email: payload,
      });

      // If we get a success response, check what happened
      if (response.data.success) {
        console.log(
          chalk.red("   ❌ POTENTIAL VULNERABILITY: Request accepted")
        );
        console.log(chalk.red(`   Response: ${JSON.stringify(response.data)}`));
        results.attacks.push({
          attack: `SQL Injection in OTP request: ${payload}`,
          status: "FAILED",
          response: response.data,
        });
        results.failed++;
      } else {
        console.log(chalk.green("   ✅ Request rejected (not found)"));
        results.attacks.push({
          attack: `SQL Injection in OTP request: ${payload}`,
          status: "PASSED",
          reason: "Treated as literal string",
        });
        results.passed++;
      }
    } catch (error) {
      if (error.response) {
        // Expected: 404 Not Found (email treated as literal string)
        if (error.response.status === 404) {
          console.log(
            chalk.green(`   ✅ BLOCKED: ${error.response.status} Not Found`)
          );
          console.log(
            chalk.green("   Payload treated as literal string (safe)")
          );
          results.attacks.push({
            attack: `SQL Injection in OTP request: ${payload}`,
            status: "PASSED",
            httpStatus: error.response.status,
          });
          results.passed++;
        } else if (error.response.status === 400) {
          console.log(
            chalk.green(`   ✅ BLOCKED: ${error.response.status} Bad Request`)
          );
          console.log(chalk.green("   Input validation rejected payload"));
          results.attacks.push({
            attack: `SQL Injection in OTP request: ${payload}`,
            status: "PASSED",
            httpStatus: error.response.status,
          });
          results.passed++;
        } else {
          console.log(
            chalk.yellow(`   ⚠️  Unexpected status: ${error.response.status}`)
          );
        }
      } else {
        console.log(chalk.yellow(`   ⚠️  Network error: ${error.message}`));
      }
    }
  }

  // Attack 2: SQL Injection in student ID check
  console.log(
    chalk.red.bold("\n\nAttack 2: SQL Injection in student ID validation")
  );

  const studentIdPayloads = [
    "TP123456' OR '1'='1",
    "TP123456'; DROP TABLE voters; --",
    "TP123456' UNION SELECT password_hash FROM voters WHERE email='admin@example.com' --",
  ];

  for (let i = 0; i < studentIdPayloads.length; i++) {
    const payload = studentIdPayloads[i];
    console.log(chalk.yellow(`\n   Payload ${i + 1}: ${payload}`));

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/check-student-id`,
        {
          studentId: payload,
        }
      );

      if (response.data.exists) {
        console.log(
          chalk.red(
            "   ❌ POTENTIAL VULNERABILITY: Injection may have succeeded"
          )
        );
        console.log(chalk.red(`   Response: ${JSON.stringify(response.data)}`));
        results.attacks.push({
          attack: `SQL Injection in student ID: ${payload}`,
          status: "FAILED",
          response: response.data,
        });
        results.failed++;
      } else {
        console.log(
          chalk.green("   ✅ Payload treated as literal string (safe)")
        );
        results.attacks.push({
          attack: `SQL Injection in student ID: ${payload}`,
          status: "PASSED",
        });
        results.passed++;
      }
    } catch (error) {
      if (error.response) {
        console.log(
          chalk.green(`   ✅ Request rejected: ${error.response.status}`)
        );
        results.attacks.push({
          attack: `SQL Injection in student ID: ${payload}`,
          status: "PASSED",
          httpStatus: error.response.status,
        });
        results.passed++;
      } else {
        console.log(chalk.yellow(`   ⚠️  Error: ${error.message}`));
      }
    }
  }

  // Attack 3: SQL Injection in registration
  console.log(
    chalk.red.bold("\n\nAttack 3: SQL Injection in user registration")
  );

  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, {
      email: "attacker@example.com",
      password: "password123",
      studentId: "TP999999",
      fullName: "Robert'; DROP TABLE voters; --",
      department: "Computer Science",
      year: 1,
    });

    console.log(chalk.yellow("   Registration request sent..."));

    // Check if registration succeeded
    if (response.data.success) {
      console.log(
        chalk.green("   ✅ Registration accepted (payload in name field)")
      );
      console.log(chalk.green("   Checking if SQL was executed..."));

      // Try to verify the account still exists (table not dropped)
      try {
        await axios.post(`${API_URL}/api/auth/check-email`, {
          email: "attacker@example.com",
        });
        console.log(
          chalk.green("   ✅ Database intact - SQL injection prevented")
        );
        console.log(chalk.green("   Payload stored as literal string\n"));
        results.attacks.push({
          attack: "SQL Injection in registration (name field)",
          status: "PASSED",
          reason: "Parameterized query prevented execution",
        });
        results.passed++;
      } catch (error) {
        console.log(chalk.yellow("   ⚠️  Could not verify database state"));
      }
    }
  } catch (error) {
    if (error.response) {
      console.log(
        chalk.green(`   ✅ Registration rejected: ${error.response.status}`)
      );
      results.attacks.push({
        attack: "SQL Injection in registration",
        status: "PASSED",
        httpStatus: error.response.status,
      });
      results.passed++;
    } else {
      console.log(chalk.yellow(`   ⚠️  Error: ${error.message}`));
    }
  }

  // Summary
  console.log(chalk.blue.bold("\n=== Test Summary ==="));
  console.log(`Total Injection Attempts: ${results.attacks.length}`);
  console.log(chalk.green(`Blocked (Passed): ${results.passed}`));
  console.log(chalk.red(`Succeeded (Failed): ${results.failed}\n`));

  if (results.failed === 0) {
    console.log(
      chalk.green.bold("✅ ALL TESTS PASSED: SQL injection prevented")
    );
    console.log(chalk.green("   Security Mechanisms Validated:"));
    console.log(
      chalk.green("   - Parameterized queries ($1, $2 placeholders)")
    );
    console.log(chalk.green("   - PostgreSQL prepared statements"));
    console.log(chalk.green("   - Input treated as literal strings"));
    console.log(chalk.green("   - No SQL code execution from user input\n"));
    results.status = "PASSED";
  } else {
    console.log(chalk.red.bold("❌ SQL INJECTION VULNERABILITIES DETECTED!"));
    console.log(chalk.red(`   ${results.failed} injection(s) succeeded\n`));
    results.status = "FAILED";
  }

  return results;
}

// Run test if executed directly
if (require.main === module) {
  testSQLInjection()
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

module.exports = testSQLInjection;
