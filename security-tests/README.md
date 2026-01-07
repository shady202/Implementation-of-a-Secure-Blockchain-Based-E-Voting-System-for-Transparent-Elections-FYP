# Security Testing Suite - E-Voting System

Comprehensive security testing and attack simulation suite to prove the blockchain-based e-voting system is **tamper-proof**.

## 📁 Files Created

### Documentation

- **`docs/SECURITY_TESTING_GUIDE.md`** - Complete testing methodology and attack scenarios
- **`security-tests/HOW_TO_RUN_TESTS.md`** - Step-by-step verification guide

### Test Scripts

- **`test-double-voting.js`** - Tests blockchain double-vote prevention
- **`test-unauthorized-access.js`** - Tests JWT authentication
- **`test-sql-injection.js`** - Tests parameterized query protection
- **`test-wallet-spoofing.js`** - Tests cryptographic signature requirements

### Test Infrastructure

- **`run-all-tests.js`** - Master test runner with report generation
- **`package.json`** - Dependencies and npm scripts
- **`.env.example`** - Configuration template

## 🚀 Quick Start

### 1. Setup

```bash
cd security-tests
npm install
copy .env.example .env
```

Edit `.env` with your configuration:

```env
CONTRACT_ADDRESS=0xYourContractAddress
TEST_VOTER_PRIVATE_KEY=YourTestPrivateKey
```

### 2. Run All Tests

```bash
npm test
```

Or:

```bash
node run-all-tests.js
```

### 3. Run Individual Tests

```bash
node test-double-voting.js
node test-unauthorized-access.js
node test-sql-injection.js
node test-wallet-spoofing.js
```

## 📊 What Gets Tested

| Test                    | Attack Vector                 | Security Mechanism                       |
| ----------------------- | ----------------------------- | ---------------------------------------- |
| **Double Voting**       | Vote twice in same category   | Smart contract `votedInCategory` mapping |
| **Unauthorized Access** | Access API without JWT        | JWT authentication middleware            |
| **SQL Injection**       | Inject malicious SQL          | Parameterized queries                    |
| **Wallet Spoofing**     | Vote with unregistered wallet | Cryptographic signatures                 |

## ✅ Expected Results

**All tests should PASS** (attacks should be blocked). This proves the system is secure.

Example output:

```
✅ ATTACK BLOCKED!
Reason: Already voted in category

✅ TEST PASSED: Smart contract successfully prevented double voting
```

## 📄 Generated Reports

After running tests:

- **`test-results.json`** - Detailed JSON report
- **`../docs/SECURITY_TEST_RESULTS.md`** - Formatted markdown report for FYP

## 🎯 For Your FYP Report

1. **Run tests**: `npm test`
2. **Collect evidence**:
   - Screenshots of test output
   - Blockchain transaction hashes
   - Generated reports
3. **Include in report**:
   - Copy `SECURITY_TEST_RESULTS.md` content
   - Add screenshots as figures
   - Reference blockchain explorer links

## 📖 Detailed Guide

See **`HOW_TO_RUN_TESTS.md`** for:

- Complete step-by-step instructions
- Troubleshooting guide
- Evidence collection tips
- FYP report structure recommendations

## 🔒 Security Layers Validated

1. **Blockchain Immutability** - Votes cannot be modified
2. **Smart Contract Access Control** - Modifiers enforce authorization
3. **JWT Authentication** - API endpoints protected
4. **Cryptographic Signatures** - Wallet ownership verified
5. **Input Validation** - SQL injection prevented

---

**Status**: ✅ Ready to run  
**Purpose**: Prove system is tamper-proof for FYP demonstration
