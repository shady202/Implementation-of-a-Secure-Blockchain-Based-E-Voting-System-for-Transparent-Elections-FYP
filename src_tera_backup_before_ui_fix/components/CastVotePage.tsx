import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
const apuLogo = "/apu-logo.png";

// 🔗 REAL blockchain helpers (make sure path is correct)
import {
  getElectionCategories,
  getCandidates,
  castVote,
} from "../lib/blockchain";

interface Category {
  id: string;
  name: string;
  description: string;
  maxVotes: number;
  isActive: boolean;
}

interface Candidate {
  id: string;          // on-chain candidate ID (stringified)
  name: string;
  position: string;    // position/category name, e.g. "President"
  party: string;
  image?: string;
  category?: string;
  votes?: number;
}

interface CastVotePageProps {
  onNavigate: (page: string) => void;
}

export function CastVotePage({ onNavigate }: CastVotePageProps) {
  const [activeCategories, setActiveCategories] = useState<Category[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState("");

  // 🔄 Load real voting data from blockchain helpers
  useEffect(() => {
    const loadVotingData = async () => {
      try {
        const [categoriesData, candidatesData] = await Promise.all([
          getElectionCategories(),
          getCandidates(),
        ]);

        const active = (categoriesData || []).filter(
          (cat: Category) => cat.isActive,
        );
        setActiveCategories(active);

        if (active.length > 0) {
          setCurrentTab(active[0].id);
        }

        setCandidates(candidatesData || []);

        if ((candidatesData || []).length > 0) {
          console.log("🔥 CANDIDATE SAMPLE:", candidatesData[0]);
        }
      } catch (error) {
        console.error("Error loading voting data:", error);
        toast.error("Failed to load voting data. Please try again.");
      }
    };

    loadVotingData();
  }, []);

  // Get candidates for a given category name (uses candidate.position)
  const getCandidatesForCategory = (categoryName: string) => {
    return candidates.filter((c) => c.position === categoryName);
  };

  const handleSelectCandidate = (categoryId: string, candidateId: string) => {
    setSelections((prev) => ({
      ...prev,
      [categoryId]: candidateId,
    }));
  };

  const isAllSelectionsComplete = () => {
    return activeCategories.every((cat) => selections[cat.id]);
  };

  const handleSubmitVote = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmVote = async () => {
    setSubmitting(true);
    try {
      // Build mapping: positionName -> candidateId
      const votesByPosition: Record<string, string> = {};

      activeCategories.forEach((category) => {
        const selectedCandidateId = selections[category.id];
        if (selectedCandidateId) {
          // category.name should match the "position" used on-chain
          votesByPosition[category.name] = selectedCandidateId;
        }
      });

      console.log("DEBUG — votesByPosition:", votesByPosition);

      await castVote(votesByPosition);

      toast.success("Vote cast successfully on the blockchain!");
      setShowConfirmDialog(false);

      // Navigate to results or confirmation page
      setTimeout(() => {
        onNavigate("results");
      }, 1500);
    } catch (error: any) {
      console.error("Error casting vote:", error);
      toast.error(
        error?.message || "Failed to cast vote. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (activeCategories.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={apuLogo} alt="APU Logo" className="h-10 w-10" />
              <h2 className="text-slate-900">APU VOTE</h2>
            </div>
          </div>
        </header>

        <div className="container mx-auto py-12 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="py-12">
                <p className="text-slate-600">
                  No active voting categories available at this time.
                </p>
                <Button
                  onClick={() => onNavigate("home")}
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={apuLogo} alt="APU Logo" className="h-10 w-10" />
            <h2 className="text-slate-900">APU VOTE</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onNavigate("home")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit
          </Button>
        </div>
      </header>

      <div className="container mx-auto py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-slate-900 mb-2">Cast Your Vote</h1>
            <p className="text-slate-600">
              Select your preferred candidate for each position
            </p>
          </div>

          {/* Voting Tabs */}
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList
              className="grid w-full mb-8"
              style={{
                gridTemplateColumns: `repeat(${activeCategories.length}, 1fr)`,
              }}
            >
              {activeCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="relative">
                  {category.name}
                  {selections[category.id] && (
                    <CheckCircle2 className="h-4 w-4 ml-2 text-blue-600" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {activeCategories.map((category) => {
              const categoryCandidates = getCandidatesForCategory(category.name);

              return (
                <TabsContent key={category.id} value={category.id}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{category.name}</CardTitle>
                      <CardDescription>
                        Select one candidate for this position.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {categoryCandidates.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-slate-600">
                            No candidates assigned to this category yet.
                          </p>
                        </div>
                      ) : (
                        <RadioGroup
                          value={selections[category.id] || ""}
                          onValueChange={(value: string) =>
                            handleSelectCandidate(category.id, value)
                          }
                        >
                          <div className="space-y-3">
                            {categoryCandidates.map((candidate) => (
                              <div
                                key={candidate.id}
                                className={`relative flex items-center space-x-4 rounded-lg border-2 p-4 cursor-pointer transition-all ${selections[category.id] === candidate.id
                                  ? "border-blue-600 bg-blue-50"
                                  : "border-slate-200 hover:border-slate-300"
                                  }`}
                                onClick={() =>
                                  handleSelectCandidate(category.id, candidate.id)
                                }
                              >
                                {/* ✅ value is the REAL on-chain candidate.id */}
                                <RadioGroupItem
                                  value={candidate.id}
                                  id={`candidate-${candidate.id}`}
                                />
                                <Label
                                  htmlFor={`candidate-${candidate.id}`}
                                  className="flex-1 cursor-pointer"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-slate-900">
                                        {candidate.name}
                                      </p>
                                      <p className="text-sm text-slate-600">
                                        {candidate.party}
                                      </p>
                                    </div>
                                    {selections[category.id] === candidate.id && (
                                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                    )}
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>

          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleSubmitVote}
              disabled={!isAllSelectionsComplete() || submitting}
              className="px-8 bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {submitting
                ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Casting Vote...
                  </>
                )
                : isAllSelectionsComplete()
                  ? "Submit Vote"
                  : "Complete all selections to continue."}
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
            <AlertDialogDescription>
              Your vote will be permanently recorded on the blockchain and
              cannot be changed. Please review your selections before
              proceeding.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="my-4 space-y-3">
            {activeCategories.map((category) => {
              const selectedCandidate = candidates.find(
                (c) => c.id === selections[category.id],
              );
              return (
                <div
                  key={category.id}
                  className="flex justify-between items-center bg-slate-50 p-3 rounded"
                >
                  <span className="text-slate-900">{category.name}:</span>
                  <span className="text-slate-600">
                    {selectedCandidate?.name || "No selection"}
                  </span>
                </div>
              );
            })}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmVote}
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Casting Vote...
                </>
              ) : (
                "Cast Vote"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
