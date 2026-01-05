# Blockchain-Based E-Voting System - System Architecture Diagram

## Comprehensive Multi-Layer Architecture

```mermaid
graph TB
    subgraph "LAYER 1: CLIENT INTERFACE"
        A1[Web Browser<br/>Chrome/Firefox/Edge]
        A2[Mobile Devices<br/>iOS/Android]
        A3[MetaMask Wallet<br/>Web3 Provider]
        A1 -.->|HTTPS/TLS| A3
        A2 -.->|HTTPS/TLS| A3
    end

    subgraph "LAYER 2: PRESENTATION LAYER - React/Vite Frontend"
        B1[HomePage.tsx<br/>Landing & Info]
        B2[VoterRegistrationPage.tsx<br/>Voter Onboarding]
        B3[LoginPage.tsx<br/>OTP Authentication]
        B4[VotePage.tsx<br/>Multi-Category Voting]
        B5[AdminDashboard.tsx<br/>Election Management]
        B6[ResultsPage.tsx<br/>Real-time Results]
        B7[MyVotesPage.tsx<br/>Vote History]
        B8[SettingsPage.tsx<br/>System Settings]
        
        B9[State Management<br/>React Context API]
        B10[Routing<br/>Client-side Navigation]
        B11[UI Components<br/>Radix UI + Tailwind]
    end

    subgraph "LAYER 3: BLOCKCHAIN INTEGRATION LAYER"
        C1[blockchain.ts<br/>Contract Interface]
        C2[ethers.js v6.16.0<br/>Web3 Library]
        C3[VotingSystemABI<br/>Contract ABI]
        C4[MetaMask Connection<br/>Wallet Provider]
        
        C1 --> C2
        C2 --> C3
        C2 --> C4
    end

    subgraph "LAYER 4: APPLICATION LAYER - Node.js/Express Backend"
        D1[Express Server<br/>Port 3001]
        
        subgraph "API Routes"
            D2[/api/auth<br/>Authentication]
            D3[/api/voters<br/>Voter Management]
            D4[/api/elections<br/>Election CRUD]
            D5[/api/categories<br/>Category Management]
            D6[/api/candidates<br/>Candidate Management]
            D7[/api/votes<br/>Vote Recording]
            D8[/api/admin<br/>Admin Operations]
            D9[/api/statistics<br/>Analytics]
            D10[/api/reset<br/>System Reset]
        end
        
        subgraph "Middleware & Services"
            D11[JWT Authentication<br/>Token Verification]
            D12[OTP Service<br/>Generation & Validation]
            D13[Email Service<br/>Nodemailer]
            D14[Input Validation<br/>express-validator]
            D15[CORS Handler<br/>Cross-Origin Control]
        end
    end

    subgraph "LAYER 5: BLOCKCHAIN LAYER - Ethereum Network"
        E1[VotingSystem.sol<br/>Smart Contract v0.8.19]
        
        subgraph "Smart Contract Functions"
            E2[Election Management<br/>createElection, startElection, endElection]
            E3[Voter Registration<br/>registerVoter, checkEligibility]
            E4[Category Management<br/>createCategory, updateCategory]
            E5[Candidate Management<br/>addCandidate, deactivateCandidate]
            E6[Voting System<br/>castVote, batchVote, hasVoted]
            E7[Results Retrieval<br/>getCandidateVotes, getCategoryResults]
            E8[System Controls<br/>pause, unpause, resetSystem]
        end
        
        E9[Contract Storage<br/>Election State, Voter Mapping,<br/>Category & Candidate Data]
        E10[Event Emissions<br/>VoteCast, ElectionStarted,<br/>CandidateAdded]
    end

    subgraph "LAYER 6: DATA PERSISTENCE LAYER - PostgreSQL"
        F1[(PostgreSQL Database<br/>evoting)]
        
        subgraph "Database Tables"
            F2[voters<br/>student_id, email, wallet_address,<br/>has_voted, otp_hash, email_verified]
            F3[elections<br/>title, description, start_time,<br/>end_time, is_active]
            F4[categories<br/>election_id, category_name,<br/>description, max_votes]
            F5[candidates<br/>category_id, candidate_name,<br/>party, vote_count, manifesto]
            F6[vote_history<br/>voter_wallet, election_id,<br/>category_id, candidate_id, tx_hash]
            F7[admins<br/>user_id, email, password_hash,<br/>wallet_address, role, permissions]
            F8[audit_logs<br/>action, entity_type, details,<br/>ip_address, created_at]
            F9[system_settings<br/>key, value(JSONB), updated_at]
        end
        
        F10[Connection Pool<br/>pg library, Max 20 connections]
    end

    subgraph "LAYER 7: EXTERNAL SERVICES & INFRASTRUCTURE"
        G1[Ethereum Network<br/>Local: Hardhat Node<br/>Testnet: Sepolia/Hoodi]
        G2[Email Service<br/>SMTP Server<br/>Gmail/Ethereal]
        G3[RPC Provider<br/>Blockchain Node Access]
        G4[MetaMask Extension<br/>Browser Wallet]
    end

    subgraph "LAYER 8: SECURITY & MONITORING"
        H1[JWT Token Auth<br/>Access Control]
        H2[OTP Verification<br/>Email-based 2FA]
        H3[Rate Limiting<br/>API Protection]
        H4[Input Sanitization<br/>SQL Injection Prevention]
        H5[Blockchain Verification<br/>Double-voting Prevention]
        H6[Audit Logging<br/>Action Tracking]
        H7[HTTPS/TLS<br/>Encrypted Transport]
    end

    %% Client to Frontend Connections
    A1 -->|HTTP Requests| B1
    A2 -->|HTTP Requests| B1
    A3 -->|Web3 Calls| C1
    
    %% Frontend to Components
    B1 --> B2
    B1 --> B3
    B1 --> B4
    B1 --> B5
    B1 --> B6
    B1 --> B7
    B1 --> B8
    B2 --> B9
    B3 --> B9
    B4 --> B9
    B5 --> B9
    B9 --> B10
    B10 --> B11
    
    %% Frontend to Blockchain Layer
    B4 -->|Vote Transaction| C1
    B5 -->|Admin Operations| C1
    B2 -->|Wallet Binding| C4
    
    %% Frontend to Backend
    B2 -->|API Calls| D1
    B3 -->|API Calls| D1
    B4 -->|API Calls| D1
    B5 -->|API Calls| D1
    B6 -->|API Calls| D1
    B7 -->|API Calls| D1
    
    %% Backend Routing
    D1 --> D2
    D1 --> D3
    D1 --> D4
    D1 --> D5
    D1 --> D6
    D1 --> D7
    D1 --> D8
    D1 --> D9
    D1 --> D10
    
    %% Backend Middleware
    D1 --> D11
    D1 --> D12
    D1 --> D13
    D1 --> D14
    D1 --> D15
    
    %% Backend to Database
    D2 -->|SQL Queries| F1
    D3 -->|SQL Queries| F1
    D4 -->|SQL Queries| F1
    D5 -->|SQL Queries| F1
    D6 -->|SQL Queries| F1
    D7 -->|SQL Queries| F1
    D8 -->|SQL Queries| F1
    D9 -->|SQL Queries| F1
    
    %% Database Tables
    F1 --> F2
    F1 --> F3
    F1 --> F4
    F1 --> F4
    F1 --> F5
    F1 --> F6
    F1 --> F7
    F1 --> F8
    F1 --> F9
    F1 --> F10
    
    %% Blockchain Layer
    C1 -->|Contract Calls| E1
    E1 --> E2
    E1 --> E3
    E1 --> E4
    E1 --> E5
    E1 --> E6
    E1 --> E7
    E1 --> E8
    E1 --> E9
    E1 --> E10
    
    %% External Services
    E1 -->|Deploy & Execute| G1
    D13 -->|Send OTP| G2
    C1 -->|RPC Calls| G3
    C4 -->|Wallet Connect| G4
    
    %% Security Layer
    D11 --> H1
    D12 --> H2
    D1 --> H3
    D14 --> H4
    E6 --> H5
    D8 --> H6
    D1 --> H7
    
    %% Styling
    classDef clientLayer fill:#e1f5ff,stroke:#01579b,stroke-width:2px
    classDef presentationLayer fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef blockchainIntegration fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef applicationLayer fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    classDef blockchainLayer fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    classDef dataLayer fill:#e0f2f1,stroke:#004d40,stroke-width:2px
    classDef externalLayer fill:#fff8e1,stroke:#f57f17,stroke-width:2px
    classDef securityLayer fill:#ffebee,stroke:#b71c1c,stroke-width:2px
    
    class A1,A2,A3 clientLayer
    class B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11 presentationLayer
    class C1,C2,C3,C4 blockchainIntegration
    class D1,D2,D3,D4,D5,D6,D7,D8,D9,D10,D11,D12,D13,D14,D15 applicationLayer
    class E1,E2,E3,E4,E5,E6,E7,E8,E9,E10 blockchainLayer
    class F1,F2,F3,F4,F5,F6,F7,F8,F9,F10 dataLayer
    class G1,G2,G3,G4 externalLayer
    class H1,H2,H3,H4,H5,H6,H7 securityLayer
```

