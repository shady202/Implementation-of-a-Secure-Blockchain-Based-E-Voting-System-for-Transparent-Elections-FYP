import { ethers } from "ethers";

// Hoodi Testnet configuration
const RPC_URL = "https://rpc.hoodi.ethpandaops.io";
// Read contract address from environment variable or use default
const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS || "0x2DCa51f1095B2BbF7a5A1A8f6c0E7c7B8AD0e613";

// Minimal ABI for verification (only events we need)
const VERIFICATION_ABI = [
  "event CategoryCreated(uint256 indexed categoryId, string name, string description)",
  "event CandidateAdded(uint256 indexed categoryId, uint256 indexed candidateId, string name, string party)",
];

/**
 * Verifies a blockchain transaction and extracts event data
 */
export async function verifyTransaction(txHash: string) {
  try {
    // Create provider without ENS support to avoid UNSUPPORTED_OPERATION errors
    const provider = new ethers.JsonRpcProvider(RPC_URL, undefined, {
      staticNetwork: true, // Prevents ENS lookups
    });

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      VERIFICATION_ABI,
      provider
    );

    // Get transaction receipt with retry logic
    let receipt = null;
    let retries = 3;

    while (!receipt && retries > 0) {
      try {
        receipt = await provider.getTransactionReceipt(txHash);
        if (!receipt) {
          // Wait a bit before retrying
          await new Promise((resolve) => setTimeout(resolve, 1000));
          retries--;
        }
      } catch (err) {
        retries--;
        if (retries === 0) throw err;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (!receipt) {
      throw new Error(
        "Transaction not found or not confirmed yet. Please wait a moment and try again."
      );
    }

    if (receipt.status !== 1) {
      throw new Error("Transaction failed on blockchain");
    }

    // Parse logs to find our events
    const events = receipt.logs
      .map((log) => {
        try {
          return contract.interface.parseLog({
            topics: log.topics as string[],
            data: log.data,
          });
        } catch {
          return null;
        }
      })
      .filter((event) => event !== null);

    return {
      verified: true,
      blockNumber: receipt.blockNumber,
      events,
      receipt,
    };
  } catch (error: any) {
    console.error("Transaction verification error:", error);
    // Provide more helpful error messages
    if (error.code === "UNSUPPORTED_OPERATION") {
      throw new Error("Network configuration error. Please contact support.");
    }
    throw error;
  }
}

/**
 * Extracts category data from CategoryCreated event
 */
export function extractCategoryFromEvent(events: any[]) {
  const categoryEvent = events.find((e) => e?.name === "CategoryCreated");

  if (!categoryEvent) {
    throw new Error("CategoryCreated event not found in transaction");
  }

  return {
    blockchainId: Number(categoryEvent.args.categoryId),
    name: categoryEvent.args.name,
    description: categoryEvent.args.description,
  };
}

/**
 * Extracts candidate data from CandidateAdded event
 */
export function extractCandidateFromEvent(events: any[]) {
  const candidateEvent = events.find((e) => e?.name === "CandidateAdded");

  if (!candidateEvent) {
    throw new Error("CandidateAdded event not found in transaction");
  }

  return {
    blockchainId: Number(candidateEvent.args.candidateId),
    categoryId: Number(candidateEvent.args.categoryId),
    name: candidateEvent.args.name,
    party: candidateEvent.args.party,
  };
}
