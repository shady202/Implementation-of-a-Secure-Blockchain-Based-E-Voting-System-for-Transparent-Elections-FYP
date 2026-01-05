# Detailed Voter Workflow - Use Case Diagram Footer

## 📋 **Complete Voter Journey (Detailed Steps)**

### **Phase 1: Initial Setup**

1. Install Digital Wallet Extension
2. Create Wallet Account
3. Secure Recovery Phrase
4. Configure Network Settings
5. Request Test Funds

### **Phase 2: Account Registration**

6. Access Registration Page
7. Fill Personal Information
8. Submit Registration Form
9. Receive OTP via Email
10. Enter OTP Code
11. Verify Email Address
12. Account Created Successfully

### **Phase 3: Wallet Binding**

13. Click "Connect Wallet" Button
14. MetaMask Popup Appears
15. Select Wallet Account
16. Approve Connection Request
17. Wallet Address Captured
18. Click "Register on Blockchain"
19. MetaMask Transaction Popup
20. Review Transaction Details
21. Confirm Transaction
22. Wait for Blockchain Confirmation
23. Voter Registered On-Chain
24. Wallet Permanently Bound
25. Registration Complete

### **Phase 4: Login & Authentication**

26. Navigate to Login Page
27. Enter Student ID
28. Enter Password
29. Click Login Button
30. New OTP Sent to Email
31. Check Email Inbox
32. Enter OTP Code
33. Verify OTP
34. Session Token Generated
35. Access Granted

### **Phase 5: Voting Process**

36. Check Election Status (Must be Active)
37. Verify Wallet Connected
38. Verify Network Correct
39. Browse Election Categories
40. View Candidate List
41. Select Candidate (Per Category)
42. Review Selections
43. Click "Submit Vote" Button
44. MetaMask Popup Appears
45. Review Vote Transaction
46. Check Gas Fee
47. Confirm in MetaMask
48. Sign Transaction
49. Transaction Sent to Blockchain
50. Wait for Confirmation
51. Vote Recorded On-Chain
52. Transaction Hash Generated
53. Frontend Sends Hash to Backend
54. Backend Verifies Transaction
55. Backend Stores Vote Record
56. Database Updated (has_voted = true)
57. Email Confirmation Sent
58. Success Message Displayed
59. Vote Status Updated

### **Phase 6: Post-Voting**

60. View Vote Confirmation
61. Check Transaction on Explorer
62. Verify Vote on Blockchain
63. Access Results Page (After Election Ends)
64. View Vote Counts
65. See Percentages & Charts
66. Verify Transparency

---

## 🔐 **Key Verification Points**

### **MetaMask Popups:**

- **Connection Request:** Approve wallet connection
- **Network Switch:** Confirm network change
- **Transaction Signature:** Sign blockchain transaction
- **Gas Fee Approval:** Confirm transaction cost

### **Identity Verifications:**

- **Email OTP:** Verify email ownership (Registration & Login)
- **Password:** Authenticate user identity
- **Wallet Signature:** Prove wallet ownership
- **Session Token:** Maintain authenticated session

### **Access Controls:**

- **Must be Registered:** To access voting
- **Must be Logged In:** To cast vote
- **Wallet Must be Connected:** To submit vote
- **Election Must be Active:** To vote
- **Cannot Vote Twice:** System prevents duplicate votes
- **Must be on Correct Network:** Hoodi testnet required

---

## 🎯 **System States**

### **Voter States:**

- Not Registered → Registered → Wallet Bound → Logged In → Voted

### **Election States:**

- Setup → Standby → Active → Ended → Reset

### **Wallet States:**

- Not Connected → Connected → Verified → Transaction Signed

---

**Total Steps in Complete Voter Journey: 66 detailed actions**
