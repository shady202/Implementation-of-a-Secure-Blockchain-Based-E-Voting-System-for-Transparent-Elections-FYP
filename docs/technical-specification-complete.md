# E-Voting System - Complete Technical Specification

## Comprehensive Answers for FYP Chapter 4 Documentation

---

## A) PROJECT IDENTITY AND SCOPE

### Project Name

**"Implementation of a Secure Blockchain-Based E-Voting System for Transparent Elections"**

**Short Description**:
A blockchain-powered electronic voting platform that enables secure, transparent, and tamper-proof student council elections using Ethereum smart contracts, MetaMask wallet authentication, and PostgreSQL database for voter management.

### User Roles

1. **Voter (Student)** - Primary user who registers and casts votes
2. **Administrator (Election Officer)** - Manages elections, candidates, categories, and system settings

**Note**: No "Candidate" user role - candidates are data entities managed by admins.

### Elections and Categories

- **Multiple Categories per Election** (e.g., President, Vice President, Secretary)
- **One Election at a Time** - System supports one active election, but can create multiple categories within it
- **Dynamic Category System** - Admin creates categories during election setup (not hardcoded)

### Voting Enforcement

- **One Vote Per Category** - Enforced **ON-CHAIN** (smart contract mapping)
- **Additional Validation OFF-CHAIN** - Backend also tracks `has_voted` in PostgreSQL for UI/UX
- **Dual-Layer Security**: Smart contract prevents double voting + database provides fast eligibility checks

---

## B) FRONTEND (PRESENTATION LAYER)

### Framework and Version

- **Framework**: Next.js **15.5.4**
- **React Version**: 19.1.0
- **TypeScript**: Yes (TypeScript 5)
- **Build Tool**: Vite (for development)
- **Styling**: Tailwind CSS 4.1.9

### Key Frontend Pages/Routes

| Route         | File Path                                  | Description                            |
| ------------- | ------------------------------------------ | -------------------------------------- |
| `/`           | `src/components/HomePage.tsx`              | Landing page with election info        |
| `/register`   | `src/components/VoterRegistrationPage.tsx` | Voter registration with OTP            |
| `/login`      | `src/components/LoginPage.tsx`             | Login with OTP authentication          |
| `/vote`       | `src/components/VotePage.tsx`              | Main voting interface (multi-category) |
| `/cast-vote`  | `src/components/CastVotePage.tsx`          | Vote submission page                   |
| `/results`    | `src/components/ResultsPage.tsx`           | Election results display               |
| `/my-votes`   | `src/components/MyVotesPage.tsx`           | Voter's vote history                   |
| `/admin`      | `src/components/AdminDashboard.tsx`        | Admin control panel                    |
| `/elections`  | `src/components/ElectionsPage.tsx`         | Election management                    |
| `/categories` | `src/components/CategoriesPage.tsx`        | Category management                    |
| `/settings`   | `src/components/SettingsPage.tsx`          | System settings                        |
| `/about`      | `src/components/AboutPage.tsx`             | About page                             |
| `/contact`    | `src/components/ContactPage.tsx`           | Contact page                           |
| `/privacy`    | `src/components/PrivacyPage.tsx`           | Privacy policy                         |
| `/terms`      | `src/components/TermsPage.tsx`             | Terms of service                       |

### Blockchain Interaction Library

- **Library**: **ethers.js** version 6.15.0 (NOT web3.js)
- **Location**: `src/lib/contract.ts` (blockchain helper functions)
- **Contract ABI**: `src/lib/VotingSystemABI.json` (auto-generated from Solidity)

### MetaMask Connection Logic

- **File**: `src/lib/contract.ts`
- **Key Functions**:
  - `connectWallet()` - Initiates MetaMask connection
  - `getProvider()` - Returns ethers BrowserProvider
  - `getSigner()` - Gets user's signer for transactions
  - `getContract()` - Returns contract instance with signer

### API Communication

- **Method**: Native `fetch()` API (no axios)
- **Base URL Configuration**:
  - File: `src/lib/api.ts` or inline in components
  - Development: `http://localhost:3001` or `http://192.168.x.x:3001`
  - Environment Variable: `VITE_API_URL` (if configured)

