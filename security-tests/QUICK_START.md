# 🚀 Quick Start - Security Testing

## One-Line Setup & Run

```bash
cd security-tests && npm install && copy .env.example .env && npm test
```

> ⚠️ **Edit `.env` first** with your `CONTRACT_ADDRESS` and `TEST_VOTER_PRIVATE_KEY`

---

## What You'll See

```
╔════════════════════════════════════════════════════════╗
║   SECURITY TEST SUITE - E-VOTING SYSTEM               ║
║   Tamper-Proof Verification                           ║
╚════════════════════════════════════════════════════════╝

=== TEST: Double Voting Attack ===
✅ ATTACK BLOCKED!
✅ TEST PASSED: Smart contract successfully prevented double voting

=== TEST: Unauthorized Access Attack ===
✅ BLOCKED: 401 Unauthorized
✅ ALL TESTS PASSED: API authentication is secure

=== TEST: SQL Injection Attack ===
✅ BLOCKED: Payload treated as literal string
✅ ALL TESTS PASSED: SQL injection prevented

=== TEST: Wallet Spoofing Attack ===
✅ ATTACK BLOCKED!
✅ ALL TESTS PASSED: Wallet spoofing prevented

╔════════════════════════════════════════════════════════╗
║              SECURITY TEST SUMMARY                     ║
╚════════════════════════════════════════════════════════╝

  Total Tests:     4
  ✅ Passed:        4
  ❌ Failed:        0
  Duration:        12.5s

  ✅ SYSTEM IS TAMPER-PROOF
```

---

## Files Generated

✅ `test-results.json` - Detailed results  
✅ `../docs/SECURITY_TEST_RESULTS.md` - FYP report

---

## For Your FYP

1. **Run**: `npm test`
2. **Screenshot**: Test summary
3. **Include**: `SECURITY_TEST_RESULTS.md` in report
4. **Demo**: Show tests running live

---

## Need Help?

📖 See [HOW_TO_RUN_TESTS.md](./HOW_TO_RUN_TESTS.md) for detailed guide
