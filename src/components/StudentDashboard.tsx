import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { UserNav } from "./UserNav";
import { isLoggedIn, getCurrentUser } from "../lib/session";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Vote,
  Shield,
  Wallet,
  TrendingUp,
  Award,
  ArrowLeft
} from "lucide-react";

const apuLogo = "/apu-logo.png";

interface StudentDashboardProps {
  onNavigate: (page: string) => void;
}

interface VotingHistory {
  id: string;
  electionTitle: string;
  date: string;
  status: string;
  transactionHash: string;
}

export function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const currentUser = isLoggedIn();
  const user = getCurrentUser();
  const [votingHistory, setVotingHistory] = useState<VotingHistory[]>([]);
  const [stats, setStats] = useState({
    totalElections: 3,
    participated: 1,
    upcoming: 1,
    walletConnected: true,
  });

  useEffect(() => {
    // Check authentication
    if (!currentUser) {
      onNavigate('login');
      return;
    }

    // Mock voting history data
    setVotingHistory([
      {
        id: "1",
        electionTitle: "Faculty Representative 2024",
        date: "2024-10-12",
        status: "Completed",
        transactionHash: "0x1234...5678",
      },
    ]);
  }, [currentUser, onNavigate]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-7xl flex h-16 items-center px-6 md:px-8">
          <div className="flex items-center gap-3 w-48">
            <img src={apuLogo} alt="Asia Pacific University Logo" className="h-10 w-auto" />
            <span>APU VOTE</span>
          </div>
          <nav className="hidden md:flex gap-6 flex-1 justify-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-sm transition-colors hover:text-primary"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('vote')}
              className="text-sm transition-colors hover:text-primary"
            >
              Elections
            </button>
            <button
              onClick={() => onNavigate('results')}
              className="text-sm transition-colors hover:text-primary"
            >
              Results
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="text-sm transition-colors hover:text-primary"
            >
              About
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="text-sm transition-colors hover:text-primary"
            >
              Contact
            </button>
          </nav>
          <div className="flex items-center gap-3 w-48 justify-end">
            <UserNav onNavigate={onNavigate} />
          </div>
        </div>
      </header>

      <main className="flex-1 bg-gradient-to-b from-teal-50/30 to-white">
        <div className="container mx-auto max-w-7xl px-6 md:px-8 py-12">
          <div className="mb-6">
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
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <User className="h-8 w-8 text-emerald-600" />
              <h1 className="text-slate-900">Student Dashboard</h1>
            </div>
            <p className="text-slate-600">
              Welcome back, {user?.firstName}! Manage your profile and view your voting activity.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Total Elections</CardTitle>
                <Vote className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-slate-900">{stats.totalElections}</div>
                <p className="text-xs text-slate-600 mt-1">
                  Available to vote
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Participated</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-slate-900">{stats.participated}</div>
                <p className="text-xs text-slate-600 mt-1">
                  Votes cast successfully
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Upcoming</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-slate-900">{stats.upcoming}</div>
                <p className="text-xs text-slate-600 mt-1">
                  Elections coming soon
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Wallet Status</CardTitle>
                <Wallet className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-slate-900">
                  {stats.walletConnected ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  ) : (
                    <span>-</span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {stats.walletConnected ? "Connected" : "Not connected"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="history">Voting History</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your registered details with APU VOTE</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-600">Full Name</label>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <p className="text-slate-900">{user?.firstName} {user?.lastName}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-600">Student ID</label>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-slate-400" />
                        <p className="text-slate-900">{user?.studentId || "TP012345"}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-600">Email Address</label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <p className="text-slate-900">{user?.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-600">Phone Number</label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <p className="text-slate-900">{user?.phone || "+60 12-345 6789"}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-600">Faculty</label>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <p className="text-slate-900">{user?.faculty || "Computing & Technology"}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-600">Registration Date</label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <p className="text-slate-900">{new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button
                      variant="outline"
                      onClick={() => onNavigate('settings')}
                    >
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Wallet Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Wallet</CardTitle>
                  <CardDescription>Your connected wallet for secure voting</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-600">Wallet Address</label>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-md">
                      <Wallet className="h-4 w-4 text-slate-400" />
                      <code className="text-sm text-slate-900 font-mono">
                        {stats.walletConnected ? "0x1234...5678" : "Not connected"}
                      </code>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {stats.walletConnected ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm text-emerald-600">Wallet Connected</span>
                      </>
                    ) : (
                      <Button onClick={() => onNavigate('wallet-connection')}>
                        Connect Wallet
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Voting History Tab */}
            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Voting History</CardTitle>
                  <CardDescription>All your past voting activities on the blockchain</CardDescription>
                </CardHeader>
                <CardContent>
                  {votingHistory.length > 0 ? (
                    <div className="space-y-4">
                      {votingHistory.map((vote) => (
                        <div key={vote.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-emerald-50 rounded-lg">
                              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                              <h3 className="text-slate-900">{vote.electionTitle}</h3>
                              <p className="text-sm text-slate-600">
                                Voted on {new Date(vote.date).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-slate-500 font-mono mt-1">
                                TX: {vote.transactionHash}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-emerald-500">{vote.status}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Vote className="h-12 w-12 text-slate-300 mb-4" />
                      <p className="text-slate-600">No voting history yet</p>
                      <Button
                        className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => onNavigate('elections')}
                      >
                        Cast Your First Vote
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                  <CardDescription>Badges earned through active participation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50">
                      <Award className="h-12 w-12 text-emerald-600 mb-2" />
                      <h3 className="text-slate-900 text-center">First Vote</h3>
                      <p className="text-sm text-slate-600 text-center mt-1">
                        Cast your first vote
                      </p>
                      <Badge className="mt-2 bg-emerald-500">Earned</Badge>
                    </div>
                    <div className="flex flex-col items-center justify-center p-6 border rounded-lg opacity-50">
                      <TrendingUp className="h-12 w-12 text-slate-400 mb-2" />
                      <h3 className="text-slate-900 text-center">Active Voter</h3>
                      <p className="text-sm text-slate-600 text-center mt-1">
                        Vote in 5 elections
                      </p>
                      <Badge variant="outline" className="mt-2">Locked</Badge>
                    </div>
                    <div className="flex flex-col items-center justify-center p-6 border rounded-lg opacity-50">
                      <Shield className="h-12 w-12 text-slate-400 mb-2" />
                      <h3 className="text-slate-900 text-center">Verified Voter</h3>
                      <p className="text-sm text-slate-600 text-center mt-1">
                        Complete wallet verification
                      </p>
                      <Badge variant="outline" className="mt-2">Locked</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="w-full border-t py-6 mt-12">
        <div className="container mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 md:flex-row px-6 md:px-8">
          <div className="text-center text-slate-600 md:text-left">
            &copy; {new Date().getFullYear()} APU Vote Chain. All rights reserved.
          </div>
          <div className="flex gap-6">
            <button
              onClick={() => onNavigate('terms')}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Terms
            </button>
            <button
              onClick={() => onNavigate('privacy')}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Privacy
            </button>
            <button
              onClick={() => onNavigate('contact')}
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