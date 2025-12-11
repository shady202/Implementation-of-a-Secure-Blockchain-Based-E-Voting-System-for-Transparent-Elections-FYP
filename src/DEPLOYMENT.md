# 🚀 APU VOTE - Complete Deployment Guide

This comprehensive guide will walk you through deploying the APU VOTE blockchain-based voting system from start to finish.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Local Development](#local-development)
4. [Testnet Deployment](#testnet-deployment)
5. [Mainnet Deployment](#mainnet-deployment)
6. [Frontend Deployment](#frontend-deployment)
7. [Post-Deployment Configuration](#post-deployment-configuration)
8. [Verification & Testing](#verification--testing)
9. [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### Required Software
- **Node.js** v16.x or later ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** for version control
- **MetaMask** browser extension ([Install](https://metamask.io/))

### Required Accounts
- **Infura** or **Alchemy** account for RPC access ([Infura](https://infura.io/) | [Alchemy](https://www.alchemy.com/))
- **Etherscan** API key for contract verification ([Get Key](https://etherscan.io/apis))
- **Vercel** account for frontend hosting (optional) ([Sign Up](https://vercel.com/))

### Ethereum Wallet
- Create a new wallet for deployment (NEVER use your personal wallet)
- Fund the wallet with ETH for gas fees
  - Testnet: Get free ETH from faucets
  - Mainnet: Purchase ETH from exchanges

## 🎯 Initial Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-org/apu-vote.git
cd apu-vote

# Install dependencies
npm install

# Install Hardhat and tools
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Network RPC URLs (Get from Infura or Alchemy)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID

# Deployment wallet private key (KEEP SECRET!)
PRIVATE_KEY=your_private_key_here

# API Keys
ETHERSCAN_API_KEY=your_etherscan_api_key
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key

# Frontend Environment
NEXT_PUBLIC_ETHEREUM_NETWORK=sepolia
NEXT_PUBLIC_INFURA_ID=your_infura_project_id
```

⚠️ **SECURITY WARNING**: Never commit your `.env` file or share your private keys!

### 3. Verify Setup

```bash
# Compile contracts
npm run compile

# Run tests
npm run test
```

## 💻 Local Development

### 1. Start Local Blockchain

```bash
# Terminal 1: Start Hardhat node
npm run node
```

This will:
- Start a local Ethereum network on `http://127.0.0.1:8545`
- Display 20 test accounts with private keys
- Fund each account with 10,000 ETH

### 2. Deploy to Local Network

```bash
# Terminal 2: Deploy and setup
npm run deploy:local
```

Or run the full setup with test data:

```bash
node scripts/setup-local.js
```

This will:
- Deploy the VotingSystem contract
- Create a test election
- Add sample candidates
- Register test voters
- Start the election

### 3. Configure MetaMask

1. Open MetaMask
2. Add Network:
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency Symbol: ETH

3. Import test account:
   - Copy private key from Hardhat node output
   - Import into MetaMask

### 4. Update Contract Address

After deployment, update `lib/blockchain.ts`:

```typescript
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
```

### 5. Start Frontend

```bash
# Terminal 3: Start Next.js
npm run dev
```

Visit: `http://localhost:3000`

## 🌐 Testnet Deployment

### 1. Get Testnet ETH

**Sepolia Faucets:**
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)

### 2. Configure Network

Ensure `hardhat.config.js` has Sepolia configuration:

```javascript
sepolia: {
  url: process.env.SEPOLIA_RPC_URL,
  accounts: [process.env.PRIVATE_KEY],
  chainId: 11155111,
}
```

### 3. Deploy to Sepolia

```bash
npm run deploy:testnet
```

**Expected Output:**
```
🚀 Starting APU VOTE deployment...
📋 Deploying contracts with account: 0x...
💰 Account balance: 0.5 ETH
📝 Deploying VotingSystem contract...
✅ VotingSystem deployed to: 0x...
⏳ Waiting for block confirmations...
✅ Confirmed!
🔍 Verifying contract on Etherscan...
✅ Contract verified on Etherscan!
```

### 4. Save Deployment Info

The deployment script automatically saves to `deployments/sepolia-latest.json`:

```json
{
  "network": "sepolia",
  "contractAddress": "0x...",
  "adminAddress": "0x...",
  "deploymentTime": "2025-10-16T10:30:00.000Z",
  "blockNumber": 12345678
}
```

### 5. Verify on Etherscan

Visit: `https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS`

Verify the contract is:
- ✅ Deployed successfully
- ✅ Source code verified
- ✅ Admin address is correct

## 🚀 Mainnet Deployment

⚠️ **CRITICAL**: Mainnet deployment uses real ETH. Double-check everything!

### Pre-Deployment Checklist

- [ ] Smart contract audited by security firm
- [ ] All tests passing
- [ ] Testnet deployment successful
- [ ] Admin wallet secured (hardware wallet recommended)
- [ ] Sufficient ETH for gas fees (~0.05-0.1 ETH)
- [ ] Backup of all configuration files
- [ ] Team approval obtained

### 1. Final Security Review

```bash
# Run full test suite
npm run test

# Check for vulnerabilities
npm audit

# Review contract code one final time
cat contracts/VotingSystem.sol
```

### 2. Prepare Production Environment

```bash
# Create production env file
cp .env .env.production

# Update for mainnet
nano .env.production
```

Update:
```env
NEXT_PUBLIC_ETHEREUM_NETWORK=mainnet
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
```

### 3. Deploy to Mainnet

```bash
# FINAL CHECK: Is everything correct?
# This will use REAL ETH!

npm run deploy:mainnet
```

### 4. Post-Deployment Actions

1. **Verify Contract on Etherscan**
   ```bash
   npm run verify -- --network mainnet DEPLOYED_ADDRESS
   ```

2. **Secure the Admin Wallet**
   - Transfer admin wallet to hardware wallet or multi-sig
   - Never expose admin private key

3. **Update Frontend Configuration**
   - Update `.env.production` with contract address
   - Deploy frontend

4. **Announce Deployment**
   - Share contract address with stakeholders
   - Publish on university website
   - Update documentation

## 🌟 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Configure Environment Variables**
   
   In Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.production`

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Custom Domain** (Optional)
   - Add domain: `vote.apu.edu.my`
   - Update DNS records
   - Enable SSL

### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   ```

2. **Deploy**
   ```bash
   npm run build
   netlify deploy --prod
   ```

### Option 3: Traditional Hosting

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Upload to Server**
   - Upload `.next` folder
   - Upload `public` folder
   - Upload `package.json`
   - Install dependencies on server
   - Start with `npm start`

## ⚙️ Post-Deployment Configuration

### 1. Admin Setup

Visit: `https://vote.apu.edu.my/login`

Login with admin account:
- Email: `admin@apu.edu.my`
- Password: (set during registration)

### 2. Create Voting Categories

Navigate to: Categories → Add Category

Example categories:
- **Student Union Government**
  - Positions: President, Vice President, Secretary, Treasurer, PRO
  
- **Faculty Representatives**
  - Positions: Faculty Rep, Assistant Faculty Rep
  
- **Departmental Executives**
  - Positions: President, Vice President, Secretary

### 3. Add Candidates

For each position:
1. Go to Admin Dashboard → Candidates
2. Click "Add Candidate"
3. Fill in details:
   - Name
   - Position
   - Party/Affiliation
   - Photo (optional)

### 4. Configure Election

1. Set election dates
2. Configure eligibility requirements
3. Set voting rules
4. Test voter registration flow

### 5. University Database Integration

Update `lib/blockchain.ts`:

```typescript
export const verifyStudentEligibility = async (studentData: any) => {
  // Replace with actual API call to university database
  const response = await fetch(process.env.UNIVERSITY_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.UNIVERSITY_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(studentData)
  });
  
  return await response.json();
}
```

## ✅ Verification & Testing

### 1. Smart Contract Testing

```bash
# Run all tests
npm run test

# Check gas usage
REPORT_GAS=true npm run test

# Check coverage
npm run coverage
```

### 2. Frontend Testing

**Test Scenarios:**
- [ ] User registration
- [ ] Wallet connection
- [ ] Student eligibility verification
- [ ] Voter registration
- [ ] Vote casting
- [ ] Results viewing
- [ ] Admin functions

### 3. End-to-End Testing

1. **As Student:**
   - Register account
   - Verify eligibility
   - Connect MetaMask
   - Register as voter
   - Cast vote
   - View results

2. **As Admin:**
   - Create election
   - Add candidates
   - Manage categories
   - Monitor votes
   - End election
   - View results

### 4. Security Testing

- [ ] Try to vote twice
- [ ] Try to vote without registration
- [ ] Try admin functions as regular user
- [ ] Test wallet disconnection scenarios
- [ ] Verify transaction signatures

## 🐛 Troubleshooting

### Common Issues

**Issue: Contract deployment fails**
```
Error: insufficient funds for gas
```
**Solution:** Ensure wallet has enough ETH for gas fees

---

**Issue: MetaMask not connecting**
```
Error: MetaMask is not installed
```
**Solution:** Install MetaMask extension and refresh page

---

**Issue: Transaction reverted**
```
Error: execution reverted
```
**Solution:** Check contract state, ensure election is active

---

**Issue: Wrong network**
```
Error: wrong network
```
**Solution:** Switch MetaMask to correct network

### Getting Help

- 📧 Email: support@apuvote.edu.my
- 📖 Documentation: https://docs.apuvote.edu.my
- 💬 Discord: https://discord.gg/apuvote
- 🐛 Issues: https://github.com/your-org/apu-vote/issues

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Ethereum Development Best Practices](https://ethereum.org/en/developers/)

## 🔒 Security Best Practices

1. **Never commit sensitive data**
   - Private keys
   - API keys
   - Admin credentials

2. **Use hardware wallets for production**
   - Ledger or Trezor recommended
   - Multi-signature for admin functions

3. **Regular security audits**
   - Annual smart contract audits
   - Penetration testing
   - Dependency updates

4. **Monitor contract activity**
   - Set up alerts for unusual activity
   - Regular balance checks
   - Transaction monitoring

## 📊 Maintenance

### Regular Tasks

**Daily:**
- Monitor election activity
- Check for errors
- Respond to support requests

**Weekly:**
- Review analytics
- Update documentation
- Backup data

**Monthly:**
- Security updates
- Dependency updates
- Performance optimization

**Quarterly:**
- Security audit
- System review
- Feature planning

---

## 🎉 Congratulations!

Your APU VOTE blockchain voting system is now deployed and ready for use!

**Next Steps:**
1. Announce to students
2. Conduct training sessions
3. Monitor first election
4. Gather feedback
5. Iterate and improve

---

**Version:** 1.0.0  
**Last Updated:** October 16, 2025  
**Maintained by:** APU Development Team
