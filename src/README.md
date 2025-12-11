# 🗳️ APU VOTE - Blockchain-Based University Voting System

A comprehensive, secure, and transparent voting platform for Asia Pacific University elections built on Ethereum blockchain technology.

![APU VOTE Banner](https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&h=300&fit=crop)

---

## 🚀 READY TO DEPLOY?

**Everything is set up and ready to deploy to Ethereum Hoodi testnet!**

### Quick Start (5 minutes):
```bash
# 1. Check if ready
npm run precheck

# 2. Setup environment
cp .env.example .env
# Edit .env with your private key

# 3. Deploy to Hoodi testnet
npm run deploy:hoodi

# 4. Verify deployment
npm run verify:hoodi
```

**📚 Full Deployment Guides:**
- **Fast Track:** [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - 5-minute guide
- **Complete Guide:** [HOODI_DEPLOYMENT_GUIDE.md](./HOODI_DEPLOYMENT_GUIDE.md) - Detailed step-by-step
- **Checklist:** [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Interactive checklist
- **Overview:** [DEPLOYMENT_READY.md](./DEPLOYMENT_READY.md) - Everything you need to know

---

## 🌟 Overview

APU VOTE is a modern blockchain-based voting system that ensures transparency, security, and immutability for university elections. Built with cutting-edge Web3 technology, it provides students with a seamless voting experience while maintaining the integrity of the electoral process.

### Key Features

- ✅ **Blockchain Security** - Votes stored immutably on Ethereum Hoodi (Chain ID: 17000)
- 🔐 **MetaMask Integration** - Secure wallet-based authentication
- 👥 **Multiple User Roles** - Students, Admins, and Election Officers
- 📊 **Real-time Results** - Live vote counting and analytics
- 🎯 **Multi-Category Voting** - Support for different election types
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🔍 **Transparent & Auditable** - All votes verifiable on blockchain
- 🚀 **Easy to Deploy** - Comprehensive deployment scripts and guides

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Student    │  │    Admin     │  │   Results    │ │
│  │  Interface   │  │  Dashboard   │  │   Viewer     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │
                    ┌────▼────┐
                    │ Web3.js │
                    │ Ethers  │
                    └────┬────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│              Ethereum Blockchain Network                │
│  ┌──────────────────────────────────────────────────┐  │
│  │         VotingSystem Smart Contract              │  │
│  │  • Election Management                           │  │
│  │  • Voter Registration                            │  │
│  │  • Candidate Management                          │  │
│  │  • Secure Voting                                 │  │
│  │  • Results Calculation                           │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js v16+ 
- npm or yarn
- MetaMask browser extension
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/apu-vote.git
cd apu-vote

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Compile smart contracts
npm run compile

# Run tests
npm run test

# Start local blockchain
npm run node

# Deploy to local network (in another terminal)
npm run deploy:local

# Start frontend development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
apu-vote/
├── components/          # React components
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── VotePage.tsx
│   ├── AdminDashboard.tsx
│   └── ui/              # UI components (shadcn)
├── contracts/           # Solidity smart contracts
│   └── VotingSystem.sol
├── scripts/             # Deployment scripts
│   ├── deploy.js
│   └── setup-local.js
├── test/                # Smart contract tests
│   └── VotingSystem.test.js
├── lib/                 # Utility libraries
│   ├── blockchain.ts    # Web3 integration
│   ├── auth.ts          # Authentication
│   └── VotingSystemABI.ts
├── styles/              # Global styles
├── hardhat.config.js    # Hardhat configuration
├── package.json
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 15.5.4
- **UI Library:** React 19.1.0
- **Styling:** Tailwind CSS 4.1.9
- **Components:** shadcn/ui
- **Icons:** Lucide React
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod

### Blockchain
- **Smart Contracts:** Solidity 0.8.19
- **Development:** Hardhat 2.22.0
- **Web3 Library:** Ethers.js 6.15.0
- **Testing:** Mocha + Chai
- **Network:** Ethereum (Sepolia, Mainnet)

### Deployment
- **Frontend:** Vercel
- **Smart Contracts:** Ethereum Network
- **CI/CD:** GitHub Actions (optional)

## 📖 Usage Guide

### For Students

1. **Register Account**
   - Visit the registration page
   - Fill in student details
   - Verify email

2. **Verify Eligibility**
   - Enter student ID and matric number
   - System verifies with university database

3. **Connect Wallet**
   - Install MetaMask
   - Connect your Ethereum wallet
   - Register as voter on blockchain

4. **Cast Vote**
   - Browse candidates
   - Select your choices
   - Confirm transaction in MetaMask
   - Vote recorded on blockchain

5. **View Results**
   - Real-time results after voting
   - Transparent vote counts
   - Verify your vote on blockchain

### For Administrators

1. **Login to Admin Dashboard**
   - Use admin credentials
   - Access admin panel

2. **Create Election**
   - Set election title
   - Define start and end dates
   - Configure voting parameters

3. **Manage Categories**
   - Create voting categories
   - Define positions
   - Set category rules

4. **Add Candidates**
   - Upload candidate information
   - Assign to positions
   - Add party affiliation

5. **Monitor Election**
   - Track voter registration
   - Monitor vote counts
   - View analytics dashboard

6. **End Election**
   - Close voting period
   - Finalize results
   - Publish winners

## 🧪 Testing

### Run Smart Contract Tests

```bash
# Run all tests
npm run test

# Run with gas reporting
REPORT_GAS=true npm run test

# Run coverage analysis
npm run coverage
```

### Test Coverage

- ✅ Election Management
- ✅ Candidate Management
- ✅ Voter Registration
- ✅ Voting Process
- ✅ Results Calculation
- ✅ Access Control
- ✅ Security Features

## 🌐 Deployment

### Local Development

```bash
npm run node          # Start local blockchain
npm run deploy:local  # Deploy contracts
npm run dev          # Start frontend
```

### Testnet Deployment (Sepolia)

```bash
npm run deploy:testnet
```

### Mainnet Deployment

```bash
npm run deploy:mainnet
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 🔒 Security Features

- **Immutable Votes** - Votes cannot be altered once cast
- **Wallet Authentication** - Secure MetaMask-based login
- **Double-Vote Prevention** - Smart contract prevents voting twice
- **Admin Access Control** - Role-based permissions
- **Encrypted Storage** - Sensitive data encrypted
- **Audit Trail** - Complete transaction history
- **Verified Contracts** - Source code verified on Etherscan

## 📊 Smart Contract Functions

### Public Functions

```solidity
// Voter Functions
function registerVoter(string _studentId, string _department, uint _year)
function vote(uint _candidateId)
function hasVotedForPosition(address _voter, string _position) returns (bool)

// View Functions
function getCandidate(uint _candidateId) returns (Candidate)
function getCandidatesForPosition(string _position) returns (uint[])
function getElectionResults(string _position) returns (Results)
function getElectionStats() returns (Stats)
```

### Admin Functions

```solidity
function createElection(string _title, uint _startTime, uint _endTime)
function startElection()
function endElection()
function addCandidate(string _name, string _position, string _party)
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript/Solidity best practices
- Write tests for new features
- Update documentation
- Ensure all tests pass
- Follow existing code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**APU Development Team**
- Lead Developer: [Your Name]
- Smart Contract Developer: [Name]
- Frontend Developer: [Name]
- UI/UX Designer: [Name]

## 📞 Support

- **Email:** support@apuvote.edu.my
- **Website:** https://vote.apu.edu.my
- **Documentation:** https://docs.apuvote.edu.my
- **Issues:** https://github.com/your-org/apu-vote/issues

## 🙏 Acknowledgments

- Asia Pacific University for project support
- Ethereum Foundation for blockchain technology
- OpenZeppelin for smart contract libraries
- shadcn for UI components
- Vercel for hosting platform

## 📈 Roadmap

### Phase 1 (Current)
- ✅ Basic voting functionality
- ✅ Admin dashboard
- ✅ Wallet integration
- ✅ Results display

### Phase 2 (Q2 2025)
- [ ] Multi-signature admin controls
- [ ] Advanced analytics dashboard
- [ ] Mobile application
- [ ] Email notifications

### Phase 3 (Q3 2025)
- [ ] Cross-chain support
- [ ] DAO governance
- [ ] NFT voter badges
- [ ] Advanced fraud detection

### Phase 4 (Q4 2025)
- [ ] AI-powered insights
- [ ] Integration with other universities
- [ ] Voter engagement features
- [ ] Advanced reporting

## 📸 Screenshots

### Home Page
![Home Page](https://via.placeholder.com/800x400?text=APU+VOTE+Home+Page)

### Voting Interface
![Voting](https://via.placeholder.com/800x400?text=Voting+Interface)

### Admin Dashboard
![Admin Dashboard](https://via.placeholder.com/800x400?text=Admin+Dashboard)

### Results Page
![Results](https://via.placeholder.com/800x400?text=Election+Results)

## 🎯 Demo Credentials

**Student Account:**
- Student ID: TP12345
- Password: password123

**Admin Account:**
- Email: admin@apu.edu.my
- Password: admin123

**Test Wallet:**
- Use MetaMask on Sepolia testnet
- Get test ETH from faucets

## ⚠️ Disclaimer

This is an educational project for university elections. Always conduct thorough security audits before using in production environments with real elections.

---

**Built with ❤️ by the APU Development Team**

**Version:** 1.0.0  
**Last Updated:** October 16, 2025
