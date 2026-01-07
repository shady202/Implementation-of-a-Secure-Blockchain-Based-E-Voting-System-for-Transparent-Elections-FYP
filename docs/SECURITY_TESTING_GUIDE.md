# Security Testing Guide - Tamper-Proof Verification

## Overview

This guide documents comprehensive security testing procedures to **prove** that the blockchain-based e-voting system is tamper-proof. Each test attempts to compromise system security and demonstrates how the system's multi-layer security architecture prevents attacks.

---

## Security Architecture Summary

### Layer 1: Blockchain Immutability

- **Smart Contract**: Solidity-based voting contract on Hoodi Network (Ethereum)
- **Immutable Storage**: Votes stored on blockchain cannot be modified or deleted
- **Access Control**: `onlyAdmin` modifier restricts administrative functions
- **State Validation**: `electionActive`, `electionExists` modifiers enforce election lifecycle
- **Double-Vote Prevention**: `votedInCategory` mapping prevents duplicate votes

### Layer 2: Wallet-Based Authentication

- **MetaMask Integration**: Cryptographic wallet signatures verify voter identity
- **Wallet Binding**: Each voter account bound to specific Ethereum address
- **Address Validation**: Backend validates wallet ownership before allowing votes
- **Transaction Signing**: All votes require wallet signature (cannot be forged)

### Layer 3: Backend Authentication & Authorization

- **JWT Tokens**: Stateless authentication with signed tokens
- **OTP Verification**: Email-based one-time passwords for account verification
- **Role-Based Access Control (RBAC)**: Admin vs. Voter permissions
- **Session Management**: Secure session handling with token expiration

### Layer 4: Database Integrity

- **Parameterized Queries**: SQL injection prevention
- **Data Validation**: Input sanitization on all endpoints
- **Referential Integrity**: Foreign key constraints maintain data consistency
- **Audit Trail**: Vote history preserved for verification

---

## Attack Scenarios & Test Cases

### Test 1: Double Voting Attack

**Objective**: Attempt to vote multiple times in the same category

**Attack Vector**:

- Voter casts vote for Category 1, Candidate A
- Voter attempts to vote again for Category 1, Candidate B

**Security Mechanism**:

- Smart contract `votedInCategory` mapping tracks votes per category
- `require(!v.votedInCategory[categoryId], "Already voted in category")` prevents duplicates

**Expected Outcome**: ❌ Transaction reverts with "Already voted in category"

**Evidence Required**:

- Screenshot of first successful vote
- Screenshot of second vote rejection
- Blockchain transaction showing revert reason

---

### Test 2: Vote Modification Attack

**Objective**: Attempt to change vote after casting

**Attack Vector**:

- Voter casts vote for Candidate A
- Attacker attempts to modify blockchain state to change vote to Candidate B
- Attacker attempts to modify database vote_history record

**Security Mechanism**:

- Blockchain immutability: Once written, data cannot be modified
- No smart contract function exists to modify votes
- Database vote_history is append-only (no UPDATE operations)

**Expected Outcome**: ❌ No mechanism exists to modify votes

**Evidence Required**:

- Blockchain explorer showing immutable transaction
- Database query showing vote_history cannot be updated
- Smart contract code review showing no vote modification functions

---

### Test 3: Wallet Spoofing Attack

**Objective**: Vote using someone else's wallet address

**Attack Vector**:

- Attacker knows victim's wallet address
- Attacker attempts to submit vote with victim's address without private key
- Attacker attempts to vote with unregistered wallet

**Security Mechanism**:

- MetaMask requires private key signature for all transactions
- Backend validates `msg.sender` matches registered wallet
- Smart contract `registerVoter()` requires wallet ownership proof

**Expected Outcome**: ❌ Transaction fails without valid signature

**Evidence Required**:

- MetaMask rejection of unsigned transaction
- Backend API error for wallet mismatch
- Smart contract revert for unregistered voter

---

### Test 4: Unauthorized API Access

**Objective**: Access protected endpoints without authentication

**Attack Vector**:

