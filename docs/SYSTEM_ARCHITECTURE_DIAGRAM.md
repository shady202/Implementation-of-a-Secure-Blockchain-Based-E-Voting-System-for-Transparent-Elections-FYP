# System Architecture Diagram - Blockchain-Based E-Voting System

## Overview

This document presents the comprehensive system architecture of the **Secure Blockchain-Based E-Voting System** for transparent elections. The architecture follows a multi-layered approach ensuring security, scalability, and transparency.

---

## Complete System Architecture

```mermaid
graph TB
    subgraph "CLIENT LAYER"
        direction TB
        A1[Web Browser<br/>Chrome/Firefox/Edge/Safari<br/>HTTPS/TLS Encrypted]
        A2[Mobile Devices<br/>iOS/Android<br/>Responsive UI]
        A3[MetaMask Wallet Extension<br/>Web3 Provider<br/>Transaction Signing]
        
        A1 -.->|HTTPS| A3
        A2 -.->|HTTPS| A3
    end

    subgraph "PRESENTATION LAYER - Frontend Application"
        direction TB
        B1[React 19.1.0 + Vite 6.3.5<br/>TypeScript 5.9.3]
        
        subgraph "Core Pages"
            B2[HomePage<br/>Landing & Info]
            B3[VoterRegistrationPage<br/>Account Creation & Wallet Binding]
            B4[LoginPage<br/>OTP Authentication]
            B5[VotePage<br/>Multi-Category Voting]
            B6[AdminDashboard<br/>Election Management]
            B7[ResultsPage<br/>Real-time Results]
            B8[MyVotesPage<br/>Vote History & Verification]
            B9[SettingsPage<br/>User Settings]
        end
        
        subgraph "UI Framework"
            B10[Radix UI Components<br/>Accessible Components]
            B11[Tailwind CSS 4.1.9<br/>Styling Framework]
            B12[React Hook Form<br/>Form Management]
            B13[Recharts<br/>Data Visualization]
        end
        
        subgraph "State Management"
            B14[React Context API<br/>Global State]
            B15[Local Storage<br/>Session Persistence]
        end
        
        B1 --> B2
        B1 --> B3
        B1 --> B4
        B1 --> B5
        B1 --> B6
        B1 --> B7
        B1 --> B8
        B1 --> B9
        B2 --> B10
        B10 --> B11
        B11 --> B12
        B12 --> B13
        B1 --> B14
        B14 --> B15
    end

    subgraph "BLOCKCHAIN INTEGRATION LAYER"
        direction TB
        C1[blockchain.ts<br/>Contract Interface Layer]
        C2[ethers.js v6.16.0<br/>Web3 Library]
        C3[VotingSystemABI<br/>Contract ABI Definition]
        C4[Network Configuration<br/>Hoodi/Sepolia/Localhost]
        C5[MetaMask Provider<br/>Wallet Connection Handler]
        
        C1 --> C2
        C2 --> C3
        C2 --> C4
        C2 --> C5
    end

    subgraph "APPLICATION LAYER - Backend API Server"
        direction TB
        D1[Express.js 4.18.2 Server<br/>Node.js + TypeScript<br/>Port 3001]
        
        subgraph "API Routes"
            D2[/api/auth<br/>Authentication & OTP]
            D3[/api/voters<br/>Voter Management]
            D4[/api/elections<br/>Election CRUD]
            D5[/api/categories<br/>Category Management]
            D6[/api/candidates<br/>Candidate Management]
            D7[/api/votes<br/>Vote Recording]
            D8[/api/admin<br/>Admin Operations]
            D9[/api/statistics<br/>Analytics & Reports]
            D10[/api/reset<br/>System Reset]
        end
        
        subgraph "Middleware & Services"
            D11[JWT Authentication<br/>Token Verification]
            D12[OTP Service<br/>6-digit Generation<br/>10-min TTL]
            D13[Email Service<br/>Nodemailer 7.0.11<br/>SMTP Integration]
            D14[Input Validation<br/>express-validator]
            D15[CORS Handler<br/>Cross-Origin Control]
            D16[Cookie Parser<br/>Session Management]
            D17[Error Handler<br/>Centralized Error Handling]
        end
        
        D1 --> D2
        D1 --> D3
        D1 --> D4
        D1 --> D5
        D1 --> D6
        D1 --> D7
        D1 --> D8
        D1 --> D9
        D1 --> D10
        
        D1 --> D11
        D1 --> D12
        D1 --> D13
        D1 --> D14
        D1 --> D15
        D1 --> D16
        D1 --> D17
    end

    subgraph "BLOCKCHAIN LAYER - Ethereum Network"
        direction TB
        E1[VotingSystem.sol<br/>Smart Contract<br/>Solidity 0.8.19]
        
        subgraph "Contract Functions"
            E2[Election Management<br/>createElection<br/>startElection<br/>endElection<br/>autoEndElection]
            E3[Voter Registration<br/>registerVoter<br/>checkEligibility<br/>isRegistered]
            E4[Category Management<br/>createCategory<br/>updateCategory<br/>removeCategory]
            E5[Candidate Management<br/>addCandidate<br/>deactivateCandidate<br/>updateCandidate]
            E6[Voting System<br/>castVote<br/>batchVote<br/>hasVoted<br/>getMyVotes]
            E7[Results Retrieval<br/>getCandidateVotes<br/>getCategoryResults<br/>getElectionStats]
            E8[System Controls<br/>pause<br/>unpause<br/>resetSystem]
        end
        
        subgraph "Contract Storage"
            E9[Election State<br/>title, startTime, endTime<br/>state, totalVoters]
            E10[Voter Mapping<br/>address => Voter struct<br/>votedInCategory tracking]
            E11[Category & Candidate Data<br/>Categories by ID<br/>Candidates by Category]
            E12[Vote Receipts<br/>Voter => Category => Receipt<br/>TX Hash Storage]
        end
        
        subgraph "Events"
            E13[VoteCast<br/>ElectionStarted<br/>ElectionEnded<br/>CandidateAdded<br/>VoterRegistered]
        end
        
        E1 --> E2
        E1 --> E3
        E1 --> E4
        E1 --> E5
        E1 --> E6
        E1 --> E7
        E1 --> E8
        E1 --> E9
        E1 --> E10
        E1 --> E11
        E1 --> E12
        E1 --> E13
    end

    subgraph "DATA PERSISTENCE LAYER - PostgreSQL Database"
        direction TB
        F1[(PostgreSQL Database<br/>evoting<br/>Connection Pool: Max 20)]
        
        subgraph "Core Tables"
            F2[(voters<br/>id, student_id, email<br/>wallet_address, department<br/>year_of_study, has_voted<br/>email_verified, otp_hash<br/>otp_expires_at)]
            F3[(elections<br/>id, title, description<br/>start_time, end_time<br/>is_active, max_voters<br/>current_voters)]
            F4[(categories<br/>id, election_id<br/>category_name, description<br/>max_votes, is_active)]
            F5[(candidates<br/>id, category_id, election_id<br/>candidate_name, party<br/>manifesto, vote_count<br/>is_approved)]
            F6[(vote_history<br/>id, voter_wallet_address<br/>election_id, category_id<br/>candidate_id, blockchain_tx_hash<br/>voted_at)]
        end
        
        subgraph "System Tables"
            F7[(admins<br/>id, user_id, email<br/>password_hash, wallet_address<br/>role, permissions, is_active)]
            F8[(audit_logs<br/>id, user_id, action<br/>entity_type, details JSONB<br/>ip_address, created_at)]
            F9[(system_settings<br/>key, value JSONB<br/>description, updated_at)]
        end
        
        F1 --> F2
        F1 --> F3
        F1 --> F4
        F1 --> F5
        F1 --> F6
        F1 --> F7
        F1 --> F8
        F1 --> F9
    end

    subgraph "EXTERNAL SERVICES & INFRASTRUCTURE"
        direction TB
        G1[Ethereum Network<br/>Hoodi Testnet<br/>Chain ID: 17000<br/>RPC: https://rpc.holesky.ethpandaops.io]
        G2[Email Service<br/>SMTP Server<br/>Gmail/Nodemailer<br/>OTP Delivery]
        G3[RPC Provider<br/>Blockchain Node Access<br/>JSON-RPC Protocol]
        G4[MetaMask Extension<br/>Browser Wallet<br/>Transaction Signing]
    end

    subgraph "SECURITY & MONITORING LAYER"
        direction TB
        H1[JWT Token Authentication<br/>Stateless Access Control<br/>Token Expiration]
        H2[OTP Verification<br/>Email-based 2FA<br/>6-digit, 10-min TTL]
        H3[Rate Limiting<br/>API Request Throttling<br/>DoS Protection]
        H4[Input Sanitization<br/>SQL Injection Prevention<br/>XSS Protection]
        H5[Blockchain Verification<br/>Double-vote Prevention<br/>On-chain Validation]
        H6[Audit Logging<br/>Complete Action History<br/>Timestamp Tracking]
        H7[HTTPS/TLS<br/>Encrypted Transport<br/>Certificate Validation]
        H8[Wallet Signature<br/>MetaMask Transaction Signing<br/>Non-repudiation]
    end

    %% Client to Frontend Connections
    A1 -->|HTTP/HTTPS Requests| B1
    A2 -->|HTTP/HTTPS Requests| B1
    A3 -->|Web3 Provider API| C1
    
    %% Frontend Component Flow
    B3 -->|Wallet Connection| C1
    B4 -->|API Calls| D1
    B5 -->|Vote Transaction| C1
    B5 -->|Vote Recording| D1
    B6 -->|Admin Operations| C1
    B6 -->|Admin Operations| D1
    B7 -->|Results Query| C1
    B7 -->|Results Query| D1
    B8 -->|Vote History| C1
    B8 -->|Vote History| D1
    
    %% Blockchain Integration Flow
    C1 -->|Contract Calls| E1
    C5 -->|Wallet Connect| G4
    
    %% Backend API Flow
    D2 -->|SQL Queries| F1
    D3 -->|SQL Queries| F1
    D4 -->|SQL Queries| F1
    D5 -->|SQL Queries| F1
    D6 -->|SQL Queries| F1
    D7 -->|SQL Queries| F1
    D8 -->|SQL Queries| F1
    D9 -->|SQL Queries| F1
    
    %% Database Relationships
    F3 -->|Foreign Key| F4
    F4 -->|Foreign Key| F5
    F3 -->|Foreign Key| F6
    F2 -->|Reference| F6
    
    %% Blockchain Network
    E1 -->|Deploy & Execute| G1
    C1 -->|RPC Calls| G3
    G3 -->|Network Access| G1
    
    %% Email Service
    D13 -->|SMTP Protocol| G2
    G2 -->|Email Delivery| A1
    
    %% Security Integration
    D11 --> H1
    D12 --> H2
    D1 --> H3
    D14 --> H4
    E6 --> H5
    D8 --> H6
    D1 --> H7
    C5 --> H8
    
    %% Styling
    classDef clientLayer fill:#e1f5ff,stroke:#01579b,stroke-width:3px,color:#000
    classDef presentationLayer fill:#f3e5f5,stroke:#4a148c,stroke-width:3px,color:#000
    classDef blockchainIntegration fill:#fff3e0,stroke:#e65100,stroke-width:3px,color:#000
    classDef applicationLayer fill:#e8f5e9,stroke:#1b5e20,stroke-width:3px,color:#000
    classDef blockchainLayer fill:#fce4ec,stroke:#880e4f,stroke-width:3px,color:#000
    classDef dataLayer fill:#e0f2f1,stroke:#004d40,stroke-width:3px,color:#000
    classDef externalLayer fill:#fff8e1,stroke:#f57f17,stroke-width:3px,color:#000
    classDef securityLayer fill:#ffebee,stroke:#b71c1c,stroke-width:3px,color:#000
    
    class A1,A2,A3 clientLayer
    class B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11,B12,B13,B14,B15 presentationLayer
    class C1,C2,C3,C4,C5 blockchainIntegration
    class D1,D2,D3,D4,D5,D6,D7,D8,D9,D10,D11,D12,D13,D14,D15,D16,D17 applicationLayer
    class E1,E2,E3,E4,E5,E6,E7,E8,E9,E10,E11,E12,E13 blockchainLayer
    class F1,F2,F3,F4,F5,F6,F7,F8,F9 dataLayer
    class G1,G2,G3,G4 externalLayer
    class H1,H2,H3,H4,H5,H6,H7,H8 securityLayer
```

