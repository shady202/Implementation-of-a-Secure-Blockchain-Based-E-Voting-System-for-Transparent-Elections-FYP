/**
 * Dual-Save API Layer
 * ====================
 * This module provides functions that save data to blockchain first,
 * then sync to the database for fast queries.
 *
 * Flow: Frontend → Blockchain (via MetaMask) → Database (via API)
 */

import {
  createCategory as createCategoryOnChain,
  addCandidate as addCandidateOnChain,
} from "./blockchain";
import { API_BASE_URL } from "./api-config";

// API Base URL - now automatically detects correct IP!

// Get current user ID from localStorage (temporary auth)
function getCurrentUserId(): string | null {
  return localStorage.getItem("user_id");
}

/**
 * Creates a category on blockchain then syncs to database
 * @param name Category name
 * @param description Category description
 * @returns Promise with category data
 */
export async function createCategoryDualSave(
  name: string,
  description: string
) {
  try {
    // Step 1: Create on blockchain (user signs via MetaMask)
    const blockchainId = await createCategoryOnChain(name, description);

    // Get the transaction hash from the last transaction
    // Note: createCategory should return txHash, we'll update it
    const provider = new (await import("ethers")).ethers.BrowserProvider(
      (window as any).ethereum
    );
    const latestBlock = await provider.getBlock("latest");

    if (!latestBlock) {
      throw new Error("Could not get latest block");
    }

    // Get transaction from block (simplified - in production, track tx hash from createCategory)
    const txHash =
      latestBlock.transactions[latestBlock.transactions.length - 1];

    // Wait a moment for transaction to be fully confirmed
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 2: Sync to database
    const userId = getCurrentUserId();
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(userId ? { "x-user-id": userId } : {}),
      },
      body: JSON.stringify({
        txHash,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to sync category to database");
    }

    const result = await response.json();

    return {
      success: true,
      blockchainId,
      category: result.category,
    };
  } catch (error: any) {
    console.error("Error in dual-save category:", error);
    throw error;
  }
}

/**
 * Adds a candidate on blockchain then syncs to database
 * @param categoryId Blockchain category ID
 * @param name Candidate name
 * @param party Candidate party/affiliation
 * @returns Promise with candidate data
 */
export async function addCandidateDualSave(
  categoryId: number,
  name: string,
  party: string
) {
  try {
    // Step 1: Add to blockchain (user signs via MetaMask)
    const blockchainId = await addCandidateOnChain(categoryId, name, party);

    // Get the transaction hash
    const provider = new (await import("ethers")).ethers.BrowserProvider(
      (window as any).ethereum
    );
    const latestBlock = await provider.getBlock("latest");

    if (!latestBlock) {
      throw new Error("Could not get latest block");
    }

    const txHash =
      latestBlock.transactions[latestBlock.transactions.length - 1];

    // Wait for confirmation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 2: Sync to database
    const userId = getCurrentUserId();
    const response = await fetch(`${API_BASE_URL}/candidates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(userId ? { "x-user-id": userId } : {}),
      },
      body: JSON.stringify({
        txHash,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || "Failed to sync candidate to database"
      );
    }

    const result = await response.json();

    return {
      success: true,
      blockchainId,
      candidate: result.candidate,
    };
  } catch (error: any) {
    console.error("Error in dual-save candidate:", error);
    throw error;
  }
}

/**
 * Fetches categories from database (fast!)
 */
export async function getCategories() {
  try {
    const userId = getCurrentUserId();
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: {
        ...(userId ? { "x-user-id": userId } : {}),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/**
 * Fetches candidates from database (fast!)
 */
export async function getCandidates() {
  try {
    const userId = getCurrentUserId();
    const response = await fetch(`${API_BASE_URL}/candidates`, {
      headers: {
        ...(userId ? { "x-user-id": userId } : {}),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch candidates");
    }

    const data = await response.json();
    return data.candidates || [];
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return [];
  }
}
