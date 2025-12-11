# ✅ DEPLOYMENT CHECKLIST - Quick Reference

Use this checklist to deploy APU VOTE to Ethereum Hoodi testnet.

---

## 🎯 BEFORE YOU START

### Required Items:
- [ ] MetaMask installed and set up
- [ ] Hoodi network added to MetaMask (Chain ID: 17000)
- [ ] Test ETH balance on Hoodi network (minimum 0.05 ETH)
- [ ] Private key exported from MetaMask
- [ ] Code editor (VS Code, etc.)
- [ ] Terminal access

---

## 📋 DEPLOYMENT STEPS

### ✅ STEP 1: Setup Environment
```bash
# Copy example env file
cp .env.example .env
```

- [ ] Created `.env` file
- [ ] Added private key (without 0x prefix)
- [ ] Set HOODI_RPC_URL=https://rpc.hoodi.io
- [ ] Set NEXT_PUBLIC_CHAIN_ID=17000
- [ ] Set NEXT_PUBLIC_NETWORK_NAME=hoodi
- [ ] Set NEXT_PUBLIC_ENABLE_MOCK_MODE=false

### ✅ STEP 2: Install Dependencies
```bash
npm install
```

- [ ] All packages installed successfully
- [ ] No error messages

### ✅ STEP 3: Compile Contract
```bash
npx hardhat compile
```

- [ ] Compilation successful
- [ ] No Solidity errors
- [ ] Artifacts created

### ✅ STEP 4: Deploy to Hoodi
```bash
npx hardhat run scripts/deploy.js --network hoodi
```

- [ ] Deployment started
- [ ] Contract deployed successfully
- [ ] Contract address received
- [ ] Transaction confirmed

### ✅ STEP 5: Update Configuration
- [ ] Copy contract address from terminal
- [ ] Paste into `.env` as NEXT_PUBLIC_CONTRACT_ADDRESS
- [ ] Save `.env` file
- [ ] Verify contract address is correct

### ✅ STEP 6: Restart Application
```bash
npm run dev
```

- [ ] Development server started
- [ ] No build errors
- [ ] Application accessible at http://localhost:3000

### ✅ STEP 7: Test Blockchain Integration
- [ ] Connect MetaMask wallet
- [ ] Switch to Hoodi network
- [ ] Register as voter (MetaMask popup appears)
- [ ] Approve transaction in MetaMask
- [ ] Transaction confirmed on blockchain
- [ ] Cast a test vote
- [ ] Verify vote recorded on-chain

---

## 🔍 VERIFICATION

### Check Contract on Explorer:
- [ ] Visit https://explorer.hoodi.io
- [ ] Search for your contract address
- [ ] View deployment transaction
- [ ] Verify contract is deployed

### Check Application:
- [ ] Wallet connection works
- [ ] MetaMask popups appear for transactions
- [ ] Transactions are confirmed
- [ ] No mock mode warnings
- [ ] Real blockchain data loading

---

## 📝 DEPLOYMENT INFO

Fill this out after deployment:

**Contract Address:**
```
0x_____________________________________
```

**Deployer Address:**
```
0x_____________________________________
```

**Deployment Transaction:**
```
0x_____________________________________
```

**Deployment Date:**
```
____________________
```

**Block Number:**
```
____________________
```

**Network:**
```
Ethereum Hoodi (Chain ID: 17000)
```

---

## ⚠️ TROUBLESHOOTING

If something goes wrong, check:

- [ ] MetaMask is unlocked
- [ ] On Hoodi network (Chain ID: 17000)
- [ ] Have enough test ETH (check balance)
- [ ] Private key is correct (no 0x prefix)
- [ ] RPC URL is correct
- [ ] Internet connection is stable
- [ ] No firewall blocking RPC

**Common Fixes:**
- Reset MetaMask account (Settings → Advanced → Reset Account)
- Try alternative RPC: https://ethereum-holesky.publicnode.com
- Get more test ETH from faucet
- Clear hardhat cache: `npx hardhat clean`

---

## 🎉 SUCCESS CRITERIA

You've successfully deployed when:

✅ Contract deployed to Hoodi testnet
✅ Contract address in `.env`
✅ Mock mode disabled
✅ MetaMask transactions working
✅ Votes recorded on blockchain
✅ Transaction confirmations visible

---

## 📞 NEED HELP?

Refer to:
- `/HOODI_DEPLOYMENT_GUIDE.md` - Full detailed guide
- `/TROUBLESHOOTING.md` - Common issues
- Hardhat docs: https://hardhat.org/docs
- Hoodi docs: https://docs.hoodi.io

---

**Ready to deploy? Start with Step 1!** 🚀
