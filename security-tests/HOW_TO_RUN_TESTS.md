# How to Run Security Tests - Step-by-Step Guide

This guide will walk you through running the security tests to prove your e-voting system is tamper-proof.

---

## Prerequisites

### 1. System Requirements

- ✅ Backend server running (`npm run dev` in `server/`)
- ✅ Frontend running (`npm run dev` in root)
- ✅ PostgreSQL database accessible
- ✅ MetaMask installed and connected to Hoodi Network
- ✅ Node.js installed (v16 or higher)

### 2. Test Data Setup

You need:

- At least one test voter account (registered and wallet bound)
- An active election with candidates
- Admin account (optional, for some tests)

---

## Quick Start (Recommended)

### Step 1: Navigate to Security Tests Directory

```bash
cd security-tests
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:

- `ethers` - For blockchain interaction
- `axios` - For API testing
- `chalk` - For colored console output
- `dotenv` - For environment configuration

### Step 3: Configure Environment

Copy the example environment file:

```bash
copy .env.example .env
```

Edit `.env` and fill in your values:

```env
# Your backend URL (default is fine if running locally)
API_URL=http://localhost:3001

# Your deployed contract address
CONTRACT_ADDRESS=0xYourActualContractAddress

# Test wallet (use a test account, NOT your real account!)
TEST_VOTER_PRIVATE_KEY=YourTestPrivateKey
```

> **⚠️ IMPORTANT**: Use TEST accounts only! Never use real private keys.

### Step 4: Run All Tests

```bash
node run-all-tests.js
```

Or use npm script:

```bash
npm test
```

This will:

1. Run all 4 security tests sequentially
2. Display colored output showing each attack attempt
3. Generate `test-results.json` with detailed results
4. Create `../docs/SECURITY_TEST_RESULTS.md` report

---

## Running Individual Tests

You can run tests one at a time for detailed analysis:

### Test 1: Double Voting Attack

```bash
node test-double-voting.js
```

**What it tests**: Attempts to vote twice in the same category  
**Expected**: ✅ Smart contract rejects with "Already voted in category"

### Test 2: Unauthorized Access Attack

```bash
node test-unauthorized-access.js
```

**What it tests**: Attempts to access API without JWT token  
**Expected**: ✅ API returns 401 Unauthorized

### Test 3: SQL Injection Attack

```bash
node test-sql-injection.js
```

**What it tests**: Attempts SQL injection in login and registration  
**Expected**: ✅ Parameterized queries prevent code execution

### Test 4: Wallet Spoofing Attack

```bash
node test-wallet-spoofing.js
```

**What it tests**: Attempts to vote with unregistered wallet  
**Expected**: ✅ Smart contract rejects unregistered voters

---

## Understanding Test Output

### ✅ PASSED (Green) - Good!

```
✅ ATTACK BLOCKED!
Reason: Already voted in category
```

This means the security mechanism worked correctly and prevented the attack.

### ❌ FAILED (Red) - Bad!

```
❌ SECURITY FAILURE: Double vote was accepted!
```

This means a vulnerability was found and needs immediate fixing.

### ⚠️ ERROR (Yellow) - Check Logs

```
⚠️ Unexpected error: Network timeout
```

This means the test couldn't complete due to technical issues (not a security failure).

---

## Collecting Evidence for Your FYP

### 1. Run Tests with Screen Recording

**Windows**:

- Press `Win + G` to open Game Bar
- Click "Record" before running tests
- Run: `node run-all-tests.js`
- Stop recording when complete

**Alternative**: Use OBS Studio for professional recording

### 2. Capture Screenshots

Take screenshots of:

- ✅ Test summary showing all tests passed
- ✅ Individual attack attempts being blocked
- ✅ Error messages from smart contract
- ✅ API 401/403 responses

### 3. Get Blockchain Evidence

For blockchain tests (double voting, wallet spoofing):

1. Copy the transaction hash from test output
2. Open Hoodi Network Explorer: https://testnet.hoodinetwork.io
3. Paste transaction hash
4. Screenshot the transaction details showing:
   - ❌ Failed status (reverted)
   - Revert reason message
   - Gas used

### 4. Review Generated Reports

After running tests, you'll have:

**JSON Report**: `security-tests/test-results.json`

```json
{
  "timestamp": "2026-01-06T02:59:22.000Z",
  "totalTests": 4,
  "passed": 4,
  "failed": 0,
  "tests": [...]
}
```

**Markdown Report**: `docs/SECURITY_TEST_RESULTS.md`

- Formatted report ready for your FYP document
- Includes summary table and detailed results
- Can be directly included in your report

---

## Manual Testing (For Deeper Understanding)

### Manual Test 1: Double Voting via UI

1. **Login** to your voter account
2. **Vote** for a candidate in Category 1
3. **Refresh** the page
4. **Attempt to vote again** in Category 1
5. **Expected**: UI should show "Already voted" or transaction should revert

**Evidence**: Screenshot of error message

### Manual Test 2: API Without Authentication

Using Postman or curl:

```bash
curl -X POST http://localhost:3001/api/votes/save \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"0x123","votes":[]}'
```

**Expected**: 401 Unauthorized response

**Evidence**: Screenshot of Postman showing 401 error

### Manual Test 3: SQL Injection in Login

1. Go to login page
2. Enter email: `admin@example.com' OR '1'='1`
3. Request OTP
4. **Expected**: "No account found" (treated as literal string)

**Evidence**: Screenshot of error message

---

## Troubleshooting

### Error: "Cannot find module 'ethers'"

**Solution**: Run `npm install` in the `security-tests/` directory

### Error: "Contract address not set"

**Solution**: Edit `.env` and set `CONTRACT_ADDRESS` to your deployed contract

### Error: "Insufficient funds for gas"

**Solution**:

1. Get test ETH from Hoodi faucet
2. Or use a wallet with existing test funds

### Error: "Network timeout"

**Solution**:

1. Check backend is running: `http://localhost:3001`
2. Check RPC URL is correct in `.env`
3. Verify internet connection

