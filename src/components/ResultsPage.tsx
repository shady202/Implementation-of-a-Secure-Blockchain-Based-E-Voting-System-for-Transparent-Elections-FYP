import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ArrowLeft, Clock, RefreshCw, AlertCircle } from "lucide-react";
import {
  getAllCategories,
  getCandidatesForCategory,
  getElectionState,
} from "../lib/blockchain";
import { UserNav } from "./UserNav";
import { isLoggedIn } from "../lib/session";

const apuLogo = "/apu-logo.png";

interface Candidate {
  id: string;
  name: string;
  position: string;
  party: string;
  category: string;
  votes: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  maxVotes: number;
  isActive: boolean;
}

interface ResultsPageProps {
  onNavigate: (page: string) => void;
}

export function ResultsPage({ onNavigate }: ResultsPageProps) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeCategories, setActiveCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [electionTitle, setElectionTitle] = useState("APU Election");
  const [electionDescription, setElectionDescription] = useState("");
  const [showResults, setShowResults] = useState(true);
  const [electionActive, setElectionActive] = useState(false);

  const currentUser = isLoggedIn();

  useEffect(() => {
    fetchResults();
  }, []);

  // Group candidates by category
  const getCandidatesByCategory = (categoryName: string) => {
    return candidates.filter((c) => c.category === categoryName);
  };

  // Group candidates by position within a category
  const getPositionsForCategory = (categoryName: string) => {
    const categoryCandidates = getCandidatesByCategory(categoryName);
    const positions: Record<string, Candidate[]> = {};

    categoryCandidates.forEach((candidate) => {
      if (!positions[candidate.position]) {
        positions[candidate.position] = [];
      }
      positions[candidate.position].push(candidate);
    });

    // Sort candidates by votes within each position
    Object.keys(positions).forEach((position) => {
      positions[position].sort((a, b) => b.votes - a.votes);
    });

    return positions;
  };

  const fetchResults = async () => {
    try {
      setLoading(true);

      // ✅ Get data directly from blockchain
      const [categoriesData, electionData] = await Promise.all([
        getAllCategories(),
        getElectionState(),
      ]);

      // Filter only active categories
      const activeCategs = categoriesData.filter((cat: any) => cat.isActive);
      setActiveCategories(
        activeCategs.map((cat: any) => ({
          id: String(cat.id),
          name: cat.name,
          description: cat.description,
          maxVotes: 1,
          isActive: cat.isActive,
        }))
      );

      // Set the first active category as default
      if (activeCategs.length > 0) {
        setActiveCategory(activeCategs[0].name);
      }

      // ✅ Get candidates for ALL categories from blockchain
      const allCandidates: Candidate[] = [];
      for (const cat of activeCategs) {
        const catCandidates = await getCandidatesForCategory(cat.id);
        catCandidates.forEach((cand: any) => {
          allCandidates.push({
            id: String(cand.id),
            name: cand.name,
            position: cat.name, // Use category name as position
            party: cand.party,
            category: cat.name,
            votes: Number(cand.votes || cand.voteCount || 0), // Get vote count from blockchain!
          });
        });
      }
      setCandidates(allCandidates);

      setElectionTitle(electionData.title || "APU Election");

      // Fetch election description from database (not on blockchain)
      try {
        const API_URL = (
          import.meta.env.VITE_API_URL || "http://localhost:3001/api"
        ).replace(/\/api$/, "");
        const electionResponse = await fetch(
          `${API_URL}/api/elections/current`
        );
        const dbElectionData = await electionResponse.json();
        if (dbElectionData.election?.description) {
          setElectionDescription(dbElectionData.election.description);
        }
      } catch (err) {
        console.error("Failed to fetch election description:", err);
      }

      // Check if election is currently active
      setElectionActive(electionData.isActive);
      setShowResults(true); // Always show results for testing

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching results:", error);
      setCandidates([]);
      setActiveCategories([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchResults();
  };

  const calculatePercentage = (votes: number, totalVotes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const getTotalVotesForPosition = (positionCandidates: Candidate[]) => {
    return positionCandidates.reduce((sum, c) => sum + c.votes, 0);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl flex h-16 items-center px-6 md:px-8">
          <div className="flex items-center gap-2 w-48">
            <img src={apuLogo} alt="APU Logo" className="h-8 w-8" />
            <span className="font-semibold text-slate-900">Results</span>
          </div>
          <nav className="hidden md:flex gap-6 flex-1 justify-center">
            <button
              onClick={() => onNavigate("home")}
              className="text-sm font-normal text-slate-600 hover:text-slate-900 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate("vote")}
              className="text-sm font-normal text-slate-600 hover:text-slate-900 transition-colors"
            >
              Elections
            </button>
            <button
              onClick={() => onNavigate("results")}
              className="text-sm font-normal text-primary"
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
                  onClick={() => onNavigate("register")}
                >
                  Register
                </Button>
                <Button onClick={() => onNavigate("login")}>Sign In</Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-7xl px-6 md:px-8 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 mb-4"
              onClick={() => onNavigate("home")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-slate-900 mb-2">{electionTitle}</h1>
                {electionDescription && (
                  <p className="text-slate-600 mb-3">{electionDescription}</p>
                )}
                <div className="flex items-center gap-4 text-slate-600">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                  {electionActive && (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-sm">
                      Election In Progress
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>

          {/* Results hidden during voting */}
          {!showResults && electionActive ? (
            <div className="flex flex-col items-center justify-center text-center space-y-6 py-24">
              <div className="bg-amber-500 rounded-full p-6 shadow-xl">
                <AlertCircle className="h-16 w-16 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Results Hidden
              </h3>
              <p className="text-lg text-slate-600 max-w-md">
                Results are hidden during the voting period. Please check back
                after the election ends to view the results.
              </p>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center space-y-6 py-24">
              <div className="relative">
                <div className="bg-emerald-500 rounded-full p-6 shadow-xl">
                  <RefreshCw className="h-16 w-16 animate-spin text-white" />
                </div>
              </div>
              <p className="text-xl font-medium text-slate-700">
                Loading results...
              </p>
            </div>
          ) : activeCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center space-y-6 py-24">
              <div className="bg-amber-500 rounded-full p-6 shadow-xl">
                <AlertCircle className="h-16 w-16 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                No Categories Available
              </h3>
              <p className="text-lg text-slate-600 max-w-md">
                The election administrator hasn't set up any voting categories
                yet.
              </p>
            </div>
          ) : (
            <Tabs
              value={activeCategory}
              onValueChange={setActiveCategory}
              className="w-full"
            >
              <TabsList className="w-full mb-6 bg-slate-200 p-1 rounded-xl grid grid-cols-3 h-14">
                {activeCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.name}
                    className="
                      rounded-lg transition-all duration-200 font-medium
                      data-[state=active]:!bg-white data-[state=active]:!text-slate-900 data-[state=active]:!shadow-md
                      data-[state=inactive]:!bg-gray-400 data-[state=inactive]:!text-slate-700
                    "
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {activeCategories.map((category) => {
                const positions = getPositionsForCategory(category.name);
                return (
                  <TabsContent
                    key={category.id}
                    value={category.name}
                    className="space-y-6"
                  >
                    {Object.keys(positions).length === 0 ? (
                      <Card>
                        <CardContent className="py-12">
                          <div className="text-center">
                            <p className="text-slate-600">
                              No candidates in this category yet.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      Object.entries(positions).map(
                        ([positionName, positionCandidates]) => {
                          const totalVotes =
                            getTotalVotesForPosition(positionCandidates);
                          return (
                            <Card
                              key={positionName}
                              className="border-2 shadow-lg"
                            >
                              <CardHeader>
                                <CardTitle>{positionName}</CardTitle>
                                <CardDescription>
                                  Total votes cast: {totalVotes}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                {positionCandidates.map((candidate, index) => {
                                  const percentage = calculatePercentage(
                                    candidate.votes,
                                    totalVotes
                                  );
                                  const isWinner =
                                    index === 0 && totalVotes > 0;

                                  return (
                                    <div
                                      key={candidate.id}
                                      className={`p-4 rounded-lg border ${
                                        isWinner
                                          ? "border-emerald-500 bg-emerald-50"
                                          : "border-slate-200"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                          <div
                                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                              isWinner
                                                ? "bg-emerald-500 text-white"
                                                : "bg-slate-200 text-slate-600"
                                            }`}
                                          >
                                            {index + 1}
                                          </div>
                                          <div>
                                            <div className="flex items-center gap-2">
                                              <span className="text-slate-900">
                                                {candidate.name}
                                              </span>
                                              {isWinner && (
                                                <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-xs">
                                                  Leading
                                                </span>
                                              )}
                                            </div>
                                            <div className="text-slate-600">
                                              {candidate.party}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-slate-900">
                                            {candidate.votes} votes
                                          </div>
                                          <div className="text-slate-600">
                                            {percentage}%
                                          </div>
                                        </div>
                                      </div>
                                      {/* Progress bar */}
                                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                          className={`h-full transition-all duration-500 ${
                                            isWinner
                                              ? "bg-emerald-500"
                                              : "bg-slate-400"
                                          }`}
                                          style={{ width: `${percentage}%` }}
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </CardContent>
                            </Card>
                          );
                        }
                      )
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          )}

          {/* Election Info */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Election Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Total Categories:</span>
                <span className="text-slate-900">
                  {activeCategories.length}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Candidates:</span>
                <span className="text-slate-900">{candidates.length}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Status:</span>
                <span className="text-slate-900">
                  {electionActive ? "In Progress" : "Completed"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
