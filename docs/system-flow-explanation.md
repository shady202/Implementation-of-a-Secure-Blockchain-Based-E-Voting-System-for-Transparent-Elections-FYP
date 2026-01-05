# E-Voting System: Complete User Flow Explanation

## Overview

This document explains the **complete flow** of how users interact with the blockchain-based e-voting system, from start to finish, going through all 6 layers of the architecture.

---

## The 6 Layers of the System

1. **LAYER 1: CLIENT LAYER** - Where users interact (browser, phone, MetaMask)
2. **LAYER 2: PRESENTATION LAYER** - The user interface (Next.js, React)
3. **LAYER 3: APPLICATION LAYER** - The backend server (Node.js, Express)
4. **LAYER 4: BLOCKCHAIN LAYER** - The voting smart contract (Ethereum)
5. **LAYER 5: DATA LAYER** - The database (PostgreSQL)
6. **LAYER 6: EXTERNAL SERVICES** - Email and blockchain network access

---

## SCENARIO 1: Voter Registration Flow

### Step-by-Step Journey Through All Layers

#### **LAYER 1: CLIENT LAYER** (User starts here)

1. **User opens web browser** (Chrome, Firefox, or Edge)
2. User navigates to the e-voting website: `http://localhost:3000` or `http://192.168.x.x:3000`
3. User sees the homepage and clicks **"Register"** button

---

#### **LAYER 2: PRESENTATION LAYER** (Frontend)

4. Browser loads the **RegistrationPage** (React component)
5. User sees a registration form with fields:
   - Student ID
   - Name
   - Email
   - Faculty
   - Department
6. User fills in all the information
7. User clicks **"Submit"** button
8. **Next.js** validates the input on the client side (checks if fields are empty, email format is correct)
9. If validation passes, Next.js sends an **HTTP POST request** to the backend:
   ```
   POST http://localhost:5000/api/voters/register
   Body: {
     studentId: "12345",
     name: "John Doe",
     email: "john@example.com",
     faculty: "computing",
     department: "Software Engineering"
   }
   ```

---

#### **LAYER 3: APPLICATION LAYER** (Backend Server)

10. **Express server** receives the registration request at `/api/voters/register`
11. Server validates the data again (server-side validation):
    - Checks if all required fields are present
    - Sanitizes input to prevent SQL injection
    - Validates email format
12. Server checks **LAYER 5 (Database)** to see if the student ID or email already exists
13. If student already exists → Server sends error response back to frontend
14. If student is new → Server generates a **6-digit OTP** (One-Time Password):
    ```javascript
    OTP = crypto.randomInt(100000, 999999); // Example: 456789
    ```
15. Server saves the OTP to **LAYER 5 (Database)** in the `otp_records` table with:
    - Email address
    - Hashed OTP
    - Expiration time (10 minutes from now)
16. Server calls **LAYER 6 (Email Service)** to send the OTP to the user's email

---

#### **LAYER 6: EXTERNAL SERVICES** (Email)

17. **Email Service** (Nodemailer) connects to **SMTP server** (Ethereal or Gmail)
18. Email service sends an email to the user:
    ```
    Subject: E-Voting System - OTP Verification
    Body: Your OTP is: 456789
          This OTP will expire in 10 minutes.
    ```
19. Email is delivered to the user's inbox

---

#### **LAYER 2: PRESENTATION LAYER** (Frontend - OTP Entry)

20. User receives the email and opens it
21. Frontend shows **OTP verification screen**
22. User enters the 6-digit OTP: `456789`
23. User clicks **"Verify OTP"** button
24. Frontend sends another **HTTP POST request** to backend:
    ```
    POST http://localhost:5000/api/auth/verify-otp
    Body: {
      email: "john@example.com",
      otp: "456789"
    }
    ```

---

#### **LAYER 3: APPLICATION LAYER** (OTP Verification)

25. Server receives OTP verification request
26. Server queries **LAYER 5 (Database)** to find the OTP record for this email
27. Server checks:
    - Does the OTP match? (compares hashed values)
    - Has it expired? (checks if current time < expiration time)
    - Has it been used already?
