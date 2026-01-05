# Use Case Diagram - Detailed Explanation

## Document Information

- **Diagram File**: [use-case-diagram.drawio](file:///c:/Users/shady/Desktop/Implementation-of-a-Secure-Blockchain-Based-E-Voting-System-for-Transparent-Elections-FYP/docs/use-case-diagram.drawio)
- **Status**: ✅ Complete
- **Last Updated**: 2026-01-01
- **Purpose**: Illustrate all functional requirements and user interactions with the e-voting system

---

## Overview

The Use Case Diagram shows **who** uses the system and **what** they can do. It provides a clear, high-level view of the system's functionality from the user's perspective, making it easy for both technical and non-technical stakeholders to understand the system's capabilities.

---

## Actors

The system has **4 primary actors**:

### 1. **Voter (Student)** 👤

**Description**: Registered students who are eligible to vote in elections

**Characteristics**:

- Must register before voting
- Can only vote once per election
- Requires MetaMask wallet for blockchain interaction
- Primary user of the system

**Color Code**: Blue (Light Blue use cases)

---

### 2. **Administrator (Election Officer)** 👨‍💼

**Description**: Authorized personnel who manage elections and system operations

**Characteristics**:

- Has elevated privileges
- Manages entire election lifecycle
- Monitors system activity
- Configures system settings

**Color Code**: Orange (Light Orange use cases)

---

### 3. **System (Automated)** 🤖

**Description**: Automated processes that run without human intervention

**Characteristics**:

- Performs background tasks
- Sends notifications
- Validates data
- Enforces business rules

**Color Code**: Green (Light Green use cases)

---

### 4. **Blockchain (Ethereum)** ⛓️

**Description**: The Ethereum blockchain network (Hoodi Network)

**Characteristics**:

- Stores votes immutably
- Provides transparency
- Ensures data integrity
- Decentralized ledger

**Color Code**: Purple (Light Purple use cases)

---

## Use Cases by Actor

### **VOTER USE CASES** (Blue)

#### 1. Register as Voter

**Description**: New students register to become eligible voters

**Preconditions**:

- User has valid student credentials
- User has access to email
- User has MetaMask wallet

**Main Flow**:

1. User provides student ID, name, email, faculty, department
2. System validates input
3. System sends OTP to email
4. User verifies OTP
5. User binds MetaMask wallet
6. Registration complete

**Postconditions**:

- User record created in database
- Wallet address bound to student identity
- User can now login and vote

**Includes**:

- Verify OTP
- Bind MetaMask Wallet
- Send Email Notification

---

#### 2. Verify OTP

**Description**: Confirm email ownership through one-time password

**Preconditions**:

- User has initiated registration
- OTP sent to user's email

**Main Flow**:

1. User receives 6-digit OTP via email
2. User enters OTP in verification form
3. System validates OTP (correct code, not expired)
4. Verification successful

**Postconditions**:

- Email verified
- User proceeds to wallet binding

---

#### 3. Bind MetaMask Wallet

**Description**: Link blockchain wallet address to voter identity

**Preconditions**:

- User has verified OTP
- User has MetaMask installed
- User has Ethereum wallet

**Main Flow**:

1. System prompts for wallet connection
2. MetaMask popup appears
3. User approves connection
4. System receives wallet address
5. Wallet address stored with voter record

**Postconditions**:

- Wallet address bound to student ID
- User can cast votes using this wallet

---

#### 4. Login to System

**Description**: Authenticate and access the voting platform

**Preconditions**:

- User is registered
- User has valid credentials

**Main Flow**:

1. User provides email/student ID
2. System sends OTP to email
3. User enters OTP
4. System validates and generates JWT token
5. User logged in

**Postconditions**:

- User session created
- JWT token stored
- User can access protected features

---

#### 5. Cast Vote ⭐ (Primary Use Case)

**Description**: Submit vote for a candidate in an active election

**Preconditions**:

- User is logged in
- User is registered
- Election is active
- User has not voted yet
- User has MetaMask connected

**Main Flow**:

1. User views list of candidates
2. User selects preferred candidate
3. User confirms selection
4. MetaMask prompts for transaction approval
5. User approves transaction
6. Vote recorded on blockchain
7. Database updated (has_voted = true)
8. Confirmation displayed

**Postconditions**:

- Vote immutably recorded on blockchain
- User marked as having voted
- Vote count incremented for candidate
- Transaction hash generated

**Includes**:

- Validate Vote Eligibility
- Record Vote on Blockchain

**Exceptions**:

- User already voted → Error message
- Election not active → Cannot vote
- MetaMask not connected → Prompt to connect
- Transaction failed → Retry option

---

#### 6. View Election Results

**Description**: See real-time or final election results

**Preconditions**:

- Election exists
- (Optional) Election has ended for final results

**Main Flow**:

1. User navigates to Results page
2. System queries blockchain for vote counts
3. System calculates statistics (total votes, percentages, winner)
4. Results displayed with charts and tables

**Postconditions**:

- User sees transparent, verifiable results
- Data fetched directly from blockchain

---

#### 7. View Voter Profile

**Description**: Check personal information and voting status

**Preconditions**:

- User is logged in

**Main Flow**:

1. User navigates to Profile page
2. System retrieves user data from database
3. Profile displayed (name, email, faculty, voting status, wallet address)

**Postconditions**:

- User sees their registration details
- User can verify voting status

---

### **ADMINISTRATOR USE CASES** (Orange)

#### 1. Create Election

**Description**: Set up a new election with candidates and schedule

**Preconditions**:

- User has admin privileges
- User is logged in

**Main Flow**:

1. Admin provides election details (title, description, dates)
2. Admin adds candidates (name, party)
3. System validates input
4. System deploys voting smart contract to blockchain
5. Election metadata saved to database
6. Contract address stored

**Postconditions**:

- New election created with "pending" status
- Smart contract deployed on blockchain
- Candidates initialized in contract

---

#### 2. Manage Candidates

**Description**: Add, edit, or remove candidates from an election

**Preconditions**:

- Election exists
- Election has not started yet

**Main Flow**:

1. Admin selects election
2. Admin adds/edits/removes candidates
3. System updates smart contract
4. Database synchronized

**Postconditions**:

- Candidate list updated
- Changes reflected on blockchain

---

#### 3. Start Election

**Description**: Activate an election to allow voting

**Preconditions**:

- Election exists with "pending" status
- Current date/time >= start date
- At least 2 candidates added

**Main Flow**:

1. Admin clicks "Start Election"
2. System validates conditions
3. Election status changed to "active"
4. Voters can now cast votes

**Postconditions**:

- Election status = "active"
- Voting enabled for registered voters

---

#### 4. End Election

**Description**: Close an election and finalize results

**Preconditions**:

- Election is active
- Current date/time >= end date (or manual override)

**Main Flow**:

1. Admin clicks "End Election"
2. System confirms action
3. Election status changed to "ended"
4. Voting disabled
5. Final results calculated

**Postconditions**:

- Election status = "ended"
- No more votes can be cast
- Results finalized

---

#### 5. Monitor System Activity

**Description**: View real-time system metrics and activity logs

**Preconditions**:

- User has admin privileges

**Main Flow**:

1. Admin opens dashboard
2. System displays:
   - Active users
   - Recent votes
   - System capacity
   - OTP activity
   - Error logs

**Postconditions**:

- Admin has visibility into system health

---

#### 6. Manage Voters

**Description**: View, search, and manage voter records

**Preconditions**:

- User has admin privileges

**Main Flow**:

1. Admin opens Voter Management page
2. System displays voter list
3. Admin can:
   - Search voters
   - View voter details
   - Check voting status
   - (Optional) Remove voters

**Postconditions**:

- Admin has oversight of voter database

---

#### 7. Configure System Settings

**Description**: Adjust system parameters and configurations

**Preconditions**:

- User has admin privileges

**Main Flow**:

1. Admin opens Settings page
2. Admin modifies settings:
   - Maximum concurrent users
   - OTP expiration time
   - Email templates
   - Network configuration
3. System saves changes

**Postconditions**:

- System operates with new configuration

---

### **SYSTEM USE CASES** (Green - Automated)

#### 1. Send Email Notification

**Description**: Automatically send emails to users

**Trigger**:

- User registers (OTP email)
- User logs in (OTP email)
- Election starts (notification email)
- Election ends (results email)

**Main Flow**:

1. System generates email content
2. System connects to SMTP server
3. Email sent to recipient
4. Delivery status logged

**Postconditions**:

- User receives email
- Email record saved

---

#### 2. Validate Vote Eligibility

**Description**: Automatically check if user can vote

**Trigger**:

- User attempts to cast vote

**Main Flow**:

1. System checks:
   - Is user registered?
   - Is election active?
   - Has user already voted?
   - Is wallet address bound?
2. System returns eligibility status

**Postconditions**:

- Vote allowed or blocked based on eligibility

---

#### 3. Automatically End Election

**Description**: System ends election when end date/time is reached

**Trigger**:

- Current date/time >= election end date

**Main Flow**:

1. System monitors election schedules
2. When end time reached:
   - Election status changed to "ended"
   - Voting disabled
   - Final results calculated
   - Notification sent to admin

**Postconditions**:

- Election automatically closed
- No manual intervention required

---

### **BLOCKCHAIN USE CASES** (Purple)

#### 1. Record Vote on Blockchain

**Description**: Store vote immutably on Ethereum blockchain

**Trigger**:

- User casts vote

**Main Flow**:

1. Smart contract receives vote transaction
2. Contract validates:
   - Voter hasn't voted before
   - Candidate ID is valid
3. Contract increments candidate vote count
4. Contract marks voter as having voted
5. Contract emits VoteCast event
6. Transaction added to blockchain

**Postconditions**:

- Vote permanently recorded
- Cannot be altered or deleted
- Publicly verifiable on blockchain

---

## Relationships

### **Association** (Solid Lines)

- Connects actors to use cases they can perform
- Example: Voter → Cast Vote

### **Include** (Dashed Lines with <<include>>)

- One use case always includes another
- Example: Register as Voter **includes** Verify OTP
- Meaning: You cannot register without verifying OTP

**Include Relationships in the System**:

1. Register as Voter → Verify OTP
2. Verify OTP → Bind MetaMask Wallet
3. Register as Voter → Send Email Notification
4. Cast Vote → Validate Vote Eligibility
5. Cast Vote → Record Vote on Blockchain

---

## Color Coding

| Color                        | Actor/Category   | Purpose                       |
| ---------------------------- | ---------------- | ----------------------------- |
| **Light Blue**               | Voter Use Cases  | Student/voter functionalities |
| **Light Orange**             | Admin Use Cases  | Administrative functions      |
| **Light Green**              | System Automated | Background processes          |
| **Light Purple**             | Blockchain       | Blockchain-related operations |
| **Dark Blue** (Thick border) | Primary Use Case | Most important: Cast Vote     |

---

## System Boundary

The **large rectangle** labeled "Blockchain-Based E-Voting System" represents the **system boundary**. Everything inside this boundary is part of the system. Actors are outside the boundary because they interact with the system but are not part of it.

---

## Key Insights

### **Voter Journey**:

1. Register as Voter (includes OTP verification and wallet binding)
2. Login to System
3. Cast Vote (includes validation and blockchain recording)
4. View Election Results

### **Admin Journey**:

1. Create Election
2. Manage Candidates
3. Start Election
4. Monitor System Activity
5. End Election
6. View Results

### **System Automation**:

- Sends emails automatically
- Validates votes before recording
- Ends elections on schedule
- No manual intervention needed for routine tasks

### **Blockchain Integration**:

- Every vote goes to blockchain
- Ensures transparency and immutability
- Provides verifiable audit trail

---

## Use Case Statistics

- **Total Use Cases**: 18
- **Voter Use Cases**: 7
- **Admin Use Cases**: 7
- **System Automated**: 3
- **Blockchain**: 1
- **Include Relationships**: 5

---

## Conclusion

This Use Case Diagram provides a comprehensive view of all functional requirements for the blockchain-based e-voting system. It clearly shows:

✅ **Who** uses the system (4 actors)  
✅ **What** they can do (18 use cases)  
✅ **How** use cases relate to each other (include relationships)  
✅ **System boundaries** (what's inside vs outside the system)

The diagram is suitable for:

- **FYP documentation** (shows functional requirements)
- **Stakeholder communication** (easy to understand)
- **Development planning** (defines features to implement)
- **Testing** (each use case = test scenario)

---

**This diagram complements the System Architecture Diagram by showing WHAT the system does, while the architecture shows HOW it's built!** 🎉