- Attempt to call `/api/votes/save` without JWT token
- Attempt to use expired/invalid JWT token
- Attempt to access admin endpoints as regular user

**Security Mechanism**:

- `requireAuth` middleware validates JWT on protected routes
- Token expiration enforced (configurable TTL)
- Role-based checks for admin endpoints

**Expected Outcome**: ❌ 401 Unauthorized or 403 Forbidden

**Evidence Required**:

- API response showing 401 error
- Postman/curl request without Authorization header
- Admin endpoint rejection for non-admin user

---

### Test 5: Election State Manipulation

**Objective**: Vote when election is not active or manipulate election timing

**Attack Vector**:

- Attempt to vote before election starts
- Attempt to vote after election ends
- Attempt to start/end election as non-admin
- Attempt to modify election end time

**Security Mechanism**:

- `electionActive` modifier checks state and timestamps
- `onlyAdmin` modifier restricts state changes
- Smart contract enforces `startTime < endTime` validation
- Auto-end mechanism prevents voting after deadline

**Expected Outcome**: ❌ "Election not active" or "Only admin" revert

**Evidence Required**:

- Transaction revert before start time
- Transaction revert after end time
- Non-admin attempt to start election rejected

---

### Test 6: SQL Injection Attack

**Objective**: Inject malicious SQL to bypass authentication or extract data

**Attack Vector**:

- Login with email: `admin@example.com' OR '1'='1`
- Vote submission with malicious candidate ID: `1; DROP TABLE votes;--`

**Security Mechanism**:

- Parameterized queries using `$1, $2` placeholders
- PostgreSQL prepared statements prevent injection
- Input validation on all user inputs

**Expected Outcome**: ❌ Query treats input as literal string, no execution

**Evidence Required**:

- Login failure with SQL injection attempt
- Database logs showing safe query execution
- No tables dropped or data compromised

---

### Test 7: Replay Attack

**Objective**: Reuse valid transaction to vote multiple times

**Attack Vector**:

- Capture valid vote transaction
- Replay transaction to blockchain

**Security Mechanism**:

- Blockchain nonce prevents replay attacks
- `votedInCategory` mapping already set to true
- Each transaction has unique hash and nonce

**Expected Outcome**: ❌ Nonce mismatch or "Already voted" revert

**Evidence Required**:

- Original transaction hash
- Replay attempt rejection
- Blockchain nonce validation

---

### Test 8: Admin Privilege Escalation

**Objective**: Regular user attempts to gain admin privileges

**Attack Vector**:

- Modify JWT token to set `isAdmin: true`
- Call admin-only smart contract functions
- Access admin dashboard endpoints

**Security Mechanism**:

- JWT signature verification prevents token tampering
- Database `admins` table checked on each request
- Smart contract `onlyAdmin` modifier checks `msg.sender == admin`

**Expected Outcome**: ❌ Invalid signature or authorization failure

**Evidence Required**:

- Modified JWT rejection
- Admin endpoint 403 Forbidden response
- Smart contract "Only admin" revert

---

### Test 9: Vote History Tampering

**Objective**: Modify or delete vote history records

**Attack Vector**:

- Direct database UPDATE to change vote_history
- Attempt to delete vote_history records
- Modify blockchain transaction data

**Security Mechanism**:

- Database permissions restrict UPDATE/DELETE on vote_history
- Blockchain data is immutable (cannot modify past blocks)
- Vote receipts stored on-chain for verification

**Expected Outcome**: ❌ Database permission denied or blockchain immutability

**Evidence Required**:

- Database error on UPDATE attempt
- Blockchain explorer showing immutable history
- Vote receipt verification from smart contract

---

### Test 10: Denial of Service (DoS)

**Objective**: Overwhelm system to prevent legitimate voting

**Attack Vector**:

- Rapid repeated vote attempts
- Flood OTP request endpoint
- Spam blockchain with transactions

**Security Mechanism**:

- Rate limiting on API endpoints
- OTP cooldown period (60 seconds)
- Gas fees prevent blockchain spam
- Smart contract gas optimization

