# System Architecture Diagram - Detailed Explanation

## Document Information

- **Diagram File**: [system-architecture.drawio](file:///c:/Users/shady/Desktop/Implementation-of-a-Secure-Blockchain-Based-E-Voting-System-for-Transparent-Elections-FYP/docs/system-architecture.drawio)
- **Status**: ✅ Complete
- **Last Updated**: 2026-01-01
- **Purpose**: Comprehensive explanation of the blockchain-based e-voting system architecture

---

## Overview

The System Architecture Diagram presents a comprehensive, multi-layered view of the blockchain-based e-voting system, illustrating the interaction between all major components, data flows, and security mechanisms. This architecture follows industry best practices for distributed systems, ensuring **scalability**, **security**, and **transparency**.

---

## Architectural Layers

The system is organized into **6 distinct layers**, each with specific responsibilities:

### LAYER 1: CLIENT INTERFACE

**Purpose**: User access and interaction points

**Components**:

#### 1. Web Browser (Chrome, Firefox, Edge)

- Primary access point for desktop users
- HTTPS/TLS encrypted communication
- Responsive design support
- Cross-browser compatibility

#### 2. MetaMask Wallet

- Web3 provider for blockchain authentication
- Wallet address management
- Transaction signing and approval
- Network switching capabilities

#### 3. Mobile Devices (iOS/Android)

- Responsive mobile interface
- Touch-optimized UI components
- Network-accessible via IP configuration
- Native browser integration

#### 4. User Types

- **Voters**: Cast votes, view results, manage registration
- **Administrators**: Manage elections, monitor system, configure settings
- **System Monitors**: Audit and oversight capabilities

**Security**: Client-side validation, HTTPS encryption, wallet-based authentication

---

### LAYER 2: PRESENTATION LAYER (Frontend)

**Purpose**: User interface rendering and client-side application logic

**Technology Stack**: Next.js 13+, React 18, TypeScript, Web3.js

**Components**:

#### 1. Next.js Framework

- **Server-Side Rendering (SSR)**: Improved performance and SEO
- **Static Site Generation (SSG)**: Pre-rendered public pages
- **API Routes**: Backend integration endpoints
- **Built-in Optimization**: Image, font, and code splitting

#### 2. React Components

- **HomePage**: Landing page with election information and announcements
- **VotePage**: Voting interface with candidate selection and confirmation
- **AdminDashboard**: Election management, monitoring, and analytics
- **ResultsPage**: Real-time results visualization and analytics
- **RegistrationPage**: Voter onboarding and wallet binding workflow

#### 3. Web3.js Integration

- Smart contract interaction layer
- Transaction management and gas estimation
- Event listening for blockchain updates
- Network switching and configuration
- MetaMask connection handling

#### 4. State Management

- React Context API for global state
- Custom hooks for reusable logic
- Local storage for session persistence
- Real-time state synchronization

#### 5. App Router

- Dynamic routing with Next.js 13+ App Router
- Protected routes with authentication middleware
- Nested layouts for consistent UI
- Loading and error states

**Data Flow**: User interactions → React components → API calls/Smart contract calls

---

### LAYER 3: APPLICATION LAYER (Backend Services)

**Purpose**: Business logic, authentication, and API services

**Technology Stack**: Node.js, Express.js, JWT, Nodemailer

**Components**:

#### 1. Node.js/Express Server

- RESTful API gateway
- Request/response handling
- Middleware pipeline (CORS, body-parser, compression)
- Error handling and logging
- Rate limiting for API protection

#### 2. API Endpoints

**Authentication Endpoints** (`/api/auth`):

- `POST /api/auth/login`: User authentication with OTP
- `POST /api/auth/logout`: Session termination
- `POST /api/auth/refresh`: Token refresh
- `GET /api/auth/verify`: Token validation

**Voter Endpoints** (`/api/voters`):

- `POST /api/voters/register`: New voter registration
- `GET /api/voters/:id`: Retrieve voter details
- `PUT /api/voters/:id`: Update voter information
- `DELETE /api/voters/:id`: Remove voter (admin only)
- `POST /api/voters/bind-wallet`: Wallet address binding

**Election Endpoints** (`/api/elections`):

- `POST /api/elections`: Create new election (admin)
- `GET /api/elections`: List all elections
- `GET /api/elections/:id`: Get election details
- `PUT /api/elections/:id`: Update election (admin)
- `POST /api/elections/:id/start`: Start election (admin)
- `POST /api/elections/:id/end`: End election (admin)

**Vote Endpoints** (`/api/votes`):

- `POST /api/votes`: Record vote (dual-write to blockchain + DB)
- `GET /api/votes/history`: Voter's voting history
- `GET /api/votes/verify/:txHash`: Verify blockchain transaction

**Results Endpoints** (`/api/results`):

- `GET /api/results/:electionId`: Get election results
- `GET /api/results/:electionId/analytics`: Detailed analytics

#### 3. Authentication Middleware

- JWT token generation (HS256 algorithm)
- Token validation on protected routes
- Session management with expiration
- Role-based access control (RBAC)
- Refresh token rotation

#### 4. OTP Service

- 6-digit OTP generation using crypto.randomInt()
- Time-based expiration (5-10 minutes)
- Rate limiting (max 3 attempts per 15 minutes)
- Secure storage with hashing
- Automatic cleanup of expired OTPs

#### 5. Email Service

- SMTP integration (Ethereal for testing, Gmail for production)
- HTML email templates with branding
- OTP delivery with retry logic
- Delivery status tracking
- Queue management for bulk emails

#### 6. Session Manager

- Concurrent user tracking in database
- Capacity limit enforcement (configurable)
- Active session monitoring
- Automatic session cleanup on timeout
- Real-time capacity reporting

#### 7. Data Validation

- Input sanitization (XSS prevention)
- Schema validation with Joi/Zod
- SQL injection prevention (parameterized queries)
- File upload validation
- Request size limiting

**Security**: JWT authentication, input validation, rate limiting, CORS configuration, helmet.js for HTTP headers

---

### LAYER 4: BLOCKCHAIN LAYER (Distributed Ledger)

**Purpose**: Immutable vote storage and transparent record-keeping

**Technology Stack**: Ethereum, Solidity 0.8.x, Hoodi Network

**Components**:

#### 1. Ethereum Hoodi Network

- Private test network for development
- EVM-compatible blockchain
- Custom network configuration (chainId, RPC URL)
- Gas-free transactions (test environment)
- Block time: ~15 seconds

#### 2. Voting Smart Contract (Solidity)

```solidity
contract Voting {
    struct Candidate {
        uint id;
        string name;
        string party;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public hasVoted;
    uint public candidatesCount;

    event VoteCast(address indexed voter, uint indexed candidateId);
    event CandidateAdded(uint indexed candidateId, string name);
}
```

**Key Features**:

- Deployed on Hoodi Network
- Immutable vote storage
- Event emission for transparency
- Access control modifiers (onlyOwner)
- Gas-optimized functions

#### 3. Candidate Management Functions

**addCandidate(name, party)**:

- Adds new candidate to election
- Increments candidate count
- Emits CandidateAdded event
- Access: Admin only

**getCandidates()**:

- Returns array of all candidates
- Includes vote counts
- Public view function

**getCandidateCount()**:

- Returns total number of candidates
- Used for iteration

#### 4. Voting Functions

**castVote(candidateId)**:

- Records vote on blockchain
- Checks if voter has already voted
- Validates candidate ID
- Increments candidate vote count
- Marks voter as having voted
- Emits VoteCast event
- Gas cost: ~50,000 gas

**getVoteCount(candidateId)**:

- Returns votes for specific candidate
- Public view function (no gas cost)

**hasVoted(voterAddress)**:

- Checks if address has voted
- Returns boolean
- Used for vote eligibility check

**getTotalVotes()**:

- Sums all votes across candidates
- Used for turnout calculation

**Security Features**:

- 🔒 **Immutable Records**: Once written, votes cannot be altered or deleted
- 🔒 **Transparent Audit Trail**: All transactions publicly verifiable on blockchain
- 🔒 **Tamper-Proof Storage**: Cryptographic hashing ensures data integrity
- 🔒 **Decentralized Consensus**: Network validation prevents single point of failure
- 🔒 **One Vote Per Address**: Smart contract enforces voting rules
- 🔒 **Event Logging**: All actions emit events for monitoring

**Data Flow**: Web3.js → MetaMask (sign transaction) → Smart Contract → Blockchain State → Event Emission

---

### LAYER 5: DATA PERSISTENCE LAYER

**Purpose**: Relational data storage for voter records and metadata

**Technology Stack**: PostgreSQL 14+, SQL

**Components**:

#### 1. PostgreSQL Database

- ACID-compliant relational DBMS
- Connection pooling (pg-pool) for performance
- Automated backup and recovery
- Indexing for query optimization
- Foreign key constraints for data integrity

#### 2. Database Tables

**voters Table**:

```sql
CREATE TABLE voters (
    student_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    wallet_address VARCHAR(42) UNIQUE,
    faculty VARCHAR(100),
    department VARCHAR(100),
    registration_status BOOLEAN DEFAULT FALSE,
    has_voted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wallet_address ON voters(wallet_address);
CREATE INDEX idx_email ON voters(email);
```

**elections Table**:

```sql
CREATE TABLE elections (
    election_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    contract_address VARCHAR(42),
    created_by VARCHAR(50) REFERENCES voters(student_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_status ON elections(status);
CREATE INDEX idx_dates ON elections(start_date, end_date);
```

**vote_history Table**:

```sql
CREATE TABLE vote_history (
    vote_id SERIAL PRIMARY KEY,
    election_id INT REFERENCES elections(election_id),
    voter_id VARCHAR(50) REFERENCES voters(student_id),
    wallet_address VARCHAR(42) NOT NULL,
    candidate_id INT NOT NULL,
    transaction_hash VARCHAR(66) UNIQUE,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_election_voter ON vote_history(election_id, voter_id);
CREATE INDEX idx_tx_hash ON vote_history(transaction_hash);
```

**otp_records Table**:

```sql
CREATE TABLE otp_records (
    otp_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    attempts INT DEFAULT 0
);

CREATE INDEX idx_email_expiry ON otp_records(email, expires_at);
```

**active_sessions Table**:

```sql
CREATE TABLE active_sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES voters(student_id),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_user_id ON active_sessions(user_id);
CREATE INDEX idx_expiry ON active_sessions(expires_at);
```

**system_settings Table**:

```sql
CREATE TABLE system_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example settings:
-- max_concurrent_users, smtp_config, network_config
```

**Data Integrity**:

- Primary keys for unique identification
- Foreign key constraints for referential integrity
- Unique constraints on email and wallet addresses
- NOT NULL constraints for required fields
- Check constraints for data validation
- Triggers for automatic timestamp updates

---

### LAYER 6: EXTERNAL SERVICES

**Purpose**: Third-party integrations for email and blockchain access

**Components**:

#### 1. SMTP Email Server

**Configuration**:

```javascript
{
  host: process.env.SMTP_HOST,      // e.g., smtp.ethereal.email
  port: process.env.SMTP_PORT,      // 587 for TLS
  secure: false,                     // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
}
```

**Features**:

- TLS encryption for secure transmission
- HTML email templates
- Attachment support
- Delivery status notifications
- Retry logic for failed sends

**OTP Email Template**:

```html
<h2>E-Voting System - OTP Verification</h2>
<p>Your One-Time Password is: <strong>{OTP}</strong></p>
<p>This OTP will expire in 10 minutes.</p>
<p>If you did not request this, please ignore this email.</p>
```

#### 2. RPC Provider

**Configuration**:

```javascript
{
  url: process.env.RPC_URL,          // Hoodi Network RPC endpoint
  chainId: process.env.CHAIN_ID,     // Network chain ID
  timeout: 30000                      // Request timeout (30s)
}
```

**Functions**:

- Transaction submission to blockchain
- Block and transaction queries
- Event log retrieval
- Network status monitoring
- Gas price estimation

**JSON-RPC Methods Used**:

- `eth_sendTransaction`: Submit transactions
- `eth_call`: Read contract state
- `eth_getTransactionReceipt`: Verify transaction status
- `eth_getLogs`: Retrieve contract events
- `eth_blockNumber`: Get current block number

---

## Data Flow Architecture

### 1. Voter Registration Flow

```
┌─────────────┐
│ User enters │
│ credentials │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Frontend validation │
└──────┬──────────────┘
       │
       ▼
┌────────────────────────┐
│ POST /api/voters/register │
└──────┬─────────────────┘
       │
       ▼
┌──────────────────────┐
│ Check for duplicates │
│ (email, student_id)  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────┐
│ Generate 6-digit │
│ OTP (crypto)     │
└──────┬───────────┘
       │
       ▼
┌─────────────────┐
│ Send email via  │
│ SMTP server     │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ User enters OTP │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Verify OTP      │
│ (hash compare)  │
└──────┬──────────┘
       │
       ▼
┌──────────────────┐
│ Prompt MetaMask  │
│ wallet binding   │
└──────┬───────────┘
       │
       ▼
┌──────────────────────┐
│ Store in database:   │
│ - Voter details      │
│ - Wallet address     │
│ - Registration status│
└──────┬───────────────┘
       │
       ▼
┌──────────────────┐
│ Registration     │
│ Complete ✓       │
└──────────────────┘
```

### 2. Vote Casting Flow

```
┌──────────────────┐
│ User logs in     │
│ (JWT auth)       │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Navigate to      │
│ VotePage         │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Load candidates  │
│ from blockchain  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ User selects     │
│ candidate        │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Check eligibility│
│ - Registered?    │
│ - Has voted?     │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ MetaMask prompt  │
│ for transaction  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ User signs       │
│ transaction      │
└──────┬───────────┘
       │
       ▼
┌──────────────────────┐
│ Smart contract:      │
│ - castVote(candidateId)│
│ - Update state       │
│ - Emit VoteCast event│
└──────┬───────────────┘
       │
       ▼
┌──────────────────┐
│ Wait for         │
│ confirmation     │
│ (1-2 blocks)     │
└──────┬───────────┘
       │
       ▼
┌──────────────────────┐
│ Update database:     │
│ - has_voted = true   │
│ - Record in vote_history│
│ - Store tx hash      │
└──────┬───────────────┘
       │
       ▼
┌──────────────────┐
│ Display success  │
│ confirmation ✓   │
└──────────────────┘
```

### 3. Results Retrieval Flow

```
┌──────────────────┐
│ User navigates   │
│ to ResultsPage   │
└──────┬───────────┘
       │
       ▼
┌──────────────────────┐
│ Web3.js queries:     │
│ - getCandidates()    │
│ - getVoteCount() x N │
└──────┬───────────────┘
       │
       ▼
┌──────────────────┐
│ Aggregate data   │
│ in frontend      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Calculate:       │
│ - Total votes    │
│ - Percentages    │
│ - Winner         │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Render charts:   │
│ - Bar chart      │
│ - Pie chart      │
│ - Statistics     │
└──────────────────┘
```

---

## Communication Protocols

| Connection            | Protocol         | Type         | Purpose              | Port     |
| --------------------- | ---------------- | ------------ | -------------------- | -------- |
| Browser ↔ Frontend    | HTTPS/TLS        | Synchronous  | Secure page delivery | 443/3000 |
| Frontend ↔ Backend    | REST API (JSON)  | Synchronous  | Data exchange        | 5000     |
| Frontend ↔ Blockchain | Web3 Provider    | Asynchronous | Smart contract calls | 8545     |
| Backend ↔ Database    | PostgreSQL (TCP) | Synchronous  | CRUD operations      | 5432     |
| Backend ↔ SMTP        | SMTP/TLS         | Synchronous  | Email delivery       | 587      |
| Blockchain ↔ RPC      | JSON-RPC         | Asynchronous | Network access       | 8545     |

---

## Security Architecture

### Multi-Layer Security Approach

#### 1. Client Layer Security

- **HTTPS Encryption**: All traffic encrypted with TLS 1.3
- **Content Security Policy (CSP)**: Prevents XSS attacks
- **CORS Configuration**: Restricts cross-origin requests
- **Input Validation**: Client-side validation before submission

#### 2. Presentation Layer Security

- **XSS Prevention**: React's built-in escaping
- **CSRF Protection**: Token-based validation
- **Secure Storage**: Sensitive data in httpOnly cookies
- **Code Splitting**: Reduces attack surface

#### 3. Application Layer Security

- **JWT Authentication**: Stateless token-based auth
- **Rate Limiting**: Prevents brute force attacks
- **SQL Injection Prevention**: Parameterized queries
- **Input Sanitization**: Validates and cleans all inputs
- **Helmet.js**: Sets security HTTP headers
- **Session Management**: Secure session handling

#### 4. Blockchain Layer Security

- **Cryptographic Signatures**: All transactions signed
- **Immutable Storage**: Cannot alter past votes
- **Access Control**: Smart contract modifiers
- **Event Logging**: Transparent audit trail
- **One Vote Rule**: Enforced by smart contract

#### 5. Data Layer Security

- **Encrypted Connections**: SSL/TLS for database
- **Role-Based Access**: Database user permissions
- **Backup Encryption**: Encrypted database backups
- **Audit Logging**: Track all database changes

#### 6. External Services Security

- **API Key Protection**: Environment variables
- **TLS Encryption**: Secure SMTP connections
- **Rate Limiting**: Prevent service abuse

---

## Scalability Considerations

### Horizontal Scaling

- **Load Balancer**: Distribute traffic across multiple backend instances
- **Stateless Design**: JWT enables any server to handle requests
- **Database Replication**: Read replicas for query distribution
- **CDN Integration**: Static assets served from edge locations

### Performance Optimization

- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Reuse database connections
- **Caching Layer**: Redis for frequently accessed data
- **Query Optimization**: Efficient SQL queries
- **Code Splitting**: Lazy loading of React components

### Blockchain Optimization

- **Gas Optimization**: Efficient Solidity code
- **Batch Processing**: Group transactions when possible
- **Event Indexing**: Fast event log retrieval
- **State Management**: Minimize on-chain storage

---

## Diagram Legend

| Symbol            | Meaning                            | Example                          |
| ----------------- | ---------------------------------- | -------------------------------- |
| **Solid Lines**   | Synchronous communication          | HTTP requests, SQL queries       |
| **Dashed Lines**  | Blockchain/Web3 communication      | Smart contract calls, RPC        |
| **🔒 Icon**       | Security and immutability features | Encryption, tamper-proof storage |
| **👤 Icon**       | User interaction points            | Login, voting, registration      |
| **Colored Boxes** | System components and services     | Servers, databases, contracts    |
| **Arrows**        | Data flow direction                | Request/response flow            |

---

## Technology Stack Summary

| Layer          | Technologies                                            |
| -------------- | ------------------------------------------------------- |
| **Client**     | Chrome, Firefox, Edge, MetaMask, iOS/Android browsers   |
| **Frontend**   | Next.js 13+, React 18, TypeScript, Web3.js, TailwindCSS |
| **Backend**    | Node.js 18+, Express.js, JWT, Nodemailer, Joi           |
| **Blockchain** | Ethereum, Solidity 0.8.x, Hoodi Network, Hardhat        |
| **Database**   | PostgreSQL 14+, pg-pool                                 |
| **External**   | SMTP (Ethereal/Gmail), JSON-RPC Provider                |

---

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│          Production Environment         │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐    ┌──────────────┐  │
│  │   Frontend   │    │   Backend    │  │
│  │  (Vercel)    │◄──►│  (Railway)   │  │
│  └──────────────┘    └──────┬───────┘  │
│                              │          │
│  ┌──────────────┐    ┌──────▼───────┐  │
│  │  Blockchain  │    │  PostgreSQL  │  │
│  │   (Hoodi)    │    │  (Railway)   │  │
│  └──────────────┘    └──────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

---

## Conclusion

This system architecture provides a robust, secure, and scalable foundation for a blockchain-based e-voting platform. The multi-layered approach ensures:

✅ **Security**: Multiple layers of protection from client to database  
✅ **Transparency**: Blockchain provides immutable audit trail  
✅ **Scalability**: Designed to handle growing user base  
✅ **Reliability**: Redundancy and error handling at each layer  
✅ **Maintainability**: Clear separation of concerns and modular design

The architecture successfully combines traditional web technologies with blockchain innovation to create a trustworthy voting system suitable for academic and institutional use.