### Tests pass but you want to see failures

**Solution**: This is actually GOOD! All tests passing means your system is secure. For demonstration:

1. Temporarily comment out security checks in smart contract
2. Run tests to show they fail
3. Restore security checks
4. Run tests again to show they pass

---

## Creating Your FYP Report Section

### Recommended Structure

```markdown
## 5.3 Security Testing & Validation

### 5.3.1 Testing Methodology

The system underwent comprehensive security testing using automated
attack simulations to validate its tamper-proof properties...

### 5.3.2 Attack Scenarios Tested

1. **Double Voting Attack**

   - Objective: [...]
   - Method: [...]
   - Result: ✅ Blocked by smart contract
   - Evidence: [Screenshot/Transaction hash]

2. **Unauthorized Access Attack**
   - [...]

### 5.3.3 Test Results Summary

[Insert table from SECURITY_TEST_RESULTS.md]

### 5.3.4 Security Mechanisms Validated

- Blockchain immutability
- JWT authentication
- Cryptographic signatures
- Parameterized queries

### 5.3.5 Conclusion

All security tests passed, demonstrating that the system successfully
prevents tampering attempts across multiple attack vectors...
```

---

## Next Steps

1. ✅ Run all tests: `npm test`
2. ✅ Review `SECURITY_TEST_RESULTS.md`
3. ✅ Collect screenshots and transaction hashes
4. ✅ Include evidence in your FYP report
5. ✅ Present findings to demonstrate tamper-proof properties

---

## Questions?

If tests fail unexpectedly:

1. Check the error messages carefully
2. Verify your system is running correctly
3. Ensure test data is set up properly
4. Review the test code to understand what's being tested

Remember: **Tests SHOULD pass** (attacks should be blocked). If they fail, it indicates a security issue that needs fixing.

---

**Good luck with your testing!** 🔒✅
