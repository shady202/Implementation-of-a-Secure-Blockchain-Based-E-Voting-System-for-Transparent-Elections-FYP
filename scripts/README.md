# Integrity Verification Scripts

This directory contains powerful scripts to **prove** and **verify** the integrity of your blockchain-based e-voting system.

## 📋 Overview

These scripts demonstrate that your system is **tamper-proof** by:

1. ✅ Verifying votes cannot be modified after casting
2. ✅ Detecting any tampering attempts
3. ✅ Cross-checking data across multiple sources
4. ✅ Identifying suspicious patterns and anomalies

---

## 🛠️ Scripts

### 1. `audit-integrity.js` - Comprehensive Integrity Audit

**Purpose**: Performs 6 critical integrity checks to verify system security

**Checks Performed**:

- ✅ Vote count consistency (Blockchain vs Database)
- ✅ All database votes exist on blockchain
- ✅ No double votes detected
- ✅ Candidate vote counts match across sources
- ✅ Voter registration consistency
- ✅ Vote timestamps within election timeframe

**Usage**:

```bash
node scripts/audit-integrity.js
```

**Expected Output**:

```
============================================================
BLOCKCHAIN E-VOTING SYSTEM - INTEGRITY AUDIT
============================================================

[CHECK 1] Verifying Vote Count Consistency...
------------------------------------------------------------
Blockchain Total Votes: 150
Database Total Votes:   150
✅ PASS: Vote counts are consistent

[CHECK 2] Verifying Database Votes on Blockchain...
------------------------------------------------------------
Total database votes to verify: 150
✅ PASS: All database votes verified on blockchain

[CHECK 3] Checking for Double Votes...
------------------------------------------------------------
✅ PASS: No double votes detected

[CHECK 4] Verifying Candidate Vote Counts...
------------------------------------------------------------

Category: President (ID: 1)
  ✅ John Doe: Blockchain=45, DB=45
  ✅ Jane Smith: Blockchain=38, DB=38
  ✅ Bob Johnson: Blockchain=42, DB=42

✅ PASS: All candidate vote counts match

[CHECK 5] Verifying Voter Registration Consistency...
------------------------------------------------------------
Blockchain Registered Voters: 150
Database Registered Voters:   150
✅ PASS: Voter registration counts match

[CHECK 6] Verifying Vote Timestamps...
------------------------------------------------------------
✅ PASS: All votes cast within election timeframe

============================================================
AUDIT SUMMARY
============================================================
Total Checks:  6
Passed:        6
Failed:        0
Duration:      3.45s
============================================================

✅ INTEGRITY VERIFIED: System is tamper-free!
```

---

### 2. `detect-anomalies.js` - Anomaly Detection

**Purpose**: Detects suspicious patterns that might indicate tampering attempts

**Detects**:

- ⚠️ Burst voting (bot attacks)
- ⚠️ Multiple votes from same wallet
- ⚠️ Votes outside election timeframe
- ⚠️ Statistical outliers in vote distribution
- ⚠️ Duplicate transaction hashes
- ⚠️ Votes from unregistered wallets
- ⚠️ Unusual voting timeline patterns

**Usage**:

```bash
node scripts/detect-anomalies.js
```

**Expected Output**:

```
============================================================
ANOMALY DETECTION - TAMPERING ATTEMPT ANALYSIS
============================================================

[ANOMALY 1] Detecting Burst Voting Patterns...
------------------------------------------------------------
✅ No burst voting detected (3 rapid votes is normal)

[ANOMALY 2] Detecting Multiple Votes from Same Wallet...
------------------------------------------------------------
✅ No wallets with excessive votes detected

[ANOMALY 3] Detecting Votes Outside Election Timeframe...
------------------------------------------------------------
✅ All votes cast within election timeframe

[ANOMALY 4] Analyzing Vote Distribution Patterns...
------------------------------------------------------------

Category: President
  Total Votes: 125
  Average per Candidate: 41.67
  Standard Deviation: 3.51
  ✅ Vote distribution appears normal

[ANOMALY 5] Checking for Duplicate Transaction Hashes...
------------------------------------------------------------
✅ All transaction hashes are unique

[ANOMALY 6] Detecting Votes from Unregistered Wallets...
------------------------------------------------------------
✅ All votes are from registered wallets

[ANOMALY 7] Analyzing Voting Timeline Patterns...
------------------------------------------------------------

  Votes by Hour:
  08:00 | ████████ 12
  09:00 | ████████████████ 24
  10:00 | ██████████████████████████████ 45
  11:00 | ████████████████████ 30
  12:00 | ████████ 14

  ✅ Voting timeline appears normal

============================================================
ANOMALY DETECTION SUMMARY
============================================================
Total Anomalies Detected: 0

✅ NO ANOMALIES DETECTED
   System appears to be operating normally with no signs of tampering
============================================================
```