28. If OTP is valid → Server marks it as verified in the database
29. Server sends success response to frontend

---

#### **LAYER 2: PRESENTATION LAYER** (Wallet Binding)

30. Frontend receives OTP verification success
31. Frontend shows **"Bind Your Wallet"** screen
32. Frontend triggers **MetaMask** (from LAYER 1)
33. **MetaMask popup** appears asking user to connect their wallet
34. User clicks **"Connect"** in MetaMask
35. MetaMask provides the wallet address (e.g., `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`)
36. Frontend sends **final registration request** to backend:
    ```
    POST http://localhost:5000/api/voters/bind-wallet
    Body: {
      email: "john@example.com",
      walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
    }
    ```

---

#### **LAYER 3: APPLICATION LAYER** (Save Registration)

37. Server receives wallet binding request
38. Server validates the wallet address format
39. Server checks **LAYER 5 (Database)** to ensure wallet address is not already used by another voter

---

#### **LAYER 5: DATA LAYER** (Database)

40. Server inserts a new record into the `voters` table:
    ```sql
    INSERT INTO voters (student_id, name, email, wallet_address, faculty, department, registration_status)
    VALUES ('12345', 'John Doe', 'john@example.com', '0x742d35...', 'computing', 'Software Engineering', true);
    ```
41. Database saves the record and confirms success

---

#### **LAYER 3: APPLICATION LAYER** (Response)

42. Server receives database confirmation
43. Server generates a **JWT token** for the user:
    ```javascript
    token = jwt.sign(
      { studentId: "12345", email: "john@example.com" },
      SECRET_KEY,
      { expiresIn: "24h" }
    );
    ```
44. Server sends success response to frontend with the token

---

#### **LAYER 2: PRESENTATION LAYER** (Success)

45. Frontend receives success response
46. Frontend stores the JWT token in browser's local storage
47. Frontend shows **"Registration Successful!"** message
48. Frontend redirects user to the **HomePage**

---

#### **LAYER 1: CLIENT LAYER** (User sees result)

49. User sees success message on their screen
50. User is now registered and can vote!

---

## SCENARIO 2: Voting Flow

### Step-by-Step Journey Through All Layers

#### **LAYER 1: CLIENT LAYER** (User starts)

1. **Registered user** opens the e-voting website
2. User clicks **"Vote Now"** button

---

#### **LAYER 2: PRESENTATION LAYER** (Login Check)

3. Frontend checks if user has a valid **JWT token** in local storage
4. If no token → Redirect to login page
5. If token exists → Frontend sends it to backend for verification:
   ```
   GET http://localhost:5000/api/auth/verify
   Headers: { Authorization: "Bearer <JWT_TOKEN>" }
   ```

---

#### **LAYER 3: APPLICATION LAYER** (Authentication)

6. Server receives authentication request
7. Server verifies the JWT token:
   - Checks if token is valid
   - Checks if token has expired
   - Extracts user information (student ID, email)
8. Server queries **LAYER 5 (Database)** to check:
   - Is this user registered?
   - Has this user already voted?

---

#### **LAYER 5: DATA LAYER** (Check Voting Status)

9. Database queries the `voters` table:
   ```sql
   SELECT has_voted, wallet_address FROM voters WHERE student_id = '12345';
   ```
