# Ethereum Hoodi Network Setup Guide

## Quick Start

Your APU VOTE application is configured to force users to connect to the **Ethereum Hoodi** network.

### How It Works

When users click "Connect Wallet", the application automatically:
1. ✅ Checks if MetaMask is installed
2. ✅ Prompts user to switch to Ethereum Hoodi network
3. ✅ Adds Ethereum Hoodi to MetaMask if not already added
4. ✅ Connects the wallet

### Simple Implementation

```typescript
// This single line forces connection to Ethereum Hoodi:
const address = await connectWallet("hoodi")
```

---

## Network Configuration

The Ethereum Hoodi network is configured in `/lib/networks.ts`:

```typescript
hoodi: {
  chainId: "0x4268",           // Hex: 0x4268
  chainIdDecimal: 17000,       // Decimal: 17000
  chainName: "Ethereum Hoodi",
  nativeCurrency: {
    name: "Hoodi Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://ethereum-holesky.publicnode.com"],
  blockExplorerUrls: ["https://holesky.etherscan.io"],
}
```

**Note:** If your Ethereum Hoodi network uses different RPC URLs or Chain IDs, update them in `/lib/networks.ts`.

---

## Changing Networks

### Option 1: Change in Code

Update any `connectWallet()` call:

```typescript
// From Ethereum Hoodi:
await connectWallet("hoodi")

// To Sepolia:
await connectWallet("sepolia")

// To Mainnet:
await connectWallet("mainnet")
```

### Option 2: Use Environment Variable