---

### 3. `cross-verify.js` - Three-Way Cross-Verification

**Purpose**: Performs comprehensive cross-verification between blockchain, database, and vote receipts

**Verifies**:

- ✅ Category consistency across sources
- ✅ Vote counts match (Blockchain ↔ Database)
- ✅ Individual voter receipts are accurate
- ✅ Transaction hashes are valid and confirmed
- ✅ Data fingerprints for tamper detection

**Usage**:

```bash
node scripts/cross-verify.js
```

**Expected Output**:

```
======================================================================
THREE-WAY CROSS-VERIFICATION REPORT
Blockchain ↔ Database ↔ Vote Receipts
======================================================================

[STEP 1] Fetching Categories...
----------------------------------------------------------------------
Blockchain Categories: 3
Database Categories:   3
✅ Category count matches

[STEP 2] Cross-Verifying Vote Counts by Category...
----------------------------------------------------------------------

📊 Category: President (ID: 1)
──────────────────────────────────────────────────────────────────────

┌─────────────────────────────┬──────────────┬──────────────┬────────┐
│ Candidate                   │ Blockchain   │ Database     │ Status │
├─────────────────────────────┼──────────────┼──────────────┼────────┤
│ John Doe                    │           45 │           45 │ ✅ OK  │
│ Jane Smith                  │           38 │           38 │ ✅ OK  │
│ Bob Johnson                 │           42 │           42 │ ✅ OK  │
└─────────────────────────────┴──────────────┴──────────────┴────────┘

[STEP 3] Verifying Individual Voter Receipts...
----------------------------------------------------------------------

Verifying receipts for 5 sample voters...

👤 Voter: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb

┌─────────────────────┬─────────────────────┬────────┐
│ Category            │ Candidate           │ Status │
├─────────────────────┼─────────────────────┼────────┤
│ President           │ John Doe            │ ✅ OK  │
│ Vice President      │ Alice Brown         │ ✅ OK  │
│ Secretary           │ Charlie Davis       │ ✅ OK  │
└─────────────────────┴─────────────────────┴────────┘

[STEP 4] Verifying Transaction Hashes...
----------------------------------------------------------------------

Verifying 10 recent transaction hashes...

✅ 0x8f3e9a2b1c4d5e6f... - Confirmed
✅ 0x7a2b3c4d5e6f7g8h... - Confirmed
✅ 0x6b1c2d3e4f5g6h7i... - Confirmed

Valid Transactions:   10
Invalid Transactions: 0

[STEP 5] Generating Data Fingerprints...
----------------------------------------------------------------------

Database Data Fingerprint (SHA-256):
a3f5e8d2c9b1a4f7e6d3c8b5a2f9e7d4c1b8a5f2e9d6c3b0a7f4e1d8c5b2a9f6e3

Total Records Hashed: 150

💡 This fingerprint can be used to detect any changes to vote data
   Store this hash securely and compare periodically to detect tampering

======================================================================
CROSS-VERIFICATION SUMMARY
======================================================================

Total Verifications:     45
Successful:              45
Failed:                  0
Success Rate:            100.00%

──────────────────────────────────────────────────────────────────────

✅ PERFECT INTEGRITY
   All data sources are perfectly synchronized
   Blockchain ↔ Database ↔ Vote Receipts: CONSISTENT

======================================================================
```

---

## 🚀 Quick Start

### Prerequisites

1. **Install Dependencies**:

   ```bash
   npm install ethers pg dotenv
   ```

2. **Configure Environment Variables**:

   Ensure your `.env` file contains:

   ```env
   VITE_CONTRACT_ADDRESS=0x...
   VITE_RPC_URL=https://...
   DATABASE_URL=postgresql://...
   ```

3. **Ensure System is Running**:

   ```bash
   # Terminal 1: Backend
   cd server
   npm run dev

   # Terminal 2: Frontend
   npm run dev
   ```

### Running All Checks

```bash
# Run integrity audit
node scripts/audit-integrity.js

# Run anomaly detection
node scripts/detect-anomalies.js

# Run cross-verification
node scripts/cross-verify.js
```

---

## 📊 For Your FYP Presentation

### How to Demonstrate Integrity

1. **Before the Demo**:

   - Run all three scripts
   - Take screenshots of the output
   - Save the results to a file

