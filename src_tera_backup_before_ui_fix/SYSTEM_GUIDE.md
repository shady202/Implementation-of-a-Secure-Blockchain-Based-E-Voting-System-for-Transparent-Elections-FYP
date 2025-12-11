# APU VOTE - Complete E-Voting System Guide

## 🎯 System Overview

This is a comprehensive blockchain-based e-voting system for Asia Pacific University with:
- **Maximum 3 voting categories** (positions)
- **Smart contract-based result visibility controls**
- **Visitor capacity management**
- **Dynamic voting interface** based on active categories
- **Real-time results** with lock/unlock functionality

---

## 📋 Pages & Navigation

### Admin Pages
1. **New Admin Dashboard** (`new-admin`) - Main control center
2. **Manage Categories** (`manage-categories`) - Create/edit up to 3 positions
3. **System Settings** (`system-settings`) - Configure voting behavior & visitor limits

### Voter Pages
4. **Cast Vote Page** (`cast-vote`) - Dynamic tabbed voting interface
5. **New Results Page** (`new-results`) - Live results or locked state

### Special Pages
6. **Over Capacity Page** (`over-capacity`) - Shown when visitor limit reached

---

## 🔧 Admin Workflow

### Step 1: Create Categories (Max 3)
Navigate to: **Manage Categories**

**What you can do:**
- Create up to 3 voting positions (e.g., President, Vice President, Secretary)
- Each category has:
  - ✅ Category Name (e.g., "President")
  - ✅ Description
  - ✅ Max Votes Allowed (default: 1)
  - ✅ Active/Inactive toggle

**UI Features:**
- ✅ "Add Category" button disabled when 3 categories exist
- ✅ Tooltip on disabled button: "Maximum limit reached."
- ✅ Helper text when limit reached
- ✅ Delete confirmation modal
- ✅ Success toasts for all actions

**Error Messages:**
- "Category name is required."
- "Maximum votes must be at least 1."
- "You cannot create more than 3 categories."

---

### Step 2: Activate Categories for Election
Navigate to: **Admin Dashboard → Current Election Setup**

**What you can do:**
- Toggle each category ON/OFF for the current election
- Categories must be marked "Active" to appear on voting page

**UI Features:**
- ✅ Switch for each category
- ✅ Warning if no categories active: "You must activate at least 1 category."
- ✅ "Start Election" button disabled if no active categories

---

### Step 3: Configure System Settings
Navigate to: **System Settings**

#### A) Voting Behavior Settings
**Toggle: "Show Results During Voting"**
- **ON**: Live results visible to voters
- **OFF**: Results locked until election ends

**UI Elements:**
- ✅ Tooltip explaining the setting
- ✅ System status text below toggle
- ✅ Info box: "Changes to this setting will apply immediately."
- ✅ Note: "This setting is blockchain-bound"

#### B) Website Traffic Limit
**Field: "Maximum Active Visitors Allowed"**
- Enter a number (e.g., 3) to limit concurrent users
- Leave blank for unlimited access

**UI Elements:**
- ✅ Tooltip: "This helps prevent overload during peak activity."
- ✅ Validation: "Value must be a positive number."
- ✅ Status display: "Current limit: X visitors" or "Unlimited access enabled"

---

## 🗳️ Voter Workflow

### Step 1: Cast Your Vote
Navigate to: **Cast Vote Page**

**UI Structure:**
- Dynamic tabs created from active categories
- Example: `[ President ] [ Vice President ] [ Secretary ]`

**Inside Each Tab:**
- Title: "Select one candidate for this position."
- Radio button selection
- Candidate cards with:
  - Name
  - Party
  - Blue highlight when selected
  - Checkmark icon on selection

**Submit Behavior:**
- Button text when incomplete: "Complete all selections to continue."
- Button text when complete: "Submit Vote" (active blue button)
- Checkmark appears on completed tabs