### Authentication Storage

- **Storage Method**: `localStorage`
- **Key Names**:
  - `authToken` - JWT token
  - `userEmail` - User's email
  - `walletAddress` - Connected wallet address
  - `studentId` - Student ID (after registration)

---

## C) BACKEND (APPLICATION LAYER)

### Framework and Port

- **Framework**: Node.js with **Express.js** 4.18.2
- **Language**: TypeScript 5.3.3
- **Port**: **3001** (configurable via `PORT` env variable)
- **Host**: `0.0.0.0` (allows network access)

### Backend Folder Structure

```
server/src/
├── index.ts              # Main server file
├── db.ts                 # PostgreSQL connection
├── routes/               # API route handlers
│   ├── auth.ts          # Authentication routes
│   ├── voters.ts        # Voter management
│   ├── elections.ts     # Election CRUD
│   ├── categories.ts    # Category management
│   ├── candidates.ts    # Candidate management
│   ├── votes.ts         # Vote recording
│   ├── admin.ts         # Admin operations
│   ├── statistics.ts    # Analytics
│   └── reset.ts         # System reset
├── middleware/
│   └── auth.ts          # JWT verification
├── services/
│   └── email.ts         # Email/OTP service
└── utils/
    ├── otp-helpers.ts   # OTP generation/validation
    ├── jwt-helpers.ts   # JWT token management
    └── validators.ts    # Input validation
```

### Complete Backend Routes

#### **Authentication Routes** (`/api/auth`)

| Method | Path                   | Handler                   | Description       |
| ------ | ---------------------- | ------------------------- | ----------------- |
| POST   | `/api/auth/send-otp`   | `auth.ts → sendOTP()`     | Send OTP to email |
| POST   | `/api/auth/verify-otp` | `auth.ts → verifyOTP()`   | Verify OTP code   |
| POST   | `/api/auth/login`      | `auth.ts → login()`       | Login with OTP    |
| GET    | `/api/auth/verify`     | `auth.ts → verifyToken()` | Verify JWT token  |

#### **Voter Routes** (`/api/voters`)

| Method | Path                             | Handler                        | Description             |
| ------ | -------------------------------- | ------------------------------ | ----------------------- |
| POST   | `/api/voters/register`           | `voters.ts → registerVoter()`  | Register new voter      |
| POST   | `/api/voters/bind-wallet`        | `voters.ts → bindWallet()`     | Bind MetaMask wallet    |
| GET    | `/api/voters/:walletAddress`     | `voters.ts → getVoter()`       | Get voter by wallet     |
| GET    | `/api/voters/student/:studentId` | `voters.ts → getByStudentId()` | Get voter by student ID |
| PUT    | `/api/voters/:id/mark-voted`     | `voters.ts → markVoted()`      | Mark voter as voted     |
| GET    | `/api/voters`                    | `voters.ts → getAllVoters()`   | Get all voters (admin)  |

#### **Election Routes** (`/api/elections`)

| Method | Path                       | Handler                              | Description         |
| ------ | -------------------------- | ------------------------------------ | ------------------- |
| POST   | `/api/elections`           | `elections.ts → createElection()`    | Create election     |
| GET    | `/api/elections`           | `elections.ts → getElections()`      | Get all elections   |
| GET    | `/api/elections/active`    | `elections.ts → getActiveElection()` | Get active election |
| PUT    | `/api/elections/:id`       | `elections.ts → updateElection()`    | Update election     |
| POST   | `/api/elections/:id/start` | `elections.ts → startElection()`     | Start election      |
| POST   | `/api/elections/:id/end`   | `elections.ts → endElection()`       | End election        |
| DELETE | `/api/elections/:id`       | `elections.ts → deleteElection()`    | Delete election     |

#### **Category Routes** (`/api/categories`)