---

## Architecture Layers Explained

### **LAYER 1: CLIENT LAYER**

**Purpose**: User access points and interaction interfaces

**Components**:
- **Web Browsers**: Chrome, Firefox, Edge, Safari with HTTPS/TLS encryption
- **Mobile Devices**: iOS and Android with responsive UI support
- **MetaMask Wallet**: Browser extension providing Web3 provider functionality

**Key Features**:
- Cross-platform compatibility
- Secure HTTPS communication
- Wallet-based authentication

---

### **LAYER 2: PRESENTATION LAYER (Frontend)**

**Technology Stack**:
- **Framework**: React 19.1.0 with Vite 6.3.5
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI (accessible components)
- **Forms**: React Hook Form with validation
- **Charts**: Recharts for data visualization

**Core Pages**:
1. **HomePage**: Landing page with election information
2. **VoterRegistrationPage**: Account creation, OTP verification, wallet binding
3. **LoginPage**: OTP-based authentication
4. **VotePage**: Multi-category voting interface
5. **AdminDashboard**: Election management and monitoring
6. **ResultsPage**: Real-time results visualization
7. **MyVotesPage**: Vote history and verification
8. **SettingsPage**: User settings and preferences

**State Management**:
- React Context API for global state
- Local Storage for session persistence
- Real-time state synchronization

