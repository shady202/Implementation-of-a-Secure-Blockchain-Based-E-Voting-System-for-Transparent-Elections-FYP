"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Wallet,
  AlertCircle,
} from "lucide-react";
import {
  connectWallet,
  registerVoter as registerVoterBlockchain,
} from "../lib/blockchain";
import { NETWORKS } from "../lib/networks";
import { toast } from "sonner";
import { parseBlockchainError } from "../lib/errorParser";
import { UserNav } from "./UserNav";
import { isLoggedIn, getCurrentUser } from "../lib/session";
import {
  registerVoter as registerVoterAPI,
  checkVoterRegistration,
} from "../lib/api";

const apuLogo = "/apu-logo.png";

interface VoterRegistrationPageProps {
  onNavigate: (page: string) => void;
  onRegistrationComplete?: () => void;
}

export function VoterRegistrationPage({
  onNavigate,
  onRegistrationComplete,
}: VoterRegistrationPageProps) {
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

  // Map faculty codes to full names
  const facultyMap: Record<string, string> = {
    computing: "School of Computing",
    engineering: "School of Engineering",
    business: "School of Business",
    media: "School of Media & Design",
    science: "School of Science",
  };

  useEffect(() => {
    // Auto-fill Student ID and Faculty from logged-in user data
    const userData = getCurrentUser();
    console.log("VoterRegistration - User Data:", userData); // DEBUG
    if (userData) {
      // Convert faculty code to full name if needed
      const facultyCode = userData.department || "";
      const facultyFullName =
        facultyMap[facultyCode.toLowerCase()] || facultyCode;

      setFormData((prev) => ({
        ...prev,
        studentId: userData.studentId || "",
        department: facultyFullName,
      }));
    }

    checkWalletConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkWalletConnection = async () => {
    if (
      typeof window !== "undefined" &&
      typeof (window as any).ethereum !== "undefined"
    ) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: "eth_accounts",
        });

        if (accounts?.length > 0) {
          const walletAddress = accounts[0];

          // Set wallet address and proceed to step 2
          setFormData((prev) => ({ ...prev, walletAddress }));
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
      if (
        typeof window === "undefined" ||
        typeof (window as any).ethereum === "undefined"
      ) {
        setError(
          "MetaMask is not installed. Please install MetaMask to continue."
        );
        toast.error("MetaMask not found");
        return;
      }

      // Optional: network info only (no auto switching here)
      try {
        const currentChainId = (await (window as any).ethereum.request({
          method: "eth_chainId",
        })) as string;

        const hoodiChainId = NETWORKS.hoodi.chainId;
        if (currentChainId !== hoodiChainId) {
          console.log("Not on Hoodi. Current chain:", currentChainId);
        }
      } catch (e) {
        console.log("Could not read chainId:", e);
      }

      const address = await connectWallet();

      // Check backend registration
      try {
        const data = await checkVoterRegistration(address);
        if (data?.registered) {
          toast.success("Wallet already registered!");
          onNavigate("vote");
          return;
        }
      } catch (e) {
        console.log("Error checking voter registration:", e);
      }

      setFormData((prev) => ({ ...prev, walletAddress: address }));
      setConnected(true);
      toast.success(
        `Wallet connected: ${address.slice(0, 6)}...${address.slice(-4)}`
      );
      setStep(2);
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);

      if (error?.code === 4001) {
        setError(
          "Connection rejected. Please approve the connection request in MetaMask."
        );
        toast.error("Connection rejected");
      } else {
        setError(
          error?.message || "Failed to connect wallet. Please try again."
        );
        toast.error(error?.message || "Failed to connect wallet");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const studentIdRegex = /^TP\d{6}$/;
    if (!studentIdRegex.test(formData.studentId)) {
      toast.error(
        "Student ID must be in format: TP followed by 6 digits (e.g., TP123456)"
      );
      setError("Invalid Student ID format. Please use format: TP123456");
      return;
    }

    if (
      !formData.studentId ||
      !formData.department ||
      !formData.year ||
      !formData.walletAddress
    ) {
      toast.error("Please fill in all required fields");
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ✅ Step 1: Register on blockchain (expects 3 args, returns void)
      toast.info("Registering on blockchain...");
      await registerVoterBlockchain(
        formData.studentId,
        formData.department,
        Number(formData.year)
      );

      // Step 2: Save to PostgreSQL database
      toast.info("Saving to database...");
      const apiResponse = await registerVoterAPI(formData);

      if (apiResponse?.success) {
        setRegistered(true);
        toast.success("Registration completed successfully!");
        localStorage.setItem("voterRegistrationCompleted", "true");
        onRegistrationComplete?.();
      } else {
        const msg =
          apiResponse?.message ||
          "Failed to save to database. Please try again.";
        setError(msg);
        toast.error(msg);
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      // Check if error is about already being registered
      const errorMessage = error?.message || error?.toString() || "";
      const isAlreadyRegistered =
        errorMessage.toLowerCase().includes("already registered") ||
        errorMessage.toLowerCase().includes("already voted");

      if (isAlreadyRegistered) {
        setError("You already voted!");
        toast.error("You already voted!");
      } else {
        const cleanError = parseBlockchainError(error);
        setError(cleanError);
        toast.error(cleanError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl flex h-16 items-center px-6 md:px-8">
          <div className="flex items-center gap-2 w-48">
            <img src={apuLogo} alt="APU Logo" className="h-8 w-8" />
            <span className="font-semibold text-slate-900">APU VOTE</span>
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
            {currentUser ? (
              <UserNav onNavigate={onNavigate} />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("login")}
              >
                Sign In
              </Button>
            )}
          </div>
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
                  onClick={() => onNavigate("home")}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={apuLogo}
                  alt="Asia Pacific University Logo"
                  className="h-10 w-auto"
                />
                <CardTitle>Voter Registration</CardTitle>
              </div>
              <CardDescription>
                Register to participate in APU VOTE elections
              </CardDescription>
            </CardHeader>

            <CardContent>
              {registered ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
                  <h3 className="text-slate-900">Registration Successful!</h3>
                  <p className="text-slate-600 mt-2 mb-6">
                    You are now registered to vote.
                  </p>
                  <Button onClick={() => onNavigate("vote")}>
                    Go to Voting Page
                  </Button>
                </div>
              ) : step === 1 ? (
                <div className="space-y-6">
                  {connected ? (
                    <Alert className="bg-emerald-50 border-emerald-200">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <AlertDescription className="text-sm text-emerald-800 ml-2">
                        Wallet connected successfully!
                        <br />
                        <span className="text-xs mt-1 block">
                          Address: {formData.walletAddress.slice(0, 6)}...
                          {formData.walletAddress.slice(-4)}
                        </span>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Wallet className="h-10 w-10 text-gray-600" />
                      </div>
                      <h3 className="text-lg text-gray-900 mb-2">
                        Connect MetaMask
                      </h3>
                      <p className="text-sm text-gray-600 mb-6">
                        Connect your wallet to register as a voter. This wallet
                        will be used to cast your vote securely.
                      </p>
                    </div>
                  )}

                  {error && (
                    <Alert className="bg-red-50 border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-sm text-red-800 ml-2">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm text-blue-900 mb-2">
                      Before you continue:
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                      <li>Make sure MetaMask is installed in your browser</li>
                      <li>Ensure you have some ETH for transaction fees</li>
                      <li>You can only vote once per election</li>
                    </ul>
                  </div>

                  {!connected && (
                    <Button
                      onClick={handleConnect}
                      disabled={loading}
                      className="w-full bg-gray-600 hover:bg-gray-700 h-11"
                    >
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

                  <p className="text-sm text-center text-slate-600">
                    Not sure if you're eligible?{" "}
                    <button
                      onClick={() => onNavigate("verify-eligibility")}
                      className="text-emerald-600 hover:underline"
                    >
                      Verify your eligibility
                    </button>{" "}
                    first.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
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
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          studentId: e.target.value.toUpperCase(),
                        }))
                      }
                      maxLength={8}
                      required
                      disabled
                      className="bg-slate-100 cursor-not-allowed"
                    />
                    <p className="text-xs text-emerald-600">
                      ✓ Auto-filled from your account
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Faculty</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      readOnly
                      disabled
                      className="bg-slate-100 cursor-not-allowed"
                    />
                    <p className="text-xs text-emerald-600">
                      ✓ Auto-filled from your account
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Year of Study</Label>
                    <Select
                      value={formData.year}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, year: value }))
                      }
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
                    <Input
                      id="walletAddress"
                      value={formData.walletAddress}
                      readOnly
                      className="bg-slate-100"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
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
                By registering, you agree to the terms and conditions of the
                university election system.
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>

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
  );
}
