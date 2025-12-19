"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
} from "lucide-react";

import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";

import {
  getElectionState,
  getAllCategories,
  getCandidatesForCategory,
  castVote,
  isVoterRegistered,
} from "../lib/blockchain";

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
  onNavigate: (page: string) => void;
}

export function VotePage({ onNavigate }: VotePageProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [voted, setVoted] = useState(false);
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [checkingRegistration, setCheckingRegistration] = useState(true);

  const [electionActive, setElectionActive] = useState(false);
  const [electionEnded, setElectionEnded] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [candidatesByCategory, setCandidatesByCategory] = useState<
    Record<number, Candidate[]>
  >({});

  const [selectedVotes, setSelectedVotes] = useState<Record<number, number>>(
    {}
  );

  /* ================= CHECK REGISTRATION ================= */

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        setCheckingRegistration(true);
        const registered = await isVoterRegistered();
        setIsRegistered(registered);

        if (!registered) {
          // Redirect to voter registration page
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
    // Only load data if registered
    if (isRegistered !== true) return;

    const load = async () => {
      try {
        setLoading(true);

        const election = await getElectionState();
        setElectionActive(election.isActive);
        setElectionEnded(election.hasEnded);

        const cats = await getAllCategories();
        const activeCats = cats.filter((c: Category) => c.isActive);
        setCategories(activeCats);

        const allCandidates: Record<number, Candidate[]> = {};

        for (const cat of activeCats) {
          const list = await getCandidatesForCategory(cat.id);
          allCandidates[cat.id] = list;
        }

        setCandidatesByCategory(allCandidates);
      } catch (err) {
        console.error("Failed to load voting data", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isRegistered]);

  /* ================= SELECTION ================= */

  const handleSelect = (categoryId: number, candidateId: number) => {
    setSelectedVotes((prev) => ({
      ...prev,
      [categoryId]: candidateId,
    }));
  };

  const isFormComplete = () => {
    return categories.every((c) => selectedVotes[c.id]);
  };

  /* ================= SUBMIT VOTE ================= */

  const handleVote = async () => {
    try {
      setSubmitting(true);

      for (const category of categories) {
        const candidateId = selectedVotes[category.id];
        await castVote(category.id, candidateId);
      }

      setVoted(true);
    } catch (err: any) {
      alert(err.message || "Failed to submit vote");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= UI STATES ================= */

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
            <AlertCircle className="h-14 w-14 text-red-600 mx-auto mb-4" />
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
            <Clock className="h-14 w-14 text-amber-500 mx-auto mb-4" />
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

  if (voted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            <CheckCircle2 className="h-14 w-14 text-emerald-600 mx-auto mb-4" />
            <h2>Vote Submitted</h2>
            <p className="text-slate-600 mt-2">
              Your vote has been recorded on the blockchain.
            </p>
            <Button className="mt-6" onClick={() => onNavigate("results")}>
              View Results
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ================= MAIN UI ================= */

  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => onNavigate("home")}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </Button>

      <div className="flex items-center gap-3 my-6">
        <img src={apuLogo} className="h-10" />
        <h1>Cast Your Vote</h1>
      </div>

      <Tabs defaultValue={String(categories[0]?.id)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          {categories.map((c) => (
            <TabsTrigger key={c.id} value={String(c.id)}>
              {c.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat.id} value={String(cat.id)}>
            <RadioGroup
              value={String(selectedVotes[cat.id] || "")}
              onValueChange={(v) => handleSelect(cat.id, Number(v))}
            >
              {candidatesByCategory[cat.id]?.map((cand) => (
                <div
                  key={cand.id}
                  className="flex items-center space-x-3 border rounded p-4 mb-3"
                >
                  <RadioGroupItem
                    value={String(cand.id)}
                    id={`cand-${cand.id}`}
                  />
                  <Label htmlFor={`cand-${cand.id}`} className="flex flex-col">
                    <span>{cand.name}</span>
                    <span className="text-slate-500 text-sm">{cand.party}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </TabsContent>
        ))}
      </Tabs>

      <CardFooter className="pt-6">
        <Button
          className="w-full"
          disabled={!isFormComplete() || submitting}
          onClick={handleVote}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Vote"
          )}
        </Button>
      </CardFooter>
    </div>
  );
}
