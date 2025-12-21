import { useState } from "react";
import {
  CheckCircle,
  Copy,
  Check,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { UserNav } from "./UserNav";
import { isLoggedIn } from "../lib/session";
import { toast } from "sonner";

const apuLogo = "/apu-logo.png";

interface VoteSuccessPageProps {
  onNavigate: (page: string) => void;
  transactionHash?: string;
}

export function VoteSuccessPage({
  onNavigate,
  transactionHash = "0x0000000000000000000000000000000000000000000000000000000000000000",
}: VoteSuccessPageProps) {
  const [copied, setCopied] = useState(false);
  const currentUser = isLoggedIn();

  const handleCopyHash = () => {
    navigator.clipboard.writeText(transactionHash);
    setCopied(true);
    toast.success("Transaction hash copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
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
            <span className="font-semibold text-slate-900">Vote Success</span>
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

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-16 px-6">
        <div className="w-full max-w-2xl">
          <Button
            variant="ghost"
            onClick={() => onNavigate("vote")}
            className="mb-6 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Voting
          </Button>

          <Card className="border-2 border-emerald-500 shadow-2xl">
            <CardHeader className="text-center pb-4 pt-8">
              <div className="flex justify-center mb-4">
                <div className="bg-emerald-500 rounded-full p-4">
                  <CheckCircle className="h-16 w-16 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-slate-900 mb-2">
                Vote Submitted Successfully!
              </CardTitle>
              <p className="text-slate-600 text-base">
                Your vote has been securely recorded on the blockchain. The
                transaction details have been saved for verification.
              </p>
            </CardHeader>

            <CardContent className="space-y-6 pb-8">
              {/* Transaction ID Section */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Transaction ID
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white border border-slate-300 rounded-md px-3 py-2 font-mono text-xs text-slate-900 overflow-x-auto">
                    {transactionHash}
                  </div>
                  <Button
                    onClick={handleCopyHash}
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Blockchain Verification Message */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <p className="text-sm text-slate-700 leading-relaxed">
                  <span className="font-semibold text-emerald-700">
                    Verify on Blockchain:
                  </span>{" "}
                  If you want to verify your vote on the blockchain, paste your
                  Transaction Hash in{" "}
                  <a
                    href="https://hoodi.etherscan.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 underline font-medium inline-flex items-center gap-1"
                  >
                    https://hoodi.etherscan.io/
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <Button
                  onClick={() => onNavigate("results")}
                  variant="outline"
                  className="w-full border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                >
                  View Results
                </Button>
                <Button
                  onClick={() => onNavigate("my-votes")}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  View My Votes
                </Button>
              </div>
            </CardContent>
          </Card>
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