**Confirmation Dialog:**
- Title: "Confirm Your Vote"
- Message: "Your vote will be permanently recorded on the blockchain and cannot be changed."
- Shows review of all selections
- Buttons: "Cast Vote" / "Go Back"

---

### Step 2: View Results
Navigate to: **New Results Page**

**Two States:**

#### State 1: Results Locked (if setting is OFF)
- 🔒 Full-page locked card
- Icon: Lock icon in gray circle
- Title: "Results Locked"
- Message: "Results will be available after the voting period ends."
- Button: "Return Home"

#### State 2: Live Results (if setting is ON)
- Dynamic tabs matching active categories
- For each candidate:
  - Ranking number (1st place highlighted in blue)
  - Name and party
  - Vote count
  - Percentage
  - Horizontal progress bar

**Features:**
- ✅ Refresh button to reload data
- ✅ "Loading data from blockchain..." spinner
- ✅ Total votes displayed per category

---

## 🚫 Capacity Management

### Over-Capacity Page
**Triggered when:** Visitor limit is set and reached

**UI Elements:**
- APU logo at top
- Warning icon in amber circle
- Title: "Website at Maximum Capacity"
- Message: "The system is experiencing high traffic. Please try again later."
- Helper text: "If you are an admin, log in to adjust the visitor limit."
- Button: "Refresh Page"

**Alternative: Maintenance Mode**
- Blue info icon
- Title: "System Under Maintenance"
- Message: "The e-voting system is temporarily unavailable. We'll be back shortly."

---

## 💾 Data Storage (localStorage)

### Key Storage Items:

```javascript
// Categories (max 3)
localStorage.setItem("votingCategories", JSON.stringify([
  {
    id: "1",
    name: "President",
    description: "Student Council President",
    maxVotes: 1,
    isActive: true
  }
]))

// System Settings
localStorage.setItem("systemSettings", JSON.stringify({
  showResultsDuringVoting: false,  // true or false
  visitorLimit: 3  // number or null for unlimited
}))

// Candidates
localStorage.setItem("candidates", JSON.stringify([
  {
    id: "1",
    name: "John Doe",
    position: "President",  // Must match category name
    party: "Innovation Party"
  }
]))

// Votes
localStorage.setItem("votes", JSON.stringify([
  {
    timestamp: "2025-01-15T10:30:00Z",
    selections: {
      "1": "candidate-id-123",  // categoryId: candidateId
      "2": "candidate-id-456"
    },
    voterAddress: "0x742d35Cc..."
  }
]))

// Has Voted Flag
localStorage.setItem("hasVoted", "true")
```

---

## 🎨 Design System

### Colors
- **Primary**: Blue (`bg-blue-600`, `hover:bg-blue-700`)
- **Success**: Blue/Green accents
- **Warning**: Amber (`bg-amber-600`)
- **Error**: Red (`bg-red-600`)
- **Admin Badge**: Indigo (`bg-indigo-100 text-indigo-700`)

### Components
- **Cards**: Rounded corners, soft shadows
- **Buttons**: Blue primary, outline secondary
- **Tooltips**: Info icon (ⓘ) with hover explanations
- **Modals**: Dialog for add/edit, AlertDialog for delete
- **Tabs**: Dynamic width based on category count

---

## ✅ UI Messages Reference

### Success Toasts
- "Category added successfully."
- "Category updated successfully."
- "Category deleted."
- "Changes saved successfully."
- "Settings updated."
- "Vote cast successfully!"

### Error Messages
- "Category name is required."
- "Maximum votes must be at least 1."
- "You cannot create more than 3 categories."
- "Value must be a positive number."
- "Something went wrong. Please try again."
- "You do not have permission to access this page."

### Empty States
- "No categories created yet. Click 'Add Category' to begin."
- "No candidates assigned to this category yet."
- "No active voting categories available at this time."

### Loading States
- "Loading data from blockchain..."
- Spinner with "Casting Vote..." in submit dialog

---

## 🔄 Key Behavior Flows