---

### **LAYER 3: BLOCKCHAIN INTEGRATION LAYER**

**Components**:
- **blockchain.ts**: Contract interface layer providing high-level functions
- **ethers.js v6.16.0**: Web3 library for Ethereum interaction
- **VotingSystemABI**: Contract Application Binary Interface
- **Network Configuration**: Support for Hoodi, Sepolia, and localhost networks
- **MetaMask Provider**: Wallet connection and transaction signing handler

**Key Functions**:
- `connectWallet()`: Connect to MetaMask and switch networks
- `registerVoterBlockchain()`: Register voter on blockchain
- `castVote()`: Cast single vote transaction
- `batchVote()`: Cast multiple votes in one transaction
- `getMyVotes()`: Retrieve voter's vote receipts
- `getElectionResults()`: Fetch real-time results

---

### **LAYER 4: APPLICATION LAYER (Backend API)**

**Technology Stack**:
- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Language**: TypeScript 5.3.3
- **Port**: 3001

**API Routes**:

| Route | Purpose |
|-------|---------|
| `/api/auth` | Authentication, OTP generation/verification, login |
| `/api/voters` | Voter registration, profile management |
| `/api/elections` | Election CRUD operations |
| `/api/categories` | Category management |
| `/api/candidates` | Candidate management |
| `/api/votes` | Vote recording and history |
| `/api/admin` | Admin operations and monitoring |
| `/api/statistics` | Analytics and reports |
| `/api/reset` | System reset (development) |