| Method | Path                  | Handler                            | Description        |
| ------ | --------------------- | ---------------------------------- | ------------------ |
| POST   | `/api/categories`     | `categories.ts → createCategory()` | Create category    |
| GET    | `/api/categories`     | `categories.ts → getCategories()`  | Get all categories |
| GET    | `/api/categories/:id` | `categories.ts → getCategory()`    | Get category by ID |
| PUT    | `/api/categories/:id` | `categories.ts → updateCategory()` | Update category    |
| DELETE | `/api/categories/:id` | `categories.ts → deleteCategory()` | Delete category    |

#### **Candidate Routes** (`/api/candidates`)

| Method | Path                                   | Handler                                     | Description                 |
| ------ | -------------------------------------- | ------------------------------------------- | --------------------------- |
| POST   | `/api/candidates`                      | `candidates.ts → addCandidate()`            | Add candidate               |
| GET    | `/api/candidates`                      | `candidates.ts → getCandidates()`           | Get all candidates          |
| GET    | `/api/candidates/category/:categoryId` | `candidates.ts → getCandidatesByCategory()` | Get candidates for category |
| PUT    | `/api/candidates/:id`                  | `candidates.ts → updateCandidate()`         | Update candidate            |
| DELETE | `/api/candidates/:id`                  | `candidates.ts → deleteCandidate()`         | Delete candidate            |

#### **Vote Routes** (`/api/votes`)

| Method | Path                  | Handler                       | Description       |
| ------ | --------------------- | ----------------------------- | ----------------- |
| POST   | `/api/votes/record`   | `votes.ts → recordVote()`     | Record vote to DB |
| GET    | `/api/votes/history`  | `votes.ts → getVoteHistory()` | Get vote history  |
| GET    | `/api/votes/my-votes` | `votes.ts → getMyVotes()`     | Get user's votes  |

#### **Admin Routes** (`/api/admin`)

| Method | Path                    | Handler                       | Description            |
| ------ | ----------------------- | ----------------------------- | ---------------------- |
| GET    | `/api/admin/dashboard`  | `admin.ts → getDashboard()`   | Get dashboard stats    |
| GET    | `/api/admin/activities` | `admin.ts → getActivities()`  | Get recent activities  |
| POST   | `/api/admin/settings`   | `admin.ts → updateSettings()` | Update system settings |

#### **Statistics Routes** (`/api/statistics`)

| Method | Path                       | Handler                         | Description         |
| ------ | -------------------------- | ------------------------------- | ------------------- |
| GET    | `/api/statistics/overview` | `statistics.ts → getOverview()` | Get system overview |
| GET    | `/api/statistics/turnout`  | `statistics.ts → getTurnout()`  | Get voter turnout   |

#### **Reset Route** (`/api/reset`)

| Method | Path                | Handler                    | Description         |
| ------ | ------------------- | -------------------------- | ------------------- |
| POST   | `/api/reset/system` | `reset.ts → resetSystem()` | Reset entire system |

### Routes Requiring JWT Authentication

**All routes except**:

- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`
- `POST /api/voters/register`
- `GET /health`

**JWT Middleware**: Applied in `src/middleware/auth.ts`

### Middleware Stack

1. **CORS** - Cross-origin resource sharing (allows localhost + network IP)
2. **express.json()** - JSON body parser
3. **express.urlencoded()** - URL-encoded body parser
4. **Request Logger** - Logs all requests to console
5. **JWT Verification** - `src/middleware/auth.ts` (on protected routes)
6. **Error Handler** - Global error handling middleware

### Backend Blockchain Interaction

**NO** - Backend does **NOT** call blockchain directly.

- Only frontend calls smart contract (via ethers.js + MetaMask)
- Backend only stores transaction hashes and metadata in PostgreSQL

---

## D) OTP AND EMAIL (EXTERNAL SERVICE + BACKEND FLOW)

### OTP Generation

- **File**: `server/src/utils/otp-helpers.ts`
- **Function**: `generateOTP()`
- **Format**: 6-digit numeric code (e.g., `456789`)
- **Expiry**: 10 minutes (configurable via `OTP_TTL_MINUTES`)
- **Resend Cooldown**: 60 seconds (configurable via `OTP_RESEND_COOLDOWN_SECONDS`)
- **Attempt Limit**: 5 attempts (configurable via `OTP_MAX_ATTEMPTS`)

### OTP Storage

- **Method**: **Hashed** (NOT plaintext)
- **Hash Algorithm**: **bcrypt** (salt rounds: 10)
- **Storage Location**: `voters` table in PostgreSQL
- **Columns**:
  - `email_otp_hash` - Bcrypt hash of OTP
  - `email_otp_expires_at` - Expiration timestamp
  - `otp_attempts` - Number of failed attempts
  - `otp_last_sent_at` - Last OTP send time

### SMTP Service

- **Service**: Gmail SMTP (or Ethereal for testing)
- **Library**: **nodemailer** 7.0.11
- **File**: `server/src/services/email.ts`
- **Functions**:
  - `sendOTPEmail(email, otp)` - Send OTP email
  - `sendWelcomeEmail(email, name)` - Send welcome email

### Environment Variables (Email)

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=apuvotingbot@gmail.com
SMTP_PASS=apuvoting2025
SMTP_FROM="APU Voting System <apuvotingbot@gmail.com>"
```

