# How to Build Your System Architecture Diagrams Manually

## Quick Start Guide

This guide will help you create professional system architecture diagrams for your blockchain-based e-voting system FYP.

---

## Option 1: Using Draw.io (Recommended for Beginners)

### Step 1: Access Draw.io

1. Go to https://app.diagrams.net/
2. Choose where to save: Device, Google Drive, or OneDrive
3. Click "Create New Diagram"

### Step 2: Create High-Level Architecture

1. **Add Shapes:**

   - Use "Rounded Rectangle" for components
   - Use "Cylinder" for databases
   - Use "Cloud" for blockchain
   - Use "Document" for smart contracts

2. **Organize Layers:**

   - Create 4 horizontal sections (Client, Application, Data, Services)
   - Drag and drop shapes into each section

3. **Add Labels:**

   - Double-click shapes to add text
   - Use clear, concise names

4. **Connect Components:**

   - Use arrows to show data flow
   - Click and drag from one shape to another

5. **Color Code:**
   - Client Layer: Green (#4CAF50)
   - Application Layer: Purple (#9C27B0)
   - Data Layer: Blue (#2196F3)
   - Services: Orange (#FF9800)

### Step 3: Create Flow Diagrams

1. **Voter Flow:**

   - Create vertical flow (top to bottom)
   - Use different colors for each phase
   - Add decision diamonds for conditional logic
   - Number each step (1, 2, 3...)

2. **Admin Flow:**
   - Similar to voter flow
   - Show admin-specific actions
   - Include monitoring and control steps

### Step 4: Export

1. File → Export As → PNG (for images)
2. File → Export As → PDF (for documents)
3. Save with descriptive names

---

## Option 2: Using Mermaid Live Editor

### Step 1: Access Mermaid

1. Go to https://mermaid.live/
2. You'll see a code editor and preview

### Step 2: Copy Diagrams

1. Copy the mermaid code from the architecture guide
2. Paste into the editor
3. See instant preview

### Step 3: Customize

1. Edit text directly in the code
2. Change colors: `style NodeName fill:#COLOR`
3. Add/remove nodes as needed

### Step 4: Export

1. Click "Actions" → "PNG" or "SVG"
2. Download the image

---

## Option 3: Using Microsoft PowerPoint/Word

### Step 1: Open PowerPoint

1. Create new blank presentation
2. Insert → Shapes

### Step 2: Build Architecture

1. **Use SmartArt:**

   - Insert → SmartArt → Process or Hierarchy
   - Choose appropriate layout

2. **Or Manual Shapes:**

   - Insert → Shapes → Rectangles
   - Arrange in layers
   - Add text boxes

3. **Add Arrows:**
   - Insert → Shapes → Arrows
   - Connect components

### Step 3: Format

1. Right-click shapes → Format Shape
2. Apply colors and effects
3. Group related items: Select all → Right-click → Group

### Step 4: Export

1. File → Save As → PNG or PDF
2. Or right-click diagram → Save as Picture

---

## What to Include in Each Diagram

### 1. High-Level Architecture Diagram

**Components to show:**

- ✅ Voter Interface (web browser)
- ✅ Admin Dashboard
- ✅ MetaMask Wallet
- ✅ Frontend (React)
- ✅ Backend API (Express)
- ✅ PostgreSQL Database
- ✅ Blockchain Network (Hoodi)
- ✅ Smart Contract
- ✅ Email Service

**Connections to show:**

- Voter/Admin → Frontend
- Frontend → Backend API
- Frontend → MetaMask → Smart Contract
- Backend API → Database
- Backend API → Email Service
- Smart Contract → Blockchain

### 2. Voter Flow Diagram

**Phases to show:**

1. **Account Creation**

   - Enter details
   - Receive OTP

2. **Email Verification**

   - Enter OTP
   - Verify email

3. **Wallet Registration**

   - Connect MetaMask
   - Register on blockchain
   - Save to database

4. **Voting**

   - View candidates
   - Select choices
   - Submit to blockchain
   - Record in database

5. **Verification**
   - View receipts
   - Verify transaction

### 3. Admin Flow Diagram

**Phases to show:**

1. Admin Login (MetaMask)
2. Election Setup
3. Category Setup
4. Candidate Setup
5. Start Election
6. Monitor Voting
7. End Election
8. View Results

### 4. Data Flow Diagram

**Show three paths:**

1. **Blockchain Path:**

   - User → Frontend → MetaMask → Smart Contract → Blockchain

2. **Database Path:**

   - User → Frontend → Backend API → PostgreSQL

3. **Combined Path:**
   - Both systems → Results Display

---

## Design Tips

### Colors

- **Green**: User-facing components, success states
- **Blue**: Data storage, databases
- **Purple**: Application logic, processing
- **Orange**: External services
- **Yellow**: Blockchain, smart contracts
- **Red**: Admin functions, critical operations

### Layout

- **Top to Bottom**: For sequential flows (voter journey)
- **Left to Right**: For data flow
- **Layered**: For system architecture (client → app → data)

### Labels

- Keep text short and clear
- Use consistent naming
- Add icons when possible
- Number steps in flows

### Arrows

- **Solid**: Main data flow
- **Dashed**: API calls
- **Dotted**: Optional or return flow
- **Thick**: High-volume data
- **Thin**: Control signals

---

## Component Descriptions for Your Diagrams

### Client Layer

- **Voter Interface**: Web browser accessing the voting system
- **Admin Dashboard**: Administrative control panel
- **MetaMask**: Cryptocurrency wallet for blockchain authentication

### Application Layer

- **Frontend**: React application built with Vite
- **Backend API**: Express.js server handling requests

### Data Layer

- **PostgreSQL**: Relational database storing user data, elections, votes
- **Blockchain**: Hoodi testnet storing immutable vote records
- **Smart Contract**: Solidity contract managing voting logic

### Services

- **Email Service**: Nodemailer sending OTP verification emails

---

## Step-by-Step: Creating Your First Diagram

### Example: Simple Voter Flow

1. **Open Draw.io**
2. **Add Start Shape:**

   - Drag "Rounded Rectangle"
   - Label: "Voter visits website"
   - Color: Light green

3. **Add Next Step:**

   - Drag another "Rounded Rectangle" below
   - Label: "Create account"
   - Color: Green

4. **Connect:**

   - Click first shape
   - Drag arrow to second shape

5. **Continue Adding Steps:**

   - Email verification
   - Wallet registration
   - Voting
   - Confirmation

6. **Add Decision Points:**

   - Use "Diamond" shape for "Email verified?"
   - Two arrows: "Yes" → Continue, "No" → Retry

7. **Format:**

   - Align shapes: Select all → Arrange → Align → Center
   - Distribute evenly: Arrange → Distribute → Vertically

8. **Export:**
   - File → Export As → PNG
   - Save as "voter_flow.png"

---

## Common Mistakes to Avoid

❌ **Too much detail** - Keep it high-level and clear
❌ **Inconsistent naming** - Use same terms throughout
❌ **Missing connections** - Show all important data flows
❌ **Poor color choices** - Use professional, contrasting colors
❌ **Cluttered layout** - Leave white space, organize clearly
❌ **No labels** - Always label components and arrows

✅ **Do this instead:**

- Focus on main components
- Use consistent terminology
- Show clear data paths
- Use professional color palette
- Organize in clear sections
- Label everything clearly

---

## Templates You Can Use

### Template 1: Layered Architecture

```
┌─────────────────────────────────────┐
│        CLIENT LAYER (Green)         │
│  [Voter] [Admin] [MetaMask]         │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│     APPLICATION LAYER (Purple)      │
│    [Frontend] [Backend API]         │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│        DATA LAYER (Blue)            │
│  [PostgreSQL] [Blockchain] [SC]     │
└─────────────────────────────────────┘
```

### Template 2: Sequential Flow

```
[Step 1] → [Step 2] → [Step 3]
   ↓          ↓          ↓
[Action]   [Action]   [Action]
```

### Template 3: Data Flow

```
[User Input] → [Validation] → [Processing] → [Storage]
                                    ↓
                              [Confirmation]
```

---

## Resources

### Free Tools

- **Draw.io**: https://app.diagrams.net/
- **Mermaid Live**: https://mermaid.live/
- **Lucidchart Free**: https://www.lucidchart.com/
- **Canva**: https://www.canva.com/ (has diagram templates)

### Icons

- **Flaticon**: https://www.flaticon.com/
- **Icons8**: https://icons8.com/
- **Font Awesome**: https://fontawesome.com/

### Color Palettes

- **Coolors**: https://coolors.co/
- **Adobe Color**: https://color.adobe.com/

### Tutorials

- Draw.io Tutorial: Search "Draw.io tutorial" on YouTube
- Mermaid Documentation: https://mermaid.js.org/

---

## Quick Reference: Your System Components

### Voters Connect To:

1. Frontend (http://localhost:5173)
2. MetaMask Wallet
3. Backend API (via Frontend)
4. Smart Contract (via Frontend)

### Admins Connect To:

1. Admin Dashboard (http://localhost:5173/admin)
2. MetaMask Wallet
3. Backend API (via Frontend)
4. Smart Contract (via Frontend)
5. PostgreSQL (via Backend)

### Data Flows:

1. **Registration**: Frontend → API → Database + Blockchain
2. **Voting**: Frontend → Smart Contract → Blockchain + API → Database
3. **Results**: Blockchain + Database → API → Frontend

---

## Need Help?

If you get stuck:

1. Start with the simplest diagram (high-level architecture)
2. Use the mermaid diagrams from the architecture guide as reference
3. Copy the visual diagrams I generated as templates
4. Focus on clarity over complexity
5. Ask for feedback before finalizing

Good luck with your diagrams! 🎨
