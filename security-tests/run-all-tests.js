/**
 * Master Test Runner - Security Test Suite
 *
 * Runs all security tests and generates comprehensive report
 */

const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

// Import all test modules
const testDoubleVoting = require("./test-double-voting");
const testUnauthorizedAccess = require("./test-unauthorized-access");
const testSQLInjection = require("./test-sql-injection");
const testWalletSpoofing = require("./test-wallet-spoofing");

async function runAllTests() {
  console.log(
    chalk.blue.bold(
      "\n╔════════════════════════════════════════════════════════╗"
    )
  );
  console.log(
    chalk.blue.bold("║   SECURITY TEST SUITE - E-VOTING SYSTEM               ║")
  );
  console.log(
    chalk.blue.bold("║   Tamper-Proof Verification                           ║")
  );
  console.log(
    chalk.blue.bold(
      "╚════════════════════════════════════════════════════════╝\n"
    )
  );

  const startTime = Date.now();
  const results = {
    timestamp: new Date().toISOString(),
    totalTests: 0,
    passed: 0,
    failed: 0,
    errors: 0,
    tests: [],
  };

  // Test 1: Double Voting Attack
  console.log(chalk.cyan("═".repeat(60)));
  try {
    const result = await testDoubleVoting();
    results.tests.push(result);
    results.totalTests++;
    if (result.status === "PASSED") results.passed++;
    else if (result.status === "FAILED") results.failed++;
    else results.errors++;
  } catch (error) {
    console.log(
      chalk.red(`Error running double voting test: ${error.message}`)
    );
    results.tests.push({
      testName: "Double Voting Attack",
      status: "ERROR",
      error: error.message,
    });
    results.totalTests++;
    results.errors++;
  }

  // Test 2: Unauthorized Access Attack
  console.log(chalk.cyan("\n" + "═".repeat(60)));
  try {
    const result = await testUnauthorizedAccess();
    results.tests.push(result);
    results.totalTests++;
    if (result.status === "PASSED") results.passed++;
    else if (result.status === "FAILED") results.failed++;
    else results.errors++;
  } catch (error) {
    console.log(
      chalk.red(`Error running unauthorized access test: ${error.message}`)
    );
    results.tests.push({
      testName: "Unauthorized Access Attack",
      status: "ERROR",
      error: error.message,
    });
    results.totalTests++;
    results.errors++;
  }

  // Test 3: SQL Injection Attack
  console.log(chalk.cyan("\n" + "═".repeat(60)));
  try {
    const result = await testSQLInjection();
    results.tests.push(result);
    results.totalTests++;
    if (result.status === "PASSED") results.passed++;
    else if (result.status === "FAILED") results.failed++;
    else results.errors++;
  } catch (error) {
    console.log(
      chalk.red(`Error running SQL injection test: ${error.message}`)
    );
    results.tests.push({
      testName: "SQL Injection Attack",
      status: "ERROR",
      error: error.message,
    });
    results.totalTests++;
    results.errors++;
  }

  // Test 4: Wallet Spoofing Attack
  console.log(chalk.cyan("\n" + "═".repeat(60)));
  try {
    const result = await testWalletSpoofing();
    results.tests.push(result);
    results.totalTests++;
    if (result.status === "PASSED") results.passed++;
    else if (result.status === "FAILED") results.failed++;
    else results.errors++;
  } catch (error) {
    console.log(
      chalk.red(`Error running wallet spoofing test: ${error.message}`)
    );
    results.tests.push({
      testName: "Wallet Spoofing Attack",
      status: "ERROR",
      error: error.message,
    });
    results.totalTests++;
    results.errors++;
  }

  // Calculate duration
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  results.duration = `${duration}s`;

  // Print Summary
  console.log(
    chalk.blue.bold(
      "\n\n╔════════════════════════════════════════════════════════╗"
    )
  );
  console.log(
    chalk.blue.bold(
      "║              SECURITY TEST SUMMARY                     ║"
    )
  );
  console.log(
    chalk.blue.bold(
      "╚════════════════════════════════════════════════════════╝\n"
    )
  );

  console.log(chalk.white(`  Total Tests:     ${results.totalTests}`));
  console.log(chalk.green(`  ✅ Passed:        ${results.passed}`));
  console.log(chalk.red(`  ❌ Failed:        ${results.failed}`));
  console.log(chalk.yellow(`  ⚠️  Errors:        ${results.errors}`));
  console.log(chalk.white(`  Duration:        ${duration}s\n`));

  // Individual test results
  console.log(chalk.blue.bold("  Test Results:\n"));
  results.tests.forEach((test, index) => {
    const icon =
      test.status === "PASSED"
        ? chalk.green("✅")
        : test.status === "FAILED"
        ? chalk.red("❌")
        : chalk.yellow("⚠️");
    console.log(`  ${index + 1}. ${icon} ${test.testName} - ${test.status}`);
  });

  // Overall verdict
  console.log(chalk.blue.bold("\n  Overall Verdict:\n"));
  if (results.failed === 0 && results.errors === 0) {
    console.log(chalk.green.bold("  ✅ SYSTEM IS TAMPER-PROOF"));
    console.log(
      chalk.green("  All security mechanisms are functioning correctly.")
    );
    console.log(
      chalk.green("  The e-voting system successfully prevented all attacks.\n")
    );
  } else if (results.failed > 0) {
    console.log(chalk.red.bold("  ❌ SECURITY VULNERABILITIES DETECTED"));
    console.log(
      chalk.red(
        `  ${results.failed} test(s) failed - immediate action required!\n`
      )
    );
  } else {
    console.log(chalk.yellow.bold("  ⚠️  TESTS COMPLETED WITH ERRORS"));
    console.log(
      chalk.yellow("  Some tests could not complete. Review logs above.\n")
    );
  }

  // Save results to file
  const reportPath = path.join(__dirname, "test-results.json");
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(chalk.blue(`  📄 Detailed report saved: ${reportPath}\n`));

  // Generate markdown report
  generateMarkdownReport(results);

  console.log(
    chalk.blue.bold(
      "╔════════════════════════════════════════════════════════╗"
    )
  );
  console.log(
    chalk.blue.bold(
      "║              TEST SUITE COMPLETE                       ║"
    )
  );
  console.log(
    chalk.blue.bold(
      "╚════════════════════════════════════════════════════════╝\n"
    )
  );

  return results;
}

