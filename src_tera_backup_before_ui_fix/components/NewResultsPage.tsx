import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { ArrowLeft, Lock, RefreshCw } from "lucide-react";
const apuLogo = "/apu-logo.png";

interface Category {
  id: string;
  name: string;
  description: string;
  maxVotes: number;
  isActive: boolean;
}

interface Candidate {
  id: string;
  name: string;
  position: string;
  party: string;
}

interface CandidateResult extends Candidate {
  voteCount: number;
  percentage: number;
}

interface NewResultsPageProps {
  onNavigate: (page: string) => void;
}

export function NewResultsPage({ onNavigate }: NewResultsPageProps) {
  const [activeCategories, setActiveCategories] = useState<Category[]>([]);
  const [results, setResults] = useState<Record<string, CandidateResult[]>>({});
  const [currentTab, setCurrentTab] = useState("");
  const [showResults, setShowResults] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResultsData();
  }, []);

  const loadResultsData = () => {
    setLoading(true);

    // Load settings to check if results should be shown
    const storedSettings = localStorage.getItem("systemSettings");
    if (storedSettings) {
      const settings = JSON.parse(storedSettings);
      setShowResults(settings.showResultsDuringVoting);
    }

    // Load active categories
    const storedCategories = localStorage.getItem("votingCategories");
    if (storedCategories) {
      const categories: Category[] = JSON.parse(storedCategories);
      const active = categories.filter(cat => cat.isActive);
      setActiveCategories(active);
      if (active.length > 0) {
        setCurrentTab(active[0].id);
      }

      // Calculate results for each category
      calculateResults(active);
    }

    setLoading(false);
  };

  const calculateResults = (categories: Category[]) => {
    const storedCandidates = localStorage.getItem("candidates");
    const storedVotes = localStorage.getItem("votes");

    if (!storedCandidates) return;

    const candidates: Candidate[] = JSON.parse(storedCandidates);
    const votes = storedVotes ? JSON.parse(storedVotes) : [];

    const resultsMap: Record<string, CandidateResult[]> = {};

    categories.forEach(category => {
      const categoryCandidates = candidates.filter(c => c.position === category.name);

      // Count votes for each candidate
      const voteCounts: Record<string, number> = {};
      categoryCandidates.forEach(c => voteCounts[c.id] = 0);

      votes.forEach((vote: any) => {
        const selectedCandidateId = vote.selections[category.id];
        if (selectedCandidateId && voteCounts[selectedCandidateId] !== undefined) {
          voteCounts[selectedCandidateId]++;
        }
      });

      const totalVotes = Object.values(voteCounts).reduce((sum, count) => sum + count, 0);

      const candidateResults: CandidateResult[] = categoryCandidates.map(candidate => ({
        ...candidate,
        voteCount: voteCounts[candidate.id] || 0,
        percentage: totalVotes > 0 ? ((voteCounts[candidate.id] || 0) / totalVotes) * 100 : 0,
      }));

      // Sort by vote count descending
      candidateResults.sort((a, b) => b.voteCount - a.voteCount);

      resultsMap[category.id] = candidateResults;
    });

    setResults(resultsMap);
  };

  const handleRefresh = () => {
    loadResultsData();
  };

  // Locked state when results are hidden
  if (!showResults) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={apuLogo} alt="APU Logo" className="h-10 w-10" />
              <h2 className="text-slate-900">APU VOTE</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('home')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </header>

        <div className="container mx-auto py-12 px-6">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardContent className="py-16 text-center">
                <div className="mx-auto mb-6 rounded-full bg-slate-100 p-4 w-fit">
                  <Lock className="h-12 w-12 text-slate-600" />
                </div>
                <h2 className="text-slate-900 mb-2">Results Locked</h2>
                <p className="text-slate-600 max-w-md mx-auto">
                  Results will be available after the voting period ends.
                </p>
                <Button
                  onClick={() => onNavigate('home')}
                  className="mt-8 bg-blue-600 hover:bg-blue-700"
                >
                  Return Home
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading data from blockchain...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={apuLogo} alt="APU Logo" className="h-10 w-10" />
            <h2 className="text-slate-900">APU VOTE</h2>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('home')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-slate-900 mb-2">Election Results</h1>
            <p className="text-slate-600">Live results based on blockchain data.</p>
          </div>

          {activeCategories.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-slate-600">No active categories available.</p>
              </CardContent>
            </Card>
          ) : (
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="grid w-full mb-8" style={{ gridTemplateColumns: `repeat(${activeCategories.length}, 1fr)` }}>
                {activeCategories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {activeCategories.map((category) => {
                const categoryResults = results[category.id] || [];
                const totalVotes = categoryResults.reduce((sum, c) => sum + c.voteCount, 0);

                return (
                  <TabsContent key={category.id} value={category.id}>
                    <Card>
                      <CardHeader>
                        <CardTitle>{category.name}</CardTitle>
                        <CardDescription>
                          Total votes cast: {totalVotes}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {categoryResults.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-slate-600">No candidates in this category.</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {categoryResults.map((candidate, index) => (
                              <div key={candidate.id} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${index === 0 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                                      }`}>
                                      {index + 1}
                                    </div>
                                    <div>
                                      <p className="text-slate-900">{candidate.name}</p>
                                      <p className="text-sm text-slate-600">{candidate.party}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-slate-900">{candidate.voteCount} votes</p>
                                    <p className="text-sm text-slate-600">{candidate.percentage.toFixed(1)}%</p>
                                  </div>
                                </div>
                                <Progress value={candidate.percentage} className="h-2" />
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                );
              })}
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
