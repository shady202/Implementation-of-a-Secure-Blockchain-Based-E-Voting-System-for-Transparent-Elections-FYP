import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { ArrowLeft, CheckCircle2, Loader2, Wallet, AlertCircle } from "lucide-react";
import { connectWallet, registerVoter as registerVoterBlockchain } from "../lib/blockchain";
import { NETWORKS } from "../lib/networks";
import { toast } from "sonner";
import { UserNav } from "./UserNav";
import { isLoggedIn } from "../lib/session";
import { registerVoter as registerVoterAPI } from "../lib/api";
import { projectId, publicAnonKey } from "../utils/supabase/info";

const apuLogo = "/apu-logo.png";

interface VoterRegistrationPageProps {
  onNavigate: (page: string) => void;
  onRegistrationComplete?: () => void;
}

export function VoterRegistrationPage({ onNavigate, onRegistrationComplete }: VoterRegistrationPageProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    studentId: "",
    department: "",
    year: "",
    walletAddress: "",
  });

  const currentUser = isLoggedIn();

  useEffect(() => {
    // Check if wallet is already connected
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          const walletAddress = accounts[0];

          // Check if user is already registered in the backend
          try {
            const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-14835f38/voter/${walletAddress}`, {
              headers: {
                'Authorization': `Bearer ${publicAnonKey}`,
              }
            });
            const data = await response.json();

            if (data.registered) {
              // User is already registered, redirect to voting page
              onNavigate('vote');
              return;
            }
          } catch (error) {
            console.log("Error checking voter registration:", error);
          }

          // User has wallet connected but not registered, show registration form
          setFormData({ ...formData, walletAddress });
          setConnected(true);
          setStep(2);
        }
      } catch (err) {
        console.error("Error checking wallet connection:", err);
      }
    }
  };

  const handleConnect = async () => {
    setLoading(true);
    setError("");

    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        setError("MetaMask is not installed. Please install MetaMask to continue.");
        toast.error("MetaMask not found");
        setLoading(false);
        return;
      }

      // Check if Hoodi network is already configured
      const currentChainId = await window.ethereum.request({ method: "eth_chainId" }) as string;
      const hoodiChainId = NETWORKS.hoodi.chainId; // Hoodi network chain ID

      let address: string;
      // If already on Hoodi network, just connect
      if (currentChainId === hoodiChainId) {
        address = await connectWallet();
      } else {
        // Try to switch to Hoodi network (will only prompt to add if not exists)
        address = await connectWallet("hoodi");
      }

      // Check if user is already registered in the backend
      try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-14835f38/voter/${address}`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          }
        });
        const data = await response.json();

        if (data.registered) {
          // User is already registered, redirect to voting page
          toast.success(`Wallet already registered!`);
          onNavigate('vote');
          return;
        }
      } catch (error) {
        console.log("Error checking voter registration:", error);
      }

      // User has wallet connected but not registered, show registration form
      setFormData({ ...formData, walletAddress: address });
      setConnected(true);
      toast.success(`Wallet connected: ${address.substring(0, 6)}...${address.substring(38)}`);
      setStep(2);
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      if (error.code === 4001) {
        setError("Connection rejected. Please approve the connection request in MetaMask.");
        toast.error("Connection rejected");
      } else {
        setError(error.message || "Failed to connect wallet. Please try again.");
        toast.error(error.message || "Failed to connect wallet");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate Student ID format (TP + 6 digits)
    const studentIdRegex = /^TP\d{6}$/;
    if (!studentIdRegex.test(formData.studentId)) {
      toast.error("Student ID must be in format: TP followed by 6 digits (e.g., TP123456)");
      setError("Invalid Student ID format. Please use format: TP123456");
      return;
    }

    // Manual validation since Select components don't support HTML required attribute
    if (!formData.studentId || !formData.department || !formData.year || !formData.walletAddress) {
      toast.error("Please fill in all required fields");
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Step 1: Register on blockchain FIRST (most important!)
      toast.info("Registering on blockchain...");
      const blockchainResult = await registerVoterBlockchain({
        studentId: formData.studentId,
        department: formData.department,
        yearOfStudy: Number(formData.year),
        walletAddress: formData.walletAddress
      });

      if (!blockchainResult.success) {
        throw new Error("Blockchain registration failed");
      }

      // Step 2: Save to Supabase database
      toast.info("Saving to database...");
      const apiResponse = await registerVoterAPI(formData);

      if (apiResponse.success) {
        setLoading(false);
        setRegistered(true);
        toast.success("Registration completed successfully!");
        localStorage.setItem("voterRegistrationCompleted", "true");
        if (onRegistrationComplete) {
          onRegistrationComplete();
        }
      } else {
        setLoading(false);
        setError(apiResponse.message || "Failed to save to database. Please try again.");
        toast.error(apiResponse.message || "Failed to save to database");
      }
    } catch (error: any) {
      setLoading(false);
      console.error("Registration error:", error);
      setError(error.message || "Failed to register voter. Please try again.");
      toast.error(error.message || "Failed to register voter");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-white">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-6 md:px-8">
          <div className="flex items-center gap-3">
            <img src={apuLogo} alt="Asia Pacific University Logo" className="h-10 w-auto" />
            <span>APU VOTE</span>
          </div>
          <nav className="hidden md:flex gap-6">
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
          {currentUser ? (
            <UserNav onNavigate={onNavigate} />
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('login')}
            >
              Sign In
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container mx-auto max-w-md px-6">
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 mr-auto"
                  onClick={() => onNavigate('home')}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <img src={apuLogo} alt="Asia Pacific University Logo" className="h-10 w-auto" />
                <CardTitle>Voter Registration</CardTitle>
              </div>
              <CardDescription>Register to participate in APU VOTE elections</CardDescription>
            </CardHeader>
            <CardContent>
              {registered ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
                  <h3 className="text-slate-900">Registration Successful!</h3>
                  <p className="text-slate-600 mt-2 mb-6">
                    You are now registered to vote in the upcoming elections.
                  </p>
                  <Button onClick={() => onNavigate('vote')}>
                    Go to Voting Page
                  </Button>
                </div>
              ) : step === 1 ? (
                <div className="space-y-6">
                  {/* Connection Status */}
                  {connected ? (
                    <Alert className="bg-emerald-50 border-emerald-200">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <AlertDescription className="text-sm text-emerald-800 ml-2">
                        Wallet connected successfully!
                        <br />
                        <span className="text-xs mt-1 block">
                          Address: {formData.walletAddress.slice(0, 6)}...{formData.walletAddress.slice(-4)}
                        </span>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Wallet className="h-10 w-10 text-gray-600" />
                      </div>
                      <h3 className="text-lg text-gray-900 mb-2">Connect MetaMask</h3>
                      <p className="text-sm text-gray-600 mb-6">
                        Connect your Ethereum wallet to register as a voter. This wallet will be used to cast your vote securely.
                      </p>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <Alert className="bg-red-50 border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-sm text-red-800 ml-2">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm text-blue-900 mb-2">Before you continue:</h4>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                      <li>Make sure MetaMask is installed in your browser</li>
                      <li>Ensure you have some ETH for transaction fees</li>
                      <li>Your wallet will be used to verify your identity</li>
                      <li>You can only vote once per election</li>
                    </ul>
                  </div>

                  {/* Connect Button */}
                  {!connected && (
                    <Button onClick={handleConnect} disabled={loading} className="w-full bg-gray-600 hover:bg-gray-700 h-11">
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Wallet className="mr-2 h-4 w-4" />
                          Connect MetaMask
                        </>
                      )}
                    </Button>
                  )}

                  {/* MetaMask Download Link */}
                  <p className="text-xs text-gray-500 text-center">
                    Don't have MetaMask?{" "}
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Download here
                    </a>
                  </p>

                  {/* Verify Eligibility Link */}
                  <p className="text-sm text-center text-slate-600">
                    Not sure if you're eligible?{" "}
                    <button
                      onClick={() => onNavigate('verify-eligibility')}
                      className="text-emerald-600 hover:underline"
                    >
                      Verify your eligibility
                    </button>{" "}
                    first.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Error Display */}
                  {error && (
                    <Alert className="bg-red-50 border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-sm text-red-800 ml-2">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      placeholder="TP123456"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value.toUpperCase() })}
                      maxLength={8}
                      required
                    />
                    <p className="text-xs text-slate-500">Format: TP followed by 6 digits (e.g., TP123456)</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                      required
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="computer-science">Computer Science</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="arts">Arts & Humanities</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year of Study</Label>
                    <Select
                      value={formData.year}
                      onValueChange={(value) => setFormData({ ...formData, year: value })}
                      required
                    >
                      <SelectTrigger id="year">
                        <SelectValue placeholder="Select your year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">First Year</SelectItem>
                        <SelectItem value="2">Second Year</SelectItem>
                        <SelectItem value="3">Third Year</SelectItem>
                        <SelectItem value="4">Fourth Year</SelectItem>
                        <SelectItem value="5">Postgraduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="walletAddress">Wallet Address</Label>
                    <Input id="walletAddress" value={formData.walletAddress} readOnly className="bg-slate-100" />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <p className="text-xs text-slate-600 text-center">
                By registering, you agree to the terms and conditions of the university election system.
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="w-full border-t py-6 mt-auto">
        <div className="container mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 md:flex-row px-6 md:px-8">
          <div className="text-center text-slate-600 md:text-left">
            &copy; {new Date().getFullYear()} APU Vote Chain. All rights reserved.
          </div>
          <div className="flex gap-4">
            <button
              className="text-sm text-slate-600 hover:underline"
            >
              Terms
            </button>
            <button
              onClick={() => onNavigate('privacy')}
              className="text-sm text-slate-600 hover:underline"
            >
              Privacy
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="text-sm text-slate-600 hover:underline"
            >
              Contact
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}