**Middleware & Services**:
- **JWT Authentication**: Token-based stateless authentication
- **OTP Service**: 6-digit OTP generation with 10-minute TTL
- **Email Service**: Nodemailer for SMTP email delivery
- **Input Validation**: express-validator for request validation
- **CORS Handler**: Cross-origin resource sharing control
- **Cookie Parser**: Session cookie management
- **Error Handler**: Centralized error handling

---

### **LAYER 5: BLOCKCHAIN LAYER**

**Smart Contract**: `VotingSystem.sol` (Solidity 0.8.19)

**Contract Address**: `0x2DCa51f1095B2BbF7a5A1A8f6c0E7c7B8AD0e613` (Hoodi Testnet)

**Key Functions**:

**Election Management**:
- `createElection(title, startTime, endTime)`: Create new election
- `startElection()`: Activate election for voting
- `endElection()`: Close election and finalize
- `autoEndElection()`: Automatic election closure

**Voter Management**:
- `registerVoter(studentId, department, yearOfStudy)`: Register voter
- `checkEligibility(address)`: Verify voter eligibility
- `isRegistered(address)`: Check registration status

**Voting System**:
- `castVote(categoryId, candidateId)`: Cast single vote
- `batchVote(VoteChoice[])`: Cast multiple votes
- `hasVoted(voter, categoryId)`: Check voting status
- `getMyVotes(voter)`: Get voter's vote receipts

