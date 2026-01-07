"use client";

import { ethers } from "ethers";
import VotingSystemABI from "./VotingSystemABI";
import { toast } from "sonner";

export const CONTRACT_ADDRESS = "0xd16823004f9aBE77135Ca63b48Ec2678Bd204b73";

/* ================= PROVIDER ================= */

const getProvider = async () => {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    throw new Error(
      "No Ethereum wallet detected. Please install and use MetaMask wallet."
    );
  }

  const ethereum = (window as any).ethereum;

  // ✅ CRITICAL: Verify we're on Ethereum Hoodi network
  try {
    const currentChainId = await ethereum.request({ method: "eth_chainId" });
    const HOODI_CHAIN_ID = "0x88BB0"; // 560048 decimal

    if (currentChainId.toLowerCase() !== HOODI_CHAIN_ID.toLowerCase()) {
      console.warn(
        `⚠️ Wrong network detected: ${currentChainId}. Switching to Ethereum Hoodi...`
      );

      try {
        // Try to switch to Hoodi
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: HOODI_CHAIN_ID }],
        });
        console.log("✅ Switched to Ethereum Hoodi network");
      } catch (switchError: any) {
        // If Hoodi network not added, add it
        if (switchError.code === 4902) {
          console.log("📝 Adding Ethereum Hoodi network to MetaMask...");
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: HOODI_CHAIN_ID,
                chainName: "Ethereum Hoodi",
                rpcUrls: ["https://rpc.hoodi.ethpandaops.io"],
                nativeCurrency: {
                  name: "Ether",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://explorer.hoodi.ethpandaops.io"],
              },
            ],
          });
          console.log("✅ Ethereum Hoodi network added and switched");
        } else {
          throw switchError;
        }
      }
    } else {
      console.log("✅ Already on Ethereum Hoodi network");
    }
  } catch (error) {
    console.error("Network verification error:", error);
    toast.error("Please switch to Ethereum Hoodi network in MetaMask");
    throw new Error(
      "Wrong network. Please switch to Ethereum Hoodi in MetaMask."
    );
  }

  return new ethers.BrowserProvider(ethereum);
};

const getContract = async (withSigner = false) => {
  const provider = await getProvider();
  if (withSigner) {
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, VotingSystemABI, signer);
  }
  return new ethers.Contract(CONTRACT_ADDRESS, VotingSystemABI, provider);
};

/* ================= WALLET ================= */

export const connectWallet = async (): Promise<string> => {
  const provider = await getProvider();
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  return signer.getAddress();
};

/* ================= ELECTION ================= */

export const createElection = async (
  title: string,
  startTime: number,
  endTime: number
) => {
  const contract = await getContract(true);
  const tx = await contract.createElection(title, startTime, endTime);
  toast.info("Creating election...");
  await tx.wait();
};

export const startElection = async () => {
  const contract = await getContract(true);
  const tx = await contract.startElection();
  toast.info("Starting election...");
  await tx.wait();
};

export const endElection = async () => {
  const contract = await getContract(true);
  const tx = await contract.endElection();
  toast.info("Ending election...");
  await tx.wait();
  toast.success("Election ended");
};

export const resetSystem = async () => {
  const contract = await getContract(true);
  const tx = await contract.resetSystem();
  toast.info("Resetting system...");
  await tx.wait();
  toast.success("System reset");
};

export const autoEndElection = async () => {
  const contract = await getContract(true);
  const tx = await contract.autoEndElection();
  toast.info("Ending election automatically...");
  await tx.wait();
  toast.success("Election auto-ended");
};

export const getElectionState = async () => {
  const contract = await getContract(false);
  const e = await contract.currentElection();
  const effectiveState = await contract.getEffectiveState();
  const isPaused = await contract.paused();

  // Solidity enum: None=0, Created=1, Active=2, Ended=3
  const state = Number(effectiveState); // Use effective state for UI

  return {
    title: e.title,
    startTime: Number(e.startTime),
    endTime: Number(e.endTime),
    state,
    totalVoters: Number(e.totalVoters),
    totalVotes: Number(e.totalVotes),
    isNone: state === 0, // No election exists
    isCreated: state === 1, // Election created, in setup phase
    isActive: state === 2, // Election is active/ongoing
    hasEnded: state === 3, // Election has ended
    isPaused,
  };
};

export const getElectionSummary = async () => {
  const contract = await getContract(false);
  const s = await contract.getElectionSummary();
  return {
    title: s.title,
    startTime: Number(s.startTime),
    endTime: Number(s.endTime),
    state: Number(s.state),
    effectiveState: Number(s.effectiveState),
    totalVoters: Number(s.totalVoters),
    totalVotes: Number(s.totalVotes),
    categoriesCount: Number(s.categoriesCount),
    candidatesCount: Number(s.candidatesCount),
    isPaused: s.isPaused,
  };
};