10. Database returns: `has_voted = false` (user hasn't voted yet)

---

#### **LAYER 3: APPLICATION LAYER** (Authorization)

11. Server confirms user is eligible to vote
12. Server sends success response to frontend

---

#### **LAYER 2: PRESENTATION LAYER** (Load Candidates)

13. Frontend receives authorization success
14. Frontend loads the **VotePage** component
15. Frontend needs to get the list of candidates from the blockchain
16. Frontend uses **Web3.js** to call the smart contract:
    ```javascript
    const candidates = await votingContract.methods.getCandidates().call();
    ```

---

#### **LAYER 4: BLOCKCHAIN LAYER** (Get Candidates)

17. **Web3.js** sends a request through **MetaMask** to the **Hoodi Network**
18. Request goes through **LAYER 6 (RPC Provider)** to access the blockchain
19. **Smart contract** executes the `getCandidates()` function
20. Smart contract returns array of candidates:
    ```javascript
    [
      { id: 1, name: "Alice Johnson", party: "Tech Party", voteCount: 0 },
      { id: 2, name: "Bob Smith", party: "Innovation Party", voteCount: 0 },
      { id: 3, name: "Carol White", party: "Future Party", voteCount: 0 },
    ];
    ```

---

#### **LAYER 6: EXTERNAL SERVICES** (RPC Provider)

21. RPC provider retrieves the data from the blockchain
22. RPC provider sends the data back to Web3.js

---

#### **LAYER 2: PRESENTATION LAYER** (Display Candidates)

23. Frontend receives the candidate list
24. Frontend displays candidates as cards or list on the screen
25. User sees all candidates with their names and parties

---

#### **LAYER 1: CLIENT LAYER** (User Makes Choice)

26. User reads through the candidates
27. User clicks on **"Vote for Alice Johnson"** button

---

#### **LAYER 2: PRESENTATION LAYER** (Confirm Vote)

28. Frontend shows a confirmation dialog: "Are you sure you want to vote for Alice Johnson?"
29. User clicks **"Confirm"**
30. Frontend prepares to send the vote to the blockchain
31. Frontend calls **MetaMask** to sign the transaction:
    ```javascript
    await votingContract.methods.castVote(1).send({ from: userWalletAddress });
    ```

---

#### **LAYER 1: CLIENT LAYER** (MetaMask Popup)

32. **MetaMask popup** appears on the user's screen
33. MetaMask shows transaction details:
    - Contract: Voting Contract
    - Function: castVote(1)
    - Gas Fee: 0.0001 ETH (example)
34. User clicks **"Confirm"** in MetaMask
35. MetaMask signs the transaction with the user's private key

---

#### **LAYER 4: BLOCKCHAIN LAYER** (Record Vote)

36. Signed transaction is sent to the **Hoodi Network** through **LAYER 6 (RPC Provider)**
37. **Smart contract** receives the `castVote(1)` transaction
38. Smart contract executes the function:
    ```solidity
    function castVote(uint candidateId) public {
        require(!hasVoted[msg.sender], "You have already voted");
        require(candidateId > 0 && candidateId <= candidatesCount, "Invalid candidate");

        candidates[candidateId].voteCount++;
        hasVoted[msg.sender] = true;

        emit VoteCast(msg.sender, candidateId);
    }
    ```
39. Smart contract checks:
    - Has this wallet address voted before? → No
    - Is the candidate ID valid? → Yes (ID = 1 is Alice)
40. Smart contract increments Alice's vote count: `voteCount = 1`
41. Smart contract marks the wallet address as having voted: `hasVoted[0x742d35...] = true`
42. Smart contract emits a **VoteCast event**:
    ```
    Event: VoteCast
    Data: {
      voter: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      candidateId: 1
    }
    ```
43. Transaction is added to a new block on the blockchain
44. Block is mined and confirmed (takes ~15 seconds)

---

#### **LAYER 6: EXTERNAL SERVICES** (RPC Provider)

45. RPC provider confirms the transaction was successful
46. RPC provider returns transaction receipt with transaction hash:
    ```
    txHash: "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b"
    ```

---

#### **LAYER 2: PRESENTATION LAYER** (Update UI)

47. Frontend receives transaction confirmation
48. Frontend sends a request to backend to update the database:
    ```
    POST http://localhost:5000/api/votes/record
    Body: {
      studentId: "12345",
      candidateId: 1,
      transactionHash: "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b"
    }
    ```

---

#### **LAYER 3: APPLICATION LAYER** (Update Database)

49. Server receives vote recording request
50. Server validates the transaction hash by checking the blockchain
51. Server updates **LAYER 5 (Database)**

---

#### **LAYER 5: DATA LAYER** (Save Vote Record)

52. Database updates the `voters` table:
    ```sql
    UPDATE voters SET has_voted = true WHERE student_id = '12345';
    ```
53. Database inserts a record into `vote_history` table:
    ```sql
    INSERT INTO vote_history (voter_id, candidate_id, transaction_hash, voted_at)
    VALUES ('12345', 1, '0x9fc76417...', NOW());
    ```
54. Database confirms the updates

---

#### **LAYER 3: APPLICATION LAYER** (Confirm)

55. Server receives database confirmation
56. Server sends success response to frontend

---

#### **LAYER 2: PRESENTATION LAYER** (Success Message)

57. Frontend receives success response
58. Frontend shows **"Vote Successfully Cast!"** message
59. Frontend displays the transaction hash as proof
60. Frontend disables the voting buttons (user can't vote again)

---

#### **LAYER 1: CLIENT LAYER** (User Sees Result)

61. User sees success message on screen
62. User sees their vote has been recorded
63. User can now view the results!

---

## SCENARIO 3: Viewing Results Flow

### Step-by-Step Journey Through All Layers

#### **LAYER 1: CLIENT LAYER** (User starts)

1. User clicks **"View Results"** button on the website

---

#### **LAYER 2: PRESENTATION LAYER** (Load Results Page)

2. Frontend loads the **ResultsPage** component
3. Frontend needs to get vote counts from the blockchain
4. Frontend uses **Web3.js** to call smart contract functions:
   ```javascript
   const candidate1Votes = await votingContract.methods.getVoteCount(1).call();
   const candidate2Votes = await votingContract.methods.getVoteCount(2).call();
   const candidate3Votes = await votingContract.methods.getVoteCount(3).call();
   ```

---

#### **LAYER 4: BLOCKCHAIN LAYER** (Get Vote Counts)

5. **Smart contract** executes `getVoteCount()` for each candidate
6. Smart contract returns the vote counts:
   - Candidate 1 (Alice): 45 votes
   - Candidate 2 (Bob): 32 votes
   - Candidate 3 (Carol): 23 votes

---

#### **LAYER 6: EXTERNAL SERVICES** (RPC Provider)

7. RPC provider retrieves the data from blockchain
8. RPC provider sends data back to Web3.js

---

#### **LAYER 2: PRESENTATION LAYER** (Calculate & Display)

9. Frontend receives all vote counts
10. Frontend calculates:
    - Total votes: 45 + 32 + 23 = 100
    - Percentages: Alice (45%), Bob (32%), Carol (23%)
    - Winner: Alice Johnson
11. Frontend renders:
    - **Bar chart** showing vote distribution
    - **Pie chart** showing percentages
    - **Table** with detailed statistics
    - **Winner announcement**

---

#### **LAYER 1: CLIENT LAYER** (User Sees Results)

12. User sees the complete election results
13. User can verify their vote was counted by checking the blockchain transaction hash

---

## SCENARIO 4: Admin Creates Election Flow

### Step-by-Step Journey Through All Layers

#### **LAYER 1: CLIENT LAYER** (Admin starts)

1. **Admin** logs into the system with admin credentials
2. Admin navigates to **Admin Dashboard**

---

#### **LAYER 2: PRESENTATION LAYER** (Admin Dashboard)

3. Frontend loads **AdminDashboard** component
4. Admin sees the **"Create Election"** section
5. Admin fills in election details:
   - Title: "Student Council Election 2026"
   - Description: "Vote for your student representatives"
   - Start Date: 2026-01-15
   - End Date: 2026-01-20
6. Admin adds candidates:
   - Alice Johnson - Tech Party
   - Bob Smith - Innovation Party
   - Carol White - Future Party
7. Admin clicks **"Create Election"** button
8. Frontend sends request to backend:
   ```
   POST http://localhost:5000/api/elections/create
   Body: {
     title: "Student Council Election 2026",
     description: "Vote for your student representatives",
     startDate: "2026-01-15",
     endDate: "2026-01-20",
     candidates: [
       { name: "Alice Johnson", party: "Tech Party" },
       { name: "Bob Smith", party: "Innovation Party" },
       { name: "Carol White", party: "Future Party" }
     ]
   }
   ```

---

#### **LAYER 3: APPLICATION LAYER** (Process Election Creation)

9. Server receives election creation request
10. Server validates admin permissions (checks JWT token)
11. Server validates election data (dates, candidate info)
12. Server saves election metadata to **LAYER 5 (Database)**

---

#### **LAYER 5: DATA LAYER** (Save Election)

13. Database inserts election record:
    ```sql
    INSERT INTO elections (title, description, start_date, end_date, status)
    VALUES ('Student Council Election 2026', 'Vote for...', '2026-01-15', '2026-01-20', 'pending');
    ```
14. Database returns the new election ID: `election_id = 1`

---

#### **LAYER 3: APPLICATION LAYER** (Deploy Smart Contract)

15. Server needs to deploy the voting smart contract to the blockchain
16. Server uses **Web3.js** to deploy the contract with the candidates

---

#### **LAYER 4: BLOCKCHAIN LAYER** (Deploy Contract)

17. Smart contract is deployed to **Hoodi Network**
18. Contract constructor initializes candidates:
    ```solidity
    constructor() {
        addCandidate("Alice Johnson", "Tech Party");
        addCandidate("Bob Smith", "Innovation Party");
        addCandidate("Carol White", "Future Party");
    }
    ```
19. Blockchain confirms deployment and returns contract address:
    ```
    contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    ```

---

#### **LAYER 6: EXTERNAL SERVICES** (RPC Provider)

20. RPC provider handles the contract deployment transaction
21. RPC provider confirms deployment success

---

#### **LAYER 3: APPLICATION LAYER** (Update Database with Contract Address)

22. Server receives contract address from blockchain
23. Server updates **LAYER 5 (Database)**

---

#### **LAYER 5: DATA LAYER** (Update Election)

24. Database updates election record:
    ```sql
    UPDATE elections SET contract_address = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    WHERE election_id = 1;
    ```

---

#### **LAYER 3: APPLICATION LAYER** (Send Response)

25. Server sends success response to frontend

---

#### **LAYER 2: PRESENTATION LAYER** (Show Success)

26. Frontend receives success response
27. Frontend shows **"Election Created Successfully!"** message
28. Frontend displays the contract address for verification

---

#### **LAYER 1: CLIENT LAYER** (Admin Sees Result)

29. Admin sees success message
30. Admin can now start the election when ready!

---

## Summary: How Data Flows Through All Layers

### **User Action → Frontend → Backend → Database/Blockchain → Response**

```
LAYER 1 (Client)
    ↓ User clicks button
LAYER 2 (Frontend)
    ↓ Sends HTTP request
LAYER 3 (Backend)
    ↓ Processes request
    ├→ LAYER 5 (Database) - Saves/retrieves data
    └→ LAYER 4 (Blockchain) - Records votes
         ↓ Uses LAYER 6 (RPC Provider)
LAYER 3 (Backend)
    ↓ Sends response
LAYER 2 (Frontend)
    ↓ Updates UI
LAYER 1 (Client)
    ✓ User sees result
```

---

## Key Takeaways

1. **Every user action starts at LAYER 1** (browser, phone)
2. **LAYER 2 (Frontend)** handles the user interface and sends requests
3. **LAYER 3 (Backend)** processes business logic and coordinates between database and blockchain
4. **LAYER 4 (Blockchain)** stores votes immutably
5. **LAYER 5 (Database)** stores user data and metadata
6. **LAYER 6 (External Services)** helps with email and blockchain access

The system is designed so that:

- **Votes are stored on blockchain** (can't be changed or deleted)
- **User data is stored in database** (fast queries and management)
- **Everything is secure** with encryption, authentication, and validation at every layer

---

**This is the complete flow of your e-voting system!** 🎉