---

## E) POSTGRESQL (DATA LAYER)

### PostgreSQL Client/ORM

- **Library**: **pg** (node-postgres) 8.11.3
- **NO ORM** - Raw SQL queries
- **Connection File**: `server/src/db.ts`
- **Connection Method**: Connection pool

### Database Tables and Key Columns

#### **1. voters**

```sql
- id (UUID, PK)
- student_id (VARCHAR, UNIQUE)
- email (VARCHAR, UNIQUE)
- wallet_address (VARCHAR, UNIQUE)
- department (VARCHAR)
- year_of_study (INTEGER)
- has_voted (BOOLEAN)
- email_verified (BOOLEAN)
- email_otp_hash (TEXT)
- email_otp_expires_at (TIMESTAMP)
- otp_attempts (INTEGER)
- registration_date (TIMESTAMP)
- voted_at (TIMESTAMP)
```

#### **2. elections**

```sql
- id (UUID, PK)
- title (VARCHAR)
- description (TEXT)
- start_time (TIMESTAMP)
- end_time (TIMESTAMP)
- is_active (BOOLEAN)
- results_published (BOOLEAN)
- created_at (TIMESTAMP)
```

#### **3. categories**

```sql
- id (UUID, PK)
- election_id (UUID, FK → elections.id)
- category_name (VARCHAR)
- description (TEXT)
- is_active (BOOLEAN)
- display_order (INTEGER)
```

#### **4. candidates**

```sql
- id (UUID, PK)
- category_id (UUID, FK → categories.id)
- election_id (UUID, FK → elections.id)
- candidate_name (VARCHAR)
- party (VARCHAR)
- manifesto (TEXT)
- vote_count (INTEGER)
- is_approved (BOOLEAN)
```

#### **5. vote_history**

```sql
- id (UUID, PK)
- voter_wallet_address (VARCHAR)
- voter_student_id (VARCHAR)
- election_id (UUID, FK → elections.id)
- category_id (UUID, FK → categories.id)
- candidate_id (UUID, FK → candidates.id)
- blockchain_tx_hash (VARCHAR)
- voted_at (TIMESTAMP)
```

#### **6. audit_logs**

```sql
- id (UUID, PK)
- user_id (VARCHAR)
- action (VARCHAR)
- entity_type (VARCHAR)
- entity_id (UUID)
- details (JSONB)
- ip_address (INET)
- created_at (TIMESTAMP)
```

#### **7. system_settings**

```sql
- key (VARCHAR, PK)
- value (JSONB)
- description (TEXT)
- updated_at (TIMESTAMP)
```

#### **8. admins**

```sql
- id (UUID, PK)
- user_id (VARCHAR, UNIQUE)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- wallet_address (VARCHAR)
- role (VARCHAR)
- is_active (BOOLEAN)
```

### Relationships and Keys