// ✅ for your AdminDashboard/VotePage imports
export const getElectionInfo = getElectionState;

/* ================= EMERGENCY ================= */

export const pauseSystem = async () => {
  const contract = await getContract(true);
  const tx = await contract.pause();
  toast.info("Pausing system...");
  await tx.wait();
  toast.success("System paused");
};

export const unpauseSystem = async () => {
  const contract = await getContract(true);
  const tx = await contract.unpause();
  toast.info("Unpausing system...");
  await tx.wait();
  toast.success("System unpaused");
};

/* ================= CATEGORIES ================= */

export const createCategory = async (
  name: string,
  description: string
): Promise<{ categoryId: number; txHash: string }> => {
  const contract = await getContract(true);
  const tx = await contract.createCategory(name, description);
  toast.info("Creating category...");
  const receipt = await tx.wait();

  let categoryId = 0;

  try {
    const event = receipt.logs.find(
      (l: any) => l.fragment?.name === "CategoryCreated"
    );
    if (event?.args?.categoryId !== undefined) {
      categoryId = Number(event.args.categoryId);
    }
  } catch {}

  return {
    categoryId,
    txHash: receipt.hash,
  };
};

export const getAllCategories = async () => {
  const contract = await getContract(false);
  const cats = await contract.getAllCategories();

  return cats.map((c: any) => ({
    id: Number(c.id),
    name: c.name,
    description: c.description,
    isActive: Boolean(c.isActive),
  }));
};

// aliases used by other pages
export const getElectionCategories = getAllCategories;

// Compatibility with code that calls addCategoryOnChain(id,name,desc,positions)
export const addCategoryOnChain = async (
  _categoryId: string,
  name: string,
  description: string,
  _positions: string[]
) => {
  // Your contract createCategory(name, description) doesn't need categoryId/positions
  return createCategory(name, description);
};

/* ================= CANDIDATES ================= */

export const addCandidate = async (
  categoryId: number,
  name: string,
  party: string
): Promise<{ candidateId: number; txHash: string }> => {
  const contract = await getContract(true);
  const tx = await contract.addCandidate(categoryId, name, party);
  toast.info("Adding candidate...");
  const receipt = await tx.wait();

  let candidateId = 0;

  try {
    const event = receipt.logs.find(
      (l: any) => l.fragment?.name === "CandidateAdded"
    );
    if (event?.args?.candidateId !== undefined) {
      candidateId = Number(event.args.candidateId);
    }
  } catch {}

  return {
    candidateId,
    txHash: receipt.hash,
  };
};

export const deactivateCandidate = async (
  categoryId: number,
  candidateId: number
) => {
  const contract = await getContract(true);
  const tx = await contract.deactivateCandidate(categoryId, candidateId);
  toast.info("Deactivating candidate...");
  await tx.wait();
  toast.success("Candidate deactivated");
};

export const getCandidatesForCategory = async (categoryId: number) => {
  const contract = await getContract(false);
  const [ids, names, parties, votes] = await contract.getCandidatesForCategory(
    categoryId
  );

  return (ids as any[]).map((id: any, i: number) => ({
    id: Number(id),
    name: names[i],
    party: parties[i],
    votes: Number(votes[i]),
  }));
};

// ✅ Used by some pages that want "all candidates"
export const getCandidates = async () => {
  const cats = await getAllCategories();
  const all: Array<{
    id: number;
    name: string;
    party: string;
    votes: number;
    categoryId: number;
  }> = [];

  for (const c of cats) {
    const list = await getCandidatesForCategory(c.id);
    for (const cand of list) {
      all.push({ ...cand, categoryId: c.id });
    }
  }
  return all;
};

/* ================= VOTERS ================= */

export const registerVoter = async (
  studentId: string,
  department: string,
  yearOfStudy: number
) => {
  const contract = await getContract(true);
  const tx = await contract.registerVoter(studentId, department, yearOfStudy);
  toast.info("Registering voter...");
  await tx.wait();
  toast.success("Voter registered");
};

export const getVoterInfo = async (voterAddress: string) => {
  const contract = await getContract(false);
  const info = await contract.getVoterInfo(voterAddress);
  return {
    studentId: info.studentId,
    department: info.department,
    yearOfStudy: Number(info.yearOfStudy),
    isRegistered: info.isRegistered,
    votedCategoriesCount: Number(info.votedCategoriesCount),
  };
};