2. **During the Demo**:

   **Step 1**: Show the smart contract code

   ```bash
   # Open VotingSystem.sol
   # Highlight that NO vote modification functions exist
   ```

   **Step 2**: Cast a vote

   ```bash
   # Login as voter
   # Cast vote for a candidate
   # Record transaction hash
   ```

   **Step 3**: Run integrity audit

   ```bash
   node scripts/audit-integrity.js
   # Show all checks passing
   ```

   **Step 4**: Attempt to vote again (double-vote test)

   ```bash
   # Try to vote again in same category
   # Show "Already voted in category" error
   ```

   **Step 5**: Run cross-verification

   ```bash
   node scripts/cross-verify.js
   # Show perfect consistency across all sources
   ```

   **Step 6**: Run anomaly detection

   ```bash
   node scripts/detect-anomalies.js
   # Show no anomalies detected
   ```

3. **Key Points to Emphasize**:
   - ✅ "No functions exist to modify votes"
   - ✅ "Blockchain is immutable - votes cannot be changed"
   - ✅ "All data sources are perfectly synchronized"
   - ✅ "No anomalies or tampering attempts detected"
   - ✅ "100% integrity verification success rate"

---

## 🔍 Understanding the Results

### ✅ PASS (Good)

- System is operating correctly
- No integrity issues detected
- Data is consistent across all sources

### ⚠️ WARNING (Review Recommended)

- Minor anomalies detected
- Not critical but worth investigating
- Could indicate unusual but legitimate activity

### ❌ FAIL (Critical)

- Integrity violation detected
- Immediate investigation required
- Potential security breach

---

## 📝 Evidence Collection

For your FYP report, collect:

1. **Screenshots**:

   - [ ] Integrity audit output (all checks passing)
   - [ ] Anomaly detection output (no anomalies)
   - [ ] Cross-verification output (100% success)
   - [ ] Smart contract code (no modification functions)
   - [ ] Double-vote prevention (error message)

2. **Transaction Hashes**:

   - [ ] Sample vote transaction
   - [ ] Blockchain explorer screenshot
   - [ ] Transaction confirmation

3. **Reports**:
   - [ ] Full integrity audit report
   - [ ] Anomaly detection report
   - [ ] Cross-verification report

---

## 🎯 Answering FYP Questions

### Q: How do you prove votes cannot be modified?

**A**: Run these scripts to demonstrate:

1. **Code Audit**: Smart contract has no vote modification functions
2. **Integrity Audit**: All votes match across blockchain and database
3. **Cross-Verification**: Three-way verification confirms consistency
4. **Blockchain Immutability**: Transaction hashes are permanent and confirmed

### Q: How do you detect tampering attempts?

**A**: Use the anomaly detection script which monitors:

1. Burst voting patterns (bot attacks)
2. Double voting attempts
3. Votes from unregistered wallets
4. Statistical outliers
5. Duplicate transaction hashes

### Q: How do you cross-check data?

**A**: The cross-verification script compares:

1. **Blockchain** (source of truth)
2. **Database** (audit trail)
3. **Vote Receipts** (user verification)

All three must match perfectly for integrity to be verified.

---

## 🔐 Security Mechanisms Validated

These scripts prove the following security mechanisms are working:

| Mechanism               | Validated By                  | Script                |
| ----------------------- | ----------------------------- | --------------------- |
| Blockchain Immutability | Transaction hash verification | `cross-verify.js`     |
| Double-Vote Prevention  | Double vote detection         | `audit-integrity.js`  |
| Vote Count Integrity    | Vote count consistency check  | `audit-integrity.js`  |
| Wallet Authentication   | Unregistered voter detection  | `detect-anomalies.js` |
| Timestamp Validation    | Election timeframe check      | `audit-integrity.js`  |
| Data Consistency        | Three-way cross-verification  | `cross-verify.js`     |
| Anomaly Detection       | Pattern analysis              | `detect-anomalies.js` |

---

## 📚 Additional Resources

- **Smart Contract**: `src/contracts/VotingSystem.sol`
- **Security Testing Guide**: `docs/SECURITY_TESTING_GUIDE.md`
- **Integrity Explanation**: See artifact `integrity_explanation.md`

---

## 🆘 Troubleshooting

### Error: "Cannot connect to blockchain"

```bash
# Check RPC URL in .env
echo $VITE_RPC_URL

# Test connection
curl -X POST $VITE_RPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

### Error: "Database connection failed"

```bash
# Check DATABASE_URL in .env
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### Error: "Contract not found"

```bash
# Verify contract address
echo $VITE_CONTRACT_ADDRESS

# Check if contract is deployed
node -e "
const { ethers } = require('ethers');
const provider = new ethers.JsonRpcProvider(process.env.VITE_RPC_URL);
provider.getCode(process.env.VITE_CONTRACT_ADDRESS).then(console.log);
"
```

---

## 📞 Support

If you encounter any issues running these scripts, check:

1. All environment variables are set correctly
2. Backend and frontend servers are running
3. Database is accessible
4. Blockchain RPC endpoint is responsive

---

**Last Updated**: January 2026  
**Version**: 1.0.0  
**Author**: E-Voting System Team
