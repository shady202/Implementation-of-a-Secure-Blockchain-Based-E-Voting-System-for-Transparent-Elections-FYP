/**
 * Network Configuration and Management
 * Handles MetaMask network detection, switching, and adding networks
 */

export interface NetworkConfig {
  chainId: string; // Hex format (e.g., "0x1")
  chainName: string;
  rpcUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls: string[];
}

/**
 * Supported Networks
 * ⚠️ MUST match the real RPC values
 */
export const NETWORKS = {
  hoodi: {
    chainId: "0x88BB0", // 560048 (0x88BB0) - matches Hoodi RPC
    chainName: "Ethereum Hoodi",
    rpcUrls: ["https://rpc.hoodi.ethpandaops.io"],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://explorer.hoodi.ethpandaops.io"],
  },
  sepolia: {
    chainId: "0xaa36a7", // 11155111
    chainName: "Sepolia Testnet",
    rpcUrls: ["https://rpc.sepolia.org"],
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  },
  localhost: {
    chainId: "0x7a69", // 31337
    chainName: "Localhost",
    rpcUrls: ["http://127.0.0.1:8545"],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: [],
  },
  polygon: {
    chainId: "0x89", // 137
    chainName: "Polygon Mainnet",
    rpcUrls: ["https://polygon-rpc.com"],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    blockExplorerUrls: ["https://polygonscan.com"],
  },
  mumbai: {
    chainId: "0x13881", // 80001
    chainName: "Mumbai Testnet",
    rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    blockExplorerUrls: ["https://mumbai.polygonscan.com"],
  },
};

export type NetworkId = keyof typeof NETWORKS;

/**
 * Check if MetaMask is installed
 */
export function isMetaMaskInstalled(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof (window as any).ethereum !== "undefined"
  );
}

/**
 * Ensure user is connected to the correct network
 * Automatically switches or adds the network
 */
export async function ensureCorrectNetwork(
  networkKey: NetworkId = "hoodi" // DEFAULT is Hoodi
): Promise<void> {
  const ethereum = (window as any).ethereum;

  if (!ethereum) {
    throw new Error("MetaMask is not available");
  }

  const config = NETWORKS[networkKey];

  if (!config) {
    throw new Error(
      `Network '${networkKey}' is not defined in NETWORKS config`
    );
  }

  // Defensive Logging
  console.log(
    `[ensureCorrectNetwork] Target: ${config.chainName} (${config.chainId})`
  );

  try {
    const currentChainId = await ethereum.request({ method: "eth_chainId" });
    console.log(`[ensureCorrectNetwork] Current: ${currentChainId}`);

    if (currentChainId.toLowerCase() === config.chainId.toLowerCase()) {
      console.log("[ensureCorrectNetwork] Already on correct network.");
      return;
    }

    // Try to switch first
    console.log("[ensureCorrectNetwork] Switching...");
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: config.chainId }],
    });
  } catch (error: any) {
    console.error("[ensureCorrectNetwork] Error:", error);

    // If chain not added yet → add it
    if (error.code === 4902 || error?.data?.originalError?.code === 4902) {
      console.log("[ensureCorrectNetwork] Chain not found. Adding...", config);
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [config],
      });
    } else {
      throw error;
    }
  }
}

/**
 * Get current network information
 */
export async function getCurrentNetwork(): Promise<
  (NetworkConfig & { chainIdDecimal: number }) | null
> {
  if (!isMetaMaskInstalled()) return null;

  const ethereum = (window as any).ethereum;
  try {
    const chainId = await ethereum.request({ method: "eth_chainId" });
    const chainIdDecimal = parseInt(chainId, 16);

    // Find matching network in our NETWORKS object
    for (const [key, config] of Object.entries(NETWORKS)) {
      if (config.chainId.toLowerCase() === chainId.toLowerCase()) {
        return { ...config, chainIdDecimal };
      }
    }

    // Return custom network info if not in our list
    return {
      chainId,
      chainIdDecimal,
      chainName: `Unknown Network (${chainIdDecimal})`,
      rpcUrls: [],
      nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
      blockExplorerUrls: [],
    };
  } catch (error) {
    console.error("Error getting current network:", error);
    return null;
  }
}

/**
 * Switch to a specific network
 */
export async function switchNetwork(networkKey: NetworkId): Promise<void> {
  await ensureCorrectNetwork(networkKey);
}

/**
 * Listen for network changes
 */
export function onNetworkChanged(callback: () => void): () => void {
  if (!isMetaMaskInstalled()) return () => {};

  const ethereum = (window as any).ethereum;
  const handler = () => callback();

  ethereum.on("chainChanged", handler);

  return () => {
    if (ethereum.removeListener) {
      ethereum.removeListener("chainChanged", handler);
    }
  };
}

/**
 * Format wallet address for display
 */
export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Check if a chain ID is a testnet
 */
export function isTestnet(chainId: number): boolean {
  // Common testnet chain IDs
  const testnets = [
    11155111, // Sepolia
    17000, // Holesky/Hoodi
    80001, // Mumbai
    31337, // Localhost
    5, // Goerli
  ];
  return testnets.includes(chainId);
}
