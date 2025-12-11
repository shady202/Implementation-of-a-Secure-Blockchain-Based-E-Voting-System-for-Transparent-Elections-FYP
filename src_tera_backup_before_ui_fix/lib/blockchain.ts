"use client";

import { ethers } from "ethers";
import VotingSystemABI from "./VotingSystemABI";
import { toast } from "sonner";
import { CONTRACT_ADDRESS } from "./env";
import { ensureCorrectNetwork } from "./networks";

/**
 * Utility: check if MetaMask is installed
 */
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== "undefined" && !!(window as any).ethereum;
};

/**
 * Internal: get an ethers v6 BrowserProvider
 */
const getProvider = () => {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    throw new Error("MetaMask is not available. Please install MetaMask.");
  }
  return new ethers.BrowserProvider((window as any).ethereum);
};

/**
 * Internal: get contract instance
 * @param needsSigner whether this call needs a signer (write tx) or not (read-only)
 */
const getContract = async (needsSigner = false) => {
  try {
    const provider = getProvider();
    if (needsSigner) {
      const signer = await provider.getSigner();
      return new ethers.Contract(CONTRACT_ADDRESS, VotingSystemABI, signer);
    }
    return new ethers.Contract(CONTRACT_ADDRESS, VotingSystemABI, provider);
  } catch (error) {
    console.error("Error getting contract:", error);
    throw error;
  }
};

/**
 * Connect to wallet and ensure correct network (Hoodi).
 * - If Hoodi is not added → ensureCorrectNetwork() should add + switch.
 * - If already added → ensureCorrectNetwork() should just switch.
 */
export const connectWallet = async (
  _requiredNetwork?: string, // kept for compatibility, not used now
): Promise<string> => {
  try {
    if (!isMetaMaskInstalled()) {
      throw new Error(
        "MetaMask is not installed. Please install MetaMask to use this application.",
      );
    }

    const ethereum = (window as any).ethereum;

    // 1️⃣ Ensure we're on the correct network (Hoodi)
    toast.info("Checking & switching to the correct network...");
    await ensureCorrectNetwork("hoodi");

    // 2️⃣ Request account access
    const accounts = (await ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found. Please unlock MetaMask.");
    }

    const address = accounts[0];

    toast.success("Wallet connected successfully.");
    return address;
  } catch (error: any) {
    console.error("Error connecting to wallet:", error);

    // User rejected request
    if (error.code === 4001 || error.code === "ACTION_REJECTED") {
      throw new Error("Connection request was rejected by the user.");
    }

    throw error;
  }
};

/**
 * Register voter on the blockchain
 */
export const registerVoter = async (studentData: {
  studentId: string;
  department: string;
  yearOfStudy: number;
  walletAddress: string;
}) => {
  try {
    if (!isMetaMaskInstalled()) {
      throw new Error("MetaMask is not available");
    }

    const ethereum = (window as any).ethereum;

    const accounts = (await ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found. Please connect MetaMask.");
    }

    // Network check removed as per requirement (assume connected)

    const contract = await getContract(true);

    const tx = await contract.registerVoter(
      studentData.studentId,
      studentData.department,
      studentData.yearOfStudy
    );

    toast.info("Submitting voter registration to the blockchain...");

    const receipt = await tx.wait();

    toast.success("Voter registered successfully on the blockchain!");
    return { success: true, transactionHash: receipt.hash };
  } catch (error: any) {
    console.error("Error registering voter:", error);

    if (error.code === "ACTION_REJECTED" || error.code === 4001) {
      throw new Error("Transaction was rejected by the user.");
    }

    throw error;
  }
};

/**
 * Create election on blockchain (admin only)
 * Must be called BEFORE startElection
 */
export const createElectionOnChain = async (
  title: string,
  startTime: number,
  endTime: number
) => {
  try {
    const contract = await getContract(true);
    const tx = await contract.createElection(title, startTime, endTime);

    toast.info("Creating election on blockchain...");
    const receipt = await tx.wait();

    toast.success("Election created on blockchain!");
    return { success: true, transactionHash: receipt.hash };
  } catch (error: any) {
    console.error("Error creating election:", error);

    if (error.code === "ACTION_REJECTED" || error.code === 4001) {
      throw new Error("Transaction was rejected by the user.");
    }

    throw error;
  }
};

/**
 * Start election on blockchain (admin only)
 */
export const startElectionOnChain = async () => {
  try {
    const contract = await getContract(true);
    const tx = await contract.startElection();

    toast.info("Starting election on blockchain...");
    const receipt = await tx.wait();

    toast.success("Election started on blockchain!");
    return { success: true, transactionHash: receipt.hash };
  } catch (error: any) {
    console.error("Error starting election:", error);

    if (error.code === "ACTION_REJECTED" || error.code === 4001) {
      throw new Error("Transaction was rejected by the user.");
    }

    throw error;
  }
};

