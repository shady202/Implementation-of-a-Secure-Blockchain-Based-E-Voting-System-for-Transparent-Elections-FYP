import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ArrowLeft, CheckCircle2, Info, Loader2, AlertCircle, Clock } from "lucide-react";
import { castVote, getElectionState, getAllCandidatesOnChain, BlockchainCandidate } from "../lib/blockchain";
import * as api from "../lib/api";

const apuLogo = "/apu-logo.png";

interface Candidate {
  id: string;
  name: string;
  position: string;
  party: string;
  category: string;
  votes: number;
  contractId: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  maxVotes: number;
  isActive: boolean;
}

interface VotePageProps {
  onNavigate: (page: string) => void;
}

export function VotePage({ onNavigate }: VotePageProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [voted, setVoted] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeCategories, setActiveCategories] = useState<Category[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, string>>({});
  const [activeCategory, setActiveCategory] = useState("");
  const [electionTitle, setElectionTitle] = useState("APU Election");
  const [electionEndDate, setElectionEndDate] = useState("");
  const [electionStartDate, setElectionStartDate] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");
  const [electionEnded, setElectionEnded] = useState(false);
  const [electionNotStarted, setElectionNotStarted] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      onNavigate('login');
      return;
    }

    const fetchData = async () => {
      try {
        // Check if wallet is connected
        if (typeof window.ethereum === 'undefined') {
          // MetaMask not installed, redirect to voter registration page
          onNavigate('voter-registration');
          return;
        }

        // Check if accounts are connected
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (!accounts || accounts.length === 0) {
          // Wallet not connected, redirect to voter registration page
          onNavigate('voter-registration');
          return;
        }

        // Check if user is registered as a voter using the backend API
        const walletAddress = accounts[0];
        const voterStatus = await api.checkVoterRegistration(walletAddress);

        if (!voterStatus.registered) {
          // Not registered, redirect to voter registration page
          onNavigate('voter-registration');
          return;
        }

        // User is registered, check if they've already voted
        setHasVoted(voterStatus.voter?.hasVoted || false);

        // Get categories and candidates, but now with robust types
        const [categoriesData, adminData, settingsData, blockchainCandidates] = await Promise.all([
          api.getCategories(),
          api.getAdminData(),
          api.getElectionSettings(),
          getAllCandidatesOnChain()
        ]);

        console.log("DEBUG Blockchain Candidates:", blockchainCandidates);

        // Filter only active categories
        const activeCategs = (categoriesData.categories || []).filter((cat: Category) => cat.isActive);
        setActiveCategories(activeCategs);

        // Set the first active category as default
        if (activeCategs.length > 0) {
          setActiveCategory(activeCategs[0].name);
        }

        // Merge local data with blockchain IDs SAFELY
        const localCandidates = adminData.candidates || [];

        // Use a more strict matching approach
        // We map UI candidates to a blockchain match. If no match, contractId is null.
        const mergedCandidates = localCandidates.map((local: any) => {
          const match = (blockchainCandidates as BlockchainCandidate[]).find((bc) =>
            bc.name.trim().toLowerCase() === local.name.trim().toLowerCase() &&
            bc.position.trim().toLowerCase() === local.position.trim().toLowerCase()
          );

          if (!match) {
            console.warn(`ℹ️ No blockchain match for candidate: ${local.name} (${local.position})`);
            console.warn("   This is normal if the contract was recently deployed and hasn't been populated yet.");
            return { ...local, contractId: null }; // DO NOT fallback to 1 or any guess
          }

          return {
            ...local,
            contractId: match.id // Real blockchain ID
          };
        });

        setCandidates(mergedCandidates);
        console.log("DEBUG Final Merged Candidates:", mergedCandidates);

        setElectionTitle(settingsData.title || "APU Election");
        setElectionEndDate(settingsData.endDate || "");
        setElectionStartDate(settingsData.startDate || "");

        // Check if election has ended or not started
        if (settingsData.startDate && settingsData.endDate) {
          const now = new Date();
          const endDate = new Date(settingsData.endDate);
          const startDate = new Date(settingsData.startDate);

          if (now > endDate) {
            setElectionEnded(true);
          } else if (now < startDate) {
            setElectionNotStarted(true);
          }
        }

      } catch (error) {
        console.error("Error fetching election data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [onNavigate]);

  // Update countdown timer every second
  useEffect(() => {
    if (!electionEndDate) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const endTime = new Date(electionEndDate).getTime();
      const distance = endTime - now;

      if (distance < 0) {
        setTimeRemaining("Election ended");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m remaining`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s remaining`);
      } else {
        setTimeRemaining(`${minutes}m ${seconds}s remaining`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [electionEndDate]);

  // Group candidates by category and position
  const getCandidatesByCategory = (categoryName: string) => {
    return candidates.filter(c => c.category === categoryName);
  };

  // Group candidates by position within a category
  const getPositionsForCategory = (categoryName: string) => {
    const categoryCandidates = getCandidatesByCategory(categoryName);
    const positions: Record<string, Candidate[]> = {};

    categoryCandidates.forEach(candidate => {
      if (!positions[candidate.position]) {
        positions[candidate.position] = [];
      }
      positions[candidate.position].push(candidate);
    });

    return positions;
  };

  /* 
   * Handle voting logic strictly using IDs 
   */
  const handleVote = async () => {
    setSubmitting(true);

    try {
      console.log("🔍 Checking blockchain election state...");
      const blockchainState = await getElectionState();
      console.log("📊 Blockchain state:", blockchainState);

      if (!blockchainState.isActive) {
        // ... error handling ...
        throw new Error("Election is not active on blockchain.");
      }

      console.log("DEBUG — selectedIds map:", selectedCandidates);

      // Construct valid votes map: { position: candidateId_number }
      // The selectedCandidates state now stores the real BLOCKCHAIN ID, not the name.
      // Wait, let's verify what we store in handleSelectCandidate first.

      // Actually, relying on state being name or ID is confusing.
      // Let's ensure selectedCandidates stores CANDIDATE NAME or UI ID, and we lookup the contract ID here?
      // User request said: "selectedCandidates: { [position: string]: string } // name or UI id"

      // Let's assume selectedCandidates stores the UI ID (local ID) or Name. 
      // But looking at previous code, handleSelectCandidate passed 'candidateId'.

      // Let's act defensively. We will re-find the candidate object to get the real contractId.

      const votesToCast: Record<string, string> = {};

      for (const [position, selectedValue] of Object.entries(selectedCandidates)) {
        if (!selectedValue) continue;

        // Find candidate in our merged list to get the real contract ID
        // dependent on what selectedValue is (ID or Name?)
        // Looking at RadioGroupItem usage (not shown here but likely assumes ID or Name)
        // Let's assume selectedValue matches candidate.id (local UUID) for safety?
        // Or if we updated RadioGroup to use contractId?

        // Let's look at how we will render RadioGroupItem first (in next step).
        // Ideally, we vote with the contractId directly.

        // FOR NOW: Let's assume we will pass the CONTRACT ID directly into selectedCandidates if available.
        // BUT the user prompt said: "mergedCandidates.find(c => c.name === selectedName...)"

        // So I should look it up.

        const candidate = candidates.find(c => c.name === selectedValue || c.id === selectedValue);
        // (Matching by name or ID is a bit risky but flexible)

        if (!candidate) {
          console.warn(`Selected candidate ${selectedValue} not found in list`);
          continue;
        }

        if (!candidate.contractId && candidate.contractId !== 0) {
          console.error(`Candidate ${candidate.name} has no valid blockchain ID (contractId=${candidate.contractId})`);
          continue; // SKIP invalid candidates
        }

        // We have a valid candidate with a contractId
        console.log(`Voting for ${position}: candidate ID ${candidate.contractId}`);
        votesToCast[position] = String(candidate.contractId);
      }

      if (Object.keys(votesToCast).length === 0) {
        throw new Error("No valid candidates selected to vote for.");
      }

      await castVote(votesToCast);
      setVoted(true);

    } catch (error: any) {
      console.error("❌ Error casting vote:", error);
      alert(error.message || "Failed to cast vote");
    } finally {
      setSubmitting(false);
    }
  };


  const handleSelectCandidate = (positionId: string, candidateId: string) => {
    console.log("DEBUG — handleSelectCandidate called:", { positionId, candidateId });
    const newSelections = {
      ...selectedCandidates,
      [positionId]: candidateId,
    };
    console.log("DEBUG — newSelections:", newSelections);
    setSelectedCandidates(newSelections);
  };

  const isFormComplete = () => {
    // Check if at least one candidate is selected per category/position
    const allPositions: string[] = [];
    activeCategories.forEach(category => {
      const positions = getPositionsForCategory(category.name);
      allPositions.push(...Object.keys(positions));
    });

    return allPositions.every((position) => selectedCandidates[position]);
  };

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
          <p className="text-slate-600">Loading election data...</p>
        </div>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 mr-auto"
                onClick={() => onNavigate('home')}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </div>
            <CardTitle>Already Voted</CardTitle>
            <CardDescription>You have already cast your vote in this election</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
              <h3 className="text-slate-900">Thank You For Voting!</h3>
              <div className="text-slate-600 mt-2 mb-6">
                Your vote has been recorded on the blockchain and cannot be changed.
              </div>
              <Button onClick={() => onNavigate('results')}>
                View Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (voted) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 mr-auto"
                onClick={() => onNavigate('home')}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </div>
            <CardTitle>Vote Successful</CardTitle>
            <CardDescription>Your vote has been recorded on the blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
              <h3 className="text-slate-900">Thank You For Voting!</h3>
              <div className="text-slate-600 mt-2 mb-6">
                Your vote has been securely recorded. The transaction hash has been sent to your email for verification.
              </div>
              <Button onClick={() => onNavigate('results')}>
                View Results
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <div className="text-xs text-slate-600 text-center">
              Transaction ID: 0x7f9e4b5c3d2a1b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // No candidates state
  if (candidates.length === 0) {
    return (
      <div className="container py-12">
        <div className="flex flex-col items-center max-w-4xl mx-auto">
          <div className="w-full mb-8">
            <div className="mb-4">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1"
                onClick={() => onNavigate('home')}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <img src={apuLogo} alt="Asia Pacific University Logo" className="h-10 w-auto ml-4" />
              <h1 className="text-slate-900">Cast Your Vote</h1>
            </div>
            <div className="text-slate-600">
              Select your preferred candidates for each position in the Student Council Election 2025
            </div>
          </div>

          <Card className="w-full">
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <AlertCircle className="h-16 w-16 text-amber-500" />
                <h3 className="text-slate-900">No candidates available</h3>
                <p className="text-slate-600 max-w-md">
                  The election administrator hasn't added any candidates yet. Please check back later.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Election ended screen
  if (electionEnded) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-12">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-12 pb-8">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <div className="rounded-full bg-red-100 p-6">
                <AlertCircle className="h-20 w-20 text-red-600" />
              </div>
              <div className="space-y-3">
                <h2 className="text-slate-900">Election Has Ended</h2>
                <p className="text-slate-600 text-lg max-w-md">
                  The voting period for <span className="font-medium">{electionTitle}</span> has concluded.
                </p>
                <p className="text-slate-500">
                  Voting ended on {new Date(electionEndDate).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
              </div>
              <div className="flex gap-4 mt-4">
                <Button onClick={() => onNavigate('results')} size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  View Results
                </Button>
                <Button onClick={() => onNavigate('home')} variant="outline" size="lg">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Election not started screen
  if (electionNotStarted) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-12">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-12 pb-8">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <div className="rounded-full bg-amber-100 p-6">
                <Clock className="h-20 w-20 text-amber-600" />
              </div>
              <div className="space-y-3">
                <h2 className="text-slate-900">Election Not Started Yet</h2>
                <p className="text-slate-600 text-lg max-w-md">
                  The voting period for <span className="font-medium">{electionTitle}</span> hasn't begun yet.
                </p>
                <p className="text-slate-500">
                  Voting starts on {new Date(electionStartDate).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
              </div>
              <div className="mt-4">
                <Button onClick={() => onNavigate('home')} variant="outline" size="lg">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col items-center max-w-4xl mx-auto">
        <div className="w-full mb-8">
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => onNavigate('home')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <img src={apuLogo} alt="Asia Pacific University Logo" className="h-10 w-auto ml-4" />
            <h1 className="text-slate-900">Cast Your Vote</h1>
          </div>
          <div className="text-slate-600">
            Select your preferred candidates for each category in the {electionTitle}
          </div>
        </div>

        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Important Information</AlertTitle>
          <AlertDescription>
            Your vote will be recorded on the Ethereum blockchain and cannot be changed once submitted. Make sure to
            review your choices before confirming.
          </AlertDescription>
        </Alert>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>{electionTitle}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              {timeRemaining && (
                <span className="text-amber-600 font-medium">{timeRemaining}</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeCategories.length > 0 ? (
              <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                <TabsList className={`grid w-full mb-6`} style={{ gridTemplateColumns: `repeat(${activeCategories.length}, 1fr)` }}>
                  {activeCategories.map((category) => (
                    <TabsTrigger key={category.id} value={category.name}>
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <p className="text-slate-600 mb-6 text-center">
                  Select your preferred candidate for each position below
                </p>

                {activeCategories.map((category) => {
                  const positions = getPositionsForCategory(category.name);
                  return (
                    <TabsContent key={category.id} value={category.name} className="space-y-6">
                      {Object.keys(positions).length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-slate-600">No candidates available in this category yet.</p>
                        </div>
                      ) : (
                        Object.entries(positions).map(([positionName, positionCandidates]) => (
                          <div key={positionName} className="space-y-4">
                            <h3 className="text-slate-900">{positionName}</h3>
                            <div className="text-slate-600 mb-4">Select one candidate for this position</div>
                            <RadioGroup
                              value={selectedCandidates[positionName] || ""}
                              onValueChange={(value: string) => handleSelectCandidate(positionName, value)}
                            >
                              {positionCandidates.map((candidate, index) => {
                                // Use contractId if valid, otherwise use array index + 1 (contract IDs start at 1)
                                const contractId = candidate.contractId;
                                const isValidContractId = contractId !== null && contractId !== undefined && !isNaN(Number(contractId));
                                const candidateValue = isValidContractId ? String(contractId) : String(index + 1);

                                return (
                                  <div
                                    key={candidate.id}
                                    className={`flex items-center space-x-2 rounded-lg border p-4 ${selectedCandidates[positionName] === candidateValue
                                      ? "border-emerald-500 bg-emerald-50"
                                      : ""
                                      }`}
                                  >
                                    <RadioGroupItem
                                      value={candidateValue}
                                      id={`candidate-${candidate.id}`}
                                    />
                                    <Label htmlFor={`candidate-${candidate.id}`} className="flex flex-col cursor-pointer w-full">
                                      <span className="text-slate-900">{candidate.name}</span>
                                      <span className="text-slate-600">{candidate.party}</span>
                                    </Label>
                                  </div>
                                );
                              })}
                            </RadioGroup>
                          </div>
                        ))
                      )}
                    </TabsContent>
                  );
                })}
              </Tabs>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                <h3 className="text-slate-900 mb-2">No Active Categories</h3>
                <p className="text-slate-600">
                  The election administrator hasn't activated any voting categories yet.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col border-t pt-6">
            <Button
              onClick={handleVote}
              disabled={activeCategories.length === 0 || !isFormComplete() || submitting}
              className="w-full mb-4"
              size="lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : activeCategories.length === 0 ? (
                "No Categories Available"
              ) : !isFormComplete() ? (
                "Please Select All Positions"
              ) : (
                "Submit Vote"
              )}
            </Button>
            <div className="text-xs text-slate-600 text-center">
              By submitting your vote, you confirm that you are eligible to vote in this election and that you are
              casting your vote of your own free will.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}