---

## Architecture Overview

### System Components

#### **LAYER 1: CLIENT INTERFACE**
- **Web Browsers**: Chrome, Firefox, Edge with HTTPS/TLS encryption
- **Mobile Devices**: iOS and Android responsive support
- **MetaMask Wallet**: Web3 provider for blockchain authentication

#### **LAYER 2: PRESENTATION LAYER** 
- **Framework**: React 19.1.0 + Vite 6.3.5
- **Routing**: Client-side navigation with state management
- **UI Library**: Radix UI components + Tailwind CSS 4.1.9
- **Key Pages**: 
  - Home, Registration, Login, Voting, Results, Admin Dashboard
  - Settings, Categories, My Votes, Vote Success

#### **LAYER 3: BLOCKCHAIN INTEGRATION**
- **Library**: ethers.js v6.16.0
- **Contract Interface**: VotingSystem ABI
- **Wallet Connection**: MetaMask provider integration
- **Functions**: Vote casting, registration, election management

#### **LAYER 4: APPLICATION LAYER**
- **Server**: Node.js + Express.js 4.18.2 (Port 3001)
- **Language**: TypeScript 5.3.3
- **API Routes**: 
  - `/api/auth` - OTP authentication
  - `/api/voters` - Voter management
  - `/api/elections` - Election CRUD operations
  - `/api/categories` - Category management
  - `/api/candidates` - Candidate management
  - `/api/votes` - Vote recording
  - `/api/admin` - Admin operations
  - `/api/statistics` - Analytics
