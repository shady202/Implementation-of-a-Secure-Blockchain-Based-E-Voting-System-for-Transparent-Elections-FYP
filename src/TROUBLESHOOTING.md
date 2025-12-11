# 🔧 Troubleshooting Guide - APU VOTE

Quick solutions to common issues.

---

## ❌ Error: "process is not defined"

**Cause**: Trying to access `process.env` in client-side code.

**Solution**: 
1. Ensure you have `.env.local` file created:
   ```bash
   cp .env.example .env.local
   ```

2. All environment variables used in client code MUST be prefixed with `NEXT_PUBLIC_`

3. Restart your development server:
   ```bash
   npm run dev
   ```

**Already Fixed**: We've created `/lib/env.ts` that safely handles environment variables in both server and client contexts.

---

## ❌ Error: "MetaMask not detected"

**Cause**: MetaMask extension not installed or not detected.

**Solution**:
1. **Install MetaMask**: Visit https://metamask.io and install the browser extension
2. **Or use Mock Mode**: Set in `.env.local`:
   ```env
   NEXT_PUBLIC_ENABLE_MOCK_MODE=true
   ```
3. Restart your dev server

---

## ❌ Error: "Cannot connect to network"

**Cause**: Hardhat local blockchain not running or wrong network.

**Solution**:
1. Start Hardhat node:
   ```bash
   npm run node
   ```

2. Add network to MetaMask:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

3. Or enable Mock Mode in `.env.local`:
   ```env
   NEXT_PUBLIC_ENABLE_MOCK_MODE=true
   ```

---

## ❌ Error: "Transaction failed" or "Insufficient funds"

**Cause**: Test account has no ETH.

**Solution**:
1. When you run `npm run node`, Hardhat displays test accounts with 10000 ETH each
2. Import one of these accounts into MetaMask using the displayed private key
3. **ONLY use these keys for local testing!**

Example from Hardhat output:
```
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

---

## ❌ Error: "Contract not deployed"

**Cause**: Smart contract hasn't been deployed to the network.

**Solution**:
1. Compile contracts:
   ```bash
   npm run compile
   ```

2. Deploy to local network:
   ```bash
   npm run deploy:local
   ```

3. Copy the deployed contract address from the console output

4. Update `.env.local`:
   ```env
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourNewContractAddress
   ```

5. Generate ABI:
   ```bash
   npm run generate-abi
   ```

6. Restart dev server:
   ```bash
   npm run dev
   ```

---

## ❌ Error: "Module not found" or Import Errors

**Cause**: Dependencies not installed or corrupted.

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Restart dev server
npm run dev
```

---

## ❌ Error: "ABI is outdated" or Contract Function Errors

**Cause**: Smart contract was updated but ABI wasn't regenerated.

**Solution**:
```bash
# Recompile contracts
npm run compile

# Regenerate ABI
npm run generate-abi

# Restart dev server
npm run dev
```

---

## ❌ Error: "Session expired" or Login Issues

**Cause**: Session encryption key mismatch or expired session.

**Solution**:
1. Clear browser localStorage:
   ```javascript
   // In browser console
   localStorage.clear()
   ```

2. Ensure `.env.local` has session key:
   ```env
   NEXT_PUBLIC_SESSION_KEY=apu-vote-session-key-2025
   ```

3. Restart dev server

---

## ❌ Error: "Wrong network" in MetaMask

**Cause**: MetaMask is connected to wrong network.

**Solution**:
1. Click on network dropdown in MetaMask
2. Select "Hardhat Local" (or add it if not present)
3. Or the app will prompt you to switch networks automatically

---

## ❌ Error: "Nonce too high" or Transaction Stuck

**Cause**: MetaMask transaction history out of sync.

**Solution**:
1. Open MetaMask
2. Click account icon → Settings → Advanced
3. Click "Reset Account"
4. Try transaction again

**Note**: This only resets transaction history, not your account balance.

---

## ❌ Error: Build Fails with TypeScript Errors

**Cause**: Type mismatches or missing type definitions.

**Solution**:
1. Ensure `/types/ethereum.d.ts` exists
2. Restart TypeScript server in your editor
3. Check for any import errors
4. Run type check:
   ```bash
   npx tsc --noEmit
   ```

---

## ❌ Warning: "Development server not responding"

**Cause**: Port 3000 already in use.

**Solution**:
1. Kill process on port 3000:
   ```bash
   # On Mac/Linux
   lsof -ti:3000 | xargs kill -9
   
   # On Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. Or use different port:
   ```bash
   PORT=3001 npm run dev
   ```

---

## ❌ Mock Mode Not Working

**Cause**: Environment variable not set correctly.

**Solution**:
1. Check `.env.local`:
   ```env
   NEXT_PUBLIC_ENABLE_MOCK_MODE=true
   ```

2. Ensure no spaces around `=`
3. Value must be exactly `true` (lowercase)
4. Restart dev server after changing

---

## ❌ Voting Not Working

**Symptoms**: Can't cast vote, no transaction appears.

**Solution**:

**In Mock Mode**:
1. Check browser console for errors
2. Ensure you're logged in
3. Clear localStorage and try again

**In Blockchain Mode**:
1. Ensure election is in "Active" state
2. Check you haven't already voted
3. Ensure you're registered as voter
4. Check MetaMask for pending transactions
5. Ensure sufficient ETH for gas

---

## ❌ Admin Dashboard Empty

**Cause**: No data or not logged in as admin.

**Solution**:
1. Login with admin credentials:
   ```
   Email: admin@apu.edu.my
   Password: admin123
   ```

2. In Mock Mode, data is automatically populated
3. In Blockchain Mode, create election first

---

## 🔄 Complete Reset (Nuclear Option)

If all else fails, reset everything:

```bash
# 1. Stop all running processes (Ctrl+C in all terminals)

# 2. Clean everything
rm -rf node_modules package-lock.json
rm -rf artifacts cache
rm -rf .next

# 3. Reinstall
npm install

# 4. Recompile contracts
npm run compile

# 5. Start fresh Hardhat node
npm run node

# 6. Deploy contracts (in new terminal)
npm run deploy:local

# 7. Generate ABI
npm run generate-abi

# 8. Update .env.local with new contract address

# 9. Clear browser data
# - Open browser console
# - Run: localStorage.clear()
# - Hard refresh (Ctrl+Shift+R)

# 10. Start dev server
npm run dev
```

---

## 📞 Still Having Issues?

### Debug Checklist
- [ ] Node version 16+ installed? (`node --version`)
- [ ] All dependencies installed? (`npm install`)
- [ ] `.env.local` file exists and has correct values?
- [ ] Hardhat node running? (if not using mock mode)
- [ ] Contract deployed? (if not using mock mode)
- [ ] MetaMask installed and unlocked?
- [ ] Browser console clear of errors?
- [ ] Dev server restarted after config changes?

### Get Help
1. Check browser console for detailed error messages
2. Check terminal where dev server is running
3. Review the error messages carefully
4. Search for error in documentation
5. Create GitHub issue with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node version, etc.)
   - Screenshots if applicable

---

## 💡 Pro Tips

1. **Always check browser console first** - Most errors are logged there
2. **Restart dev server after .env changes** - Environment variables are loaded at startup
3. **Use Mock Mode for UI development** - Faster and no blockchain needed
4. **Keep Hardhat node running** - Restarting it changes contract addresses
5. **MetaMask can be tricky** - "Reset Account" fixes most issues
6. **Check the docs** - README.md and QUICK_START.md have detailed guides

---

**Updated**: October 20, 2025  
**Version**: 1.1.0
