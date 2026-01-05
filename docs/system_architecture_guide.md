# Blockchain-Based E-Voting System - Complete Architecture Guide

## Table of Contents

1. [High-Level System Architecture](#high-level-system-architecture)
2. [Component Details](#component-details)
3. [Voter Flow Architecture](#voter-flow-architecture)
4. [Admin Flow Architecture](#admin-flow-architecture)
5. [Data Flow Diagrams](#data-flow-diagrams)
6. [Technology Stack](#technology-stack)
7. [Security Architecture](#security-architecture)

---

## Visual Architecture Diagrams

### High-Level System Architecture Diagrams

**Original Design (Component-Based):**

![High-Level System Architecture - Original](./high_level_architecture_original.png)

**Flowchart Design (Layer-Based):**

![High-Level System Architecture - Flowchart](./high_level_architecture_flowchart.png)

### Voter Journey Flow

![Voter Flow Diagram](./voter_flow_diagram.png)

### Admin Journey Flow

![Admin Flow Diagram](./admin_flow_diagram.png)

---

## High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        V[Voter Interface]
        A[Admin Dashboard]
        MM[MetaMask Wallet]
    end

    subgraph "Application Layer"
        FE[Frontend - React/Vite]
        API[Backend API - Express.js]
    end

    subgraph "Data Layer"
        DB[(PostgreSQL Database)]
        BC[Blockchain - Hoodi Testnet]
        SC[Smart Contract - VotingSystem.sol]
    end

    subgraph "External Services"
        EMAIL[Email Service - Nodemailer]
        IPFS[IPFS - Optional]
    end

    V --> FE
    A --> FE
    MM --> FE
    FE --> API
    API --> DB
    API --> SC
    SC --> BC
    API --> EMAIL

    style V fill:#4CAF50
    style A fill:#2196F3
    style MM fill:#FF9800
    style FE fill:#9C27B0
    style API fill:#F44336
    style DB fill:#00BCD4
    style BC fill:#FFD700
    style SC fill:#FFA500
```

### Architecture Overview

Your e-voting system follows a **3-tier architecture** with blockchain integration:

1. **Presentation Layer**: React-based frontend with MetaMask integration
2. **Application Layer**: Express.js backend API server
3. **Data Layer**: Dual storage (PostgreSQL + Blockchain)

---

## Component Details

### 1. Frontend Components (React + Vite)

```mermaid
graph LR
    subgraph "Frontend Structure"
        HP[HomePage]
        VR[Voter Registration]
        VP[Voting Page]
        AD[Admin Dashboard]
        RES[Results Page]

        HP --> VR
        VR --> VP
        VP --> RES
        AD --> |Manages| VP
    end

    subgraph "Shared Libraries"
        BL[blockchain.ts]
        API_LIB[api.ts]
        AUTH[auth.ts]
    end

    VR --> BL
    VR --> API_LIB
    VP --> BL
    VP --> API_LIB
    AD --> BL
    AD --> API_LIB

    style HP fill:#E8F5E9
    style VR fill:#C8E6C9
    style VP fill:#A5D6A7
    style AD fill:#81C784
    style RES fill:#66BB6A
```

**Key Frontend Files:**

- `src/components/HomePage.tsx` - Landing page with election info
- `src/components/VoterRegistrationPage.tsx` - Voter registration form
- `src/components/VotePage.tsx` - Voting interface
- `src/components/AdminDashboard.tsx` - Admin control panel
- `src/lib/blockchain.ts` - Blockchain interaction layer
- `src/lib/api.ts` - Backend API calls

### 2. Backend Components (Express.js)

```mermaid
graph TB
    subgraph "Backend API Structure"
        SERVER[server/src/index.ts]

        subgraph "Routes"
            AUTH_R[auth.ts]
            VOTER_R[voters.ts]
            ELECTION_R[elections.ts]
            VOTE_R[votes.ts]
            ADMIN_R[admin.ts]
        end

        subgraph "Services"
            DB_S[database.ts]
            EMAIL_S[email.ts]
            OTP_S[otp-helpers.ts]
        end

        SERVER --> AUTH_R
        SERVER --> VOTER_R
        SERVER --> ELECTION_R
        SERVER --> VOTE_R
        SERVER --> ADMIN_R

        AUTH_R --> DB_S
        VOTER_R --> DB_S
        ELECTION_R --> DB_S
        VOTE_R --> DB_S
        ADMIN_R --> DB_S

        AUTH_R --> EMAIL_S
        AUTH_R --> OTP_S
    end

    style SERVER fill:#FF6B6B
    style DB_S fill:#4ECDC4
    style EMAIL_S fill:#95E1D3
```

**Key Backend Files:**

- `server/src/index.ts` - Main server entry point
- `server/src/routes/` - API route handlers
- `server/src/database.ts` - PostgreSQL connection
- `server/src/email.ts` - Email OTP service

### 3. Database Schema (PostgreSQL)

```mermaid
erDiagram
    VOTERS ||--o{ VOTE_HISTORY : creates
    ELECTIONS ||--o{ CATEGORIES : contains
    CATEGORIES ||--o{ CANDIDATES : has
    CANDIDATES ||--o{ VOTE_HISTORY : receives
    ELECTIONS ||--o{ VOTE_HISTORY : tracks

    VOTERS {
        uuid id PK
        varchar student_id UK
        varchar email UK
        varchar wallet_address UK
        varchar department
        int year_of_study
        boolean has_voted
        boolean email_verified
        timestamp registration_date
    }

    ELECTIONS {
        uuid id PK
        varchar title
        text description
        timestamp start_time
        timestamp end_time
        boolean is_active
        int max_voters
    }

    CATEGORIES {
        uuid id PK
        uuid election_id FK
        varchar category_name
        text description
        int max_votes
        boolean is_active
    }

    CANDIDATES {
        uuid id PK
        uuid category_id FK
        uuid election_id FK
        varchar candidate_name
        varchar party
        text manifesto
        int vote_count
    }

    VOTE_HISTORY {
        uuid id PK
        varchar voter_wallet_address
        uuid election_id FK
        uuid category_id FK
        uuid candidate_id FK
        varchar blockchain_tx_hash
        timestamp voted_at
    }

    ADMINS {
        uuid id PK
        varchar user_id UK
        varchar wallet_address UK
        varchar role
        boolean is_active
    }
```

### 4. Smart Contract (Solidity)

**Contract Address**: `0x2DCa51f1095B2BbF7a5A1A8f6c0E7c7B8AD0e613` (Hoodi Testnet)

**Key Functions:**

- `createElection()` - Initialize new election
- `startElection()` - Activate voting
- `endElection()` - Close voting
- `registerVoter()` - Register voter on blockchain
- `createCategory()` - Add voting category
- `addCandidate()` - Add candidate to category
- `vote()` - Cast single vote
- `batchVote()` - Cast multiple votes at once
- `getMyVotes()` - Retrieve voter's vote receipts

---

## Voter Flow Architecture

### Complete Voter Journey

```mermaid
sequenceDiagram
    participant V as Voter
    participant FE as Frontend
    participant MM as MetaMask
    participant API as Backend API
    participant DB as PostgreSQL
    participant SC as Smart Contract
    participant BC as Blockchain
    participant EM as Email Service

    Note over V,EM: PHASE 1: ACCOUNT CREATION
    V->>FE: Visit Create Account Page
    V->>FE: Enter Student ID, Email, Password
    FE->>API: POST /api/auth/create-account
    API->>DB: Check if student_id/email exists
    DB-->>API: Not found (OK)
    API->>API: Hash password
    API->>DB: INSERT into voters (temp record)
    API->>API: Generate 6-digit OTP
    API->>EM: Send OTP to email
    EM-->>V: Email with OTP
    API-->>FE: Account created, verify email

    Note over V,EM: PHASE 2: EMAIL VERIFICATION
    V->>FE: Enter OTP from email
    FE->>API: POST /api/auth/verify-email
    API->>DB: Verify OTP hash & expiry
    DB-->>API: OTP valid
    API->>DB: UPDATE voters SET email_verified=true
    API-->>FE: Email verified

    Note over V,EM: PHASE 3: WALLET REGISTRATION
    V->>FE: Navigate to Wallet Registration
    FE->>MM: Request wallet connection
    MM-->>V: Approve connection
    MM-->>FE: Return wallet address
    FE->>API: POST /api/auth/login (student_id, password)
    API->>DB: Verify credentials
    DB-->>API: User authenticated
    API-->>FE: Login successful

    FE->>API: GET /api/voters/check-registration
    API->>DB: Check wallet_address
    DB-->>API: Not registered

    V->>FE: Fill registration form (Faculty, Year)
    FE->>SC: registerVoter(studentId, dept, year)
    SC->>BC: Store voter on blockchain
    BC-->>SC: Transaction confirmed
    SC-->>FE: Registration successful

    FE->>API: POST /api/voters/register
    API->>DB: UPDATE voters SET wallet_address, dept, year
    DB-->>API: Updated
    API-->>FE: Registration complete

    Note over V,EM: PHASE 4: VOTING
    V->>FE: Navigate to Vote Page
    FE->>MM: Get connected wallet
    MM-->>FE: Wallet address

    FE->>API: GET /api/elections/active
    API->>DB: SELECT active election
    DB-->>API: Election data
    API-->>FE: Election info

    FE->>SC: getAllCategories()
    SC-->>FE: Categories list

    loop For each category
        FE->>SC: getCandidatesForCategory(categoryId)
        SC-->>FE: Candidates with vote counts
    end

    V->>FE: Select candidates
    V->>FE: Submit votes

    FE->>SC: batchVote([{categoryId, candidateId}])
    SC->>BC: Record votes on blockchain
    BC-->>SC: Transaction hash
    SC-->>FE: Votes recorded

    FE->>API: POST /api/votes/record
    API->>DB: INSERT into vote_history
    API->>DB: UPDATE voters SET has_voted=true
    API->>DB: UPDATE candidates SET vote_count
    DB-->>API: Success
    API-->>FE: Vote recorded in DB

    FE-->>V: Vote successful! Show receipt

    Note over V,EM: PHASE 5: VERIFICATION
    V->>FE: View My Votes
    FE->>SC: getMyVotes()
    SC-->>FE: Vote receipts with tx hashes
    FE-->>V: Display vote history
```

### Voter Connection Points

**What Voters Connect To:**

1. **Frontend (React App)**

   - URL: `http://[YOUR_IP]:5173` or `http://localhost:5173`
   - Purpose: User interface for all interactions

2. **MetaMask Wallet**

   - Network: Ethereum Hoodi Testnet
   - Purpose: Wallet authentication and transaction signing

3. **Backend API** (via Frontend)

   - URL: `http://[YOUR_IP]:3000/api`
   - Endpoints used:
     - `/api/auth/create-account` - Create account
     - `/api/auth/verify-email` - Verify OTP
     - `/api/auth/login` - Login
     - `/api/voters/register` - Register wallet
     - `/api/elections/active` - Get election info
     - `/api/votes/record` - Record vote

4. **Smart Contract** (via Frontend)

   - Address: `0x2DCa51f1095B2BbF7a5A1A8f6c0E7c7B8AD0e613`
   - Functions called:
     - `registerVoter()`
     - `getAllCategories()`
     - `getCandidatesForCategory()`
     - `batchVote()`
     - `getMyVotes()`

5. **Email Service** (receives emails)
   - Purpose: Receive OTP for verification

---

## Admin Flow Architecture

### Complete Admin Journey

```mermaid
sequenceDiagram
    participant A as Admin
    participant FE as Frontend
    participant MM as MetaMask
    participant API as Backend API
    participant DB as PostgreSQL
    participant SC as Smart Contract
    participant BC as Blockchain

    Note over A,BC: PHASE 1: ADMIN AUTHENTICATION
    A->>FE: Access Admin Dashboard
    FE->>MM: Request wallet connection
    MM-->>A: Approve connection
    MM-->>FE: Return admin wallet address

    FE->>API: GET /api/admin/verify
    API->>DB: SELECT from admins WHERE wallet_address
    DB-->>API: Admin record found
    API-->>FE: Admin authenticated

    Note over A,BC: PHASE 2: ELECTION SETUP
    A->>FE: Create Election Form
    A->>FE: Enter title, description, dates

    FE->>SC: createElection(title, startTime, endTime)
    SC->>BC: Store election on blockchain
    BC-->>SC: Transaction confirmed
    SC-->>FE: Election created

    FE->>API: POST /api/elections/create
    API->>DB: INSERT into elections
    DB-->>API: Election ID
    API-->>FE: Election saved

    Note over A,BC: PHASE 3: CATEGORY SETUP
    A->>FE: Add Category Form
    A->>FE: Enter category name, description

    FE->>SC: createCategory(name, description)
    SC->>BC: Store category on blockchain
    BC-->>SC: Category ID, tx hash
    SC-->>FE: Category created

    FE->>API: POST /api/categories/create
    API->>DB: INSERT into categories
    DB-->>API: Success
    API-->>FE: Category saved

    Note over A,BC: PHASE 4: CANDIDATE SETUP
    loop For each candidate
        A->>FE: Add Candidate Form
        A->>FE: Enter name, party, manifesto

        FE->>SC: addCandidate(categoryId, name, party)
        SC->>BC: Store candidate on blockchain
        BC-->>SC: Candidate ID, tx hash
        SC-->>FE: Candidate added

        FE->>API: POST /api/candidates/create
        API->>DB: INSERT into candidates
        DB-->>API: Success
        API-->>FE: Candidate saved
    end

    Note over A,BC: PHASE 5: START ELECTION
    A->>FE: Click "Start Election"
    FE->>SC: startElection()
    SC->>BC: Update election state to ACTIVE
    BC-->>SC: Transaction confirmed
    SC-->>FE: Election started

    FE->>API: PATCH /api/elections/start
    API->>DB: UPDATE elections SET is_active=true
    DB-->>API: Success
    API-->>FE: Election activated

    Note over A,BC: PHASE 6: MONITOR VOTING
    loop Real-time monitoring
        FE->>API: GET /api/admin/dashboard-stats
        API->>DB: SELECT voter stats, vote counts
        DB-->>API: Statistics
        API-->>FE: Dashboard data

        FE->>SC: getElectionSummary()
        SC-->>FE: Blockchain stats

        FE-->>A: Display live results
    end

    Note over A,BC: PHASE 7: END ELECTION
    A->>FE: Click "End Election"
    FE->>SC: endElection()
    SC->>BC: Update election state to ENDED
    BC-->>SC: Transaction confirmed
    SC-->>FE: Election ended

    FE->>API: PATCH /api/elections/end
    API->>DB: UPDATE elections SET is_active=false
    DB-->>API: Success
    API-->>FE: Election closed

    Note over A,BC: PHASE 8: VIEW RESULTS
    A->>FE: Navigate to Results
    FE->>SC: getAllCategories()
    SC-->>FE: Categories

    loop For each category
        FE->>SC: getCandidatesForCategory(categoryId)
        SC-->>FE: Candidates with final vote counts
    end

    FE->>API: GET /api/votes/history
    API->>DB: SELECT from vote_history
    DB-->>API: Vote records
    API-->>FE: Vote history

    FE-->>A: Display final results
```

### Admin Connection Points

**What Admin Connects To:**

1. **Frontend (Admin Dashboard)**

   - URL: `http://[YOUR_IP]:5173/admin`
   - Purpose: Election management interface

2. **MetaMask Wallet**

   - Network: Ethereum Hoodi Testnet
   - Purpose: Admin authentication and transaction signing
   - Required: Admin wallet must be registered in `admins` table

3. **Backend API** (via Frontend)

   - URL: `http://[YOUR_IP]:3000/api`
   - Endpoints used:
     - `/api/admin/verify` - Verify admin status
     - `/api/elections/*` - Manage elections
     - `/api/categories/*` - Manage categories
     - `/api/candidates/*` - Manage candidates
     - `/api/admin/dashboard-stats` - Get statistics
     - `/api/votes/history` - View vote history

4. **Smart Contract** (via Frontend)

   - Address: `0x2DCa51f1095B2BbF7a5A1A8f6c0E7c7B8AD0e613`
   - Functions called:
     - `createElection()`
     - `startElection()`
     - `endElection()`
     - `resetSystem()`
     - `createCategory()`
     - `addCandidate()`
     - `getElectionSummary()`
     - `getAllCategories()`
     - `getCandidatesForCategory()`
     - `pauseSystem()` / `unpauseSystem()`

5. **PostgreSQL Database** (via Backend)
   - Purpose: Store election data, monitor voters, view audit logs

---

## Data Flow Diagrams

### Overall Data Flow

![Data Flow Diagram](./data_flow_diagram.png)

### Vote Recording Data Flow

```mermaid
graph TB
    subgraph "Vote Submission Flow"
        V1[Voter selects candidates]
        V2[Frontend validates selections]
        V3[Call batchVote on Smart Contract]
        V4[MetaMask prompts for signature]
        V5[Transaction sent to blockchain]
        V6[Blockchain confirms transaction]
        V7[Frontend receives tx hash]
        V8[Call Backend API to record vote]
        V9[Backend saves to vote_history]
        V10[Backend updates has_voted flag]
        V11[Backend updates candidate vote_count]
        V12[Success confirmation to voter]

        V1 --> V2
        V2 --> V3
        V3 --> V4
        V4 --> V5
        V5 --> V6
        V6 --> V7
        V7 --> V8
        V8 --> V9
        V9 --> V10
        V10 --> V11
        V11 --> V12
    end

    style V3 fill:#FFD700
    style V6 fill:#FFD700
    style V9 fill:#00BCD4
    style V10 fill:#00BCD4
```

### Registration Data Flow

```mermaid
graph LR
    subgraph "Voter Registration Flow"
        R1[Create Account]
        R2[Email Verification]
        R3[Wallet Connection]
        R4[Blockchain Registration]
        R5[Database Update]

        R1 --> |OTP sent| R2
        R2 --> |Email verified| R3
        R3 --> |Wallet connected| R4
        R4 --> |On-chain record| R5
        R5 --> |Complete| R6[Ready to Vote]
    end

    style R1 fill:#E3F2FD
    style R2 fill:#BBDEFB
    style R3 fill:#90CAF9
    style R4 fill:#64B5F6
    style R5 fill:#42A5F5
    style R6 fill:#2196F3
```

### Results Retrieval Flow

```mermaid
graph TB
    subgraph "Results Display Flow"
        RES1[User requests results]
        RES2{Election ended?}
        RES3[Fetch from Smart Contract]
        RES4[Get categories]
        RES5[Get candidates with votes]
        RES6[Fetch vote history from DB]
        RES7[Combine data]
        RES8[Display results]

        RES1 --> RES2
        RES2 --> |Yes| RES3
        RES2 --> |No| RES9[Show error]
        RES3 --> RES4
        RES4 --> RES5
        RES5 --> RES6
        RES6 --> RES7
        RES7 --> RES8
    end

    style RES3 fill:#FFD700
    style RES6 fill:#00BCD4
    style RES8 fill:#4CAF50
```

---

## Technology Stack

### Frontend Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Blockchain Library**: ethers.js v6
- **Wallet**: MetaMask integration
- **UI Components**: Custom components
- **Routing**: React Router
- **State Management**: React hooks
- **Notifications**: Sonner (toast notifications)

### Backend Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 14+
- **ORM/Query**: Direct SQL queries with pg library
- **Email**: Nodemailer
- **Security**: bcrypt for password hashing
- **CORS**: Enabled for cross-origin requests

### Blockchain Stack

- **Network**: Ethereum Hoodi Testnet
- **Smart Contract Language**: Solidity
- **Contract Address**: `0x2DCa51f1095B2BbF7a5A1A8f6c0E7c7B8AD0e613`
- **Wallet Provider**: MetaMask
- **RPC Endpoint**: Hoodi testnet RPC

### Database Tables

1. **voters** - Voter accounts and registration
2. **elections** - Election metadata
3. **categories** - Voting categories
4. **candidates** - Candidate information
5. **vote_history** - Permanent vote records
6. **admins** - Admin accounts
7. **audit_logs** - System activity logs
8. **system_settings** - Configuration

---

## Security Architecture

### Multi-Layer Security

```mermaid
graph TB
    subgraph "Security Layers"
        L1[Layer 1: Email Verification]
        L2[Layer 2: Password Authentication]
        L3[Layer 3: Wallet Binding]
        L4[Layer 4: Blockchain Verification]
        L5[Layer 5: Database Integrity]

        L1 --> L2
        L2 --> L3
        L3 --> L4
        L4 --> L5
    end

    subgraph "Security Features"
        F1[OTP Expiry - 10 minutes]
        F2[Password Hashing - bcrypt]
        F3[Wallet-Identity Binding]
        F4[Immutable Blockchain Records]
        F5[Audit Logging]
        F6[One Vote Per Category]
        F7[Transaction Signatures]
    end

    style L1 fill:#FFCDD2
    style L2 fill:#EF9A9A
    style L3 fill:#E57373
    style L4 fill:#EF5350
    style L5 fill:#F44336
```

### Security Mechanisms

1. **Email Verification (OTP)**

   - 6-digit OTP sent to student email
   - 10-minute expiration
   - Maximum 3 attempts
   - Prevents unauthorized registrations

2. **Password Security**

   - bcrypt hashing with salt
   - Minimum password requirements
   - Secure storage in database

3. **Wallet-Identity Binding**

   - One wallet per student ID
   - Wallet address verified on each vote
   - Prevents vote manipulation

4. **Blockchain Immutability**

   - All votes recorded on blockchain
   - Cannot be altered or deleted
   - Transparent and verifiable

5. **Double Recording**

   - Votes stored on blockchain AND database
   - Cross-verification possible
   - Redundancy for integrity

6. **Admin Access Control**
   - Wallet-based authentication
   - Role-based permissions
   - Audit trail of admin actions

---

## Summary: How Everything Connects

### Voter Perspective

1. **Create Account** → Backend API → PostgreSQL
2. **Verify Email** → Email Service → Backend API → PostgreSQL
3. **Connect Wallet** → MetaMask → Frontend
4. **Register** → Smart Contract → Blockchain + Backend API → PostgreSQL
5. **Vote** → Smart Contract → Blockchain + Backend API → PostgreSQL
6. **Verify** → Smart Contract → Display receipts

### Admin Perspective

1. **Login** → MetaMask → Backend API → PostgreSQL (verify admin)
2. **Create Election** → Smart Contract → Blockchain + Backend API → PostgreSQL
3. **Add Categories** → Smart Contract → Blockchain + Backend API → PostgreSQL
4. **Add Candidates** → Smart Contract → Blockchain + Backend API → PostgreSQL
5. **Start Election** → Smart Contract → Blockchain + Backend API → PostgreSQL
6. **Monitor** → Backend API → PostgreSQL + Smart Contract → Blockchain
7. **End Election** → Smart Contract → Blockchain + Backend API → PostgreSQL
8. **View Results** → Smart Contract → Blockchain + Backend API → PostgreSQL

### Data Storage

- **Blockchain**: Votes, voter registrations, election state, categories, candidates
- **PostgreSQL**: User accounts, emails, passwords, vote history, audit logs, election metadata
- **Why Both?**: Blockchain for immutability and transparency, Database for efficient queries and user management

---

## Next Steps for Building Diagrams

If you want to create visual diagrams manually, here are the recommended tools:

1. **Draw.io (diagrams.net)** - Free, web-based
2. **Lucidchart** - Professional diagrams
3. **Mermaid Live Editor** - For mermaid diagrams
4. **Microsoft Visio** - Enterprise solution
5. **Figma** - For UI/UX focused diagrams

The mermaid diagrams above can be copied directly into any markdown viewer or mermaid editor!