- **Primary Keys**: All tables use UUID
- **Foreign Keys**:
  - `categories.election_id` → `elections.id` (CASCADE DELETE)
  - `candidates.category_id` → `categories.id` (CASCADE DELETE)
  - `candidates.election_id` → `elections.id` (CASCADE DELETE)
  - `vote_history.election_id` → `elections.id` (SET NULL)
  - `vote_history.category_id` → `categories.id` (SET NULL)
  - `vote_history.candidate_id` → `candidates.id` (SET NULL)

### Vote Recording to Database

**When a vote is cast**:

1. **Update `voters` table**: Set `has_voted = TRUE`, `voted_at = NOW()`
2. **Insert into `vote_history`**: Record vote with transaction hash
3. **Update `candidates` table**: Increment `vote_count` (optional, mainly for backup)

**Transaction Hash**: Stored in `vote_history.blockchain_tx_hash`

---

## F) SMART CONTRACT (BLOCKCHAIN LAYER)

### Contract Details

- **Contract Name**: `VotingSystem`
- **File Path**: `src/contracts/VotingSystem.sol`
- **Solidity Version**: 0.8.19
- **Network**: **Hoodi Testnet** (Ethereum-compatible)
- **Chain ID**: (Not specified in code, configured in MetaMask)

### Contract Address Handling

- **Method**: **Environment-based** (stored in `.env` file)
- **Frontend**: `VITE_CONTRACT_ADDRESS`
- **Deployment**: Address saved to `src/deployments/hoodi.json` after deployment

### Key Public Functions

#### **Election Management**

- `createElection(string title, uint256 startTime, uint256 endTime)` - Admin only
- `startElection()` - Admin only
- `endElection()` - Admin only
- `autoEndElection()` - Anyone (if time reached)
- `resetSystem()` - Admin only

#### **Category Management**

- `createCategory(string name, string description)` - Admin only
- `updateCategory(uint256 categoryId, ...)` - Admin only
- `deactivateCategory(uint256 categoryId)` - Admin only
- `getCategory(uint256 categoryId)` - Public view
- `getAllCategories()` - Public view

#### **Candidate Management**

- `addCandidate(uint256 categoryId, string name, string party)` - Admin only
- `deactivateCandidate(uint256 categoryId, uint256 candidateId)` - Admin only
- `getCandidatesForCategory(uint256 categoryId)` - Public view

#### **Voter Registration & Voting**

- `registerVoter(string studentId, string department, uint256 yearOfStudy)` - Public
- `vote(uint256 categoryId, uint256 candidateId)` - Public (during active election)
- `batchVote(VoteChoice[] votes)` - Public (vote multiple categories at once)
- `hasVotedInCategory(address voter, uint256 categoryId)` - Public view

#### **Getters**

- `getVoterInfo(address voterAddress)` - Public view
- `getMyVotes()` - Public view (returns VoteReceipt[])
- `getElectionSummary()` - Public view
- `getEffectiveState()` - Public view (checks auto-end)

### Key Events Emitted

- `ElectionCreated(string title, uint256 startTime, uint256 endTime)`
- `ElectionStarted(uint256 timestamp)`
- `ElectionEnded(uint256 timestamp)`
- `ElectionAutoEnded(uint256 timestamp)`
- `CategoryCreated(uint256 indexed categoryId, string name)`
- `CandidateAdded(uint256 indexed categoryId, uint256 indexed candidateId, string name)`
- `VoterRegistered(address indexed voterAddress, string studentId)`
- `VoteCast(address indexed voter, uint256 indexed categoryId, uint256 indexed candidateId)`
- `BatchVoteCast(address indexed voter, uint256 voteCount)`
- `SystemReset(uint256 timestamp)`

### Access Control Model

- **Admin Enforcement**: `onlyAdmin` modifier (checks `msg.sender == admin`)
- **Admin Address**: Set in constructor (deployer becomes admin)
- **Who Can**:
  - **Start/End Election**: Admin only
  - **Add Candidates**: Admin only
  - **Create Categories**: Admin only
  - **Vote**: Any registered voter (during active election)
  - **Register**: Anyone (during election setup or active)

### "Already Voted" Enforcement

