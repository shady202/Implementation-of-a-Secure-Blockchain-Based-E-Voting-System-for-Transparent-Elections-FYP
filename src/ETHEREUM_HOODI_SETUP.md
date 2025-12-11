# Ethereum Hoodi Network - Quick Setup

## What is Ethereum Hoodi?

Ethereum Hoodi is the blockchain network used for APU VOTE elections. It provides secure, transparent, and immutable voting records.

---

## 🚀 Quick Setup (2 Minutes)

### Step 1: Install MetaMask
1. Visit https://metamask.io/download/
2. Install browser extension
3. Create or import a wallet

### Step 2: Your App is Already Configured!
The APU VOTE application is pre-configured to use Ethereum Hoodi. When users click "Connect Wallet", they will automatically be prompted to:
- Switch to Ethereum Hoodi network
- Add Ethereum Hoodi to MetaMask (if not already added)

### Step 3: Get Test Tokens (Optional for Testing)
Visit a faucet to get free test ETH:
- https://holesky-faucet.pk910.de/
- https://faucet.holesky.ethscan.io/

### Step 4: Test It!
```bash
npm run dev
```
- Visit http://localhost:3000
- Click "Connect Wallet" on the voter registration page
- Approve network switch in MetaMask
- Connect your account
- Done! ✅

---

## 📋 Network Details

| Property | Value |
|----------|-------|
| Network Name | Ethereum Hoodi |
| Chain ID (Decimal) | 17000 |
| Chain ID (Hex) | 0x4268 |
| Currency Symbol | ETH |
| RPC URL | https://rpc.holesky.ethpandaops.io |
| Block Explorer | https://holesky.etherscan.io |

---

## 💻 How It Works in Code

### Forcing Network Connection

```typescript
// In your component:
import { connectWallet } from "../lib/blockchain"

const handleConnect = async () => {
  // This automatically switches to Ethereum Hoodi
  const address = await connectWallet("hoodi")
  console.log("Connected:", address)
}
```

### What Happens Behind the Scenes

1. **Check MetaMask:** Verifies MetaMask is installed
2. **Get Current Network:** Checks which network user is on
3. **Switch if Needed:** If not on Ethereum Hoodi, prompts switch
4. **Add if Missing:** If Ethereum Hoodi not in MetaMask, adds it
5. **Connect Account:** Requests wallet connection
6. **Return Address:** Returns connected wallet address

---

## 🔧 Configuration Files

### Network Definition
**File:** `/lib/networks.ts`

```typescript
hoodi: {
  chainId: "0x4268",
  chainIdDecimal: 17000,
  chainName: "Ethereum Hoodi",
  nativeCurrency: {
    name: "Hoodi Ether",
    symbol: "ETH",
    decimals: 18,
  },
  // Multiple RPC endpoints for reliability:
  rpcUrls: [
    "https://rpc.holesky.ethpandaops.io",
    "https://ethereum-holesky-rpc.publicnode.com",
    "https://holesky.drpc.org",
    "https://1rpc.io/holesky",
  ],
  blockExplorerUrls: ["https://holesky.etherscan.io"],
}
```

**Note:** If your Ethereum Hoodi network has different parameters (RPC URL, Chain ID, etc.), update this configuration.

### Environment Variables
**File:** `.env.local`

```bash
NEXT_PUBLIC_NETWORK_NAME=hoodi
NEXT_PUBLIC_REQUIRED_NETWORK=hoodi
NEXT_PUBLIC_CHAIN_ID=17000
```

---

## 🎯 Current Implementation

### Where It's Used

1. **Voter Registration** (`/components/VoterRegistrationPage.tsx`)
   ```typescript
   await connectWallet("hoodi")
   ```

2. **Network Configuration** (`/lib/networks.ts`)
   - Defines Ethereum Hoodi network parameters

3. **Environment Defaults** (`/lib/env.ts`)
   - Sets "hoodi" as default network

---

## 🔄 Switching to a Different Network

### Option 1: Change in Code

```typescript
// From:
await connectWallet("hoodi")

// To Sepolia:
await connectWallet("sepolia")

// To Mainnet:
await connectWallet("mainnet")
```

### Option 2: Environment Variable

Edit `.env.local`:
```bash
NEXT_PUBLIC_REQUIRED_NETWORK=sepolia
```

Then use:
```typescript
import { REQUIRED_NETWORK } from "../lib/env"
await connectWallet(REQUIRED_NETWORK)
```

---

## 🌐 Available Networks

Change `"hoodi"` to any of these:

- `"hoodi"` - Ethereum Hoodi (current default)
- `"sepolia"` - Sepolia Testnet
- `"mainnet"` - Ethereum Mainnet
- `"polygon"` - Polygon Mainnet
- `"mumbai"` - Mumbai Testnet
- `"bsc"` - Binance Smart Chain
- `"localhost"` - Local Hardhat Network

---

## ❓ Troubleshooting

### Network Parameters Don't Match

If your Ethereum Hoodi network has different parameters:

1. Edit `/lib/networks.ts`
2. Update the `hoodi` configuration:
   ```typescript
   hoodi: {
     chainId: "0xYOUR_CHAIN_ID",
     chainIdDecimal: YOUR_CHAIN_ID_DECIMAL,
     chainName: "Your Network Name",
     rpcUrls: ["YOUR_RPC_URL"],
     blockExplorerUrls: ["YOUR_EXPLORER_URL"],
   }
   ```

### MetaMask Shows Wrong Network

Clear solution:
```typescript
// Force switch to correct network
import { switchNetwork } from "../lib/networks"
await switchNetwork("hoodi")
```

### Want to Use Custom RPC

Update in `/lib/networks.ts`:
```typescript
rpcUrls: ["https://your-custom-rpc-url.com"]
```

---

## 📱 User Experience

When connecting wallet:

1. **User clicks "Connect Wallet"**
2. **MetaMask shows:** "Switch to Ethereum Hoodi"
3. **User clicks "Switch Network"**
4. **If not added:** MetaMask prompts to add Ethereum Hoodi
5. **User clicks "Add Network"**
6. **MetaMask shows:** "Connect with MetaMask"
7. **User selects account and clicks "Connect"**
8. **✅ Connected!**

---

## 📚 Additional Resources

- **Network Setup Guide:** `/NETWORK_SETUP_GUIDE.md`
- **Network Configuration:** `/lib/networks.ts`
- **Network Status Component:** `/components/NetworkStatus.tsx`
- **Environment Template:** `/.env.example`

---

## ✅ Checklist

- [x] Ethereum Hoodi configured in `/lib/networks.ts`
- [x] Default network set to "hoodi" in all files
- [x] VoterRegistrationPage forces Hoodi connection
- [x] Environment variables updated
- [x] NetworkStatus component available for use

**Everything is ready! Your app will automatically force users to connect to Ethereum Hoodi network.**

---

## 🚦 Next Steps

1. **Update network parameters** if your Ethereum Hoodi uses different RPC/Chain ID
2. **Deploy your smart contract** to Ethereum Hoodi network
3. **Update contract address** in `.env.local`
4. **Test the connection** with MetaMask
5. **Set `ENABLE_MOCK_MODE=false`** when ready for real blockchain

---

**Need Help?**
- Check network configuration in `/lib/networks.ts`
- View implementation in `/components/VoterRegistrationPage.tsx`
- Read full guide in `/NETWORK_SETUP_GUIDE.md`