1. **Create `.env.local`** (if it doesn't exist):
```bash
cp .env.example .env.local
```

2. **Edit `.env.local`**:
```bash
NEXT_PUBLIC_REQUIRED_NETWORK=hoodi
```

3. **Update `/lib/env.ts`**:
```typescript
export const REQUIRED_NETWORK = 
  typeof process !== 'undefined'
    ? process.env.NEXT_PUBLIC_REQUIRED_NETWORK || "hoodi"
    : "hoodi"
```

4. **Use in components**:
```typescript
import { REQUIRED_NETWORK } from "../lib/env"
await connectWallet(REQUIRED_NETWORK)
```

---

## Available Networks

| Network Key | Name | Chain ID | Use Case |
|------------|------|----------|----------|
| `"hoodi"` | Ethereum Hoodi | 17000 | **Default - Testing** |
| `"sepolia"` | Sepolia Testnet | 11155111 | Alternative testnet |
| `"mainnet"` | Ethereum Mainnet | 1 | Production (real money) |
| `"polygon"` | Polygon | 137 | Cheaper gas fees |
| `"mumbai"` | Mumbai Testnet | 80001 | Polygon testing |
| `"bsc"` | Binance Smart Chain | 56 | Alternative chain |
| `"localhost"` | Hardhat Local | 31337 | Local development |

---

## Adding a Custom Network

If Ethereum Hoodi has different parameters than configured, or you want to add a new network:

1. **Edit `/lib/networks.ts`**:

```typescript
export const NETWORKS: Record<string, NetworkConfig> = {
  // ... existing networks ...
  
  // Your custom network
  mynetwork: {
    chainId: "0x123",                    // Your chain ID in hex
    chainIdDecimal: 291,                 // Your chain ID in decimal
    chainName: "My Custom Network",      // Display name
    nativeCurrency: {
      name: "My Token",
      symbol: "MTK",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.mynetwork.com"],
    blockExplorerUrls: ["https://explorer.mynetwork.com"],
  },
}
```

2. **Use it**:
```typescript
await connectWallet("mynetwork")
```

---

## Testing the Connection

### 1. Install MetaMask
- Install MetaMask browser extension
- Create or import a wallet

### 2. Get Test Tokens
Visit a faucet to get free test ETH:
- https://holesky-faucet.pk910.de/
- https://faucet.holesky.ethscan.io/

### 3. Test in Your App
```bash
npm run dev
# Visit http://localhost:3000
# Navigate to voter registration
# Click "Connect Wallet"
# MetaMask should prompt to switch to Ethereum Hoodi
```

---

## Current Implementation

### Files Using Ethereum Hoodi

1. **`/lib/networks.ts`** - Network definition
2. **`/components/VoterRegistrationPage.tsx`** - Forces Hoodi connection
3. **`/.env.example`** - Default configuration
4. **`/lib/env.ts`** - Environment defaults

### Where Network Forcing Happens

**In `/components/VoterRegistrationPage.tsx`:**

```typescript
const handleConnect = async () => {
  setLoading(true)
  try {
    // Force connection to Ethereum Hoodi network
    const address = await connectWallet("hoodi")
    setFormData({ ...formData, walletAddress: address })
    toast.success(`Wallet connected!`)
    setStep(2)
  } catch (error: any) {
    toast.error(error.message || "Failed to connect wallet")
  } finally {
    setLoading(false)
  }
}
```

---

## User Experience

When a user connects their wallet:

1. **User clicks "Connect Wallet"**
2. **MetaMask popup appears:**
   - "Switch to Ethereum Hoodi"
   - [Cancel] [Switch Network]
3. **If Ethereum Hoodi not in MetaMask:**
   - Another popup: "Add Ethereum Hoodi to MetaMask?"
   - [Cancel] [Add Network]
4. **After network switch:**
   - Final popup: "Connect with MetaMask"
   - User selects account
   - [Cancel] [Connect]
5. **Connected!**
   - Shows wallet address
   - User can proceed with registration/voting

---

## Network Switching in Code

### Automatic Switch with Connect

```typescript
// Automatically switches to Hoodi before connecting
const address = await connectWallet("hoodi")
```

### Manual Switch

```typescript
import { switchNetwork } from "../lib/networks"

// Just switch network without connecting
await switchNetwork("hoodi")
```

### Check Current Network

```typescript
import { getCurrentNetwork } from "../lib/networks"

const network = await getCurrentNetwork()
console.log("Current network:", network?.chainName)
console.log("Chain ID:", network?.chainIdDecimal)
```

### Verify Before Action

```typescript
import { ensureCorrectNetwork } from "../lib/networks"

// Ensure on Hoodi before proceeding
await ensureCorrectNetwork("hoodi")
// Now safe to perform blockchain operations
```

---

## Error Handling

### MetaMask Not Installed

```typescript
try {
  await connectWallet("hoodi")
} catch (error) {
  if (error.message.includes("not installed")) {
    // Redirect to MetaMask download
    window.open("https://metamask.io/download/", "_blank")
  }
}
```

### User Rejected Switch

```typescript
try {
  await connectWallet("hoodi")
} catch (error) {
  if (error.message.includes("rejected")) {
    toast.error("Please approve network switch to continue")
  }
}
```

### Wrong Network Warning

```typescript
const network = await getCurrentNetwork()
if (network?.chainName !== "Ethereum Hoodi") {
  toast.warning("Please switch to Ethereum Hoodi network")
}
```

---

## Using NetworkStatus Component

Display current network and allow switching:

```typescript
import { NetworkStatus } from "./components/NetworkStatus"

function MyPage() {
  return (
    <div>
      {/* Shows network badge and switch button if wrong network */}
      <NetworkStatus 
        requiredNetwork="hoodi" 
        showWalletAddress={true}
      />
      
      {/* Your page content */}
    </div>
  )
}
```

**Compact version for header:**

```typescript
import { NetworkStatusCompact } from "./components/NetworkStatus"

function Header() {
  return (
    <header>
      <NetworkStatusCompact requiredNetwork="hoodi" />
    </header>
  )
}
```

---

## Environment Configuration

### `.env.example` (Template)

```bash
NEXT_PUBLIC_NETWORK_NAME=hoodi
NEXT_PUBLIC_REQUIRED_NETWORK=hoodi
NEXT_PUBLIC_CHAIN_ID=17000
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### `.env.local` (Your actual config)

```bash
# Copy from .env.example and customize
cp .env.example .env.local

# Then edit .env.local with your values
```

---

## Summary

**To force users to Ethereum Hoodi:**
- ✅ Already configured in `VoterRegistrationPage.tsx`
- ✅ Uses `connectWallet("hoodi")`
- ✅ Automatically switches networks
- ✅ Adds Ethereum Hoodi if not in MetaMask

**To change networks:**
- Change `"hoodi"` to another network key
- Or use environment variable configuration

**All available networks:**
- hoodi, sepolia, mainnet, polygon, mumbai, bsc, localhost

**Need help?**
- Check `/lib/networks.ts` for network configurations
- Check `/components/VoterRegistrationPage.tsx` for implementation example
- Check `/components/NetworkStatus.tsx` for UI components
