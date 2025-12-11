# APU VOTE Smart Contract

## Overview
The VotingSystem.sol smart contract provides a secure, transparent, and tamper-proof voting system for Asia Pacific University elections using Ethereum blockchain technology.

## Features

### 1. Election Management
- **Create Election**: Admin can create new elections with title, start time, and end time
- **Start Election**: Activate the election for voting
- **End Election**: Close the election and finalize results
- **Election States**: Created → Active → Ended

### 2. Voting Categories
- **Add Categories**: Create voting categories (e.g., Student Union Government, Faculty Representatives)
- **Category Management**: Each category contains multiple positions
- **Remove Categories**: Mark categories as inactive while preserving history

### 3. Candidate Management
- **Add Candidates**: Register candidates for specific positions within categories
- **Candidate Information**: Store name, position, party affiliation, and vote count
- **Position-based Organization**: Candidates are organized by their running positions

### 4. Voter Registration
- **Student Verification**: Register voters with student ID, department, and year of study
- **Unique Registration**: Each wallet address can only register once
- **Voter Tracking**: Track registration status and voting participation

### 5. Voting System
- **Secure Voting**: One vote per position per voter
- **Anonymous Voting**: Votes are recorded but voter identity is protected
- **Real-time Tracking**: Vote counts updated immediately on blockchain
- **Double-voting Prevention**: Smart contract enforces one vote per position rule

### 6. Results and Transparency
- **Live Results**: View election statistics in real-time
- **Final Results**: Access complete results after election ends
- **Audit Trail**: All transactions recorded permanently on blockchain
- **Transparency**: Anyone can verify vote counts and election integrity

## Smart Contract Structure

### Main Components

#### Structs
- `Election`: Election details and status
- `Candidate`: Candidate information and vote count
- `Voter`: Voter registration and voting status
- `VotingCategory`: Category organization and positions

#### State Variables
- `admin`: Contract owner address
- `currentElection`: Active election details
- `voters`: Mapping of voter addresses to voter data
- `candidatesById`: Mapping of candidate IDs to candidate data
- `candidatesByPosition`: Mapping of positions to candidate arrays
- `categories`: Mapping of category IDs to category data

#### Key Functions

**Admin Functions:**
- `createElection(title, startTime, endTime)`
- `startElection()`
- `endElection()`
- `addCategory(id, name, description, positions)`
- `removeCategory(id)`
- `addCandidate(name, position, party, category)`

**Voter Functions:**
- `registerVoter(studentId, department, yearOfStudy)`
- `vote(candidateId)`

**View Functions:**
- `getCategories()` - Get all active categories
- `getCategoryDetails(id)` - Get category information
- `getCandidate(candidateId)` - Get candidate details
- `getCandidatesForPosition(position)` - Get all candidates for a position
- `getElectionResults(position)` - Get results for a position
- `getElectionStats()` - Get overall election statistics
- `hasVotedForPosition(voter, position)` - Check if voter has voted

## Security Features

1. **Access Control**: Only admin can create elections and add candidates
2. **Time-based Voting**: Elections can only be voted on during active period
3. **Registration Verification**: Voters must be registered before voting
4. **Double-voting Prevention**: Smart contract prevents voting twice for same position
5. **Immutable Records**: All votes permanently recorded on blockchain
6. **Transparency**: All election data publicly verifiable

## Events

The contract emits events for all major actions:
- `ElectionCreated(title, startTime, endTime)`
- `ElectionStarted(timestamp)`
- `ElectionEnded(timestamp)`
- `CategoryAdded(id, name)`
- `CategoryRemoved(id)`
- `VoterRegistered(voterAddress, studentId)`
- `CandidateAdded(candidateId, name, position)`
- `VoteCast(voter, candidateId, position)`

## Deployment

### Prerequisites
- Solidity ^0.8.19
- Hardhat or Truffle for deployment
- MetaMask or other Web3 wallet
- Test ETH for gas fees (on testnet)

### Deployment Steps

1. **Install Dependencies**
```bash
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers
```

2. **Compile Contract**
```bash
npx hardhat compile
```

3. **Deploy to Testnet (e.g., Sepolia)**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

4. **Verify Contract on Etherscan**
```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

### Recommended Networks
- **Development**: Hardhat local network
- **Testing**: Sepolia or Goerli testnet
- **Production**: Ethereum mainnet (with thorough testing)

## Frontend Integration

### Using ethers.js

```typescript
import { ethers } from 'ethers';
import VotingSystemABI from './contracts/VotingSystem.json';

// Connect to contract
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(CONTRACT_ADDRESS, VotingSystemABI.abi, signer);

// Register voter
await contract.registerVoter(studentId, department, yearOfStudy);

// Cast vote
await contract.vote(candidateId);

// Get results
const results = await contract.getElectionResults(position);
```

## Gas Optimization

The contract includes several gas optimization techniques:
- Efficient data structures (mappings over arrays where possible)
- Batch operations for multiple votes
- Minimal storage reads/writes
- Event emission for off-chain data indexing

## Testing

Comprehensive test suite should cover:
- Election lifecycle (create, start, end)
- Voter registration and voting
- Category and candidate management
- Access control and permissions
- Edge cases and error handling
- Gas usage optimization

## Security Auditing

Before mainnet deployment:
1. Internal code review
2. Automated security analysis (Slither, Mythril)
3. Professional security audit
4. Bug bounty program
5. Gradual rollout with monitoring

## Future Enhancements

Potential improvements:
- Multi-signature admin control
- Delegate voting functionality
- Ranked-choice voting support
- Anonymous voting with zero-knowledge proofs
- Cross-chain compatibility
- DAO governance integration

## License

MIT License - See LICENSE file for details

## Support

For questions or issues:
- Email: vote@apu.edu.my
- GitHub: [Project Repository]
- Documentation: [Full Documentation]

## Version History

- **v1.0.0** (Current)
  - Initial release
  - Basic voting functionality
  - Category management
  - Admin controls
  - Voter registration
  - Results tracking