**Expected Outcome**: ❌ Rate limit errors, cooldown enforcement

**Evidence Required**:

- 429 Too Many Requests response
- OTP cooldown message
- Gas cost preventing spam

---

## Testing Methodology

### Prerequisites

1. **Running System**:

   - Backend server running on `http://localhost:3001`
   - Frontend running on `http://localhost:5173`
   - PostgreSQL database accessible
   - MetaMask connected to Hoodi Network

2. **Test Environment**:

   - Node.js installed
   - Test accounts created (voter + admin)
   - Active election with candidates

3. **Tools Required**:
   - Postman or curl for API testing
   - MetaMask browser extension
   - Blockchain explorer (Hoodi testnet)
   - Database client (pgAdmin or psql)

### Running Automated Tests

```bash
# Navigate to security tests directory
cd security-tests

# Install dependencies
npm install

# Run all security tests
node run-all-tests.js

# Run individual test
node test-double-voting.js
node test-vote-modification.js
node test-wallet-spoofing.js
node test-unauthorized-access.js
node test-election-manipulation.js
node test-sql-injection.js
```

### Manual Testing Steps

1. **Setup Test Data**:

   - Create test voter account
   - Register wallet address
   - Create active election

2. **Execute Attack**:

   - Follow attack vector steps
   - Document each attempt
   - Capture screenshots/logs

3. **Verify Security Response**:

   - Confirm attack is blocked
   - Check error messages
   - Verify system state unchanged

4. **Document Evidence**:
   - Screenshot of attack attempt
   - Error message/transaction revert
   - Blockchain explorer proof
   - Database state verification

---

## Evidence Collection

### For Each Test Case:

1. **Before State**:

   - Screenshot of initial system state
   - Database query results
   - Blockchain state

2. **Attack Execution**:

   - Screenshot of attack attempt
   - Command/API request used
   - Transaction hash (if applicable)

3. **After State**:

   - Screenshot of error/rejection
   - System state unchanged
   - Logs showing security mechanism triggered

4. **Blockchain Proof**:
   - Transaction hash on explorer
   - Revert reason displayed
   - Gas used (failed transactions)

---

## Interpreting Results

### ✅ PASS (System is Secure)

- Attack is **rejected** by security mechanism
- Appropriate error message displayed
- System state remains unchanged
- No data compromised

### ❌ FAIL (Vulnerability Found)

- Attack succeeds in bypassing security
- Unauthorized action completed
- Data modified or accessed
- **Requires immediate fix**

---

## Reporting Template

```markdown
## Test Case: [Test Name]

**Date**: [YYYY-MM-DD]
**Tester**: [Your Name]
**System Version**: [Commit Hash/Version]

### Attack Description

[What attack was attempted]

### Steps Executed

1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Outcome

[What should happen]

### Actual Outcome

[What actually happened]

### Evidence

- Screenshot 1: [Description]
- Screenshot 2: [Description]
- Transaction Hash: [Hash]
- Logs: [Relevant logs]

### Conclusion

✅ PASS - System successfully prevented attack
❌ FAIL - Vulnerability discovered

### Security Mechanism Validated

[Which security layer prevented the attack]
```

---

## Conclusion

This comprehensive security testing suite validates that the blockchain-based e-voting system is **tamper-proof** through:

1. **Blockchain Immutability**: Votes cannot be modified after casting
2. **Cryptographic Authentication**: Wallet signatures prevent impersonation
3. **Access Control**: Multi-layer authorization prevents unauthorized actions
4. **Data Integrity**: Database and blockchain maintain consistent state
5. **Attack Resistance**: System withstands common attack vectors

All tests should **FAIL** (attacks rejected), proving the system's security.

---

## Next Steps

1. Run automated test suite: `node run-all-tests.js`
2. Document results in `SECURITY_TEST_RESULTS.md`
3. Collect evidence (screenshots, transaction hashes)
4. Include in FYP report as security validation
5. Present findings to demonstrate tamper-proof properties