**Results & Queries**:
- `getCandidateVotes(candidateId)`: Get candidate vote count
- `getCategoryResults(categoryId)`: Get category results
- `getElectionStats()`: Get overall election statistics

**Contract Storage**:
- Election state and metadata
- Voter mapping with voting status
- Category and candidate data structures
- Vote receipts with transaction hashes

**Events**:
- `VoteCast`: Emitted when vote is cast
- `ElectionStarted`: Emitted when election starts
- `ElectionEnded`: Emitted when election ends
- `VoterRegistered`: Emitted when voter registers

---

### **LAYER 6: DATA PERSISTENCE LAYER**

**Database**: PostgreSQL

**Connection**: pg library with connection pooling (max 20 connections)

**Core Tables**:

1. **voters**
   - Stores voter registration data
   - Email, student ID, wallet address
   - OTP verification status
   - Voting status tracking

2. **elections**
   - Election metadata
   - Start/end times
   - Active status
   - Voter capacity limits

3. **categories**
   - Voting categories per election
   - Category descriptions
   - Maximum votes per category

4. **candidates**
   - Candidate information
   - Party affiliation
   - Manifesto and photos
   - Vote counts

5. **vote_history**
   - Lifetime vote records
   - Blockchain transaction hashes
   - Timestamp tracking
   - Audit trail

**System Tables**:

6. **admins**
   - Admin accounts
   - Role-based permissions
   - Wallet addresses

7. **audit_logs**
   - System action tracking
   - JSONB details field
   - IP address logging

8. **system_settings**
   - Configuration storage (JSONB)
   - System-wide settings

---

### **LAYER 7: EXTERNAL SERVICES**

**Ethereum Network**:
- **Network**: Hoodi Testnet (Chain ID: 17000)
- **RPC URL**: https://rpc.holesky.ethpandaops.io
- **Block Explorer**: https://holesky.etherscan.io
- **Alternative**: Sepolia Testnet (Chain ID: 11155111)

**Email Service**:
- **Provider**: Nodemailer 7.0.11
- **Protocol**: SMTP
- **Purpose**: OTP delivery for email verification

**RPC Provider**:
- Blockchain node access
- JSON-RPC protocol
- Transaction broadcasting

**MetaMask Extension**:
- Browser-based wallet
- Transaction signing
- Network switching

---

### **LAYER 8: SECURITY & MONITORING**

**Security Mechanisms**:

1. **JWT Token Authentication**
   - Stateless access control
   - Token expiration
   - Secure token storage

2. **OTP Verification**
   - Email-based 2FA
   - 6-digit codes
   - 10-minute TTL
   - Rate limiting on attempts

3. **Rate Limiting**
   - API request throttling
   - DoS protection
   - Per-IP limits

4. **Input Sanitization**
   - SQL injection prevention
   - XSS protection
   - Input validation

5. **Blockchain Verification**
   - On-chain double-vote prevention
   - Immutable vote records
   - Transaction verification

6. **Audit Logging**
   - Complete action history
   - Timestamp tracking
   - IP address logging

7. **HTTPS/TLS**
   - Encrypted transport
   - Certificate validation
   - Secure communication

8. **Wallet Signature**
   - MetaMask transaction signing
   - Non-repudiation
   - Cryptographic proof

---

## Data Flow Patterns

### **1. Voter Registration Flow**

```
User → Registration Page → Enter Details → 
Backend API (/api/auth/create-account) → 
Generate OTP → Email Service → User Email → 
User Verifies OTP → Backend API (/api/auth/verify-email) → 
Connect MetaMask → Register on Blockchain (registerVoter) → 
Save to PostgreSQL (voters table) → Registration Complete
```

### **2. Voting Flow**

```
User → Vote Page → Select Candidates → 
MetaMask Signature → Smart Contract (castVote/batchVote) → 
Blockchain Verification (double-vote check) → 
Event Emission (VoteCast) → 
Backend API (/api/votes/record) → 
PostgreSQL (vote_history table) → 
Update UI → Show Success
```

### **3. Admin Election Management Flow**

```
Admin → Admin Dashboard → Create Election → 
Backend API (/api/elections/create) → 
PostgreSQL (elections table) → 
Smart Contract (createElection) → 
Add Categories → Add Candidates → 
Start Election → Notify Voters
```

### **4. Results Retrieval Flow**