function generateMarkdownReport(results) {
  const reportPath = path.join(
    __dirname,
    "..",
    "docs",
    "SECURITY_TEST_RESULTS.md"
  );

  let markdown = `# Security Test Results

**Test Date**: ${new Date(results.timestamp).toLocaleString()}  
**Duration**: ${results.duration}  
**Total Tests**: ${results.totalTests}  
**Status**: ${
    results.failed === 0 && results.errors === 0 ? "✅ PASSED" : "❌ FAILED"
  }

---

## Summary

| Metric | Count |
|--------|-------|
| Total Tests | ${results.totalTests} |
| ✅ Passed | ${results.passed} |
| ❌ Failed | ${results.failed} |
| ⚠️ Errors | ${results.errors} |

---

## Test Results

`;

  results.tests.forEach((test, index) => {
    const status =
      test.status === "PASSED"
        ? "✅ PASSED"
        : test.status === "FAILED"
        ? "❌ FAILED"
        : "⚠️ ERROR";

    markdown += `### ${index + 1}. ${test.testName}

**Status**: ${status}

`;

    if (test.securityMechanism) {
      markdown += `**Security Mechanism**: ${test.securityMechanism}\n\n`;
    }

    if (test.errorMessage) {
      markdown += `**Error Message**: \`${test.errorMessage}\`\n\n`;
    }

    if (test.attacks && test.attacks.length > 0) {
      markdown += `**Attack Attempts**: ${test.attacks.length}\n`;
      markdown += `- Blocked: ${test.passed || 0}\n`;
      markdown += `- Succeeded: ${test.failed || 0}\n\n`;
    }

    markdown += `---\n\n`;
  });

  markdown += `## Conclusion

`;

  if (results.failed === 0 && results.errors === 0) {
    markdown += `✅ **SYSTEM IS TAMPER-PROOF**

All ${results.totalTests} security tests passed successfully. The e-voting system demonstrated robust security across multiple attack vectors:

- **Blockchain Immutability**: Votes cannot be modified after casting
- **Authentication & Authorization**: JWT tokens and role-based access control prevent unauthorized access
- **Input Validation**: SQL injection attempts are blocked by parameterized queries
- **Wallet Security**: Cryptographic signatures prevent vote spoofing
- **Smart Contract Access Control**: Modifiers enforce proper authorization

The system is ready for deployment with confidence in its security posture.
`;
  } else {
    markdown += `❌ **SECURITY VULNERABILITIES DETECTED**

${results.failed} test(s) failed. Immediate remediation required before deployment.

Please review the failed tests above and implement necessary security fixes.
`;
  }

  markdown += `\n---

*Generated automatically by Security Test Suite*
`;

  fs.writeFileSync(reportPath, markdown);
  console.log(chalk.blue(`  📄 Markdown report saved: ${reportPath}`));
}

// Run tests
if (require.main === module) {
  runAllTests()
    .then((results) => {
      process.exit(results.failed === 0 && results.errors === 0 ? 0 : 1);
    })
    .catch((error) => {
      console.error(chalk.red("Fatal error:"), error);
      process.exit(1);
    });
}

module.exports = runAllTests;
