import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { generateCategoryId } from "../lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Switch } from "./ui/switch";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock,
  Download,
  Loader2,
  Lock,
  Plus,
  RefreshCw,
  Trash2,
  Users,
} from "lucide-react";
import { AuthGuard } from "./AuthGuard";
import { UserNav } from "./UserNav";
import { exportVotersToExcel } from "../lib/exportUtils";
import { toast } from "sonner";
import * as api from "../lib/api";
import { startElectionOnChain, endElectionOnChain, createElectionOnChain, addCandidateOnChain } from "../lib/blockchain";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const apuLogo = "/apu-logo.png";

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

interface Candidate {
  id: string;
  name: string;
  position: string;
  party: string;
  category: string;
  contractId?: number;
}

interface Voter {
  id: string;
  studentId: string;
  walletAddress: string;
  department: string;
  registrationDate: string;
  hasVoted: boolean;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  maxVotes: number;
  isActive: boolean;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [adminData, setAdminData] = useState({
    totalVoters: 0,
    registeredVoters: 0,
    votesCount: 0,
    electionStatus: "Not Started",
    electionTitle: "Student Council Election 2025",
    startDate: "",
    endDate: "",
    candidates: [] as Candidate[],
    voters: [] as Voter[],
    activities: [] as Activity[],
  });
  const [newElection, setNewElection] = useState({
    title: "",
    startDate: "",
    endDate: "",
  });
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    position: "",
    party: "",
    category: "",
    contractId: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [requireVerification, setRequireVerification] = useState(true);
  const [showResultsDuringVoting, setShowResultsDuringVoting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchAdminData();
    loadElectionSettings();
    loadCategories();

    // Auto-refresh activities every 30 seconds
    const interval = setInterval(() => {
      fetchActivities();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminData();
      setAdminData(data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const loadElectionSettings = async () => {
    try {
      const settings = await api.getElectionSettings();
      setNewElection({
        title: settings.title || "",
        startDate: settings.startDate || "",
        endDate: settings.endDate || "",
      });
      setRequireVerification(settings.requireIdVerification ?? true);
      setShowResultsDuringVoting(settings.showResultsDuringVoting ?? false);
    } catch (error) {
      console.error("Error loading election settings:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      const activities = await api.getRecentActivities();
      setAdminData(prev => ({ ...prev, activities: activities.activities || [] }));
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const handleCreateElection = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate dates
      const now = new Date();
      const startDate = new Date(newElection.startDate);
      const endDate = new Date(newElection.endDate);

      // Set 'now' to the beginning of the current minute to avoid millisecond issues
      now.setSeconds(0, 0);
      startDate.setSeconds(0, 0);
      endDate.setSeconds(0, 0);

      if (startDate < now) {
        toast.error("Start date and time cannot be in the past. Please select a current or future date.");
        setSubmitting(false);
        return;
      }

      if (endDate <= startDate) {
        toast.error("End date must be after the start date.");
        setSubmitting(false);
        return;
      }

      // CRITICAL: Create election on BLOCKCHAIN first with Unix timestamps
      toast.info("Creating election on blockchain...");
      const startTimestamp = Math.floor(startDate.getTime() / 1000); // Convert to Unix timestamp
      const endTimestamp = Math.floor(endDate.getTime() / 1000);

      await createElectionOnChain(
        newElection.title,
        startTimestamp,
        endTimestamp
      );

      // Then save election settings to database
      await api.updateElectionSettings({
        title: newElection.title,
        startDate: newElection.startDate,
        endDate: newElection.endDate,
        requireIdVerification: requireVerification,
        showResultsDuringVoting: showResultsDuringVoting,
      });

      // CRITICAL: Force update status to 'Created' to unlock candidate management
      await api.updateElectionStatus('Created');

      toast.success("Election created and reset successfully!");

      // Reload all data to reflect changes
      await Promise.all([
        fetchAdminData(),
        loadElectionSettings()
      ]);
    } catch (error) {
      console.error("Error creating election:", error);
      toast.error("Failed to save election settings");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Auto-assign Contract ID if not provided
      const candidateToAdd = {
        ...newCandidate,
        contractId: newCandidate.contractId || String(adminData.candidates.length + 1)
      };

      // CRITICAL: Derive the correct Category ID for blockchain
      // Must match the logic used in CategoriesPage.tsx: name.toLowerCase().replace(/\s+/g, '-')
      // CRITICAL: Derive the correct Category ID for blockchain
      // Must match the logic used in CategoriesPage.tsx
      const blockchainCategoryId = generateCategoryId(candidateToAdd.category);

      // Add candidate to BLOCKCHAIN first
      await addCandidateOnChain(
        candidateToAdd.name,
        candidateToAdd.position,
        candidateToAdd.party,
        blockchainCategoryId // Pass the ID, not the Name
      );

      await api.addCandidate(candidateToAdd);
      toast.success(`Candidate added to Blockchain and Database!`);

      setNewCandidate({
        name: "",
        position: "",
        party: "",
        category: "",
        contractId: "",
      });
      fetchAdminData();
    } catch (error) {
      console.error("Error adding candidate:", error);
      toast.error("Failed to add candidate");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveCandidate = async (candidateId: string) => {
    try {
      await api.removeCandidate(candidateId);
      fetchAdminData();
    } catch (error) {
      console.error("Error removing candidate:", error);
    }
  };

  const handleFixAllCandidates = async () => {
    setSubmitting(true);
    try {
      const candidatesWithoutId = adminData.candidates.filter(c => !c.contractId && c.contractId !== 0);

      if (candidatesWithoutId.length === 0) {
        toast.info("All candidates already have Contract IDs!");
        return;
      }

      let counter = 0;
      for (const candidate of candidatesWithoutId) {
        await api.updateCandidate(candidate.id, {
          ...candidate,
          contractId: counter
        });
        counter++;
      }

      toast.success(`Fixed ${candidatesWithoutId.length} candidates!`);
      await fetchAdminData();
    } catch (error) {
      console.error("Error fixing candidates:", error);
      toast.error("Failed to fix candidates");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartElection = async () => {
    setSubmitting(true);

    try {
      // First, check if there are unsaved changes and save them
      if (newElection.title || newElection.startDate || newElection.endDate) {
        await api.updateElectionSettings({
          title: newElection.title,
          startDate: newElection.startDate,
          endDate: newElection.endDate,
          requireIdVerification: requireVerification,
          showResultsDuringVoting: showResultsDuringVoting,
        });
      }

      // CRITICAL: Start election on BLOCKCHAIN first
      toast.info("Starting election on blockchain...");
      await startElectionOnChain();

      // Then update database status
      await api.startElection();

      toast.success("Election started successfully!");
      await fetchAdminData();
    } catch (error) {
      console.error("Error starting election:", error);
      toast.error("Failed to start election");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEndElection = async () => {
    setSubmitting(true);

    try {
      // CRITICAL: End election on BLOCKCHAIN first
      toast.info("Ending election on blockchain...");
      await endElectionOnChain();

      // Then update database
      await api.endElection();

      toast.success("Election ended successfully!");
      await fetchAdminData();
    } catch (error) {
      console.error("Error ending election:", error);
      toast.error("Failed to end election");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateTime = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
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
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={apuLogo} alt="APU Logo" className="h-10 w-10" />
              <h2 className="text-slate-900">Admin Dashboard</h2>
              <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                Administrator
              </Badge>
            </div>
            <UserNav onNavigate={onNavigate} />
          </div>
        </header>

        <div className="container mx-auto py-12 px-6">
          <div className="flex flex-col max-w-6xl mx-auto">
            <div className="w-full mb-8">
              <div className="mb-4">
                <Button variant="ghost" size="sm" className="gap-1" onClick={() => onNavigate('home')}>
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <img src={apuLogo} alt="Asia Pacific University Logo" className="h-10 w-auto" />
                <h1 className="text-slate-900">Admin Dashboard</h1>
              </div>
              <p className="text-slate-600">Manage elections, candidates, and monitor voting activity</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Registered Voters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="text-slate-900">{adminData.registeredVoters}</div>
                    <div className="text-slate-600">of {adminData.totalVoters} eligible</div>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${(adminData.registeredVoters / adminData.totalVoters) * 100}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Votes Cast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="text-slate-900">{adminData.votesCount}</div>
                    <div className="text-slate-600">of {adminData.registeredVoters} registered</div>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${(adminData.votesCount / adminData.registeredVoters) * 100}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Election Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-slate-900">{adminData.electionStatus}</div>
                    <div className="flex items-center">
                      {adminData.electionStatus === "Active" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : adminData.electionStatus === "Ended" ? (
                        <Lock className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-amber-500" />
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleStartElection}
                      disabled={submitting}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Start Election
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleEndElection}
                      disabled={adminData.electionStatus !== "Active" || submitting}
                    >
                      End Election
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                    <CardDescription>Current election status and statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-slate-900">{adminData.electionTitle}</p>
                          <p className="text-slate-600">
                            {adminData.startDate && adminData.endDate
                              ? `${formatDateTime(adminData.startDate)} - ${formatDateTime(adminData.endDate)}`
                              : "No dates set"}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => onNavigate('results')}>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Results
                        </Button>
                      </div>

                      <div>
                        <h3 className="text-slate-900 mb-4">Recent Activity (Last Hour)</h3>
                        <div className="space-y-4">
                          {adminData.activities.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                              <Clock className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                              <p>No recent activity in the last hour</p>
                            </div>
                          ) : (
                            adminData.activities.map((activity) => (
                              <div key={activity.id} className="flex items-start gap-4">
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
                                  <p className="text-slate-900">{activity.description}</p>
                                  <p className="text-slate-600">{new Date(activity.timestamp).toLocaleTimeString()}</p>
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
                    <CardDescription>Add or remove candidates for the election</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddCandidate} className="space-y-4 mb-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Candidate Name</Label>
                          <Input
                            id="name"
                            value={newCandidate.name}
                            onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="position">Position</Label>
                          <Input
                            id="position"
                            value={newCandidate.position}
                            onChange={(e) => setNewCandidate({ ...newCandidate, position: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="party">Party/Affiliation</Label>
                          <Input
                            id="party"
                            value={newCandidate.party}
                            onChange={(e) => setNewCandidate({ ...newCandidate, party: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={newCandidate.category}
                            onValueChange={(value: string) => setNewCandidate({ ...newCandidate, category: value })}
                            required
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.name}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contractId">Contract ID (Optional)</Label>
                          <Input
                            id="contractId"
                            type="number"
                            placeholder={`Auto: ${adminData.candidates.length}`}
                            value={newCandidate.contractId}
                            onChange={(e) => setNewCandidate({ ...newCandidate, contractId: e.target.value })}
                          />
                          <p className="text-xs text-slate-500">Leave empty to auto-assign the next ID ({adminData.candidates.length})</p>
                        </div>
                      </div>
                      <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
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
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleFixAllCandidates}
                        disabled={submitting}
                        className="ml-2"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Fix All Candidates
                      </Button>
                    </form>

                    <div>
                      <h3 className="text-slate-900 mb-4">Current Candidates</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Party</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {adminData.candidates.map((candidate) => (
                            <TableRow key={candidate.id}>
                              <TableCell className="text-slate-900">{candidate.name}</TableCell>
                              <TableCell className="text-slate-600">{candidate.position}</TableCell>
                              <TableCell className="text-slate-600">{candidate.party}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" onClick={() => handleRemoveCandidate(candidate.id)}>
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
                    <CardDescription>View and manage registered voters</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex gap-2">
                        <Input placeholder="Search voters..." className="w-64" />
                        <Button variant="outline" size="sm" onClick={fetchAdminData}>
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
                        {adminData.voters.map((voter) => (
                          <TableRow key={voter.id}>
                            <TableCell className="text-slate-900">{voter.studentId}</TableCell>
                            <TableCell className="font-mono text-slate-600">{voter.walletAddress.substring(0, 10)}...</TableCell>
                            <TableCell className="text-slate-600">{voter.department}</TableCell>
                            <TableCell className="text-slate-600">{new Date(voter.registrationDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              {voter.hasVoted ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border border-slate-400" />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="categories" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Voting Categories</CardTitle>
                    <CardDescription>Manage voting categories and positions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-slate-600 mb-4">Manage all voting categories and positions from the dedicated page.</p>
                      <Button onClick={() => onNavigate('manage-categories')} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Manage Categories
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Election Settings</CardTitle>
                    <CardDescription>Configure election parameters</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateElection} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Election Title</Label>
                        <Input
                          id="title"
                          value={newElection.title}
                          onChange={(e) => setNewElection({ ...newElection, title: e.target.value })}
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
                            onChange={(e) => setNewElection({ ...newElection, startDate: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endDate">End Date</Label>
                          <Input
                            id="endDate"
                            type="datetime-local"
                            value={newElection.endDate}
                            onChange={(e) => setNewElection({ ...newElection, endDate: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="allowResults">Show Results During Voting</Label>
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
                        <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
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
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={handleStartElection}
                          disabled={submitting || adminData.electionStatus === "Active"}
                        >
                          Start Election
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleEndElection}
                          disabled={submitting || adminData.electionStatus !== "Active"}
                        >
                          End Election
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}