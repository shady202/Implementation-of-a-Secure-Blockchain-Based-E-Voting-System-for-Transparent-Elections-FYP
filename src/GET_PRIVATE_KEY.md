# 🔑 How to Get Your MetaMask Private Key

## Step-by-Step Instructions:

### 1. **Open MetaMask**
   - Click the MetaMask extension icon in your browser

### 2. **Access Account Menu**
   - Click the **three dots (⋮)** in the top right corner
   - OR click on your account name/icon

### 3. **Open Account Details**
   - Click **"Account Details"** from the dropdown menu

### 4. **Show Private Key**
   - Click the button that says **"Show Private Key"** or **"Export Private Key"**

### 5. **Enter Password**
   - MetaMask will ask for your wallet password
   - Enter it and click **"Confirm"**

### 6. **Copy Your Private Key**
   - You'll see a long string of characters (64 characters)
   - Example format: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2`
   - Click **"Copy to clipboard"** or manually copy it

### 7. **IMPORTANT: Remove 0x prefix if present**
   - If your key starts with `0x`, **remove it**
   - ✅ Correct: `a1b2c3d4e5f6g7h8...`
   - ❌ Wrong: `0xa1b2c3d4e5f6g7h8...`

## ⚠️ Security Warnings:

### NEVER:
- ❌ Share your private key with anyone
- ❌ Post it online or in public channels
- ❌ Commit it to Git (the .gitignore protects it)
- ❌ Send it via email or messaging apps
- ❌ Use the same key for mainnet and testnet (best practice)

### ALWAYS:
- ✅ Keep it in the .env file only
- ✅ Make sure .env is in your .gitignore
- ✅ Use a dedicated testnet wallet for testing
- ✅ Keep backups of your seed phrase (not private key)

## 💡 Pro Tip:

Create a **separate MetaMask account** just for testing:
1. In MetaMask, click your account icon
2. Click "Create Account"
3. Name it "APU VOTE Testnet"
4. Use this account's private key for deployment

This keeps your main account safe!

## 🆘 Can't Find Private Key Option?

If you don't see "Show Private Key":
1. Make sure MetaMask is unlocked
2. Try clicking on the account name first
3. Look for "Account Details" or "Settings"
4. The option should be under account settings

## ✅ Verification:

Your private key should:
- Be exactly **64 characters** long (without 0x)
- Contain only letters (a-f) and numbers (0-9)
- Look like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2`

---

**Once you have your private key, paste it into the `.env` file and save!**