- **Middleware**: JWT auth, CORS, validation, rate limiting

#### **LAYER 5: BLOCKCHAIN LAYER**
- **Smart Contract**: VotingSystem.sol (Solidity 0.8.19)
- **Network**: Hardhat (local), Sepolia/Hoodi (testnet)
- **Contract Address**: 0x2DCa51f1095B2BbF7a5A1A8f6c0E7c7B8AD0e613
- **Key Functions**:
  - Election: create, start, end, auto-end
  - Voter: register, check eligibility
  - Voting: castVote, batchVote, vote verification
  - Results: real-time vote counts
  - Security: pause/unpause, reset

#### **LAYER 6: DATA PERSISTENCE**
- **Database**: PostgreSQL
- **Connection**: pg library with pool (max 20 connections)
- **Tables**:
  - `voters` - Student registration, wallet binding, OTP verification
  - `elections` - Election metadata and timing
  - `categories` - Voting categories per election
  - `candidates` - Candidate details and vote counts
  - `vote_history` - Lifetime vote records with blockchain TX hash
  - `admins` - Admin accounts with role-based permissions
  - `audit_logs` - System action tracking
  - `system_settings` - Configuration (JSONB)

#### **LAYER 7: EXTERNAL SERVICES**
- **Ethereum Network**: Local Hardhat node / Sepolia testnet
- **Email Service**: Nodemailer with SMTP (Gmail/Ethereal)
- **RPC Provider**: Blockchain node access
- **MetaMask**: Browser-based wallet extension

#### **LAYER 8: SECURITY & MONITORING**
- **JWT Authentication**: Stateless token-based auth
- **OTP Verification**: Email-based 2FA (6-digit, 10-min TTL)
- **Rate Limiting**: API request throttling
- **Input Sanitization**: SQL injection prevention
- **Blockchain Verification**: On-chain double-vote prevention
- **Audit Logging**: Complete action history
- **HTTPS/TLS**: Encrypted transport layer

