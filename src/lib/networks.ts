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
    blockExplorerUrls: [
      "https://explorer.hoodi.ethpandaops.io",
    ],
  },
};

export type NetworkId = keyof typeof NETWORKS;

/**
 * Check if MetaMask is installed
 */
export function isMetaMaskInstalled(): boolean {
  return typeof window !== "undefined" && typeof (window as any).ethereum !== "undefined";
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
    throw new Error(`Network '${networkKey}' is not defined in NETWORKS config`);
  }

  // Defensive Logging
  console.log(`[ensureCorrectNetwork] Target: ${config.chainName} (${config.chainId})`);

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
