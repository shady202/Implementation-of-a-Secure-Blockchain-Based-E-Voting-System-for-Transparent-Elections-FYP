"use client";

import { ethers } from "ethers";
import VotingSystemABI from "./VotingSystemABI";
import { toast } from "sonner";

export const CONTRACT_ADDRESS = "0x7E7B7e71ae3D0b1E2E75701929E6885c7b5a4B91";

/* ================= PROVIDER ================= */

const getProvider = () => {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    throw new Error("MetaMask is not available");
  }
  return new ethers.BrowserProvider((window as any).ethereum);
};

const getContract = async (withSigner = false) => {
  const provider = getProvider();
  if (withSigner) {
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, VotingSystemABI, signer);
  }
  return new ethers.Contract(CONTRACT_ADDRESS, VotingSystemABI, provider);
};

/* ================= WALLET ================= */

export const connectWallet = async (): Promise<string> => {
  const provider = getProvider();
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
  toast.success("Election created");
};

export const startElection = async () => {
  const contract = await getContract(true);
  const tx = await contract.startElection();
  toast.info("Starting election...");
  await tx.wait();
  toast.success("Election started");
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

export const getElectionState = async () => {
  const contract = await getContract(false);
  const e = await contract.currentElection();

  // Solidity enum: None=0, Created=1, Active=2, Ended=3
  const state = Number(e.state);

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
  };
};

// ✅ for your AdminDashboard/VotePage imports
export const getElectionInfo = getElectionState;

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

  // Best-effort event parse (depends on ABI)
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

// ✅ aliases used by other pages
export const getElectionCategories = getAllCategories;

// ✅ Compatibility with code that calls addCategoryOnChain(id,name,desc,positions)
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

export const isVoterRegistered = async (): Promise<boolean> => {
  try {
    // For now, use localStorage to track registration
    // The contract doesn't expose a direct voters(address) getter
    const localCheck = localStorage.getItem("voterRegistrationCompleted");
    if (localCheck === "true") {
      console.log("✅ Voter registered (localStorage)");
      return true;
    }

    // TODO: Once voter registration is synced with backend,
    // we can query the database via API instead
    console.log("❌ Voter not registered");
    return false;
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

// ✅ Some pages import vote()
export const vote = castVote;

/* ================= ELIGIBILITY (basic placeholder) ================= */
// If you want “real verification”, use lib/api.ts below.
export const verifyStudentEligibility = async (_formData: any) => {
  return { eligible: true, message: "OK" };
};