/**
 * End election on blockchain (admin only)
 */
export const endElectionOnChain = async () => {
  try {
    const contract = await getContract(true);
    const tx = await contract.endElection();

    toast.info("Ending election on blockchain...");
    const receipt = await tx.wait();

    toast.success("Election ended on blockchain!");
    return { success: true, transactionHash: receipt.hash };
  } catch (error: any) {
    console.error("Error ending election:", error);

    if (error.code === "ACTION_REJECTED" || error.code === 4001) {
      throw new Error("Transaction was rejected by the user.");
    }

    throw error;
  }
};

/**
 * Check voter status from the blockchain
 */
export const checkVoterStatus = async (walletAddress: string) => {
  try {
    const contract = await getContract(false);
    const voter = await contract.voters(walletAddress);

    const hasVoted: boolean = voter.hasVoted;
    const isRegistered: boolean = voter.isRegistered;

    return {
      isRegistered,
      hasVoted,
      registrationData: {
        studentId: voter.studentId,
        department: voter.department,
        yearOfStudy: Number(voter.yearOfStudy),
      },
    };
  } catch (error) {
    console.error("Error checking voter status:", error);
    throw error;
  }
};



/**
 * Get election state from blockchain for debugging
 */
export const getElectionState = async () => {
  try {
    const contract = await getContract(false);
    const election = await contract.currentElection();
    const stats = await contract.getElectionStats();

    console.log("=== BLOCKCHAIN ELECTION STATE ===");
    console.log("Title:", election.title);
    console.log("Start Time:", new Date(Number(election.startTime) * 1000).toLocaleString());
    console.log("End Time:", new Date(Number(election.endTime) * 1000).toLocaleString());
    console.log("State:", election.state); // 0=Created, 1=Active, 2=Ended
    console.log("Current Time:", new Date().toLocaleString());
    console.log("Total Voters:", Number(stats.totalRegisteredVoters));
    console.log("Total Votes:", Number(stats.totalVotesCast));
    console.log("================================");

    return {
      title: election.title,
      startTime: Number(election.startTime),
      endTime: Number(election.endTime),
      state: Number(election.state), // 0=Created, 1=Active, 2=Ended
      totalVoters: Number(stats.totalRegisteredVoters),
      totalVotes: Number(stats.totalVotesCast),
      isActive: Number(election.state) === 1,
      hasStarted: Date.now() >= Number(election.startTime) * 1000,
      hasEnded: Date.now() > Number(election.endTime) * 1000
    };
  } catch (error) {
    console.error("Error getting election state:", error);
    throw error;
  }
};

/**
 * Add a candidate to the blockchain (admin only)
 */
export const addCandidateOnChain = async (
  name: string,
  position: string,
  party: string,
  category: string
) => {
  try {
    const contract = await getContract(true);
    // Note: The smart contract addCandidate function signature might need to be checked
    // Based on the solidity file: function addCandidate(string memory _name, string memory _position, string memory _party, string memory _category)
    const tx = await contract.addCandidate(name, position, party, category);

    toast.info(`Adding candidate "${name}" to blockchain...`);
    const receipt = await tx.wait();

    toast.success("Candidate added to blockchain!");
    return { success: true, transactionHash: receipt.hash };
  } catch (error: any) {
    console.error("Error adding candidate:", error);

    if (error.code === "ACTION_REJECTED" || error.code === 4001) {
      throw new Error("Transaction was rejected by the user.");
    }


    throw error;
  }
};

/**
 * Add a category to the blockchain (admin only)
 */
export const addCategoryOnChain = async (
  id: string,
  name: string,
  description: string,
  positions: string[]
) => {
  try {
    const contract = await getContract(true);
    const tx = await contract.addCategory(id, name, description, positions);

    toast.info(`Adding category "${name}" to blockchain...`);
    const receipt = await tx.wait();

    toast.success("Category added to blockchain!");
    return { success: true, transactionHash: receipt.hash };
  } catch (error: any) {
    console.error("Error adding category:", error);

    if (error.code === "ACTION_REJECTED" || error.code === 4001) {
      throw new Error("Transaction was rejected by the user.");
    }

    throw error;
  }
};

/**
 * Cast vote on blockchain
 * votesByPosition: { [positionName]: candidateIdString }
 */
