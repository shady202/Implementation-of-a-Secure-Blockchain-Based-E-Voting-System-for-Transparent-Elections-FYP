# 🚀 Quick Start Guide - APU VOTE

Get the APU VOTE blockchain voting system up and running in minutes!

---

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ Node.js v16 or higher
- ✅ npm or yarn package manager
- ✅ MetaMask browser extension installed
- ✅ Git (for cloning the repository)

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-org/apu-vote.git
cd apu-vote

# Install dependencies
npm install
```

### Step 2: Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit with your preferred editor
nano .env
```

**Minimum required settings for local development**:
```env
NEXT_PUBLIC_ENABLE_MOCK_MODE=true
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_CHAIN_ID=31337
```

### Step 3: Compile Smart Contracts

```bash
npm run compile
```

### Step 4: Start Local Blockchain (Optional)

**Terminal 1** - Run local Hardhat node:
```bash
npm run node
```

**Terminal 2** - Deploy contracts:
```bash
npm run deploy:local
```

**Terminal 3** - Generate ABI:
```bash
npm run generate-abi
```

### Step 5: Start Application

```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## 🎯 Development Modes

### Mock Mode (No Blockchain Required)

Perfect for UI development and testing:

```env
NEXT_PUBLIC_ENABLE_MOCK_MODE=true
```

- ✅ No MetaMask required
- ✅ Instant responses
- ✅ Uses localStorage
- ✅ Great for prototyping

### Blockchain Mode (Real Integration)

For actual blockchain testing:

```env
NEXT_PUBLIC_ENABLE_MOCK_MODE=false
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
NEXT_PUBLIC_CHAIN_ID=31337
```

- ✅ Real MetaMask integration
- ✅ Actual blockchain transactions
- ✅ Gas fees apply
- ✅ Full functionality

---

## 🧪 Test Credentials

### Student Account
```
Student ID: TP12345
Password: password123
```

### Admin Account
```
Email: admin@apu.edu.my
Password: admin123
```

### Alternative Admin
```
Email: election@apu.edu.my
Password: election123
```

---

## 🔗 MetaMask Setup for Local Development

### 1. Add Hardhat Local Network

**Network Settings**:
- Network Name: `Hardhat Local`
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Currency Symbol: `ETH`

### 2. Import Test Account

When you run `npm run node`, Hardhat displays test accounts. Import one:

```
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

⚠️ **Warning**: Only use these accounts for local testing!

---

## 📝 Common Commands

```bash
# Development
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm run start            # Start production server

# Blockchain
npm run compile          # Compile Solidity contracts
npm run generate-abi     # Generate TypeScript ABI
npm run node             # Start local blockchain
npm run deploy:local     # Deploy to local network
npm run deploy:testnet   # Deploy to Sepolia testnet
npm run test             # Run smart contract tests

# Utilities
npm run lint             # Run ESLint
```

---

## 🏗️ Project Structure

```
apu-vote/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   └── ...                # Feature components
├── lib/                    # Utilities and helpers
│   ├── blockchain.ts      # Blockchain integration
│   ├── auth.ts            # Authentication
│   ├── session.ts         # Session management
│   └── VotingSystemABI.ts # Contract ABI
├── contracts/              # Solidity smart contracts
├── scripts/                # Deployment & utility scripts
├── test/                   # Smart contract tests
├── types/                  # TypeScript type definitions
└── styles/                 # Global styles
```

---

## 🎨 Key Features to Test

### For Students
1. **Register** → Create account
2. **Verify Eligibility** → Student ID verification
3. **Connect Wallet** → MetaMask integration
4. **Cast Vote** → Vote for candidates
5. **View Results** → See election results

### For Admins
1. **Login** → Admin dashboard access
2. **Create Election** → Set up new election
3. **Add Categories** → Organize positions
4. **Add Candidates** → Register candidates
5. **Manage Election** → Start/Stop voting
6. **Monitor** → View real-time statistics

---

## 🐛 Troubleshooting

### Issue: "MetaMask not detected"

**Solution**:
1. Install MetaMask extension
2. Or enable Mock Mode: `NEXT_PUBLIC_ENABLE_MOCK_MODE=true`

### Issue: "Cannot connect to network"

**Solution**:
1. Ensure Hardhat node is running: `npm run node`
2. Check MetaMask is on correct network (Chain ID: 31337)
3. Try resetting MetaMask account (Settings → Advanced → Reset Account)

### Issue: "Transaction failed"

**Solution**:
1. Check you have enough ETH in your test wallet
2. Ensure election state is correct (Active for voting)
3. Verify you haven't already voted
4. Check browser console for detailed error

### Issue: "Contract not deployed"

**Solution**:
```bash
# Re-deploy the contract
npm run deploy:local

# Update .env with new contract address
npm run generate-abi
```

### Issue: "Module not found" errors

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Issue: "ABI is outdated"

**Solution**:
```bash
npm run compile
npm run generate-abi
```

---

## 🔒 Security Notes

### For Development
- ✅ Use test accounts only
- ✅ Never commit `.env` file
- ✅ Use different keys for each environment
- ✅ Enable mock mode for UI testing

### For Production
- ⚠️ Get smart contract audited
- ⚠️ Use hardware wallet for deployment
- ⚠️ Enable multi-sig for admin
- ⚠️ Implement rate limiting
- ⚠️ Add proper monitoring

---

## 📚 Next Steps

1. **Explore the UI** → Test all features in mock mode
2. **Deploy Locally** → Try blockchain integration
3. **Run Tests** → `npm run test`
4. **Read Documentation** → Check README.md and DEPLOYMENT.md
5. **Deploy to Testnet** → Follow DEPLOYMENT.md guide

---

## 🆘 Getting Help

### Resources
- 📖 **README.md** - Full project documentation
- 🚀 **DEPLOYMENT.md** - Deployment guide
- 🔧 **FIXES_SUMMARY.md** - Recent fixes and changes
- 💻 **GitHub Issues** - Report bugs or request features

### Common Questions

**Q: Do I need to run a blockchain node for development?**  
A: No! Enable `NEXT_PUBLIC_ENABLE_MOCK_MODE=true` for frontend-only development.

**Q: How do I reset everything?**  
A: Stop all services, delete `node_modules`, `.env`, and `artifacts/`, then start from Step 1.

**Q: Can I use this in production?**  
A: Only after proper security audit, testing, and following all production security guidelines.

**Q: How do I change the contract after deployment?**  
A: Deploy a new contract and update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env`.

---

## ✨ Quick Tips

1. **Use Mock Mode First** - Get familiar with the UI without blockchain complexity
2. **Keep Hardhat Node Running** - Restart it if you encounter strange errors
3. **Check Browser Console** - Most errors are logged there with details
4. **MetaMask Can Be Tricky** - Try "Reset Account" if transactions won't go through
5. **Save Test Accounts** - Keep track of which accounts are voters vs admins

---

**Happy Coding! 🎉**

For questions or issues, check the documentation or create a GitHub issue.

---

**Version**: 1.1.0  
**Last Updated**: October 20, 2025
