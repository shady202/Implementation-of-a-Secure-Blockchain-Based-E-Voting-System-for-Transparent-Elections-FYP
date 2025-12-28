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
import { isLoggedIn } from "../lib/session";

const apuLogo = "/apu-logo.png";

interface Category {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

interface Candidate {
  id: number;
  name: string;
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
  const currentUser = isLoggedIn();

  const [electionActive, setElectionActive] = useState(false);
  const [electionEnded, setElectionEnded] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [candidatesByCategory, setCandidatesByCategory] = useState<
    Record<number, Candidate[]>
  >({});

  const [selectedVotes, setSelectedVotes] = useState<Record<number, number>>(
    {}
  );
  const [activeTab, setActiveTab] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");
  const [electionTitle, setElectionTitle] = useState("Election");

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
        const registered = await isVoterRegistered();
        setIsRegistered(registered);

        if (!registered) {
          onNavigate("voter-registration");
          return;
        }
      } catch (err) {
        console.error("Failed to check voter registration", err);
        setIsRegistered(false);
      } finally {
        setCheckingRegistration(false);
      }
    };

    checkRegistration();
  }, [onNavigate]);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    if (!isRegistered) return;

    const loadData = async () => {
      try {
        setLoading(true);

        const electionState = await getElectionState();
        setElectionActive(electionState.isActive);
        setElectionEnded(electionState.hasEnded);

        setElectionTitle(electionState.title || "Election");

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
          }
        } else {
          setTimeRemaining("");
        }

        if (!electionState.isActive) {
          setElectionActive(false);
          setLoading(false);
          return;
        }

        const cats = await getAllCategories();
        setCategories(cats);

        if (cats.length > 0) {
          setActiveTab(cats[0].name);
        }

        const candidatesMap: Record<number, Candidate[]> = {};
        for (const c of cats) {
          const cands = await getCandidatesForCategory(c.id);
          candidatesMap[c.id] = cands;
        }

        setCandidatesByCategory(candidatesMap);

        // HYBRID VOTE CHECK: Database (fast) + Blockchain (secure)
        // New contract deployed with reset bug FIXED!
        try {
          const provider = new ethers.BrowserProvider((window as any).ethereum);
          const signer = await provider.getSigner();
          const walletAddress = await signer.getAddress();

          console.log("🔍 HYBRID vote check for wallet:", walletAddress);

          // ⚡ STEP 1: Check DATABASE (fast, election-specific)
          let databaseSaysVoted = false;
          try {
            const dbResponse = await fetch(
              "http://localhost:3001/api/voters/check-registration",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ walletAddress }),
              }
            );
            const dbData = await dbResponse.json();
            databaseSaysVoted = dbData.registered && dbData.hasVoted;
            console.log(
              "💾 Database check:",
              databaseSaysVoted ? "❌ VOTED" : "✅ Not voted"
            );
          } catch (dbErr) {
            console.error("Database check failed:", dbErr);
          }

          // 🔒 STEP 2: Check BLOCKCHAIN (secure, permanent audit)
          let blockchainSaysVoted = false;
          try {
            console.log(
              "📋 Checking blockchain for categories:",
              cats.map((c: Category) => ({ id: c.id, name: c.name }))
            );

            for (const cat of cats) {
              const hasVoted = await hasVotedInCategory(walletAddress, cat.id);
              if (hasVoted) {
                blockchainSaysVoted = true;
                console.log(
                  "⛓️  Blockchain: VOTED in category",
                  cat.name,
                  "(ID:",
                  cat.id,
                  ")"
                );
                break;
              }
            }
            console.log(
              "⛓️  Blockchain check:",
              blockchainSaysVoted ? "❌ VOTED" : "✅ Not voted"
            );
          } catch (bcErr) {
            console.error("Blockchain check failed:", bcErr);
          }

          // ✅ FINAL DECISION: Block if EITHER says voted
          if (databaseSaysVoted || blockchainSaysVoted) {
            const detectedBy =
              databaseSaysVoted && blockchainSaysVoted
                ? "both database AND blockchain"
                : databaseSaysVoted
                ? "database"
                : "blockchain";

            console.warn(
              "❌ ALREADY VOTED - Detected by:",
              detectedBy,
              "\n  Database:",
              databaseSaysVoted ? "VOTED" : "Not voted",
              "\n  Blockchain:",
              blockchainSaysVoted ? "VOTED" : "Not voted"
            );
            setAlreadyVoted(true);
          } else {
            console.log(
              "✅ ELIGIBLE TO VOTE - Both checks passed:\n  Database: Not voted\n  Blockchain: Not voted"
            );
            setAlreadyVoted(false);
          }
        } catch (err) {
          console.error("❌ Failed to check voting status:", err);
          setAlreadyVoted(true);
        }
      } catch (err) {
        console.error("Failed to load election data", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isRegistered]);

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

  const handleSelect = (categoryId: number, candidateId: number) => {
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

      const votes = categories.map((cat) => ({
        categoryId: cat.id,
        candidateId: selectedVotes[cat.id],
      }));

      const result = await batchVote(votes);

      // Step 2: Save votes to database for LIFETIME history
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      try {
        // Get current election ID from database (if exists)
        const electionResponse = await fetch(
          "http://localhost:3001/api/elections/current"
        );
        const electionData = await electionResponse.json();

        // ALWAYS save vote history, even if no election!
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
            candidateName: candidate?.name || `Candidate ${candidateId}`,
            transactionHash: result.transactionHash,
          };
        });

        // Save vote history (works with or without election)
        const saveResponse = await fetch(
          "http://localhost:3001/api/votes/save",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              walletAddress,
              electionId, // Can be null
              votes: votesWithNames,
            }),
          }
        );

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
          "http://localhost:3001/api/voters/mark-voted",
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
                {timeRemaining && (
                  <CardDescription className="text-amber-600 font-medium">
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
                        onValueChange={(v) => handleSelect(cat.id, Number(v))}
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
                                {cand.name}
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