---

## Data Flow Patterns

### **Voter Registration Flow**
```
Browser → Registration Page → API /auth/register → Generate OTP → 
Email Service → User Email → Verify OTP → Bind MetaMask Wallet → 
Save to PostgreSQL (voters table) → Register on Blockchain
```

### **Voting Flow**
```
Browser → Vote Page → Select Candidates → MetaMask Signature → 
Smart Contract castVote() → Blockchain Verification (no double-vote) → 
Event Emission → Backend /api/votes/save → PostgreSQL vote_history → 
Email Confirmation → Update UI
```

### **Admin Election Management**
```
Admin Dashboard → Create Election → API /elections/create → 
PostgreSQL (elections table) → Blockchain createElection() → 
Add Categories & Candidates → Start Election → Notify Voters
```

### **Results Retrieval**
```
Results Page → Smart Contract getCategoryResults() → 
Real-time vote counts → Display with charts → 
Cross-verify with PostgreSQL vote_history
```

---

## Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend | React | 19.1.0 | UI framework |
| Frontend | Vite | 6.3.5 | Build tool & dev server |
| Frontend | TypeScript | 5.9.3 | Type safety |
| Frontend | Tailwind CSS | 4.1.9 | Styling |
| Frontend | ethers.js | 6.15.0 | Blockchain interaction |
| Backend | Node.js | - | Runtime |
| Backend | Express.js | 4.18.2 | Web framework |
| Backend | TypeScript | 5.3.3 | Type safety |
| Backend | pg | 8.11.3 | PostgreSQL client |
| Backend | Nodemailer | 7.0.11 | Email service |
| Backend | jsonwebtoken | 9.0.2 | JWT auth |
| Blockchain | Solidity | 0.8.19 | Smart contract |
| Blockchain | Hardhat | 3.1.0 | Development framework |
| Database | PostgreSQL | - | Relational database |

---

## Network Architecture

### **Development Environment**
- Frontend: `http://localhost:5173` or `http://192.168.x.x:5173`
- Backend: `http://localhost:3001` or `http://192.168.x.x:3001`
- Blockchain: `http://localhost:8545` (Hardhat node)
- Database: `localhost:5432` (PostgreSQL)

### **Production/Testnet**
- Frontend: Deployed via Vite build
- Backend: Node.js server on cloud
- Blockchain: Sepolia/Hoodi testnet
- Database: Cloud-hosted PostgreSQL

---

## Security Features

1. **Multi-Layer Authentication**
   - Email OTP (2FA)
   - JWT tokens
   - MetaMask wallet signatures

2. **Double-Vote Prevention**
   - On-chain mapping: `voters[address].votedInCategory[categoryId]`
   - Off-chain tracking: `voters.has_voted` in PostgreSQL
   - Transaction verification

3. **Data Integrity**
   - Blockchain immutability
   - PostgreSQL constraints
   - Input validation at all layers

4. **Audit Trail**
   - Complete vote history with TX hashes
   - Admin action logging
   - Timestamp verification

5. **Access Control**
   - Role-based permissions (voter/admin)
   - JWT token expiration
   - CORS policy enforcement

---

## Deployment Configuration

### **Smart Contract Deployment**
```bash
# Compile contract
npx hardhat compile

# Deploy to local network
npx hardhat run scripts/deploy.ts --network localhost

# Deploy to testnet
npx hardhat run scripts/deploy.ts --network sepolia
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
# Serve dist/ folder
```

### **Database Setup**
```bash
psql -U postgres -f server/schema.sql
```

---

## Performance Optimizations

- **Frontend**: Code splitting, lazy loading, React.memo
- **Backend**: Connection pooling (max 20), query optimization
- **Blockchain**: Batch voting, optimized gas usage
- **Database**: Indexed columns, JSONB for flexible data

---

## Future Enhancements

- [ ] Multi-signature admin operations
- [ ] Decentralized storage (IPFS) for candidate photos
- [ ] Mobile native applications
- [ ] Real-time WebSocket notifications
- [ ] Advanced analytics dashboard
- [ ] Biometric authentication integration

---

**Document Version**: 1.0  
**Last Updated**: January 2, 2026  
**Project**: Implementation of a Secure Blockchain-Based E-Voting System for Transparent Elections (FYP)