```
User → Results Page → 
Smart Contract (getCategoryResults) → 
Real-time Vote Counts → 
Backend API (/api/statistics) → 
PostgreSQL Aggregation → 
Display with Charts → 
Cross-verify with Blockchain
```

---

## Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | React | 19.1.0 | UI framework |
| **Frontend** | Vite | 6.3.5 | Build tool & dev server |
| **Frontend** | TypeScript | 5.9.3 | Type safety |
| **Frontend** | Tailwind CSS | 4.1.9 | Styling framework |
| **Frontend** | ethers.js | 6.15.0 | Blockchain interaction |
| **Backend** | Node.js | Latest | Runtime environment |
| **Backend** | Express.js | 4.18.2 | Web framework |
| **Backend** | TypeScript | 5.3.3 | Type safety |
| **Backend** | pg | 8.11.3 | PostgreSQL client |
| **Backend** | Nodemailer | 7.0.11 | Email service |
| **Backend** | jsonwebtoken | 9.0.2 | JWT authentication |
| **Blockchain** | Solidity | 0.8.19 | Smart contract language |
| **Blockchain** | Hardhat | 3.1.0 | Development framework |
| **Database** | PostgreSQL | Latest | Relational database |

---

## Network Architecture

### **Development Environment**
- **Frontend**: `http://localhost:5173` or `http://192.168.x.x:5173`
- **Backend**: `http://localhost:3001` or `http://192.168.x.x:3001`
- **Blockchain**: `http://localhost:8545` (Hardhat node) or Hoodi Testnet
- **Database**: `localhost:5432` (PostgreSQL)

### **Production/Testnet**
- **Frontend**: Deployed via Vite build (static hosting)
- **Backend**: Node.js server on cloud platform
- **Blockchain**: Hoodi Testnet (Chain ID: 17000)
- **Database**: Cloud-hosted PostgreSQL

---

## Security Features

### **Multi-Layer Authentication**
1. Email OTP (2FA) - 6-digit code via email
2. JWT tokens - Stateless session management
3. MetaMask wallet signatures - Cryptographic proof

### **Double-Vote Prevention**
1. **On-chain**: `voters[address].votedInCategory[categoryId]` mapping
2. **Off-chain**: `voters.has_voted` flag in PostgreSQL
3. **Transaction verification**: Blockchain TX hash validation

### **Data Integrity**
1. Blockchain immutability - Votes cannot be altered
2. PostgreSQL constraints - Database-level validation
3. Input validation - All layers validate input

### **Audit Trail**
1. Complete vote history with TX hashes
2. Admin action logging
3. Timestamp verification
4. IP address tracking

### **Access Control**
1. Role-based permissions (voter/admin)
2. JWT token expiration
3. CORS policy enforcement
4. Rate limiting per endpoint

---

## Performance Optimizations

- **Frontend**: Code splitting, lazy loading, React.memo optimization
- **Backend**: Connection pooling (max 20), query optimization, indexing
- **Blockchain**: Batch voting, optimized gas usage, event filtering
- **Database**: Indexed columns, JSONB for flexible data, query optimization

---

## Deployment Configuration

### **Smart Contract Deployment**
```bash
# Compile contract
npx hardhat compile

# Deploy to local network
npx hardhat run scripts/deploy.ts --network localhost

# Deploy to Hoodi testnet
npx hardhat run scripts/deploy.ts --network hoodi
```

### **Backend Deployment**
```bash
cd server
npm install
npm run build
npm start
```

### **Frontend Deployment**
```bash
npm install
npm run build
# Serve dist/ folder via static hosting
```

### **Database Setup**
```bash
psql -U postgres -f server/schema.sql
```

---

## Future Enhancements

- [ ] Multi-signature admin operations
- [ ] Decentralized storage (IPFS) for candidate photos
- [ ] Mobile native applications
- [ ] Real-time WebSocket notifications
- [ ] Advanced analytics dashboard
- [ ] Biometric authentication integration
- [ ] Cross-chain voting support
- [ ] Zero-knowledge proof integration for privacy

---

**Document Version**: 2.0  
**Last Updated**: January 2, 2026  
**Project**: Implementation of a Secure Blockchain-Based E-Voting System for Transparent Elections (FYP)  
**Status**: ✅ Complete

