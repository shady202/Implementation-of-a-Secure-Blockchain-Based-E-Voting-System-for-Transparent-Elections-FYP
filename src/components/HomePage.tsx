import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Shield, Lock, Check, ChevronRight } from "lucide-react";
import { UserNav } from "./UserNav";
import { isLoggedIn } from "../lib/session";
import { useState, useEffect } from "react";
import { getElectionSettings, getDashboardStatistics } from "../lib/api";
import { getElectionState } from "../lib/blockchain";

const apuLogo = "/apu-logo.png";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

interface ElectionData {
  title: string;
  status: string;
  startDate: string;
  endDate: string;
  votesCount: number;
  isActive: boolean;
}

export function HomePage({ onNavigate }: HomePageProps) {
  // Check if user is logged in
  const currentUser = isLoggedIn();
  const [electionData, setElectionData] = useState<ElectionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        // Fetch directly from blockchain (skip Supabase API to avoid 404 errors)
        // Check if MetaMask is available
        if (typeof window === "undefined" || !(window as any).ethereum) {
          throw new Error("MetaMask not available");
        }

        const blockchainElection = await getElectionState();
        const startDate = blockchainElection.startTime
          ? new Date(blockchainElection.startTime * 1000)
          : null;
        const endDate = blockchainElection.endTime
          ? new Date(blockchainElection.endTime * 1000)
          : null;

        // Map blockchain states: None=0, Created=1, Active=2, Ended=3
        let status = "Not Available";
        let isActive = false;

        if (blockchainElection.state === 0) {
          status = "No Election";
        } else if (blockchainElection.state === 1) {
          status = "Setup Phase";
        } else if (blockchainElection.state === 2) {
          status = "Active";
          isActive = true;
        } else if (blockchainElection.state === 3) {
          status = "Ended";
        }

        setElectionData({
          title: blockchainElection.title || "No Active Election",
          status,
          startDate: startDate
            ? startDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : "TBD",
          endDate: endDate
            ? endDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : "TBD",
          votesCount: blockchainElection.totalVotes || 0,
          isActive,
        });
      } catch (error) {
        console.error("Failed to fetch election data from blockchain:", error);
        // Final fallback: static defaults
        setElectionData({
          title: "No Active Election",
          status: "Not Available",
          startDate: "TBD",
          endDate: "TBD",
          votesCount: 0,
          isActive: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchElectionData();
  }, []);

  const handleElectionsClick = () => {
    if (!currentUser) {
      // Not logged in, save intended destination and redirect to login
      localStorage.setItem("intendedDestination", "vote");
      onNavigate("login");
    } else {
      // Logged in, go to elections (which will check registration status)
      onNavigate("vote");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl flex h-16 items-center px-6 md:px-8">
          <div className="flex items-center gap-2 w-48">
            <img src={apuLogo} alt="APU Logo" className="h-8 w-8" />
            <span className="text-slate-900">APU VOTE</span>
          </div>
          <nav className="hidden md:flex gap-6 flex-1 justify-center">
            <button
              onClick={() => onNavigate("home")}
              className="text-sm font-normal text-primary"
            >
              Home
            </button>
            <button
              onClick={handleElectionsClick}
              className="text-sm font-normal transition-colors hover:text-primary"
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
            {currentUser ? (
              <UserNav onNavigate={onNavigate} />
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => onNavigate("register")}
                  className="text-slate-900"
                >
                  Register
                </Button>
                <Button
                  onClick={() => onNavigate("login")}
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="container mx-auto max-w-7xl px-6 md:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
              {/* Left Content */}
              <div className="flex flex-col justify-center space-y-6 pt-8">
                <div className="space-y-4">
                  <h1 className="text-slate-900 leading-tight">
                    APU VOTE: Secure University Elections on Blockchain
                  </h1>
                  <p className="text-slate-600 max-w-[600px]">
                    Transparent, tamper-proof voting system ensuring fair
                    elections with real-time results and complete auditability.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Button
                    size="lg"
                    className="bg-slate-900 hover:bg-slate-800 text-white px-8"
                    onClick={() => onNavigate("register")}
                  >
                    Register to Vote
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-slate-300 text-slate-900 hover:bg-slate-50 px-8"
                    onClick={() => onNavigate("about")}
                  >
                    Learn More
                  </Button>
                </div>
              </div>

              {/* Right Card */}
              <div className="flex items-start justify-center lg:justify-end pt-8">
                {loading ? (
                  <Card className="w-full max-w-sm border-2 border-emerald-400 shadow-lg">
                    <CardHeader className="text-center space-y-1 pb-4">
                      <CardTitle className="text-slate-900">
                        Loading...
                      </CardTitle>
                      <CardDescription className="text-slate-600">
                        Fetching election data
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="h-32 flex items-center justify-center">
                        <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
                      </div>
                    </CardContent>
                  </Card>
                ) : electionData ? (
                  <Card
                    className={`w-full max-w-sm border-2 ${
                      electionData.isActive
                        ? "border-emerald-400"
                        : "border-slate-300"
                    } shadow-lg`}
                  >
                    <CardHeader className="text-center space-y-1 pb-4">
                      <CardTitle className="text-slate-900">
                        Current Election
                      </CardTitle>
                      <CardDescription className="text-slate-600">
                        {electionData.title}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-900">
                            Status:
                          </span>
                          <Badge
                            className={`${
                              electionData.status === "Active"
                                ? "bg-emerald-500 hover:bg-emerald-600"
                                : electionData.status === "Ended"
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-slate-500 hover:bg-slate-600"
                            } text-white`}
                          >
                            {electionData.status}
                          </Badge>
                        </div>
                        {electionData.isActive && (
                          <>
                            <div className="h-2 w-full rounded-full bg-slate-200">
                              <div
                                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                                style={{
                                  width: `${
                                    electionData.startDate !== "TBD" &&
                                    electionData.endDate !== "TBD"
                                      ? Math.min(
                                          75,
                                          Math.max(10, Math.random() * 100)
                                        )
                                      : 0
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-600">
                              <span>Started: {electionData.startDate}</span>
                              <span>Ends: {electionData.endDate}</span>
                            </div>
                          </>
                        )}
                        {!electionData.isActive &&
                          electionData.startDate !== "TBD" && (
                            <div className="flex justify-between text-xs text-slate-600">
                              <span>Started: {electionData.startDate}</span>
                              <span>Ends: {electionData.endDate}</span>
                            </div>
                          )}
                      </div>
                      <div className="text-center py-2">
                        <p className="text-sm text-slate-600 mb-1">
                          Total Votes Cast
                        </p>
                        <p className="text-slate-900">
                          {electionData.votesCount.toLocaleString()}
                        </p>
                      </div>
                      <Button
                        className={`w-full ${
                          electionData.isActive
                            ? "bg-slate-900 hover:bg-slate-800"
                            : "bg-slate-400 hover:bg-slate-500 cursor-not-allowed"
                        } text-white`}
                        onClick={
                          electionData.isActive
                            ? handleElectionsClick
                            : undefined
                        }
                        disabled={!electionData.isActive}
                      >
                        {electionData.isActive
                          ? "Vote Now"
                          : electionData.status === "Ended"
                          ? "Election Ended"
                          : "Not Started"}
                        {electionData.isActive && (
                          <ChevronRight className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* Why Blockchain Voting Section */}
        <section className="w-full py-16 md:py-24 bg-white">
          <div className="container mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col items-center justify-center space-y-3 text-center mb-12">
              <h2 className="text-slate-900">Why Blockchain Voting?</h2>
              <p className="max-w-[800px] text-slate-600">
                Our platform leverages Ethereum blockchain technology to provide
                a secure, transparent, and tamper-proof voting system.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
              {/* Security Card */}
              <div className="flex flex-col items-start space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-emerald-500" />
                  <h3 className="text-slate-900">Security</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Cryptographic security ensures votes cannot be tampered with
                  once cast. Each vote is securely recorded on the blockchain.
                </p>
              </div>

              {/* Transparency Card */}
              <div className="flex flex-col items-start space-y-3">
                <div className="flex items-center gap-3">
                  <Lock className="h-6 w-6 text-emerald-500" />
                  <h3 className="text-slate-900">Transparency</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  All votes are publicly verifiable while maintaining voter
                  privacy. The entire election process is transparent and
                  auditable.
                </p>
              </div>

              {/* Fairness Card */}
              <div className="flex flex-col items-start space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="h-6 w-6 text-emerald-500" />
                  <h3 className="text-slate-900">Fairness</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Decentralized system prevents any single entity from
                  controlling the election. Real-time results are available to
                  all participants.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6 bg-white">
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
  );
}
