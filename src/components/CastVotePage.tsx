"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
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

import {
  getElectionState,
  getAllCategories,
  getCandidatesForCategory,
  castVote,
} from "../lib/blockchain";

const apuLogo = "/apu-logo.png";

type Category = {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
};

type Candidate = {
  id: number;
  name: string;
  party: string;
  votes: number;
};

interface CastVotePageProps {
  onNavigate: (page: string) => void;
}

export function CastVotePage({ onNavigate }: CastVotePageProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [electionActive, setElectionActive] = useState(false);
  const [electionEnded, setElectionEnded] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [candidatesByCategory, setCandidatesByCategory] = useState<
    Record<number, Candidate[]>
  >({});
  const [selectedVotes, setSelectedVotes] = useState<Record<number, number>>(
    {}
  );
  const [currentTab, setCurrentTab] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const election = await getElectionState();
        setElectionActive(election.isActive);
        setElectionEnded(election.hasEnded);

        const cats = await getAllCategories();
        const activeCats = cats.filter((c: Category) => c.isActive);
        setCategories(activeCats);

        if (activeCats.length > 0) setCurrentTab(String(activeCats[0].id));

        const allCandidates: Record<number, Candidate[]> = {};
        for (const cat of activeCats) {
          const list = await getCandidatesForCategory(cat.id);
          allCandidates[cat.id] = list;
        }
        setCandidatesByCategory(allCandidates);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load voting data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const isFormComplete = useMemo(() => {
    return categories.every((c) => selectedVotes[c.id]);
  }, [categories, selectedVotes]);

  const handleSelect = (categoryId: number, candidateId: number) => {
    setSelectedVotes((prev) => ({ ...prev, [categoryId]: candidateId }));
  };

  // Helper to get candidate name by ID and category
  const getCandidateName = (
    categoryId: number,
    candidateId: number
  ): string => {
    const candidate = candidatesByCategory[categoryId]?.find(
      (c) => c.id === candidateId
    );
    return candidate?.name || "Unknown";
  };

  // Show confirmation dialog
  const handleSubmit = () => {
    setShowConfirmation(true);
  };

  // Actually submit votes after confirmation
  const handleConfirmedSubmit = async () => {
    try {
      setSubmitting(true);
      setShowConfirmation(false);

      // Submit ONE tx per category
      for (const cat of categories) {
        const candId = selectedVotes[cat.id];
        if (!candId) continue;
        await castVote(cat.id, candId);
      }

      toast.success("All votes submitted!");
      onNavigate("results");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Failed to submit votes");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (electionEnded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            <h2>Election Ended</h2>
            <p className="text-slate-600 mt-2">
              Voting is no longer available.
            </p>
            <Button className="mt-6" onClick={() => onNavigate("results")}>
              View Results
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!electionActive) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            <h2>Election Not Started</h2>
            <p className="text-slate-600 mt-2">Voting has not started yet.</p>
            <Button className="mt-6" onClick={() => onNavigate("home")}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full border-2 shadow-lg">
          <CardContent className="py-12 text-center">
            <p className="text-slate-600">No active categories found.</p>
            <Button className="mt-6" onClick={() => onNavigate("home")}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl flex h-16 items-center px-6 md:px-8">
          <div className="flex items-center gap-2 w-48">
            <img src={apuLogo} alt="APU Logo" className="h-8 w-8" />
            <span className="text-slate-900">Cast Your Vote</span>
          </div>
          <nav className="hidden md:flex gap-6 flex-1 justify-center">
            <button
              onClick={() => onNavigate("home")}
              className="text-sm font-normal transition-colors hover:text-primary"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate("vote")}
              className="text-sm font-normal text-primary"
            >
              Elections
            </button>
            <button
              onClick={() => onNavigate("results")}
              className="text-sm font-normal transition-colors hover:text-primary"
            >
              Results
            </button>
            <button
              onClick={() => onNavigate("about")}
              className="text-sm font-normal transition-colors hover:text-primary"
            >
              About
            </button>
            <button
              onClick={() => onNavigate("contact")}
              className="text-sm font-normal transition-colors hover:text-primary"
            >
              Contact
            </button>
          </nav>
          <div className="flex items-center gap-3 w-48 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("home")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl px-6 md:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-slate-900 mb-2">Cast Your Vote</h1>
            <p className="text-slate-600">
              Select one candidate for each position
            </p>
          </div>

          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="flex w-full mb-8 overflow-x-auto whitespace-nowrap gap-2 bg-slate-100 p-2 rounded-lg">
              {categories.map((c) => (
                <TabsTrigger
                  key={c.id}
                  value={String(c.id)}
                  className="flex-shrink-0 min-w-[120px] relative data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  {c.name}
                  {selectedVotes[c.id] && (
                    <CheckCircle2 className="h-4 w-4 ml-2 text-emerald-600" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((cat) => {
              const list = candidatesByCategory[cat.id] || [];
              return (
                <TabsContent key={cat.id} value={String(cat.id)}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{cat.name}</CardTitle>
                      <CardDescription>Select one candidate.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {list.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-slate-600">
                            No candidates for this category yet.
                          </p>
                        </div>
                      ) : (
                        <RadioGroup
                          value={String(selectedVotes[cat.id] || "")}
                          onValueChange={(v) => handleSelect(cat.id, Number(v))}
                        >
                          <div className="space-y-3">
                            {list.map((cand) => (
                              <div
                                key={cand.id}
                                className={`relative flex items-center space-x-4 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                                  selectedVotes[cat.id] === cand.id
                                    ? "border-blue-600 bg-blue-50"
                                    : "border-slate-200 hover:border-slate-300"
                                }`}
                                onClick={() => handleSelect(cat.id, cand.id)}
                              >
                                <RadioGroupItem
                                  value={String(cand.id)}
                                  id={`cand-${cat.id}-${cand.id}`}
                                />
                                <Label
                                  htmlFor={`cand-${cat.id}-${cand.id}`}
                                  className="flex-1 cursor-pointer"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-slate-900">
                                        {cand.name}
                                      </p>
                                      <p className="text-sm text-slate-600">
                                        {cand.party}
                                      </p>
                                    </div>
                                    {selectedVotes[cat.id] === cand.id && (
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

          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={!isFormComplete || submitting}
              className="px-8 bg-slate-900 hover:bg-slate-800 text-white"
              size="lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Vote"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Votes</AlertDialogTitle>
            <AlertDialogDescription>
              Please review your selections carefully. Once submitted, your
              votes cannot be changed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3 my-4">
            {categories.map((cat) => {
              const candidateId = selectedVotes[cat.id];
              const candidateName = candidateId
                ? getCandidateName(cat.id, candidateId)
                : "Not selected";

              return (
                <div
                  key={cat.id}
                  className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"
                >
                  <span className="font-medium text-slate-700">
                    {cat.name}:
                  </span>
                  <span className="text-emerald-600 font-semibold">
                    {candidateName}
                  </span>
                </div>
              );
            })}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmedSubmit}
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Confirm & Submit"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
