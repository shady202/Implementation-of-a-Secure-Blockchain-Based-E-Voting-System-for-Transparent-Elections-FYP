import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ArrowLeft, Clock, RefreshCw, AlertCircle } from "lucide-react";
import * as api from "../lib/api";
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
  const [showResults, setShowResults] = useState(true);
  const [electionActive, setElectionActive] = useState(false);

  const currentUser = isLoggedIn();

  useEffect(() => {
    fetchResults();
  }, []);

  // Group candidates by category
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

    // Sort candidates by votes within each position
    Object.keys(positions).forEach(position => {
      positions[position].sort((a, b) => b.votes - a.votes);
    });

    return positions;
  };

  const fetchResults = async () => {
    try {
      setLoading(true);

      // Get categories, candidates, and settings
      const [categoriesData, adminData, settingsData] = await Promise.all([
        api.getCategories(),
        api.getAdminData(),
        api.getElectionSettings()
      ]);

      // Filter only active categories
      const activeCategs = (categoriesData.categories || []).filter((cat: Category) => cat.isActive);
      setActiveCategories(activeCategs);

      // Set the first active category as default
      if (activeCategs.length > 0) {
        setActiveCategory(activeCategs[0].name);
      }

      // Set candidates
      setCandidates(adminData.candidates || []);

      setElectionTitle(settingsData.title || "APU Election");

      // Check if election is currently active
      const now = new Date();
      const startDate = new Date(settingsData.startDate);
      const endDate = new Date(settingsData.endDate);
      const isActive = now >= startDate && now <= endDate;
      setElectionActive(isActive);

      // Check if results should be shown during voting
      if (isActive && settingsData.showResultsDuringVoting === false) {
        setShowResults(false);
      } else {
        setShowResults(true);
      }

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
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={apuLogo} alt="Asia Pacific University Logo" className="h-8 w-auto" />
            <h2 className="text-slate-900">Election Results</h2>
          </div>
          <div className="flex items-center gap-4">
            {currentUser && <UserNav onNavigate={onNavigate} />}
          </div>
        </div>
      </header>

      <main className="flex-1 container py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 mb-4"
              onClick={() => onNavigate('home')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-slate-900 mb-2">{electionTitle}</h1>
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
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Results hidden during voting */}
          {!showResults && electionActive ? (
            <Card>
              <CardContent className="py-16">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <AlertCircle className="h-16 w-16 text-amber-500" />
                  <h3 className="text-slate-900">Results Hidden</h3>
                  <p className="text-slate-600 max-w-md">
                    Results are hidden during the voting period. Please check back after the election ends to view the results.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : loading ? (
            <Card>
              <CardContent className="py-16">
                <div className="flex flex-col items-center justify-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
                  <p className="text-slate-600">Loading results...</p>
                </div>
              </CardContent>
            </Card>
          ) : activeCategories.length === 0 ? (
            <Card>
              <CardContent className="py-16">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <AlertCircle className="h-16 w-16 text-amber-500" />
                  <h3 className="text-slate-900">No Categories Available</h3>
                  <p className="text-slate-600 max-w-md">
                    The election administrator hasn't set up any voting categories yet.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <TabsList className={`grid w-full mb-6`} style={{ gridTemplateColumns: `repeat(${activeCategories.length}, 1fr)` }}>
                {activeCategories.map((category) => (
                  <TabsTrigger key={category.id} value={category.name}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {activeCategories.map((category) => {
                const positions = getPositionsForCategory(category.name);
                return (
                  <TabsContent key={category.id} value={category.name} className="space-y-6">
                    {Object.keys(positions).length === 0 ? (
                      <Card>
                        <CardContent className="py-12">
                          <div className="text-center">
                            <p className="text-slate-600">No candidates in this category yet.</p>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      Object.entries(positions).map(([positionName, positionCandidates]) => {
                        const totalVotes = getTotalVotesForPosition(positionCandidates);
                        return (
                          <Card key={positionName}>
                            <CardHeader>
                              <CardTitle>{positionName}</CardTitle>
                              <CardDescription>
                                Total votes cast: {totalVotes}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {positionCandidates.map((candidate, index) => {
                                const percentage = calculatePercentage(candidate.votes, totalVotes);
                                const isWinner = index === 0 && totalVotes > 0;

                                return (
                                  <div
                                    key={candidate.id}
                                    className={`p-4 rounded-lg border ${isWinner ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'
                                      }`}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-3">
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isWinner ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                                          }`}>
                                          {index + 1}
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <span className="text-slate-900">{candidate.name}</span>
                                            {isWinner && (
                                              <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-xs">
                                                Leading
                                              </span>
                                            )}
                                          </div>
                                          <div className="text-slate-600">{candidate.party}</div>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-slate-900">{candidate.votes} votes</div>
                                        <div className="text-slate-600">{percentage}%</div>
                                      </div>
                                    </div>
                                    {/* Progress bar */}
                                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full transition-all ${isWinner ? 'bg-emerald-500' : 'bg-slate-400'
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
                      })
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
                <span className="text-slate-900">{activeCategories.length}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Candidates:</span>
                <span className="text-slate-900">{candidates.length}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Status:</span>
                <span className="text-slate-900">
                  {electionActive ? 'In Progress' : 'Completed'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