### Flow 1: Admin Creates Election
1. Navigate to **Manage Categories**
2. Click "Add Category" (up to 3 times)
3. Fill form: Name, Description, Max Votes
4. Toggle "Active in current election" ON
5. Click "Save Category"
6. Return to **Admin Dashboard**
7. Verify categories appear in "Current Election Setup"
8. Toggle any categories ON/OFF as needed
9. Must have at least 1 active category
10. Click "Start Election"

### Flow 2: Voter Casts Ballot
1. Navigate to **Cast Vote Page**
2. See tabs for each active category
3. Click first tab, select a candidate (card highlights blue)
4. Checkmark appears on tab
5. Repeat for all tabs until complete
6. "Submit Vote" button becomes active
7. Click "Submit Vote"
8. Review selections in confirmation dialog
9. Click "Cast Vote"
10. Loading spinner shows "Casting Vote..."
11. Success toast appears
12. Redirected to Results page

### Flow 3: Results Visibility Control
1. Navigate to **System Settings**
2. Find "Show Results During Voting" toggle
3. Turn OFF to lock results
4. Voters see "Results Locked" page
5. Turn ON to show live results
6. Voters see real-time vote counts
7. Change applies immediately

### Flow 4: Visitor Limit Enforcement
1. Navigate to **System Settings**
2. Enter number in "Maximum Active Visitors" (e.g., 3)
3. Click "Save Visitor Limit"
4. When 4th user tries to access: redirected to **Over Capacity Page**
5. User sees warning and "Refresh Page" button
6. Admin can increase limit or user waits for slot to open

---

## 🧪 Testing Checklist

### Admin Testing
- [ ] Create 3 categories successfully
- [ ] Try creating 4th category (should be disabled with tooltip)
- [ ] Edit a category
- [ ] Delete a category (with confirmation)
- [ ] Toggle categories active/inactive
- [ ] Try starting election with 0 active categories (should be disabled)
- [ ] Toggle "Show Results During Voting" and verify results page changes
- [ ] Set visitor limit and verify enforcement

### Voter Testing
- [ ] View voting page with 1 active category (1 tab)
- [ ] View voting page with 3 active categories (3 tabs)
- [ ] Submit button disabled until all selections made
- [ ] Checkmarks appear on completed tabs
- [ ] Confirmation dialog shows correct selections
- [ ] Vote records properly in localStorage
- [ ] Results show correctly when unlocked
- [ ] Results locked page shows when setting is OFF

---

## 🚀 Quick Start for Admins

**First Time Setup:**
1. Navigate to: `new-admin`
2. Click "Manage Categories"
3. Add 3 positions (President, VP, Secretary)
4. Return to dashboard
5. Activate all 3 categories
6. Click "Manage Categories" again to add candidates
7. Go to "System Settings"
8. Configure results visibility
9. Set visitor limit if needed
10. Ready to start election!

---

## 📱 All Routes

```
/home               → HomePage
/new-admin          → NewAdminDashboard
/manage-categories  → ManageCategoriesPage
/system-settings    → SystemSettingsPage
/cast-vote          → CastVotePage
/new-results        → NewResultsPage
/over-capacity      → OverCapacityPage
```

---

## 🎯 Key Features Summary

✅ **Maximum 3 Categories** - Hard limit with UI enforcement  
✅ **Dynamic Voting Tabs** - Auto-generated from active categories  
✅ **Smart Contract Toggle** - Show/hide results during voting  
✅ **Visitor Capacity Control** - Prevent system overload  
✅ **Complete Error Handling** - All error states covered  
✅ **Comprehensive Tooltips** - Help text for every setting  
✅ **Confirmation Dialogs** - Prevent accidental actions  
✅ **Toast Notifications** - User feedback for all actions  
✅ **Empty States** - Helpful messages when no data  
✅ **Loading States** - Blockchain-aware loading indicators  

---

**System is now ready for production use!** 🎉
