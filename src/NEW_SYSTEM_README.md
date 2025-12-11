# 🗳️ APU VOTE - New Voting System

## Quick Start (5 Steps)

### 1. **Initialize Sample Data**
The app opens on the **Admin Dashboard** (`new-admin`)
- Click **"Initialize Sample Data"** button
- This creates 3 sample categories and 7 candidates
- Categories: President, Vice President, Secretary

### 2. **Activate Categories**
On the same page, scroll to **"Current Election Setup"**
- Toggle ON the categories you want (President and Vice President are already ON)
- You need at least 1 active category

### 3. **Test Voting**
- Click **"Test Voting Page"** card
- You'll see tabs for each active category
- Select a candidate in each tab
- Click **"Submit Vote"** when all selections are complete
- Confirm your vote in the dialog

### 4. **View Results**
- Go back to Admin Dashboard
- Click **"View Results"** card
- By default, results are **LOCKED** 🔒

### 5. **Unlock Results**
- Go to **"System Settings"** card
- Toggle **"Show Results During Voting"** to ON
- Go back to Results page - now you can see live results! 📊

---

## 🎯 All Pages

| Page | Route | Purpose |
|------|-------|---------|
| **Admin Dashboard** | `new-admin` | Main control panel |
| **Manage Categories** | `manage-categories` | Create/edit up to 3 positions |
| **System Settings** | `system-settings` | Configure results visibility & visitor limits |
| **Cast Vote** | `cast-vote` | Voting interface (dynamic tabs) |
| **Results** | `new-results` | View election results or locked state |
| **Over Capacity** | `over-capacity` | Shown when visitor limit reached |

---

## 🎨 Key Features

### ✅ Category Management (Max 3)
- **Add Category** button
- Required fields: Name, Description, Max Votes
- Active/Inactive toggle
- Edit and delete with confirmation
- All error messages and tooltips included

### ✅ Smart Contract Toggle
- **"Show Results During Voting"** setting
- **OFF** = Results locked with 🔒 icon page
- **ON** = Live results visible
- Changes apply immediately

### ✅ Visitor Limit Control
- Set max concurrent users (e.g., 3)
- Leave blank for unlimited
- Users beyond limit see "Over Capacity" page
- Refresh to retry

### ✅ Dynamic Voting Interface
- Tabs auto-generated from active categories
- 1 active category = 1 tab
- 3 active categories = 3 tabs
- Checkmarks show completed selections
- Submit disabled until all complete

### ✅ Complete UI Messages
All toasts, errors, tooltips, and confirmations as specified:
- "Category added successfully."
- "Category name is required."
- "Maximum limit reached." (tooltip)
- And 20+ more...

---

## 🧪 Testing Buttons

On the **Admin Dashboard**, you have 3 quick actions:

1. **Initialize Sample Data** (Green button)
   - Creates 3 categories
   - Creates 7 candidates
   - Sets default settings
   
2. **Add 10 Sample Votes** (Blue button)
   - Generates 10 random votes
   - Updates vote count immediately
   
3. **Clear All Data** (Red button)
   - Removes all categories, candidates, votes, settings
   - Confirmation required

---

## 📊 Sample Data Details

### Categories Created
1. **President** (Active)
   - 3 candidates: Sarah Chen, Marcus Johnson, Aisha Rahman
   
2. **Vice President** (Active)
   - 2 candidates: David Kim, Elena Rodriguez
   
3. **Secretary** (Inactive)
   - 2 candidates: James Wong, Priya Patel

### Settings
- Results: Hidden by default
- Visitor Limit: Unlimited by default

---

## 🎯 User Flows to Test

### Flow 1: Admin Setup
1. Open app (starts on `new-admin`)
2. Click "Initialize Sample Data"
3. See 3 categories in "Current Election Setup"
4. Toggle Secretary to ON
5. Click "Manage Categories" to see all 3
6. Try to add a 4th (button is disabled)
7. Edit a category
8. Delete a category (confirm dialog)

### Flow 2: Voting Experience
1. From dashboard, click "Test Voting Page"
2. See tabs for President and VP (Secretary OFF)
3. Click President tab, select Sarah Chen
4. See checkmark on President tab
5. Click VP tab, select David Kim
6. "Submit Vote" button becomes active
7. Click Submit
8. Review selections in dialog
9. Click "Cast Vote"
10. Watch spinner "Casting Vote..."
11. Success toast appears
12. Redirected to Results

### Flow 3: Results Lock/Unlock
1. View Results - see 🔒 "Results Locked"
2. Click "Return Home"
3. Go to dashboard → "System Settings"
4. Toggle "Show Results During Voting" to ON
5. Go back to Results
6. Now see live vote counts with bars
7. Toggle back OFF
8. Results locked again

### Flow 4: Visitor Limit
1. Go to "System Settings"
2. Enter "3" in visitor limit field
3. Click "Save Visitor Limit"
4. See "Current limit: 3 visitors"
5. (In production, 4th user sees Over Capacity page)

---

## 🎨 Design Highlights

- **Blue Primary Color** (`bg-blue-600`) throughout
- **Rounded Cards** with soft shadows
- **Smooth Transitions** on hover
- **Tooltips** on all info icons (ⓘ)
- **Success/Error Colors** for feedback
- **Responsive Layout** (mobile-friendly)

---

## 📱 Navigation Map

```
Admin Dashboard (new-admin)
├── Manage Categories (manage-categories)
├── System Settings (system-settings)
├── Test Voting Page (cast-vote)
└── View Results (new-results)
    └── Locked if setting OFF
    └── Live if setting ON
```

---

## 🔧 LocalStorage Structure

```javascript
// votingCategories (max 3)
[{ id, name, description, maxVotes, isActive }]

// candidates (linked by position name)
[{ id, name, position, party }]

// systemSettings
{ showResultsDuringVoting: false, visitorLimit: null }

// votes
[{ timestamp, selections: { categoryId: candidateId }, voterAddress }]

// hasVoted (flag)
"true" or not present
```

---

## ✨ What's Different from Original System

### Old System
- Unlimited categories
- Categories grouped candidates by department
- No results locking
- No visitor limits
- Emerald green color scheme

### New System
- **Max 3 categories** with UI enforcement
- Categories = positions (President, VP, etc.)
- **Smart contract result toggle** (lock/unlock)
- **Visitor capacity management**
- **Blue color scheme**
- **Dynamic tabs** on voting page
- **Complete error handling**
- **All UI messages** as specified
- **Sample data generator**

---

## 🚀 Ready to Use!

The system is fully functional and ready for testing. All 6 pages work together seamlessly with proper data flow between them.

**Start here:** The app opens on `new-admin` - just click "Initialize Sample Data" to begin!
