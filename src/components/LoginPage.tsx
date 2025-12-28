import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { ArrowLeft, Loader2, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { loginUser, loginAdmin } from "../lib/auth";
import { UserNav } from "./UserNav";
import { isLoggedIn } from "../lib/session";
import { createSession } from "../lib/session"; // Import to create session after OTP

const apuLogo = "/apu-logo.png";

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("student");
  const [error, setError] = useState("");
  const currentUser = isLoggedIn();

  // OTP State
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [otpEmail, setOtpEmail] = useState("");

  // Store pending user data until OTP is verified
  const [pendingUser, setPendingUser] = useState<any>(null);
  const [pendingToken, setPendingToken] = useState<string>("");

  // Admin wallet verification state
  const [adminCredentialsVerified, setAdminCredentialsVerified] =
    useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [expectedWalletAddress, setExpectedWalletAddress] = useState("");
  const [verifyingWallet, setVerifyingWallet] = useState(false);

  const [studentForm, setStudentForm] = useState({
    studentId: "",
    password: "",
  });
  const [adminForm, setAdminForm] = useState({
    email: "",
    password: "",
  });

  const handleElectionsClick = () => {
    if (!currentUser) {
      localStorage.setItem("intendedDestination", "vote");
      onNavigate("login");
    } else {
      onNavigate("vote");
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setSocialLoading(provider);
    setError("");

    try {
      // Simulate social login
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.info(`${provider} login is not yet implemented`);
    } catch (err) {
      setError("Social login failed");
    } finally {
      setSocialLoading(null);
    }
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginUser({
        studentId: studentForm.studentId,
        password: studentForm.password,
      });

      if (response.success) {
        // Store user data but DON'T create session yet
        setPendingUser(response.user);
        setPendingToken(response.token || "");

        // Request OTP for email verification
        if (response.user?.email) {
          await handleRequestOtp(response.user.email);
        } else {
          // No email - create session immediately (backward compatibility)
          if (response.user && response.token) {
            createSession(response.user, response.token);
          }
          toast.success("Login successful!");
          const intended = localStorage.getItem("intendedDestination");
          if (intended) {
            localStorage.removeItem("intendedDestination");
            onNavigate(intended);
          } else {
            onNavigate("home");
          }
        }
      } else {
        setError(response.message || "Invalid student ID or password");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate email and password
      const response = await loginAdmin({
        email: adminForm.email,
        password: adminForm.password,
      });

      if (!response.success) {
        setError(response.message || "Invalid admin credentials");
        toast.error("Invalid email or password");
        setLoading(false);
        return;
      }

      // SUCCESS - Navigate to dashboard
      toast.success("Login successful!");
      setLoading(false);
      setTimeout(() => onNavigate("admin"), 500);
    } catch (err) {
      toast.error("An error occurred during admin login");
      setError("An error occurred during admin login");
      console.error(err);
      setLoading(false);
    }
  };

  // Separate function to verify wallet (called by button click)
  const handleVerifyAdminWallet = async () => {
    setVerifyingWallet(true);
    setError("");

    try {
      // Check MetaMask installation
      if (typeof window === "undefined" || !(window as any).ethereum) {
        toast.error("Please connect your wallet first", {
          style: { background: "#fee2e2", color: "#dc2626" },
        });
        setError("MetaMask not detected. Please install MetaMask extension.");
        setVerifyingWallet(false);
        return;
      }

      // Connect wallet
      const { connectWallet } = await import("../lib/blockchain");
      const connectedWallet = await connectWallet();

      if (!connectedWallet) {
        toast.error("Please connect your wallet first", {
          style: { background: "#fee2e2", color: "#dc2626" },
        });
        setError("Failed to connect wallet. Please connect MetaMask.");
        setVerifyingWallet(false);
        return;
      }

      // Verify wallet address
      const verifyResponse = await fetch(
        "http://localhost:3001/api/admin/verify-wallet",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: adminEmail,
            walletAddress: connectedWallet,
          }),
        }
      );

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok || !verifyData.success) {
        toast.error(
          "Please change your wallet address to the admin wallet address",
          {
            style: { background: "#fee2e2", color: "#dc2626" },
            duration: 5000,
          }
        );
        setError(
          verifyData.message ||
            "Unauthorized wallet address. Please connect with your registered admin wallet."
        );
        setVerifyingWallet(false);
        return;
      }

      // SUCCESS! Wallet verified - NOW navigate
      toast.success("Wallet verified! Redirecting to admin dashboard...");
      setVerifyingWallet(false);

      setTimeout(() => {
        onNavigate("admin");
      }, 1000);
    } catch (walletError: any) {
      console.error("Wallet verification error:", walletError);

      if (walletError.code === 4001) {
        toast.error("Please connect your wallet first", {
          style: { background: "#fee2e2", color: "#dc2626" },
        });
        setError(
          "Wallet connection rejected. Please connect MetaMask to continue."
        );
      } else {
        toast.error("Please connect your wallet first", {
          style: { background: "#fee2e2", color: "#dc2626" },
        });
        setError("Failed to connect to MetaMask. Please try again.");
      }

      setVerifyingWallet(false);
    }
  };

  // Handle OTP Request
  const handleRequestOtp = async (email: string) => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/auth/request-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setOtpEmail(email);
      setShowOtpInput(true);
      setCountdown(60);
      toast.success("Verification code sent to your email!");

      // Start countdown timer
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Failed to send verification code");
      throw error;
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3001/api/auth/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: otpEmail, otp: otpCode }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid verification code");
      }

      toast.success("Email verified successfully!");
      setShowOtpInput(false);

      // NOW create session after OTP is verified
      if (pendingUser && pendingToken) {
        createSession(pendingUser, pendingToken);
      }

      // Proceed with login
      toast.success("Login successful!");
      const intended = localStorage.getItem("intendedDestination");
      if (intended) {
        localStorage.removeItem("intendedDestination");
        onNavigate(intended);
      } else {
        onNavigate("home");
      }
    } catch (error: any) {
      toast.error(error.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setOtpCode("");
    await handleRequestOtp(otpEmail);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl flex h-16 items-center px-6 md:px-8">
          <div className="flex items-center gap-2 w-48">
            <img src={apuLogo} alt="APU Logo" className="h-8 w-8" />
            <span className="font-semibold text-slate-900">Sign In</span>
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

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-6">
        <Card className="w-full max-w-md border-2 shadow-lg">
          <CardHeader>
            <div className="flex items-center">
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
                className="h-10 w-auto ml-4"
              />
              <CardTitle>Login to APU VOTE</CardTitle>
            </div>
            <CardDescription>
              Access your account to participate in elections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student">Student Login</TabsTrigger>
                <TabsTrigger value="admin">Admin Login</TabsTrigger>
              </TabsList>

              <TabsContent value="student" className="space-y-4 mt-6">
                {/* Traditional Login Form */}
                <form onSubmit={handleStudentLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      placeholder="Enter your student ID"
                      value={studentForm.studentId}
                      onChange={(e) =>
                        setStudentForm({
                          ...studentForm,
                          studentId: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={studentForm.password}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-600" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-600" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* OTP Verification Section */}
                  {showOtpInput && (
                    <div className="space-y-4 mt-6 p-4 border-2 border-green-200 rounded-lg bg-green-50">
                      <div className="flex items-center gap-2 text-green-700">
                        <ShieldAlert className="h-5 w-5" />
                        <span className="font-semibold">
                          Email Verification Required
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        We've sent a 6-digit code to <strong>{otpEmail}</strong>
                      </p>

                      <div className="space-y-2">
                        <Label htmlFor="otp">Verification Code</Label>
                        <Input
                          id="otp"
                          type="text"
                          maxLength={6}
                          placeholder="Enter 6-digit code"
                          value={otpCode}
                          onChange={(e) =>
                            setOtpCode(e.target.value.replace(/\D/g, ""))
                          }
                          className="text-center text-2xl tracking-widest font-mono"
                          autoFocus
                        />
                      </div>

                      <div className="space-y-2">
                        <Button
                          onClick={handleVerifyOtp}
                          disabled={loading || otpCode.length !== 6}
                          style={{ backgroundColor: "#16a34a", color: "white" }}
                          className="w-full hover:bg-green-700 text-white h-12 text-base font-semibold"
                          type="button"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            "Verify & Login"
                          )}
                        </Button>

                        <Button
                          onClick={handleResendOtp}
                          disabled={countdown > 0}
                          variant="outline"
                          className="w-full"
                          type="button"
                        >
                          {countdown > 0
                            ? `Resend Code (${countdown}s)`
                            : "Resend Code"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {error && (
                    <Alert variant="destructive">
                      <ShieldAlert className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {!showOtpInput && (
                    <Button
                      type="submit"
                      className="w-full bg-emerald-500 hover:bg-emerald-600"
                      disabled={loading || socialLoading !== null}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  )}
                </form>

                <div className="text-center space-y-2">
                  <button
                    onClick={() => onNavigate("forgot-password")}
                    className="text-sm text-emerald-600 hover:underline"
                  >
                    Forgot your password?
                  </button>
                  <p className="text-slate-600">
                    Don't have an account?{" "}
                    <button
                      onClick={() => onNavigate("register")}
                      className="text-emerald-600 hover:underline"
                    >
                      Register here
                    </button>
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4 mt-6">
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      placeholder="Enter your admin email"
                      value={adminForm.email}
                      onChange={(e) =>
                        setAdminForm({ ...adminForm, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminPassword">Password</Label>
                    <div className="relative">
                      <Input
                        id="adminPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your admin password"
                        value={adminForm.password}
                        onChange={(e) =>
                          setAdminForm({
                            ...adminForm,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-600" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-600" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <ShieldAlert className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                    disabled={loading || socialLoading !== null}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Admin Sign In"
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-slate-600">
                    Admin access is restricted to authorized personnel only.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-slate-600 text-center">
              By signing in, you agree to the APU VOTE terms of service and
              privacy policy.
            </p>
          </CardFooter>
        </Card>
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
