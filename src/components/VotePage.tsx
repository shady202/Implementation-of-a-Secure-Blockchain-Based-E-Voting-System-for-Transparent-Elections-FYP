"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Info,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

import {
  getElectionState,
  getAllCategories,
  getCandidatesForCategory,
  batchVote,
  isVoterRegistered,
  hasVotedInCategory,
} from "../lib/blockchain";
import { UserNav } from "./UserNav";
import { isLoggedIn, getCurrentUser } from "../lib/session";

const apuLogo = "/apu-logo.png";
const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3001/api"
).replace(/\/api$/, "");

interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface Candidate {
  id: string;
  candidate_name: string;
  party: string;
  votes: number;
}

interface VotePageProps {
  onNavigate: (page: string, txHash?: string) => void;
}

export function VotePage({ onNavigate }: VotePageProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [voted, setVoted] = useState(false);
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  const [walletMismatch, setWalletMismatch] = useState(false);
  const [walletMismatchMessage, setWalletMismatchMessage] = useState("");
  const [registeredWallet, setRegisteredWallet] = useState("");
  const currentUser = getCurrentUser();

  const [electionActive, setElectionActive] = useState(false);
  const [electionEnded, setElectionEnded] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [candidatesByCategory, setCandidatesByCategory] = useState<
    Record<string, Candidate[]>
  >({});

  const [selectedVotes, setSelectedVotes] = useState<Record<string, string>>(
    {}
  );
  const [activeTab, setActiveTab] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");
  const [electionTitle, setElectionTitle] = useState("Election");
  const [electionDescription, setElectionDescription] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Mapping: database category UUID -> blockchain category ID
  const [blockchainCategoryMap, setBlockchainCategoryMap] = useState<
    Record<string, number>
  >({});

  // Mapping: database candidate UUID -> blockchain candidate ID
  const [blockchainCandidateMap, setBlockchainCandidateMap] = useState<
    Record<string, number>
  >({});

  /* ================= SLIDING TAB INDICATOR ================= */

  const tabsListRef = useRef<HTMLDivElement | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const listEl = tabsListRef.current;
    const activeEl = triggerRefs.current[activeTab];

    if (!listEl || !activeEl) return;

    const listRect = listEl.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();

    setIndicator({
      left: activeRect.left - listRect.left,
      width: activeRect.width,
    });
  }, [activeTab, categories.length]);

  useEffect(() => {
    const onResize = () => {
      const listEl = tabsListRef.current;
      const activeEl = triggerRefs.current[activeTab];

      if (!listEl || !activeEl) return;

      const listRect = listEl.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();

      setIndicator({
        left: activeRect.left - listRect.left,
        width: activeRect.width,
      });
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeTab]);

  /* ================= CHECK REGISTRATION ================= */

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        // Check if user is logged in first
        if (!currentUser) {
          console.log("❌ Not logged in - redirecting to login");
          localStorage.setItem("intendedDestination", "vote");
          onNavigate("login");
          return;
        }

        setCheckingRegistration(true);

        try {
          // Get current wallet address from MetaMask (SAME AS MY VOTES PAGE)
          const provider = new ethers.BrowserProvider((window as any).ethereum);
          const signer = await provider.getSigner();
          const walletAddress = await signer.getAddress();

          console.log(
            "🔍 Validating wallet for Elections page:",
            walletAddress
          );

          // VALIDATE: Check if wallet matches registered account (EXACT SAME AS MY VOTES PAGE)
          try {
            const validateResponse = await fetch(
              `${API_URL}/api/voters/validate-wallet`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  walletAddress,
                  studentId: currentUser?.studentId,
                  email: currentUser?.email,
                }),
              }
            );

            const validateData = await validateResponse.json();

            if (!validateData.valid) {
              console.log("❌ WALLET-IDENTITY MISMATCH on Elections page!");

              // Check if this is a "needs registration" case
              if (
                validateData.message &&
                validateData.message.includes("complete wallet registration")
              ) {
                console.log("🔄 Redirecting to wallet registration...");
                setIsRegistered(false);
                setCheckingRegistration(false);
                setLoading(false);
                onNavigate("voter-registration");
                return;
              }

              // Otherwise, show wallet mismatch error
              setWalletMismatch(true);
              setWalletMismatchMessage(
                validateData.message ||
                  "This wallet doesn't match your registered account."
              );
              setIsRegistered(false);
              setCheckingRegistration(false);
              setLoading(false);
              return;
            }

            console.log("✅ Wallet validated for Elections page");
            setWalletMismatch(false);
            setIsRegistered(true);
            setCheckingRegistration(false);
          } catch (validateErr) {
            console.error("❌ Wallet validation failed:", validateErr);
            setWalletMismatch(true);
            setWalletMismatchMessage(
              "Failed to validate wallet. Please ensure you're using your registered wallet."
            );
            setIsRegistered(false);
            setCheckingRegistration(false);
            setLoading(false);
            return;
          }
        } catch (walletErr: any) {
          console.error("Error getting wallet address:", walletErr);
          setIsRegistered(false);
          setCheckingRegistration(false);
          setLoading(false);
          onNavigate("voter-registration");
        }
      } catch (err) {
        console.error("Failed to check registration", err);
        setIsRegistered(false);
        setCheckingRegistration(false);
        setLoading(false);
      }
    };

    checkRegistration();
  }, [onNavigate, refreshTrigger]);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    if (!isRegistered) return;

    const loadData = async () => {
      try {
        setLoading(true);

        console.log(
          "🚀 STEP 1: Fetching election data from /api/elections/current..."
        );

        // Fetch election data from DATABASE (FAST - no blockchain!)
        const electionResponse = await fetch(
          `${API_URL}/api/elections/current`
        );

        console.log("✅ STEP 2: Got response from /api/elections/current");

        if (!electionResponse.ok) {
          throw new Error(`Election API failed: ${electionResponse.status}`);
        }

        const electionData = await electionResponse.json();
        console.log("✅ STEP 3: Parsed election data:", electionData);

        if (electionData.election) {
          setElectionTitle(electionData.election.title || "Election");
          setElectionDescription(electionData.election.description || "");

          // Determine status - handle both 'status' string and 'isActive' boolean
          const isActive =
            electionData.election.status === "active" ||
            electionData.election.isActive === true;

          console.log("📊 Election status check:", {
            status: electionData.election.status,
            isActive: electionData.election.isActive,
            computed_isActive: isActive,
          });

          setElectionActive(isActive);
          setElectionEnded(
            electionData.election.status === "ended" ||
              electionData.election.isActive === false
          );

          // Calculate time remaining
          if (electionData.election.endTime) {
            const endTime =
              new Date(electionData.election.endTime).getTime() / 1000;
            const now = Math.floor(Date.now() / 1000);
            const remaining = endTime - now;

            if (remaining > 0) {
              const days = Math.floor(remaining / 86400);
              const hours = Math.floor((remaining % 86400) / 3600);
              const minutes = Math.floor((remaining % 3600) / 60);
              const seconds = remaining % 60;
              setTimeRemaining(
                `${days}d ${hours}h ${minutes}m ${seconds}s remaining`
              );
            } else {
              setTimeRemaining("Election ending soon");
            }
          }
        } else {
          console.log("⚠️  No election data found");
          setElectionActive(false);
          setLoading(false);
          return;
        }

        // Check if election is active - use the computed isActive value
        const isActive =
          electionData.election.status === "active" ||
          electionData.election.isActive === true;

        if (!electionData.election || !isActive) {
          console.log(
            "⚠️  Election is not active - status:",
            electionData.election?.status,
            "isActive:",
            electionData.election?.isActive
          );
          setElectionActive(false);
          setLoading(false);
          return;
        }

        console.log("🚀 STEP 4: Fetching categories from /api/categories...");

        // Fetch categories from DATABASE (FAST - no blockchain!)
        const categoriesResponse = await fetch(`${API_URL}/api/categories`);

        console.log("✅ STEP 5: Got response from /api/categories");

        if (!categoriesResponse.ok) {
          throw new Error(
            `Categories API failed: ${categoriesResponse.status}`
          );
        }

        const categoriesResult = await categoriesResponse.json();
        const categoriesData = categoriesResult.categories || categoriesResult;

        console.log("✅ STEP 6: Parsed categories data:", categoriesData);

        setCategories(categoriesData);

        if (categoriesData.length > 0) {
          setActiveTab(categoriesData[0].name);
        }

        // Fetch blockchain categories and create mapping
        console.log(
          "🔗 STEP 6.5: Fetching blockchain categories for ID mapping..."
        );
        try {
          const blockchainCategories = await getAllCategories();
          console.log("✅ Blockchain categories:", blockchainCategories);

          // Create mapping: database UUID -> blockchain numeric ID (by matching names)
          const mapping: Record<string, number> = {};
          for (const dbCat of categoriesData) {
            const blockchainCat = blockchainCategories.find(
              (bc: any) =>
                bc.name === dbCat.name || bc.name === dbCat.category_name
            );
            if (blockchainCat) {
              mapping[dbCat.id] = blockchainCat.id;
              console.log(
                `  📍 Mapped "${dbCat.name}" (${dbCat.id}) -> blockchain ID ${blockchainCat.id}`
              );
            } else {
              console.warn(
                `  ⚠️ No blockchain category found for "${dbCat.name}"`
              );
            }
          }
          setBlockchainCategoryMap(mapping);
        } catch (bcError) {
          console.error("❌ Failed to fetch blockchain categories:", bcError);
        }

        console.log("🚀 STEP 7: Fetching candidates for each category...");

        // Fetch ALL candidates from DATABASE (FAST - no blockchain!)
        const allCandidatesResponse = await fetch(`${API_URL}/api/candidates`);

        if (!allCandidatesResponse.ok) {
          throw new Error(
            `Candidates API failed: ${allCandidatesResponse.status}`
          );
        }

        const allCandidatesResult = await allCandidatesResponse.json();
        const allCandidates =
          allCandidatesResult.candidates || allCandidatesResult;

        console.log("✅ STEP 8: Got all candidates:", allCandidates.length);

        // Group candidates by category_id
        const candidatesMap: Record<number, Candidate[]> = {};
        for (const cat of categoriesData) {
          // Filter candidates for this category
          const categoryCandidates = allCandidates.filter(
            (candidate: any) => candidate.category_id === cat.id
          );
          candidatesMap[cat.id] = categoryCandidates;
          console.log(
            `  ✅ ${categoryCandidates.length} candidates for ${cat.name}`
          );
        }

        setCandidatesByCategory(candidatesMap);

        console.log("✅ Categories and candidates loaded");

        console.log("🔍 STEP 8: Checking if already voted (database only)...");

        // Check if user has already voted (from database - NO MetaMask!)
        try {
          const dbResponse = await fetch(
            `${API_URL}/api/voters/check-registration`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ studentId: currentUser?.studentId }),
            }
          );

          if (!dbResponse.ok) {
            console.error("Failed to check voting status");
            setAlreadyVoted(false);
          } else {
            const dbData = await dbResponse.json();

            console.log("✅ STEP 9: Vote status check complete");

            if (dbData.registered && dbData.hasVoted) {
              console.log("❌ Already voted (database)");
              setAlreadyVoted(true);
            } else {
              console.log("✅ Eligible to vote");
              setAlreadyVoted(false);
            }
          }
        } catch (err: any) {
          console.error("❌ Failed to check voting status:", err);
          setAlreadyVoted(false); // Allow voting on error
        }
      } catch (err) {
        console.error("Failed to load election data", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isRegistered, refreshTrigger]);

  /* ================= REAL-TIME COUNTDOWN ================= */

  useEffect(() => {
    if (!electionActive) return;

    const timer = setInterval(async () => {
      try {
        const electionState = await getElectionState();

        if (electionState.isActive && electionState.endTime) {
          const now = Math.floor(Date.now() / 1000);
          const remaining = electionState.endTime - now;

          if (remaining > 0) {
            const days = Math.floor(remaining / 86400);
            const hours = Math.floor((remaining % 86400) / 3600);
            const minutes = Math.floor((remaining % 3600) / 60);
            const seconds = remaining % 60;
            setTimeRemaining(
              `${days}d ${hours}h ${minutes}m ${seconds}s remaining`
            );
          } else {
            setTimeRemaining("Election ending soon");
            setElectionEnded(true);
            clearInterval(timer);
          }
        }
      } catch (err) {
        console.error("Error updating countdown:", err);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [electionActive]);

  /* ================= HELPERS ================= */

  const handleSelect = (categoryId: string, candidateId: string) => {
    setSelectedVotes((prev) => ({
      ...prev,
      [categoryId]: candidateId,
    }));
  };

  const isFormComplete = () => {
    return categories.every((cat) => selectedVotes[cat.id]);
  };

  const handleVote = async () => {
    try {
      setSubmitting(true);

      // Convert UUID-based votes to blockchain numeric IDs using the mapping
      const votes = await Promise.all(
        categories.map(async (cat) => {
          const selectedCandidateId = selectedVotes[cat.id];
          const candidatesInCategory = candidatesByCategory[cat.id] || [];

          // Find the selected candidate in database
          const selectedCandidate = candidatesInCategory.find(
            (c) => c.id === selectedCandidateId
          );

          // Get blockchain category ID from mapping
          const blockchainCategoryId = blockchainCategoryMap[cat.id];

          if (blockchainCategoryId === undefined) {
            throw new Error(
              `No blockchain mapping found for category "${cat.name}"`
            );
          }

          // Fetch blockchain candidates for this category
          const blockchainCandidates = await getCandidatesForCategory(
            blockchainCategoryId
          );

          // Find blockchain candidate by matching name
          const blockchainCandidate = blockchainCandidates.find(
            (bc: any) => bc.name === selectedCandidate?.candidate_name
          );

          if (!blockchainCandidate) {
            throw new Error(
              `Blockchain candidate not found for "${selectedCandidate?.candidate_name}" in category "${cat.name}"`
            );
          }

          console.log(
            `  ✅ Matched "${selectedCandidate?.candidate_name}" -> blockchain ID ${blockchainCandidate.id}`
          );

          return {
            categoryId: blockchainCategoryId,
            candidateId: blockchainCandidate.id,
          };
        })
      );

      console.log("🗳️ Submitting votes to blockchain:", votes);

      const result = await batchVote(votes);

      // Step 2: Save votes to database for LIFETIME history
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      try {
        // Get active election from database
        const electionResponse = await fetch(
          `${API_URL}/api/elections/current`
        );
        const electionData = await electionResponse.json();

        const electionId = electionData.election?.id || null;
        const electionTitle =
          electionData.election?.title || "General Election";

        console.log("💾 Saving vote history...", {
          wallet: walletAddress,
          electionId,
          electionTitle,
          votes: votes.length,
        });

        //Prepare vote data with category/candidate NAMES
        const votesWithNames = categories.map((cat) => {
          const candidateId = selectedVotes[cat.id];
          const candidate = candidatesByCategory[cat.id]?.find(
            (c: Candidate) => c.id === candidateId
          );

          return {
            categoryId: cat.id,
            categoryName: cat.name,
            candidateId: candidateId,
            candidateName:
              candidate?.candidate_name || `Candidate ${candidateId}`,
            transactionHash: result.transactionHash,
          };
        });

        // Save vote history (works with or without election)
        const saveResponse = await fetch(`${API_URL}/api/votes/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            walletAddress,
            electionId, // Can be null
            votes: votesWithNames,
          }),
        });

        const saveData = await saveResponse.json();

        if (saveData.success) {
          console.log(
            "✅ Vote history saved to database:",
            saveData.votesSaved,
            "votes"
          );
        } else {
          console.error("❌ Failed to save vote history:", saveData.error);
        }
      } catch (historyErr) {
        console.error("❌ CRITICAL: Failed to save vote history:", historyErr);
        // Continue anyway - blockchain vote succeeded
      }

      // Step 3: Mark voter as voted in DATABASE
      try {
        console.log(
          "📞 Calling mark-voted endpoint for wallet:",
          walletAddress
        );

        const markVotedResponse = await fetch(
          `${API_URL}/api/voters/mark-voted`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ walletAddress }),
          }
        );

        const markVotedData = await markVotedResponse.json();

        if (markVotedResponse.ok && markVotedData.success) {
          console.log("✅ Voter marked as voted in database successfully");
        } else {
          console.error(
            "❌ Failed to mark voter as voted:",
            markVotedData.error || "Unknown error"
          );
          console.error("Response status:", markVotedResponse.status);
        }
      } catch (markErr) {
        console.error(
          "❌ Network error while marking voter as voted:",
          markErr
        );
      }

      toast.success("All votes submitted successfully!");
      // Navigate to success page with transaction hash
      onNavigate("vote-success", result.transactionHash);
    } catch (err: any) {
      console.error("Failed to submit vote", err);
      alert("Failed to submit vote: " + (err?.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleElectionsClick = () => {
    if (!currentUser) {
      localStorage.setItem("intendedDestination", "vote");
      onNavigate("login");
    } else {
      onNavigate("vote");
    }
  };

  /* ================= LOADING/CHECKING STATES ================= */

  if (checkingRegistration) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-emerald-50 to-white py-10">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="bg-emerald-500 rounded-full p-6 shadow-xl">
            <Loader2 className="h-16 w-16 animate-spin text-white" />
          </div>
          <p className="text-xl font-medium text-slate-700">
            Checking registration...
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-emerald-50 to-white py-10">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="bg-emerald-500 rounded-full p-6 shadow-xl">
            <Loader2 className="h-16 w-16 animate-spin text-white" />
          </div>
          <p className="text-xl font-medium text-slate-700">
            Loading election data...
          </p>
        </div>
      </div>
    );
  }

  if (walletMismatch) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-emerald-50 to-white py-10">
        <div className="w-full max-w-2xl px-6">
          <Card className="border-2 border-emerald-200 shadow-xl">
            <CardHeader className="bg-emerald-50 border-b border-emerald-200">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-emerald-600" />
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Wallet Address Mismatch
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Alert className="mb-6 bg-emerald-50 border-emerald-300">
                <AlertCircle className="h-5 w-5 text-emerald-600" />
                <AlertTitle className="text-slate-900 font-semibold">
                  Security Alert
                </AlertTitle>
                <AlertDescription className="text-slate-700 mt-2">
                  {walletMismatchMessage}
                </AlertDescription>
              </Alert>

              <div className="space-y-4 text-slate-700">
                <p className="font-medium">
                  You are currently connected with a wallet that doesn't match
                  your registered account.
                </p>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900 mb-2">
                    <Info className="h-4 w-4 inline mr-2" />
                    How to fix this:
                  </p>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Open your MetaMask wallet</li>
                    <li>Switch to the wallet address you registered with</li>
                    <li>Refresh this page</li>
                    <li>Ensure you're logged in with the correct TP number</li>
                  </ol>
                </div>

                <p className="text-sm text-slate-600">
                  <strong>Why is this happening?</strong> To prevent multiple
                  votes, each student can only vote using the wallet address
                  they registered with during account creation.
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => {
                    setRefreshTrigger((prev) => prev + 1);
                  }}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  Refresh Page
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onNavigate("home")}
                  className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  Return Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!electionActive) {
    return (
      <div className="container py-10 max-w-4xl mx-auto flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No Active Election
              </h3>
              <p className="text-slate-600 mb-6">
                There is currently no election running.
              </p>
              <Button onClick={() => onNavigate("home")}>Return Home</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (electionEnded) {
    return (
      <div className="container py-10 max-w-4xl mx-auto flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Clock className="h-12 w-12 text-slate-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Election Ended
              </h3>
              <p className="text-slate-600 mb-6">
                The election has ended. Thank you for your participation.
              </p>
              <Button onClick={() => onNavigate("results")}>
                View Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (voted || alreadyVoted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-emerald-50 to-white py-10">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            {/* Icon */}
            <div className="bg-emerald-500 rounded-full p-6 shadow-xl">
              <CheckCircle2 className="h-16 w-16 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-slate-900">
              {alreadyVoted ? "Already Voted!" : "Vote Submitted!"}
            </h2>

            {/* Description */}
            <p className="text-lg text-slate-600 max-w-sm">
              {alreadyVoted
                ? "You have already cast your vote in this election. Your vote has been recorded on the blockchain."
                : "Your vote has been successfully recorded on the blockchain."}
            </p>

            {/* Button */}
            <Button
              onClick={() => onNavigate("my-votes")}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-lg rounded-xl shadow-lg"
            >
              View My Votes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ================= MAIN UI ================= */

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl flex h-16 items-center px-6 md:px-8">
          <div className="flex items-center gap-2 w-48">
            <img src={apuLogo} alt="APU Logo" className="h-8 w-8" />
            <span className="font-semibold text-slate-900">Elections</span>
          </div>
          <nav className="hidden md:flex gap-6 flex-1 justify-center">
            <button
              onClick={() => onNavigate("home")}
              className="text-sm font-normal text-slate-600 hover:text-slate-900 transition-colors"
            >
              Home
            </button>
            <button
              onClick={handleElectionsClick}
              className="text-sm font-normal text-primary"
            >
              Elections
            </button>
            <button
              onClick={() => onNavigate("results")}
              className="text-sm font-normal text-slate-600 hover:text-slate-900 transition-colors"
            >
              Results
            </button>
            <button
              onClick={() => onNavigate("my-votes")}
              className="text-sm font-normal text-slate-600 hover:text-slate-900 transition-colors"
            >
              My Votes
            </button>
            <button
              onClick={() => onNavigate("about")}
              className="text-sm font-normal text-slate-600 hover:text-slate-900 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => onNavigate("contact")}
              className="text-sm font-normal text-slate-600 hover:text-slate-900 transition-colors"
            >
              Contact
            </button>
          </nav>
          <div className="flex items-center gap-3 w-48 justify-end">
            {currentUser ? (
              <UserNav onNavigate={onNavigate} />
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate("register")}
                >
                  Register
                </Button>
                <Button
                  size="sm"
                  onClick={() => onNavigate("login")}
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-6 md:px-8 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => onNavigate("home")}
              className="mb-6 -ml-2 text-slate-700 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>

            <div className="flex items-center gap-3 mb-4">
              <img src={apuLogo} alt="APU Logo" className="h-12 w-12" />
              <h1 className="text-3xl font-bold text-slate-900">
                Cast Your Vote
              </h1>
            </div>

            <p className="text-slate-600 mb-6">
              Select your preferred candidates for each category in the{" "}
              {electionTitle}
            </p>

            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-slate-900 font-semibold">
                Important Information
              </AlertTitle>
              <AlertDescription className="text-slate-600">
                Your vote will be recorded on the Ethereum blockchain and cannot
                be changed once submitted. Make sure to review your choices
                before confirming.
              </AlertDescription>
            </Alert>

            <Card className="border-2 shadow-lg">
              <CardHeader className="border-b bg-white">
                <CardTitle className="text-xl font-bold text-slate-900">
                  {electionTitle}
                </CardTitle>
                {electionDescription && (
                  <CardDescription className="text-slate-600 mt-2">
                    {electionDescription}
                  </CardDescription>
                )}
                {timeRemaining && (
                  <CardDescription className="text-amber-600 font-medium mt-2">
                    {timeRemaining}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="pt-6">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList
                    ref={tabsListRef}
                    className="relative w-full mb-6 bg-slate-200 p-1 rounded-lg overflow-hidden grid grid-cols-3"
                  >
                    {/* Sliding white pill */}
                    <div
                      className="absolute top-1 bottom-1 rounded-md bg-white shadow-sm transition-all duration-300 ease-out"
                      style={
                        {
                          "--indicator-left": `${indicator.left}px`,
                          "--indicator-width": `${indicator.width}px`,
                        } as React.CSSProperties
                      }
                    />

                    {categories.map((cat) => (
                      <TabsTrigger
                        key={cat.id}
                        value={cat.name}
                        ref={(node) => {
                          triggerRefs.current[cat.name] = node;
                        }}
                        className="
                        relative z-10 rounded-md transition-colors
                        data-[state=active]:text-slate-900
                        data-[state=inactive]:text-slate-500
                        data-[state=inactive]:bg-transparent
                      "
                      >
                        {cat.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <p className="text-center text-slate-600 mb-6">
                    Select your preferred candidate for each position below
                  </p>

                  {categories.map((cat) => (
                    <TabsContent
                      key={cat.id}
                      value={cat.name}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-4">
                        Select one candidate for this position
                      </p>

                      <RadioGroup
                        value={String(selectedVotes[cat.id] || "")}
                        onValueChange={(v) => handleSelect(cat.id, v)}
                      >
                        {candidatesByCategory[cat.id]?.map((cand) => (
                          <div
                            key={cand.id}
                            className={`flex items-center space-x-3 rounded-lg border-2 p-4 transition-all cursor-pointer ${
                              selectedVotes[cat.id] === cand.id
                                ? "border-emerald-500 bg-emerald-50"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                          >
                            <RadioGroupItem
                              value={String(cand.id)}
                              id={`cand-${cand.id}`}
                              className="border-gray-300"
                            />
                            <Label
                              htmlFor={`cand-${cand.id}`}
                              className="flex flex-col cursor-pointer w-full"
                            >
                              <span className="font-medium text-slate-900">
                                {cand.candidate_name}
                              </span>
                              <span className="text-sm text-slate-500">
                                {cand.party}
                              </span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>

              <CardFooter className="flex flex-col border-t pt-6 pb-6">
                <Button
                  className={`w-full h-12 text-base font-medium transition-colors rounded-lg ${
                    !isFormComplete() || submitting
                      ? "bg-slate-400 hover:bg-slate-400 cursor-not-allowed text-white"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                  disabled={!isFormComplete() || submitting}
                  onClick={handleVote}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : !isFormComplete() ? (
                    "Please Select All Positions"
                  ) : (
                    "Submit Vote"
                  )}
                </Button>
                <p className="text-xs text-slate-500 text-center mt-3">
                  By submitting your vote, you confirm that you are eligible to
                  vote in this election and that you are casting your vote of
                  your own free will.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6 bg-white">
        <div className="container mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 md:flex-row px-6 md:px-8">
          <div className="text-center text-sm text-slate-600 md:text-left">
            © {new Date().getFullYear()} APU Vote Chain. All rights reserved.
          </div>
          <div className="flex gap-6">
            <button
              onClick={() => onNavigate("terms")}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Terms
            </button>
            <button
              onClick={() => onNavigate("privacy")}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Privacy
            </button>
            <button
              onClick={() => onNavigate("contact")}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Contact
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