- **Method**: Mapping in contract: `mapping(address => mapping(uint256 => bool)) votedInCategory`
- **Per Category**: Yes - voter can vote once per category
- **Check**: `require(!v.votedInCategory[categoryId], "Already voted in category")`

### Multiple Elections Support

- **Current Design**: **Single election at a time**
- **To support multiple**: Would need `electionId` parameter in all functions
- **Current Approach**: Reset system after election ends to create new election

---

## G) RPC / WALLET / CHAINLIST (EXTERNAL SERVICES)

### RPC Endpoint

- **Provider Type**: **Hoodi Network RPC** (custom Ethereum testnet)
- **Configuration**: Added manually to MetaMask
- **URL**: (Private, not in code - configured in MetaMask)

### Chainlist Requirement

- **Required**: **YES** - Users must manually add Hoodi network to MetaMask
- **Network Details**:
  - Network Name: Ethereum Hoodi
  - RPC URL: (Provided by Hoodi)
  - Chain ID: (Provided by Hoodi)
  - Currency Symbol: ETH
  - Block Explorer: (If available)

### RPC Error Handling

- **File**: `src/lib/contract.ts`
- **Common Errors**:
  - Network not added → Prompt user to add network
  - Wrong network → Prompt user to switch
  - RPC timeout → Retry logic
  - Transaction failed → Display error message

### Transaction Signing

- **Signed By**: **MetaMask only** (frontend)
- **Backend Signing**: **NO** - Backend never signs transactions
- **Flow**: User approves in MetaMask → Transaction sent to blockchain → Backend records hash

---

## H) SECURITY, VALIDATION, AND AUDIT

### Input Validation

- **Frontend**:
  - React Hook Form with Zod schema validation
  - File: `src/components/*.tsx` (inline validation)
- **Backend**:
  - express-validator middleware
  - File: `server/src/utils/validators.ts`
  - Applied on all POST/PUT routes

### Rate Limiting

- **Status**: **NOT IMPLEMENTED** (can be added with express-rate-limit)
- **Recommended Routes**: `/api/auth/send-otp`, `/api/auth/verify-otp`

### HTTPS