export const isVoterRegistered = async (address?: string): Promise<boolean> => {
  try {
    if (!address) {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      address = await signer.getAddress();
    }
    const info = await getVoterInfo(address);
    return info.isRegistered;
  } catch (err) {
    console.error("Error checking voter registration:", err);
    return false;
  }
};

export const hasVotedInCategory = async (
  voterAddress: string,
  categoryId: number
): Promise<boolean> => {
  const contract = await getContract(false);
  return contract.hasVotedInCategory(voterAddress, categoryId);
};

/* ================= VOTING ================= */

export const castVote = async (categoryId: number, candidateId: number) => {
  const contract = await getContract(true);
  const tx = await contract.vote(categoryId, candidateId);
  toast.info("Submitting vote...");
  await tx.wait();
  toast.success("Vote recorded");
};

// Some pages import vote()
export const vote = castVote;

export const batchVote = async (
  votes: Array<{ categoryId: number; candidateId: number }>
): Promise<{ transactionHash: string }> => {
  const contract = await getContract(true);
  const tx = await contract.batchVote(votes);
  toast.info("Submitting batch votes...");
  const receipt = await tx.wait();
  // Success message shown by calling component

  return {
    transactionHash: receipt.hash,
  };
};

/* ================= VOTE VERIFICATION ================= */

export interface VoteReceipt {
  categoryId: number;
  categoryName: string;
  candidateId: number;
  candidateName: string;
  timestamp: Date;
  transactionHash?: string;
}

export const getMyVotes = async (): Promise<VoteReceipt[]> => {
  const contract = await getContract(false);
  const receipts = await contract.getMyVotes();
  return receipts.map((r: any) => ({
    categoryId: Number(r.categoryId),
    categoryName: r.categoryName,
    candidateId: Number(r.candidateId),
    candidateName: r.candidateName,
    timestamp: new Date(Number(r.timestamp) * 1000),
  }));
};

/**
 * ✅ BLOCKCHAIN EVENT-BASED VOTE RECEIPTS
 * Fetches vote receipts directly from blockchain VoteCast events
 * This is isolated from other functions and provides true blockchain verification
 */
export const getVoteReceiptsFromBlockchain = async (
  walletAddress: string,
  electionStartTime?: number,
  electionEndTime?: number
): Promise<VoteReceipt[]> => {
  try {
    const contract = await getContract(false);

    console.log(
      "📜 Querying blockchain for VoteCast events for:",
      walletAddress
    );

    // Query VoteCast events filtered by voter address
    // event VoteCast(address indexed voter, uint256 indexed categoryId, uint256 indexed candidateId)
    const filter = contract.filters.VoteCast(walletAddress);
    const events = await contract.queryFilter(filter);

    console.log(`✅ Found ${events.length} VoteCast event(s) on blockchain`);

    if (events.length === 0) {
      return [];
    }

    // Get all categories to map IDs to names
    const categories = await getAllCategories();
    const categoryMap = new Map(categories.map((c: any) => [c.id, c]));

    // Process each event and enrich with names
    const receipts: VoteReceipt[] = [];

    for (const event of events) {
      try {
        const categoryId = Number((event as any).args?.categoryId);
        const candidateId = Number((event as any).args?.candidateId);

        // Get block timestamp
        const block = await event.getBlock();
        const timestamp = new Date(block.timestamp * 1000);

        // Filter by election time range if provided
        if (electionStartTime && electionEndTime) {
          const voteTime = timestamp.getTime() / 1000; // Convert to seconds
          if (voteTime < electionStartTime || voteTime > electionEndTime) {
            console.log(
              `⏭️  Skipping vote from ${timestamp.toLocaleString()} (outside current election)`
            );
            continue; // Skip votes outside the election period
          }
        }

        // Get category name
        const category: any = categoryMap.get(categoryId);
        const categoryName = category?.name || `Category ${categoryId}`;

        // Get candidate name from the category
        const candidates = await getCandidatesForCategory(categoryId);
        const candidate = candidates.find((c: any) => c.id === candidateId);
        const candidateName = candidate?.name || `Candidate ${candidateId}`;

        receipts.push({
          categoryId,
          categoryName,
          candidateId,
          candidateName,
          timestamp,
          transactionHash: event.transactionHash,
        });
      } catch (err) {
        console.error("Error processing vote event:", err);
        // Continue processing other events even if one fails
      }
    }

    // Sort by timestamp (newest first)
    receipts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    console.log(
      `✅ Processed ${receipts.length} blockchain vote receipt(s) for current election`
    );

    return receipts;
  } catch (error) {
    console.error("❌ Error fetching votes from blockchain:", error);
    throw new Error("Failed to fetch vote receipts from blockchain");
  }
};

export const verifyStudentEligibility = async (_formData: any) => {
  return { eligible: true, message: "OK" };
};
