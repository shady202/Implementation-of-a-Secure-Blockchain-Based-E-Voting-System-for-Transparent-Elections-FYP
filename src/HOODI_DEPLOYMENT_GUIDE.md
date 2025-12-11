# 🚀 ETHEREUM HOODI DEPLOYMENT GUIDE

Complete step-by-step guide to deploy APU VOTE smart contract to Ethereum Hoodi testnet.

---

## 📋 PREREQUISITES CHECKLIST

Before you start, make sure you have:

- [ ] MetaMask browser extension installed
- [ ] Test ETH on Hoodi network (from faucet)
- [ ] Node.js and npm installed
- [ ] Private key exported from MetaMask
- [ ] Terminal/Command Prompt access

---

## 🔧 STEP 1: GET YOUR METAMASK PRIVATE KEY

### ⚠️ **SECURITY WARNING**
**NEVER share your private key with anyone! Keep it secret!**

### How to Export Private Key from MetaMask:

1. **Open MetaMask** browser extension
2. Click on the **three dots** (⋮) menu in the top right
3. Click **"Account Details"**
4. Click **"Show Private Key"**
5. Enter your MetaMask **password**
6. **Copy** your private key (without the `0x` prefix)

**Example format:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

---

## 💰 STEP 2: GET TEST ETH ON HOODI NETWORK

You need test ETH to deploy the contract and pay for gas fees.

### Option 1: Hoodi Faucet (Recommended)

1. **Visit:** https://faucet.hoodi.io
2. **Connect** your MetaMask wallet
3. **Make sure** you're on the Hoodi network (Chain ID: 17000)
4. **Request** test ETH (usually 0.1-1 ETH)
5. **Wait** for the transaction to complete (~30 seconds)

### Option 2: Alternative Faucets

If the official faucet is down, try:
- https://holesky-faucet.pk910.de (may work for Hoodi)
- Ask in Ethereum Discord/Telegram for testnet ETH

### Verify Your Balance:

1. Open MetaMask
2. Make sure you're on **Hoodi Network**
3. Check your balance (should show > 0 ETH)

**Minimum recommended:** 0.05 ETH for deployment

---

## 🔐 STEP 3: CONFIGURE ENVIRONMENT VARIABLES

### Create .env File:

1. **Copy** the example file:
   ```bash
   cp .env.example .env
   ```

2. **Open** `.env` in a text editor

3. **Update** with your information:

```bash
# ====== BLOCKCHAIN DEPLOYMENT ======
# Paste your private key here (NO 0x prefix!)
PRIVATE_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2

# Hoodi RPC URL
HOODI_RPC_URL=https://rpc.hoodi.io

# ====== CONTRACT CONFIGURATION ======
# Leave empty for now - will be filled after deployment
NEXT_PUBLIC_CONTRACT_ADDRESS=

# Network settings
NEXT_PUBLIC_CHAIN_ID=17000
NEXT_PUBLIC_NETWORK_NAME=hoodi

# ====== APPLICATION SETTINGS ======
# Set to FALSE to enable real blockchain transactions
NEXT_PUBLIC_ENABLE_MOCK_MODE=false

# Session key
NEXT_PUBLIC_SESSION_KEY=apu-vote-session-key-2025

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Save** the file

### ⚠️ Security Notes:
- **NEVER** commit `.env` to Git
- Add `.env` to your `.gitignore` file
- Use different private keys for testnet and mainnet

---

## 📦 STEP 4: INSTALL DEPENDENCIES

Open your terminal and run:

```bash
npm install
```

This will install all required packages including:
- Hardhat
- Ethers.js
- Solidity compiler
- Testing tools

**Expected output:**
```
added 500+ packages
```

---

## 🏗️ STEP 5: COMPILE THE CONTRACT

Compile your Solidity smart contract:

```bash
npx hardhat compile
```

**Expected output:**
```
Compiled 1 Solidity file successfully
```

**What this does:**
- Compiles `contracts/VotingSystem.sol`
- Generates ABI and bytecode
- Creates artifacts in `/artifacts` folder

**⚠️ If you see errors:**
- Check Solidity version compatibility
- Ensure contract syntax is correct
- Review error messages carefully

---

## 🚀 STEP 6: DEPLOY TO HOODI TESTNET

### Run Deployment:

```bash
npx hardhat run scripts/deploy.js --network hoodi
```

### What Happens During Deployment:

1. **Connects** to Hoodi network
2. **Checks** deployer balance
3. **Deploys** VotingSystem contract
4. **Waits** for confirmations
5. **Saves** deployment info
6. **Updates** configuration files

### Expected Output:

```bash
🚀 Starting APU VOTE deployment...

📋 Deploying contracts with account: 0x1234...5678
💰 Account balance: 0.5 ETH

📝 Deploying VotingSystem contract...
✅ VotingSystem deployed to: 0xABCD...EF01
👤 Admin address: 0x1234...5678

⏳ Waiting for block confirmations...
✅ Confirmed!

✅ Updated lib/blockchain.ts with new contract address
✅ Deployment info saved to: deployments/hoodi-1234567890.json

============================================================
🎉 DEPLOYMENT COMPLETE!
============================================================

📌 Important Information:
   Contract Address: 0xABCD...EF01
   Network: hoodi
   Admin: 0x1234...5678

