import { useState, useEffect } from "react";
import { VoteReceipt } from "../lib/blockchain";

// Extended interface to include election title and description
interface ExtendedVoteReceipt extends VoteReceipt {
  electionTitle?: string;
  electionDescription?: string;
}
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  CheckCircle2,
  Calendar,
  User,
  ArrowLeft,
  Loader2,
  Receipt,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { UserNav } from "./UserNav";
import { isLoggedIn, getCurrentUser } from "../lib/session";
import { ethers } from "ethers";

const apuLogo = "/apu-logo.png";
const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3001/api"
).replace(/\/api$/, "");

interface MyVotesPageProps {
  onNavigate: (page: string) => void;
}

export function MyVotesPage({ onNavigate }: MyVotesPageProps) {
  const [receipts, setReceipts] = useState<ExtendedVoteReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [notRegistered, setNotRegistered] = useState(false);
  const [walletMismatch, setWalletMismatch] = useState(false);
  const [walletMismatchMessage, setWalletMismatchMessage] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const currentUser = getCurrentUser();

  useEffect(() => {
    // Check if user is logged in
    if (!currentUser) {
      console.log("❌ Not logged in - redirecting to login");
      localStorage.setItem("intendedDestination", "my-votes");
      onNavigate("login");
      return;
    }

    loadReceipts();
  }, [refreshTrigger]);

  const loadReceipts = async () => {
    try {
      setLoading(true);
      setNotRegistered(false);

      // Get current wallet address
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      console.log("📜 Loading vote history for wallet:", walletAddress);

      // VALIDATE: Check if wallet matches registered account
      try {
        const validateResponse = await fetch(
          `${API_URL}/api/voters/validate-wallet`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              walletAddress,
              studentId: currentUser?.studentId,
              email: currentUser?.email,
            }),
          }
        );

        const validateData = await validateResponse.json();

        if (!validateData.valid) {
          console.log("❌ WALLET-IDENTITY MISMATCH on My Votes page!");
          setWalletMismatch(true);
          setWalletMismatchMessage(
            validateData.message ||
              "This wallet doesn't match your registered account."
          );
          setLoading(false);
          return;
        }

        console.log("✅ Wallet validated for My Votes page");
        setWalletMismatch(false);
      } catch (validateErr) {
        console.error("❌ Wallet validation failed:", validateErr);
        setWalletMismatch(true);
        setWalletMismatchMessage(
          "Failed to validate wallet. Please ensure you're using your registered wallet."
        );
        setLoading(false);
        return;
      }

      // Fetch vote history from DATABASE (lifetime, all elections)
      const response = await fetch(
        `${API_URL}/api/votes/history/${walletAddress}`
      );
      const data = await response.json();

      if (data.success && data.elections && data.elections.length > 0) {
        console.log(
          `✅ Found ${data.totalVotes} vote(s) across ${data.elections.length} election(s)`
        );

        // Convert database format to component format
        const allReceipts: ExtendedVoteReceipt[] = [];

        for (const election of data.elections) {
          for (const vote of election.votes) {
            allReceipts.push({
              categoryId: 0, // Not needed for display
              categoryName: vote.categoryName,
              candidateId: 0, // Not needed for display
              candidateName: vote.candidateName,
              timestamp: new Date(vote.timestamp),
              transactionHash: vote.transactionHash,
              electionTitle: election.electionTitle, // Use electionTitle from API
              electionDescription: election.electionDescription, // Use electionDescription from API
            });
          }
        }

        setReceipts(allReceipts);
      } else {
        console.log("ℹ️  No vote history found");
        setReceipts([]);
      }
    } catch (err: any) {
      console.error("Failed to load vote history:", err);
      toast.error("Failed to load vote history");
      setReceipts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleElectionsClick = () => {
    if (!currentUser) {
      localStorage.setItem("intendedDestination", "vote");
      onNavigate("login");
    } else {
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
            <span className="font-semibold text-slate-900">My Votes</span>
          </div>
          <nav className="hidden md:flex gap-6 flex-1 justify-center">
            <button
              onClick={() => onNavigate("home")}
              className="text-sm font-normal text-slate-600 hover:text-slate-900 transition-colors"
            >
              Home
            </button>
            <button
              onClick={handleElectionsClick}
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
              className="text-sm font-normal text-primary"
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
                  size="sm"
                  onClick={() => onNavigate("register")}
                >
                  Register
                </Button>
                <Button
                  size="sm"
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

      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-6 md:px-8 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => onNavigate("home")}
              className="mb-6 -ml-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>

            <div className="flex items-center gap-3 mb-4">
              <Receipt className="h-8 w-8 text-emerald-500" />
              <h1 className="text-3xl font-bold text-slate-900">
                My Vote Receipts
              </h1>
            </div>

            <p className="text-slate-600 mb-8">
              View your blockchain-verified voting receipts and confirm your
              participation in the election.
            </p>

            {/* Info Card */}
            <Card className="mb-8 border-2 shadow-lg bg-emerald-50 border-emerald-200">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="bg-emerald-500/20 p-3 rounded-full h-fit">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900 mb-1">
                      Blockchain Verified
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      These receipts are fetched directly from the blockchain.
                      They serve as cryptographic proof that your vote was
                      successfully recorded.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {walletMismatch ? (
              <Card className="border-2 border-red-200 shadow-lg bg-red-50">
                <CardContent className="py-16 text-center">
                  <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-4">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Wallet Address Mismatch
                  </h3>
                  <p className="text-slate-600 max-w-md mx-auto mb-6">
                    {walletMismatchMessage}
                  </p>
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg max-w-md mx-auto mb-6">
                    <p className="text-sm font-semibold text-blue-900 mb-2">
                      How to fix this:
                    </p>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside text-left">
                      <li>Open your MetaMask wallet</li>
                      <li>Switch to the wallet you registered with</li>
                      <li>Refresh this page</li>
                    </ol>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={() => {
                        setLoading(true);
                        setWalletMismatch(false);
                        setRefreshTrigger((prev) => prev + 1);
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      Refresh Page
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onNavigate("home")}
                    >
                      Return Home
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : loading ? (
              <div className="flex flex-col items-center justify-center space-y-6 py-24">
                <div className="bg-emerald-500 rounded-full p-6 shadow-xl">
                  <Loader2 className="h-16 w-16 animate-spin text-white" />
                </div>
                <p className="text-xl font-medium text-slate-700">
                  Fetching receipts from blockchain...
                </p>
              </div>
            ) : notRegistered ? (
              <Card className="border-2 border-amber-200 shadow-lg bg-amber-50">
                <CardContent className="py-16 text-center">
                  <div className="bg-amber-100 p-4 rounded-full w-fit mx-auto mb-4">
                    <Receipt className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Not Registered as Voter
                  </h3>
                  <p className="text-slate-600 mb-6 max-w-sm mx-auto">
                    You need to register as a voter before you can view your
                    vote receipts.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={() => onNavigate("voter-registration")}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      Register as Voter
                    </Button>
                    <Button
                      onClick={() => onNavigate("home")}
                      variant="outline"
                    >
                      Go to Home
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : receipts.length === 0 ? (
              <Card className="border-2 shadow-lg">
                <CardContent className="py-16 text-center">
                  <div className="bg-slate-100 p-4 rounded-full w-fit mx-auto mb-4">
                    <Receipt className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    No Votes Found
                  </h3>
                  <p className="text-slate-600 mb-6 max-w-sm mx-auto">
                    It seems you haven't cast any votes in the current election
                    yet.
                  </p>
                  <Button
                    onClick={() => onNavigate("vote")}
                    className="bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    Go to Voting Page
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {/* Group receipts by transaction hash */}
                {(() => {
                  const groupedByTx: Record<string, ExtendedVoteReceipt[]> = {};
                  receipts.forEach((receipt) => {
                    const txHash = receipt.transactionHash || "unknown";
                    if (!groupedByTx[txHash]) {
                      groupedByTx[txHash] = [];
                    }
                    groupedByTx[txHash].push(receipt);
                  });

                  return Object.entries(groupedByTx).map(
                    ([txHash, txReceipts], idx) => (
                      <Card
                        key={idx}
                        className="border-2 shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                      >
                        <div className="bg-emerald-500/10 px-4 py-2 border-b border-emerald-500/20 flex justify-between items-center">
                          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                            Confirmed Transaction
                          </span>
                          <span className="text-xs text-emerald-600 font-medium">
                            {txReceipts.length} vote(s)
                          </span>
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                            {txReceipts[0].electionTitle || "My Votes"}
                          </CardTitle>
                          {txReceipts[0].electionDescription && (
                            <p className="text-sm text-slate-600 mt-2">
                              {txReceipts[0].electionDescription}
                            </p>
                          )}
                        </CardHeader>
                        <CardContent>
                          {/* List all votes in this transaction */}
                          <div className="space-y-4">
                            {txReceipts.map((receipt, voteIdx) => (
                              <div
                                key={voteIdx}
                                className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0"
                              >
                                <div className="bg-slate-100 p-2 rounded-lg mt-0.5">
                                  <User className="h-4 w-4 text-slate-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">
                                    {receipt.categoryName}
                                  </p>
                                  <p className="font-semibold text-slate-900">
                                    {receipt.candidateName}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Time cast */}
                          <div className="flex items-start gap-3 mt-4 pt-4 border-t border-slate-200">
                            <div className="bg-slate-100 p-2 rounded-lg mt-0.5">
                              <Calendar className="h-4 w-4 text-slate-600" />
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">
                                Time Cast
                              </p>
                              <p className="font-semibold text-slate-900">
                                {txReceipts[0].timestamp.toLocaleDateString()}
                              </p>
                              <p className="text-xs text-slate-600">
                                {txReceipts[0].timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>

                          {/* Transaction hash */}
                          {txHash && txHash !== "unknown" && (
                            <div className="mt-4 pt-4 border-t border-slate-200">
                              <div className="bg-emerald-50 rounded-lg p-3">
                                <p className="text-xs text-emerald-700 font-semibold mb-1">
                                  Blockchain Transaction
                                </p>
                                <div className="flex items-center gap-2">
                                  <code className="text-[10px] text-slate-700 font-mono flex-1 truncate">
                                    {txHash}
                                  </code>
                                  <a
                                    href={`https://hoodi.etherscan.io/tx/${txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-600 hover:text-emerald-700"
                                    title="View on Blockchain Explorer"
                                  >
                                    <Receipt className="h-4 w-4" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  );
                })()}

                <div className="mt-8 text-center bg-white p-6 rounded-xl border-2 border-slate-200 shadow-lg">
                  <p className="text-sm text-slate-500 mb-4 italic">
                    "Your vote is clear, your choice is secured."
                  </p>
                  <div className="flex justify-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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