export const castVote = async (votesByPosition: Record<string, string>) => {
  try {
    if (!isMetaMaskInstalled()) {
      throw new Error("MetaMask is not available");
    }

    // ✅ اتأكد إننا على شبكة Hoodi الصح
    // مفيش باراميتر هنا، الدالة نفسها عارفة تختار الشبكة من config
    await ensureCorrectNetwork();

    const contract = await getContract(true);

    const candidateIds: bigint[] = [];
    const positions: string[] = [];

    for (const [position, rawId] of Object.entries(votesByPosition)) {
      if (!rawId || rawId === "undefined") {
        throw new Error(`Invalid candidate ID selected for position: ${position}`);
      }

      if (!/^\d+$/.test(rawId)) {
        console.error("Non-numeric candidateId:", position, rawId);
        throw new Error(
          `Invalid candidate ID for "${position}". Please ask the admin to set a numeric Contract ID for this candidate.`
        );
      }

      positions.push(position);
      candidateIds.push(BigInt(rawId));
    }

    console.log("DEBUG — positions:", positions);
    console.log("DEBUG — candidateIds:", candidateIds);
    console.log("DEBUG — Submitting votes one by one (contract accepts single ID)");

    // IMPORTANT: The contract's vote() function accepts only ONE candidate ID at a time
    // So we need to call it multiple times, once for each position
    const receipts = [];

    for (let i = 0; i < candidateIds.length; i++) {
      console.log(`Voting for ${positions[i]}: candidate ID ${candidateIds[i]}`);

      const tx = await contract.vote(candidateIds[i]);
      toast.info(`Submitting vote ${i + 1}/${candidateIds.length} to the blockchain...`);

      const receipt = await tx.wait();
      receipts.push(receipt);

      console.log(`✅ Vote ${i + 1} confirmed: ${receipt.hash}`);
    }

    toast.success(`All ${receipts.length} votes have been recorded on the blockchain!`);
    return { success: true, transactionHash: receipts[receipts.length - 1].hash };
  } catch (error: any) {
    console.error("Error casting vote:", error);

    if (error.code === "ACTION_REJECTED" || error.code === 4001) {
      throw new Error("Transaction was rejected by the user.");
    }

    throw error;
  }
};


/**
 * Get election results from blockchain
 */
export const getElectionResults = async () => {
  try {
    const contract = await getContract(false);

    // Fetch total voters and votes
    const totalVotersBN = await contract.totalVoters();
    const totalVotesBN = await contract.totalVotes();

    const totalVoters = Number(totalVotersBN);
    const totalVotes = Number(totalVotesBN);

    // Fetch candidates and their votes by position
    // 💡 Adjust this list if you have more / different positions
    const positions = ["President", "Vice President", "Secretary"];
    const candidatesData: any[] = [];

    for (const position of positions) {
      const candidates = await contract.getCandidatesByPosition(position);
      for (const candidate of candidates) {
        candidatesData.push({
          id: candidate.id.toString(),
          name: candidate.name,
          position: candidate.position,
          party: candidate.party,
          votes: Number(candidate.voteCount),
          percentage: 0,
        });
      }
    }

    // Calculate vote percentages
    candidatesData.forEach((candidate) => {
      candidate.percentage =
        totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0;
    });

    return {
      totalVoters,
      totalVotes,
      turnoutPercentage:
        totalVoters > 0 ? (totalVotes / totalVoters) * 100 : 0,
      candidates: candidatesData,
    };
  } catch (error) {
    console.error("Error fetching election results:", error);
    throw error;
  }
};

/**
 * Get categories / positions from blockchain
 */
export const getElectionCategories = async () => {
  try {
    const contract = await getContract(false);
    const categories = await contract.getCategories();

    return categories.map((cat: any) => ({
      id: cat.id.toString(),
      name: cat.name,
      description: cat.description,
      isActive: cat.isActive,
      maxVotes: Number(cat.maxVotes),
    }));
  } catch (error) {
    console.error("Error fetching election categories:", error);
    throw error;
  }
};

/**
 * Get all candidates from blockchain
 */
export const getCandidates = async () => {
  try {
    const contract = await getContract(false);
    const candidates = await contract.getAllCandidates();

    return candidates.map((candidate: any) => ({
      id: candidate.id.toString(),
      name: candidate.name,
      position: candidate.position,
      party: candidate.party,
      category: candidate.category,
      votes: Number(candidate.voteCount),
    }));
  } catch (error) {
    console.error("Error fetching candidates:", error);
    throw error;
  }
};

/**
 * Get current wallet address (if already connected)
 */
export const getCurrentWalletAddress = async (): Promise<string | null> => {
  try {
    if (!isMetaMaskInstalled()) {
      return null;
    }

    const ethereum = (window as any).ethereum;

    const accounts = (await ethereum.request({
      method: "eth_accounts",
    })) as string[];

    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error("Error getting current wallet address:", error);
    return null;
  }
};

/**
 * Verify student eligibility (Mock implementation)
 * In production, this would check against university database or whitelist
 */
export const verifyStudentEligibility = async (studentData: any) => {
  console.log("Verifying student:", studentData);

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock validation logic
  if (!studentData.studentId || !studentData.matricNumber) {
    return {
      eligible: false,
      message: "Missing student information."
    };
  }

  return {
    eligible: true,
    message: "Student verified successfully."
  };
};