📝 Next Steps:
   1. Update .env with NEXT_PUBLIC_CONTRACT_ADDRESS
   2. Configure voting categories in admin dashboard
   3. Add candidates for each position
   4. Set up election parameters
   5. Test voter registration and voting flow

============================================================
```

### ⚠️ Troubleshooting Deployment Errors:

#### Error: "Insufficient funds"
- **Solution:** Get more test ETH from faucet

#### Error: "Network connection failed"
- **Solution:** Check RPC URL, try alternative: `https://ethereum-holesky.publicnode.com`

#### Error: "Invalid private key"
- **Solution:** Remove `0x` prefix from private key in `.env`

#### Error: "Nonce too high"
- **Solution:** Reset MetaMask account or wait a few minutes

---

## ✅ STEP 7: VERIFY DEPLOYMENT

### 1. Copy Contract Address

From the deployment output, copy the contract address:
```
0xABCD...EF01
```

### 2. Update .env File

Open `.env` and add the contract address:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xABCD...EF01
```

### 3. Verify on Block Explorer

Visit: https://explorer.hoodi.io

- **Search** for your contract address
- **Verify** deployment transaction
- **Check** contract code

### 4. Test Contract Interaction

Create a test script to verify the contract works:

```bash
npx hardhat console --network hoodi
```

Then run:
```javascript
const VotingSystem = await ethers.getContractFactory("VotingSystem");
const contract = await VotingSystem.attach("YOUR_CONTRACT_ADDRESS");
const admin = await contract.admin();
console.log("Admin:", admin);
```

---

## 🔄 STEP 8: UPDATE FRONTEND CONFIGURATION

### 1. Update env.ts (already configured)

The deployment script automatically updates `/lib/env.ts` with the new contract address.

### 2. Verify Changes:

Check `/lib/env.ts`:
```typescript
CONTRACT_ADDRESS: "0xABCD...EF01"
CHAIN_ID: "17000"
NETWORK_NAME: "hoodi"
ENABLE_MOCK_MODE: false
```

### 3. Restart Development Server:

```bash
npm run dev
```

---

## 🧪 STEP 9: TEST THE DEPLOYMENT

### Test Wallet Connection:

1. **Open** http://localhost:3000
2. **Click** "Get Started"
3. **Login** with test credentials
4. **Click** "Elections"
5. **Connect Wallet**
6. **Approve** MetaMask connection
7. **Switch** to Hoodi network (if prompted)

### Test Voter Registration:

1. **Navigate** to voter registration
2. **Fill** registration form
3. **Submit** registration
4. **Approve** MetaMask transaction
5. **Wait** for confirmation

### Test Voting:

1. **Navigate** to voting page
2. **Select** candidates
3. **Submit** votes
4. **Approve** MetaMask transaction
5. **Verify** transaction on explorer

---

## 📊 DEPLOYMENT ARTIFACTS

After deployment, you'll have these files:

### `/deployments/hoodi-latest.json`
```json
{
  "network": "hoodi",
  "contractAddress": "0xABCD...EF01",
  "adminAddress": "0x1234...5678",
  "deploymentTime": "2025-01-15T10:30:00.000Z",
  "blockNumber": 123456
}
```

### Updated Files:
- ✅ `/lib/env.ts` - Contract address updated
- ✅ `/deployments/hoodi-*.json` - Deployment records
- ✅ `.env` - Environment variables

---

## 🛠️ COMMON DEPLOYMENT SCENARIOS

### Scenario 1: Re-deploying After Contract Changes

```bash
# 1. Update contract code
# 2. Recompile
npx hardhat compile

# 3. Deploy again
npx hardhat run scripts/deploy.js --network hoodi

# 4. Update .env with new address
```

### Scenario 2: Deploying to Different Network

```bash
# Deploy to Sepolia instead
npx hardhat run scripts/deploy.js --network sepolia
```

### Scenario 3: Local Testing Before Hoodi

```bash
# Start local node
npx hardhat node

# In another terminal
npx hardhat run scripts/deploy.js --network localhost
```

---

## 📝 POST-DEPLOYMENT CHECKLIST

After successful deployment:

- [ ] Contract address saved in `.env`
- [ ] ENABLE_MOCK_MODE set to `false`
- [ ] Contract verified on block explorer
- [ ] Frontend connects to contract
- [ ] Wallet connection works
- [ ] Can register as voter
- [ ] Can cast votes
- [ ] Admin dashboard accessible
- [ ] All transactions confirmed on-chain

---

## 🆘 GETTING HELP

### Resources:

- **Hoodi Documentation:** https://docs.hoodi.io
- **Hardhat Docs:** https://hardhat.org/docs
- **Ethers.js Docs:** https://docs.ethers.org

### Logs Location:

- Deployment logs: `/deployments/`
- Hardhat console: Terminal output
- MetaMask activity: MetaMask → Activity tab

### Debug Commands:

```bash
# Check network connection
npx hardhat node --network hoodi

# Verify contract
npx hardhat verify --network hoodi YOUR_CONTRACT_ADDRESS

# Run tests
npx hardhat test
```

---

## 🎉 SUCCESS!

If you've completed all steps, your APU VOTE contract is now live on Ethereum Hoodi testnet!

**What's Next?**

1. Configure admin dashboard
2. Add voting categories
3. Create candidate profiles
4. Test the full voting flow
5. Share with beta testers

---

**Last Updated:** January 2025
**Contract Version:** 1.0.0
**Network:** Ethereum Hoodi (Chain ID: 17000)
