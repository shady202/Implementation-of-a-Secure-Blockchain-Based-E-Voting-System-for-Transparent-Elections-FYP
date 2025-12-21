"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  Plus,
  Trash2,
  Users,
  CheckCircle2,
  Clock,
  BarChart3,
  Lock,
  RefreshCw,
  Download,
} from "lucide-react";
import { toast } from "sonner";

import { AuthGuard } from "./AuthGuard";
import { UserNav } from "./UserNav";
import { parseBlockchainError } from "../lib/errorParser";

import {
  createElection,
  startElection,
  endElection,
  resetSystem,
  getElectionInfo,
  getAllCategories,
  createCategory,
  addCandidate,
  deactivateCandidate,
  getCandidatesForCategory,
  pauseSystem,
  unpauseSystem,
} from "../lib/blockchain";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Progress } from "./ui/progress";

const apuLogo = "/apu-logo.png";

// Helper to get current user ID for API calls
const getCurrentUserId = () => localStorage.getItem("user_id");

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
  categoryId: number;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

interface Voter {
  id: string;
  studentId: string;
  walletAddress: string;
  department: string;
  registrationDate: string;
  hasVoted: boolean;
}

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [election, setElection] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const [newElection, setNewElection] = useState({
    title: "",
    startDate: "",
    endDate: "",
  });
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    position: "",
    party: "",
    category: "",
    contractId: "",
  });
  const [showResultsDuringVoting, setShowResultsDuringVoting] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [voters, setVoters] = useState<Voter[]>([]);

  // Admin data derived from election state and fetched data
  const adminData = {
    registeredVoters: election?.totalVoters || voters.length || 0,
    totalVoters: 100, // Placeholder - you can adjust
    votesCount: election?.totalVotes || 0,
    electionStatus:
      election?.state === 0
        ? "Not Started"
        : election?.state === 1
        ? "Setup Phase" // Created state - can add categories/candidates
        : election?.state === 2
        ? "Active"
        : election?.state === 3
        ? "Ended"
        : "Not Started",
    electionTitle: election?.title || "No Election Created",
    startDate: election?.startTime
      ? new Date(election.startTime * 1000).toISOString()
      : "",
    endDate: election?.endTime
      ? new Date(election.endTime * 1000).toISOString()
      : "",
    candidates: candidates.map((c) => ({
      id: c.id,
      name: c.name,
      position:
        categories.find((cat) => cat.id === c.categoryId)?.name || "Unknown",
      party: c.party,
    })),
    voters: voters,
    activities: activities,
  };

  // Fetch activities from backend
  const fetchActivities = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/admin/activities"
      );
      const data = await response.json();
      setActivities(data.activities || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setActivities([]);
    }
  };

  // Fetch voters from backend
  const fetchVoters = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/admin/voters");
      const data = await response.json();
      setVoters(data.voters || []);
    } catch (error) {
      console.error("Error fetching voters:", error);
      setVoters([]);
    }
  };

  const loadAll = async () => {
    try {
      setLoading(true);
      const e = await getElectionInfo();
      const cats = await getAllCategories();

      const allCandidates: Candidate[] = [];
      if (cats.length > 0) {
        await Promise.all(
          cats.map(async (cat: Category) => {
            const catCands = await getCandidatesForCategory(cat.id);
            (catCands as any[]).forEach((c: any) => {
              allCandidates.push({
                id: Number(c.id),
                name: String(c.name),
                party: String(c.party),
                categoryId: cat.id,
              });
            });
          })
        );
      }

      setElection(e);
      setCategories(cats as Category[]);
      setCandidates(allCandidates);

      // Fetch activities and voters from backend
      await fetchActivities();
      await fetchVoters();
    } catch (err: any) {
      console.error("Create category error:", err);
      const errorDetail =
        err?.response?.data || err?.message || JSON.stringify(err);
      toast.error(`RAW ERROR: ${JSON.stringify(errorDetail, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();

    // Set up auto-refresh polling every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchActivities();
      fetchVoters();
    }, 30000); // 30 seconds

    return () => clearInterval(refreshInterval);
  }, []);

  const handleCreateElection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const start = Math.floor(
        new Date(newElection.startDate).getTime() / 1000
      );
      const end = Math.floor(new Date(newElection.endDate).getTime() / 1000);
      await createElection(newElection.title, start, end);
      toast.success("Election created successfully!");
      await loadAll();
    } catch (err: any) {
      toast.error(parseBlockchainError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartElection = async () => {
    try {
      setSubmitting(true);
      await startElection();
      toast.success("Election started successfully!");
      await loadAll();
    } catch (err: any) {
      toast.error(parseBlockchainError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEndElection = async () => {
    try {
      setSubmitting(true);
      await endElection();
      toast.success("Election ended successfully!");
      await loadAll();
    } catch (err: any) {
      toast.error(parseBlockchainError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handlePause = async () => {
    try {
      setSubmitting(true);
      await pauseSystem();
      await loadAll();
    } catch (err: any) {
      toast.error(parseBlockchainError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnpause = async () => {
    try {
      setSubmitting(true);
      await unpauseSystem();
      await loadAll();
    } catch (err: any) {
      toast.error(parseBlockchainError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetSystem = async () => {
    const confirmed = window.confirm(
      "⚠️ WARNING: This will completely reset the system!\n\n" +
        "This action will DELETE:\n" +
        "• All elections\n" +
        "• All categories\n" +
        "• All candidates\n" +
        "• All voters\n" +
        "• All votes\n\n" +
        "This cannot be undone. Are you absolutely sure?"
    );

    if (!confirmed) {
      toast.info("Reset cancelled");
      return;
    }

    try {
      setSubmitting(true);

      // Auto-handle state transitions for reset
      // States: 0=None, 1=Created (Setup Phase), 2=Active, 3=Ended
      if (election && election.state === 1) {
        // If in Setup Phase (Created), start first, then end
        toast.info("Starting election...");
        await startElection();
        toast.success("Election started!");

        toast.info("Ending election...");
        await endElection();
        toast.success("Election ended!");
      } else if (election && election.state === 2) {
        // If Active, just end it
        toast.info("Ending election...");
        await endElection();
        toast.success("Election ended!");
      }
      // If already Ended (state=3) or None (state=0), just reset

      // Step 1: Reset blockchain
      toast.info("Resetting blockchain...");
      await resetSystem();
      toast.success("✅ Blockchain reset complete!");

      // Step 2: Reset database
      toast.info("Resetting database...");
      const { resetDatabase } = await import("../lib/api");
      await resetDatabase();
      toast.success("✅ Database reset complete!");

      toast.success(
        "System reset successfully! You can now create a new election."
      );
      await loadAll();
    } catch (err: any) {
      toast.error(parseBlockchainError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCategory = async () => {
    try {
      setSubmitting(true);

      // Check if election is in Setup Phase (state = 1 = Created)
      if (!election || election.state !== 1) {
        toast.error("❌ Categories can only be added during Setup Phase!");
        return;
      }

      // Step 1: Create on blockchain (user signs with MetaMask)
      const result = await createCategory(
        newCategory.name,
        newCategory.description
      );

      // Step 2: Sync to PostgreSQL database
      const userId = getCurrentUserId();
      const response = await fetch("http://localhost:3001/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(userId ? { "x-user-id": userId } : {}),
        },
        body: JSON.stringify({
          txHash: result.txHash,
          categoryId: result.categoryId,
          name: newCategory.name,
          description: newCategory.description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Backend error:", errorData);
        throw new Error(`Database sync failed: ${errorData}`);
      }

      setNewCategory({ name: "", description: "" });
      toast.success("✅ Category created and saved to database!");
      await loadAll();
    } catch (err: any) {
      console.error("Full error:", err);
      const rawError = err?.message || JSON.stringify(err);
      toast.error(`❌ ERROR: ${rawError}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category? This will deactivate it on the blockchain."
    );

    if (!confirmed) return;

    try {
      setSubmitting(true);
      toast.info("Deactivating category on blockchain...");

      // Deactivate on blockchain using ethers directly
      if (typeof window === "undefined" || !(window as any).ethereum) {
        throw new Error("MetaMask is not installed");
      }

      const { ethers } = await import("ethers");
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      const VotingSystemABI = (await import("../lib/VotingSystemABI")).default;
      const CONTRACT_ADDRESS = (await import("../lib/blockchain"))
        .CONTRACT_ADDRESS;

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        VotingSystemABI,
        signer
      );
      const tx = await contract.deactivateCategory(categoryId);
      await tx.wait();

      toast.success("✅ Category deleted!");
      await loadAll();
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(parseBlockchainError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (!newCandidate.category) {
        toast.error("Please select a category");
        return;
      }
      // Find category ID from name
      const category = categories.find((c) => c.name === newCandidate.category);
      if (!category) {
        toast.error("Invalid category selected");
        return;
      }

      // Step 1: Add to blockchain (user signs with MetaMask)
      const result = await addCandidate(
        category.id,
        newCandidate.name,
        newCandidate.party
      );

      // Step 2: Sync to PostgreSQL database
      const userId = getCurrentUserId();
      const response = await fetch("http://localhost:3001/api/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(userId ? { "x-user-id": userId } : {}),
        },
        body: JSON.stringify({
          txHash: result.txHash,
          candidateId: result.candidateId,
          name: newCandidate.name,
          party: newCandidate.party,
          categoryName: newCandidate.category,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to sync candidate to database");
      }

      setNewCandidate({
        name: "",
        position: "",
        party: "",
        category: "",
        contractId: "",
      });
      toast.success("Candidate added and saved to database!");
      await loadAll();
    } catch (err: any) {
      toast.error(parseBlockchainError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveCandidate = async (candidateId: number) => {
    try {
      setSubmitting(true);
      // Find the candidate to get its categoryId
      const candidate = candidates.find((c) => c.id === candidateId);
      if (!candidate) {
        toast.error("Candidate not found");
        return;
      }
      await deactivateCandidate(candidate.categoryId, candidateId);
      toast.success("Candidate removed");
      await loadAll();
    } catch (err: any) {
      toast.error(err?.message || "Failed to remove candidate");
    } finally {
      setSubmitting(false);
    }
  };

  const exportVotersToExcel = (voters: any[]) => {
    toast.info("Export feature - voter data is stored on blockchain");
  };

  const fetchAdminData = async () => {
    await loadAll();
  };

  const handleSyncCandidates = async () => {
    toast.info("Candidates are automatically synced to blockchain");
  };

  // Format dates
  const formatDate = (timestamp: number) => {
    if (!timestamp) return "TBD";
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
          <p className="text-slate-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requireAdmin={true} onNavigate={onNavigate}>
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-white">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto max-w-7xl flex h-16 items-center px-6 md:px-8">
            <div className="flex items-center gap-2 w-48">
              <img src={apuLogo} alt="APU Logo" className="h-8 w-8" />
              <span className="text-slate-900">APU VOTE</span>
              <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 text-xs">
                Admin
              </Badge>
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
              <UserNav onNavigate={onNavigate} />
            </div>
          </div>
        </header>

        <div className="container mx-auto py-12 px-6">
          <div className="flex flex-col max-w-6xl mx-auto">
            <div className="w-full mb-8">
              <div className="mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => onNavigate("home")}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <img
                  src={apuLogo}
                  alt="Asia Pacific University Logo"
                  className="h-10 w-auto"
                />
                <h1 className="text-slate-900">Admin Dashboard</h1>
              </div>
              <p className="text-slate-600">
                Manage elections, candidates, and monitor voting activity
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">
                    Registered Voters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="text-slate-900">
                      {adminData.registeredVoters}
                    </div>
                    <div className="text-slate-600">
                      of {adminData.totalVoters} eligible
                    </div>
                  </div>
                  <Progress
                    value={
                      (adminData.registeredVoters / adminData.totalVoters) * 100
                    }
                    className="mt-2 bg-slate-200"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">
                    Votes Cast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    // Calculate expected total votes
                    // Each registered voter can vote once per category
                    const numberOfCategories = categories.length || 1;
                    const expectedTotalVotes =
                      adminData.registeredVoters * numberOfCategories;
                    const completionPercentage =
                      expectedTotalVotes > 0
                        ? (adminData.votesCount / expectedTotalVotes) * 100
                        : 0;

                    return (
                      <>
                        <div className="flex items-baseline justify-between">
                          <div className="text-slate-900">
                            {adminData.votesCount}
                          </div>
                          <div className="text-slate-600">
                            of {expectedTotalVotes} possible votes
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {adminData.registeredVoters} voters ×{" "}
                          {numberOfCategories}{" "}
                          {numberOfCategories === 1 ? "category" : "categories"}
                        </div>
                        <Progress
                          value={Math.min(completionPercentage, 100)}
                          className="mt-2 bg-slate-200"
                        />
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">
                    Election Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-slate-900 flex items-center gap-2">
                      {adminData.electionStatus}
                      {election?.isPaused && (
                        <Badge variant="destructive" className="animate-pulse">
                          PAUSED
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center">
                      {adminData.electionStatus === "Active" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : adminData.electionStatus === "Ended" ? (
                        <Lock className="h-5 w-5 text-gray-500" />
                      ) : adminData.electionStatus === "Setup Phase" ? (
                        <Clock className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-amber-500" />
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={handleStartElection}
                      disabled={submitting}
                      className="bg-emerald-600 hover:bg-emerald-700 text-xs px-3"
                    >
                      Start Election
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleEndElection}
                      disabled={
                        (adminData.electionStatus !== "Active" &&
                          adminData.electionStatus !== "Setup Phase") ||
                        submitting
                      }
                      className="text-xs px-3"
                    >
                      End Election
                    </Button>
                    <Button
                      size="sm"
                      variant={election?.isPaused ? "default" : "destructive"}
                      onClick={election?.isPaused ? handleUnpause : handlePause}
                      disabled={
                        submitting || adminData.electionStatus === "Not Started"
                      }
                      className="text-xs px-3"
                    >
                      {election?.isPaused ? "Unpause" : "Emergency Stop"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-5 mb-8">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="candidates">Candidates</TabsTrigger>
                <TabsTrigger value="voters">Voters</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Election Overview</CardTitle>
                    <CardDescription>
                      Current election status and statistics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-slate-900">
                            {adminData.electionTitle}
                          </p>
                          <p className="text-slate-600">
                            {adminData.startDate && adminData.endDate
                              ? `${formatDateTime(
                                  adminData.startDate
                                )} - ${formatDateTime(adminData.endDate)}`
                              : "No dates set"}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onNavigate("results")}
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Results
                        </Button>
                      </div>

                      <div>
                        <h3 className="text-slate-900 mb-4">
                          Recent Activity (Last Hour)
                        </h3>
                        <div className="space-y-4">
                          {adminData.activities.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                              <Clock className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                              <p>No recent activity in the last hour</p>
                            </div>
                          ) : (
                            adminData.activities.map((activity) => (
                              <div
                                key={activity.id}
                                className="flex items-start gap-4"
                              >
                                <div className="rounded-full bg-emerald-100 p-2">
                                  {activity.type === "voter_registered" ? (
                                    <Users className="h-4 w-4 text-emerald-600" />
                                  ) : activity.type === "vote_cast" ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                  ) : activity.type === "candidate_added" ? (
                                    <Plus className="h-4 w-4 text-emerald-600" />
                                  ) : (
                                    <Clock className="h-4 w-4 text-emerald-600" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-slate-900">
                                    {activity.description}
                                  </p>
                                  <p className="text-slate-600">
                                    {new Date(
                                      activity.timestamp
                                    ).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="candidates" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Candidates</CardTitle>
                    <CardDescription>
                      Add or remove candidates for the election
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={handleAddCandidate}
                      className="space-y-4 mb-8"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Candidate Name</Label>
                          <Input
                            id="name"
                            value={newCandidate.name}
                            onChange={(e) =>
                              setNewCandidate({
                                ...newCandidate,
                                name: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={newCandidate.category}
                            onValueChange={(value: string) =>
                              setNewCandidate({
                                ...newCandidate,
                                category: value,
                                position: value, // Auto-set position to match category
                              })
                            }
                            required
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.name}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="party">Party/Affiliation</Label>
                          <Input
                            id="party"
                            value={newCandidate.party}
                            onChange={(e) =>
                              setNewCandidate({
                                ...newCandidate,
                                party: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-slate-900 hover:bg-slate-800 text-white"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Candidate
                          </>
                        )}
                      </Button>
                    </form>

                    <div>
                      <h3 className="text-slate-900 mb-4">
                        Current Candidates
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Party</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {adminData.candidates.map((candidate) => (
                            <TableRow
                              key={`${candidate.position}-${candidate.id}`}
                            >
                              <TableCell className="text-slate-900">
                                {candidate.name}
                              </TableCell>
                              <TableCell className="text-slate-600">
                                {candidate.position}
                              </TableCell>
                              <TableCell className="text-slate-600">
                                {candidate.party}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveCandidate(candidate.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="voters" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Registered Voters</CardTitle>
                    <CardDescription>
                      View and manage registered voters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Search voters..."
                          className="w-64"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={fetchAdminData}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportVotersToExcel(adminData.voters)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export List
                      </Button>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student ID</TableHead>
                          <TableHead>Wallet Address</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Registration Date</TableHead>
                          <TableHead>Voted</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {adminData.voters.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-8 text-slate-500"
                            >
                              No registered voters yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          adminData.voters.map((voter) => (
                            <TableRow key={voter.id}>
                              <TableCell className="text-slate-900 font-mono">
                                {/* Mask Student ID: TP123456 → TP123*** */}
                                {voter.studentId.substring(
                                  0,
                                  voter.studentId.length - 3
                                )}
                                ***
                              </TableCell>
                              <TableCell className="font-mono text-slate-600">
                                {/* Mask Wallet Address: 0x1234567890abcdef → 0x123456...cdef */}
                                {voter.walletAddress.substring(0, 8)}...
                                {voter.walletAddress.slice(-4)}
                              </TableCell>
                              <TableCell className="text-slate-600">
                                {voter.department}
                              </TableCell>
                              <TableCell className="text-slate-600">
                                {new Date(
                                  voter.registrationDate
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {voter.hasVoted ? (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                ) : (
                                  <div className="h-4 w-4 rounded-full border border-slate-400" />
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="categories" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Voting Categories</CardTitle>
                    <CardDescription>
                      Manage voting categories and positions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateCategory();
                      }}
                      className="space-y-4 mb-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="categoryName">Category Name</Label>
                          <Input
                            id="categoryName"
                            placeholder="e.g., President, Secretary"
                            value={newCategory.name}
                            onChange={(e) =>
                              setNewCategory({
                                ...newCategory,
                                name: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="categoryDescription">
                            Description
                          </Label>
                          <Input
                            id="categoryDescription"
                            placeholder="Describe this position"
                            value={newCategory.description}
                            onChange={(e) =>
                              setNewCategory({
                                ...newCategory,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={submitting || !newCategory.name}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Category
                          </>
                        )}
                      </Button>
                    </form>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Existing Categories</h3>
                      {categories.length === 0 ? (
                        <p className="text-center text-slate-500 py-8">
                          No categories yet. Add your first category above.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <div
                              key={category.id}
                              className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
                            >
                              <div>
                                <p className="text-sm font-medium">
                                  {category.name}
                                </p>
                                <p className="text-sm text-slate-600">
                                  {category.description}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDeleteCategory(category.id)
                                }
                                disabled={submitting}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Election Settings</CardTitle>
                    <CardDescription>
                      Configure election parameters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateElection} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Election Title</Label>
                        <Input
                          id="title"
                          value={newElection.title}
                          onChange={(e) =>
                            setNewElection({
                              ...newElection,
                              title: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startDate">Start Date</Label>
                          <Input
                            id="startDate"
                            type="datetime-local"
                            value={newElection.startDate}
                            onChange={(e) =>
                              setNewElection({
                                ...newElection,
                                startDate: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endDate">End Date</Label>
                          <Input
                            id="endDate"
                            type="datetime-local"
                            value={newElection.endDate}
                            onChange={(e) =>
                              setNewElection({
                                ...newElection,
                                endDate: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="allowResults">
                            Show Results During Voting
                          </Label>
                          <Switch
                            id="allowResults"
                            checked={showResultsDuringVoting}
                            onCheckedChange={setShowResultsDuringVoting}
                          />
                        </div>
                        <p className="text-sm text-slate-500">
                          {showResultsDuringVoting
                            ? "✓ Voters can see live results while voting is active"
                            : "✗ Results will be hidden until voting ends"}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          type="submit"
                          disabled={submitting}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Settings"
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="default"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={handleStartElection}
                          disabled={
                            submitting || adminData.electionStatus === "Active"
                          }
                        >
                          Start Election
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleEndElection}
                          disabled={
                            submitting || adminData.electionStatus !== "Active"
                          }
                        >
                          End Election
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700"
                          onClick={handleResetSystem}
                          disabled={submitting}
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Resetting...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Reset System
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full border-t py-6 bg-white mt-auto">
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
    </AuthGuard>
  );
}
