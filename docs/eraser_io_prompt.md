# Eraser.io Prompt for Blockchain E-Voting System Architecture

## Copy and Paste This Into Eraser.io

```
Create a system architecture diagram for a blockchain-based e-voting system.

// Client Layer
group Client Layer {
  VoterInterface [icon: monitor, label: "Voter Interface\n(Web Browser)"]
  AdminDashboard [icon: settings, label: "Admin Dashboard\n(Control Panel)"]
  MetaMask [icon: wallet, label: "MetaMask Wallet\n(Authentication)"]
}

// Application Layer
group Application Layer {
  Frontend [icon: react, label: "Frontend\nReact + Vite"]
  BackendAPI [icon: server, label: "Backend API\nExpress.js + Node.js"]
}

// Data Layer
group Data Layer {
  PostgreSQL [icon: database, label: "PostgreSQL\n(User Data, Elections)"]
  Blockchain [icon: link, label: "Blockchain\nHoodi Testnet"]
  SmartContract [icon: file-code, label: "Smart Contract\nVotingSystem.sol"]
}

// External Services
group External Services {
  EmailService [icon: mail, label: "Email Service\nNodemailer (OTP)"]
}

// Connections
VoterInterface --> Frontend
AdminDashboard --> Frontend
MetaMask --> Frontend

Frontend --> BackendAPI
Frontend --> MetaMask

BackendAPI --> PostgreSQL
BackendAPI --> EmailService

MetaMask --> SmartContract
SmartContract --> Blockchain

// Styling
Client Layer [color: green]
Application Layer [color: purple]
Data Layer [color: blue]
External Services [color: orange]
```

---

## Alternative: Detailed Flow Diagram for Eraser.io

```
// Voter Registration Flow
VoterStart [shape: oval, label: "Voter Starts"]
CreateAccount [label: "Create Account\n(Student ID, Email, Password)"]
SendOTP [label: "System Sends OTP"]
VerifyEmail [label: "Verify Email with OTP"]
ConnectWallet [label: "Connect MetaMask Wallet"]
RegisterBlockchain [label: "Register on Blockchain"]
SaveDatabase [label: "Save to Database"]
RegistrationComplete [shape: oval, label: "Registration Complete"]

VoterStart --> CreateAccount
CreateAccount --> SendOTP
SendOTP --> VerifyEmail
VerifyEmail --> ConnectWallet
ConnectWallet --> RegisterBlockchain
RegisterBlockchain --> SaveDatabase
SaveDatabase --> RegistrationComplete

// Voting Flow
VotingStart [shape: oval, label: "Voting Starts"]
ViewCandidates [label: "View Candidates"]
SelectChoices [label: "Select Candidates"]
SubmitVote [label: "Submit to Blockchain"]
RecordDB [label: "Record in Database"]
ShowReceipt [label: "Show Vote Receipt"]
VotingEnd [shape: oval, label: "Vote Confirmed"]

VotingStart --> ViewCandidates
ViewCandidates --> SelectChoices
SelectChoices --> SubmitVote
SubmitVote --> RecordDB
RecordDB --> ShowReceipt
ShowReceipt --> VotingEnd

// Styling
CreateAccount [color: lightblue]
VerifyEmail [color: blue]
RegisterBlockchain [color: purple]
SubmitVote [color: green]
```

---

## Component Interaction Diagram for Eraser.io

```
// Components
Voter [icon: user, shape: actor]
Admin [icon: user-shield, shape: actor]
Frontend [icon: react]
MetaMask [icon: wallet]
BackendAPI [icon: server]
Database [icon: database]
SmartContract [icon: file-code]
Blockchain [icon: link]
Email [icon: mail]

// Voter Flow
Voter --> Frontend: "Access System"
Frontend --> MetaMask: "Connect Wallet"
MetaMask --> SmartContract: "Sign Transaction"
SmartContract --> Blockchain: "Record Vote"
Frontend --> BackendAPI: "API Call"
BackendAPI --> Database: "Store Data"
BackendAPI --> Email: "Send OTP"

// Admin Flow
Admin --> Frontend: "Manage Election"
Frontend --> BackendAPI: "Create Election"
BackendAPI --> Database: "Save Election"
Frontend --> SmartContract: "Deploy on Chain"
SmartContract --> Blockchain: "Store Immutable"

// Styling
Voter [color: green]
Admin [color: blue]
Frontend [color: purple]
SmartContract [color: gold]
Blockchain [color: orange]
```

---

## Data Flow Diagram for Eraser.io

```
// User Actions
UserRegistration [shape: process, label: "User Registration"]
CastVote [shape: process, label: "Cast Vote"]
ViewResults [shape: process, label: "View Results"]

// Processing
ValidateInput [shape: process, label: "Validate Input"]
SignTransaction [shape: process, label: "MetaMask Signs"]
ProcessContract [shape: process, label: "Smart Contract"]
APIProcess [shape: process, label: "Backend API"]

// Storage
BlockchainStorage [shape: datastore, label: "Blockchain\n(Immutable)"]
DatabaseStorage [shape: datastore, label: "PostgreSQL\n(Queryable)"]

// Flows
UserRegistration --> ValidateInput
ValidateInput --> SignTransaction
SignTransaction --> ProcessContract
ProcessContract --> BlockchainStorage

ValidateInput --> APIProcess
APIProcess --> DatabaseStorage

CastVote --> ValidateInput
ViewResults --> BlockchainStorage
ViewResults --> DatabaseStorage

// Styling
UserRegistration [color: green]
CastVote [color: blue]
ProcessContract [color: purple]
BlockchainStorage [color: gold]
DatabaseStorage [color: lightblue]
```

---

## Quick Start Guide for Eraser.io

1. **Go to**: https://app.eraser.io/
2. **Create new diagram**
3. **Choose**: "Diagram as Code"
4. **Paste** any of the prompts above
5. **Click**: "Generate" or "Render"
6. **Customize**: Colors, layout, labels
7. **Export**: PNG, SVG, or PDF

## Eraser.io Syntax Quick Reference

- `ComponentName [icon: iconname, label: "Display Text"]` - Create component
- `group GroupName { ... }` - Group components
- `A --> B` - Arrow from A to B
- `A <--> B` - Bidirectional arrow
- `[color: colorname]` - Set color
- `[shape: oval/process/datastore/actor]` - Set shape
- `// Comment` - Add comments

## Tips for Best Results

1. Start with the **system architecture** prompt
2. Then create **voter flow** and **admin flow** separately
3. Use **consistent colors** across diagrams
4. Export in **high resolution** for FYP documentation
5. Customize labels to match your exact implementation

## Color Scheme Recommendations

- **Green**: User-facing, voter actions
- **Blue**: Admin functions, databases
- **Purple**: Application logic
- **Orange/Gold**: Blockchain, smart contracts
- **Light Blue**: Data processing, verification