- **Local Development**: **HTTP only** (http://localhost:3001)
- **Production Deployment**: **HTTPS** (via Vercel for frontend, Railway for backend)

### Data Encryption at Rest

- **Passwords**: Bcrypt hashed (if used)
- **OTP**: Bcrypt hashed
- **Wallet Addresses**: Stored in plaintext (public data)
- **Database**: No full-disk encryption (relies on PostgreSQL server security)

### Audit Logs

**Stored in `audit_logs` table**:

- User login/logout
- OTP verification attempts
- Vote cast (with transaction hash)
- Admin actions (create election, add candidate, etc.)
- System configuration changes

### Session/Capacity Control

- **Feature**: **YES** - Maximum concurrent users
- **Location**: `server/src/routes/admin.ts`
- **Mechanism**:
  - Track active sessions in `system_settings` table
  - Limit configurable by admin
  - Block new logins when capacity reached
  - Display "System at capacity" message

---

## I) END-TO-END FLOWS

### 1. REGISTRATION FLOW

**Frontend → Backend → DB → Email → Frontend → Backend → DB → Wallet Bind**

1. User opens `/register` page
2. User fills form (student ID, name, email, faculty, department)
3. Frontend sends `POST /api/voters/register` with form data
4. Backend validates input
5. Backend checks if student ID/email already exists in `voters` table
6. Backend generates 6-digit OTP
7. Backend hashes OTP with bcrypt
8. Backend stores OTP hash in `voters` table (`email_otp_hash`, `email_otp_expires_at`)
9. Backend calls email service to send OTP
10. Email service sends OTP via SMTP (Gmail/Ethereal)
11. Backend returns success response to frontend
12. Frontend shows OTP input screen
13. User receives email and enters OTP
14. Frontend sends `POST /api/auth/verify-otp` with email and OTP
15. Backend retrieves OTP hash from `voters` table
16. Backend compares entered OTP with stored hash (bcrypt.compare)
17. Backend checks expiration time
18. If valid, backend marks `email_verified = TRUE`
19. Backend generates JWT token
20. Backend returns JWT token to frontend
21. Frontend stores JWT in localStorage
22. Frontend shows "Bind Wallet" screen
23. Frontend triggers MetaMask connection
24. User approves MetaMask connection
25. Frontend receives wallet address
26. Frontend sends `POST /api/voters/bind-wallet` with email and wallet address
27. Backend validates wallet address format
28. Backend checks if wallet already used
29. Backend updates `voters` table: `wallet_address = <address>`
30. Backend returns success
31. Frontend shows "Registration Complete!" message
32. User redirected to homepage

---

### 2. VOTE CASTING FLOW

**Frontend JWT Check → Backend Eligibility → Frontend MetaMask TX → Chain → Backend Record → DB**

1. User navigates to `/vote` page
2. Frontend checks localStorage for JWT token
3. If no token → Redirect to `/login`
4. Frontend sends `GET /api/auth/verify` with JWT token
5. Backend verifies JWT signature and expiration
6. Backend returns user info (email, student ID)
7. Frontend sends `GET /api/voters/student/:studentId`
8. Backend queries `voters` table
9. Backend checks `has_voted` status
10. If `has_voted = TRUE` → Return error "Already voted"
11. If eligible, backend returns voter info
12. Frontend calls smart contract `getAllCategories()`
13. Smart contract returns list of categories
14. For each category, frontend calls `getCandidatesForCategory(categoryId)`
15. Smart contract returns candidates with vote counts
16. Frontend displays categories and candidates
17. User selects one candidate per category
18. User clicks "Submit Vote" button
19. Frontend validates selections (one per category)
20. Frontend calls `contract.batchVote(votes)` via ethers.js
21. MetaMask popup appears
22. User reviews transaction (gas fee, vote details)
23. User clicks "Confirm" in MetaMask
24. MetaMask signs transaction with user's private key
25. Transaction sent to Hoodi blockchain
26. Smart contract receives `batchVote()` call
27. Smart contract validates:
    - Voter is registered
    - Election is active
    - Voter hasn't voted in each category
    - Candidates exist and are active
28. Smart contract increments `voteCount` for each candidate
29. Smart contract marks `votedInCategory[categoryId] = TRUE`
30. Smart contract emits `VoteCast` events
31. Smart contract emits `BatchVoteCast` event
32. Transaction mined and confirmed
33. Frontend receives transaction receipt with hash
34. Frontend sends `POST /api/votes/record` with:
    - studentId
    - votes (categoryId, candidateId)
    - transactionHash
35. Backend validates transaction hash on blockchain
36. Backend updates `voters` table: `has_voted = TRUE`, `voted_at = NOW()`
37. Backend inserts records into `vote_history` table
38. Backend returns success
39. Frontend shows "Vote Successfully Cast!" message
40. Frontend displays transaction hash
41. User redirected to `/my-votes` page

---

### 3. RESULTS VIEWING FLOW

**Frontend Reads from Chain Only (No Backend Aggregation)**

1. User navigates to `/results` page
2. Frontend calls `contract.getAllCategories()`
3. Smart contract returns list of categories
4. For each category:
   a. Frontend calls `contract.getCandidatesForCategory(categoryId)`
   b. Smart contract returns candidates with `voteCount`
5. Frontend calculates:
   - Total votes per category
   - Percentage for each candidate
   - Winner (candidate with most votes)
6. Frontend renders:
   - Bar charts (vote distribution)
   - Pie charts (percentages)
   - Tables (detailed statistics)
   - Winner announcement
7. **No backend involvement** - All data from blockchain

**Alternative (with backend)**:

- Frontend can also call `GET /api/statistics/overview`
- Backend queries `vote_history` table for aggregated stats
- Used for admin dashboard, not public results

---

### 4. ADMIN ELECTION CREATION FLOW

**Admin Creates in DB → Calls Contract to Deploy Election**

1. Admin logs in to `/admin` dashboard
2. Admin navigates to "Create Election" section
3. Admin fills form:
   - Title: "Student Council Election 2026"
   - Description: "Vote for your representatives"
   - Start Date: 2026-01-15
   - End Date: 2026-01-20
4. Admin adds categories:
   - President
   - Vice President
   - Secretary
5. For each category, admin adds candidates:
   - President: Alice (Tech Party), Bob (Innovation Party)
   - VP: Carol (Future Party), Dave (Progress Party)
   - Secretary: Eve (Unity Party), Frank (Change Party)
6. Frontend sends `POST /api/elections` with election data
7. Backend validates input
8. Backend inserts into `elections` table
9. Backend returns election ID
10. Frontend sends `POST /api/categories` for each category
11. Backend inserts into `categories` table
12. Frontend sends `POST /api/candidates` for each candidate
13. Backend inserts into `candidates` table
14. **Frontend calls smart contract** `createElection(title, startTime, endTime)`
15. MetaMask prompts admin to sign transaction
16. Admin approves
17. Smart contract creates election with state = "Created"
18. Smart contract emits `ElectionCreated` event
19. Transaction confirmed
20. Frontend receives transaction receipt
21. **For each category**, frontend calls `contract.createCategory(name, description)`
22. **For each candidate**, frontend calls `contract.addCandidate(categoryId, name, party)`
23. All transactions confirmed
24. Frontend shows "Election Created Successfully!"
25. Admin can now start election when ready

---

## J) CORE FILES REFERENCE FOR CHAPTER 4

### Frontend Pages/Components

```
src/components/HomePage.tsx
src/components/VoterRegistrationPage.tsx
src/components/LoginPage.tsx
src/components/VotePage.tsx
src/components/CastVotePage.tsx
src/components/ResultsPage.tsx
src/components/MyVotesPage.tsx
src/components/AdminDashboard.tsx
src/components/ElectionsPage.tsx
src/components/CategoriesPage.tsx
src/components/SettingsPage.tsx
```

### Backend Route Files

```
server/src/routes/auth.ts
server/src/routes/voters.ts
server/src/routes/elections.ts
server/src/routes/categories.ts
server/src/routes/candidates.ts
server/src/routes/votes.ts
server/src/routes/admin.ts
server/src/routes/statistics.ts
```

### Backend Services

```
server/src/services/email.ts          # Email/OTP service
server/src/utils/otp-helpers.ts       # OTP generation/validation
server/src/utils/jwt-helpers.ts       # JWT token management
server/src/middleware/auth.ts         # JWT verification middleware
```

### Database Schema/Migration

```
server/schema.sql                     # Complete PostgreSQL schema
server/migrations/                    # Migration scripts
```

### Smart Contract

```
src/contracts/VotingSystem.sol        # Main voting contract
```

### Blockchain Interaction Helpers

```
src/lib/contract.ts                   # Contract interaction functions
src/lib/VotingSystemABI.json          # Contract ABI
src/hardhat.config.js                 # Hardhat configuration
scripts/deploy.js                     # Deployment script
```

---

## STACK SUMMARY

| Layer                  | Technology               | Version            |
| ---------------------- | ------------------------ | ------------------ |
| **Frontend**           | Next.js                  | 15.5.4             |
| **Frontend**           | React                    | 19.1.0             |
| **Frontend**           | TypeScript               | 5.x                |
| **Frontend**           | Tailwind CSS             | 4.1.9              |
| **Blockchain Library** | ethers.js                | 6.15.0             |
| **Backend**            | Node.js + Express        | 4.18.2             |
| **Backend**            | TypeScript               | 5.3.3              |
| **Database**           | PostgreSQL               | (Latest)           |
| **DB Client**          | pg (node-postgres)       | 8.11.3             |
| **Smart Contract**     | Solidity                 | 0.8.19             |
| **Blockchain**         | Ethereum (Hoodi Testnet) | -                  |
| **Email**              | Nodemailer               | 7.0.11             |
| **SMTP**               | Gmail                    | -                  |
| **Authentication**     | JWT                      | jsonwebtoken 9.0.2 |
| **Password Hashing**   | bcrypt                   | 5.1.1              |

---

**This document provides complete technical specifications for your FYP Chapter 4 documentation!** 🎉
