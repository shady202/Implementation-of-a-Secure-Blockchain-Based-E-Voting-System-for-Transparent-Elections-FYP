import { useState, useEffect } from "react";
import { getMyVotes, VoteReceipt, isVoterRegistered } from "../lib/blockchain";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  CheckCircle2,
  Calendar,
  User,
  ArrowLeft,
  Loader2,
  Receipt,
} from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { UserNav } from "./UserNav";
import { isLoggedIn } from "../lib/session";

const apuLogo = "/apu-logo.png";

interface MyVotesPageProps {
  onNavigate: (page: string) => void;
}

export function MyVotesPage({ onNavigate }: MyVotesPageProps) {
  const [receipts, setReceipts] = useState<VoteReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [notRegistered, setNotRegistered] = useState(false);
  const currentUser = isLoggedIn();

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async () => {
    try {
      setLoading(true);
      setNotRegistered(false);

      // Check if user is registered on the blockchain first
      const isRegistered = await isVoterRegistered();

      if (!isRegistered) {
        setNotRegistered(true);
        toast.error(
          "Your wallet is not registered as a voter on the blockchain"
        );
        return;
      }

      const votes = await getMyVotes();
      setReceipts(votes);
    } catch (err: any) {
      console.error("Failed to load votes:", err);

      // Check if error is "Not registered"
      if (
        err?.message?.includes("Not registered") ||
        err?.reason === "Not registered"
      ) {
        setNotRegistered(true);
        toast.error("You need to register as a voter first");
      } else {
        toast.error("Failed to load vote receipts from blockchain");
      }
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

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-emerald-500 mb-4" />
                <p className="text-slate-600 animate-pulse font-medium">
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
                {receipts.map((receipt, idx) => (
                  <Card
                    key={idx}
                    className="border-2 shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="bg-emerald-500/10 px-4 py-2 border-b border-emerald-500/20 flex justify-between items-center">
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        Confirmed Transaction
                      </span>
                      <span className="text-xs text-emerald-600 font-medium">
                        ID: #{receipt.categoryId.toString()}
                      </span>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                        {receipt.categoryName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-slate-100 p-2 rounded-lg mt-0.5">
                            <User className="h-4 w-4 text-slate-600" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">
                              Voted For
                            </p>
                            <p className="font-semibold text-slate-900">
                              {receipt.candidateName}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-mono underline decoration-dotted">
                              ID: {receipt.candidateId.toString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-slate-100 p-2 rounded-lg mt-0.5">
                            <Calendar className="h-4 w-4 text-slate-600" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">
                              Time Cast
                            </p>
                            <p className="font-semibold text-slate-900">
                              {receipt.timestamp.toLocaleDateString()}
                            </p>
                            <p className="text-xs text-slate-600">
                              {receipt.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {receipt.transactionHash && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <div className="bg-emerald-50 rounded-lg p-3">
                            <p className="text-xs text-emerald-700 font-semibold mb-1">
                              Blockchain Transaction
                            </p>
                            <div className="flex items-center gap-2">
                              <code className="text-[10px] text-slate-700 font-mono flex-1 truncate">
                                {receipt.transactionHash}
                              </code>
                              <a
                                href={`https://hoodi.etherscan.io/tx/${receipt.transactionHash}`}
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
                ))}

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
