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
        toast.success("Login successful!");

        // Check for intended destination
        const intended = localStorage.getItem("intendedDestination");
        if (intended) {
          localStorage.removeItem("intendedDestination");
          onNavigate(intended);
        } else {
          onNavigate("home");
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
      const response = await loginAdmin({
        email: adminForm.email,
        password: adminForm.password,
      });

      if (response.success) {
        toast.success("Admin login successful!");
        onNavigate("admin");
      } else {
        setError(response.message || "Invalid admin credentials");
      }
    } catch (err) {
      setError("An error occurred during admin login");
      console.error(err);
    } finally {
      setLoading(false);
    }
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
                  variant="ghost"
                  onClick={() => onNavigate("register")}
                  className="text-slate-600 hover:text-slate-900"
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
                {/* Social Login Options */}
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-slate-600 mb-4">
                      Sign in with your university account
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full h-11 bg-transparent"
                    onClick={() => handleSocialLogin("google")}
                    disabled={socialLoading !== null || loading}
                  >
                    {socialLoading === "google" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    )}
                    {socialLoading === "google"
                      ? "Signing in..."
                      : "Continue with Google"}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-11 bg-transparent"
                    onClick={() => handleSocialLogin("microsoft")}
                    disabled={socialLoading !== null || loading}
                  >
                    {socialLoading === "microsoft" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path fill="#F25022" d="M1 1h10v10H1z" />
                        <path fill="#00A4EF" d="M13 1h10v10H13z" />
                        <path fill="#7FBA00" d="M1 13h10v10H1z" />
                        <path fill="#FFB900" d="M13 13h10v10H13z" />
                      </svg>
                    )}
                    {socialLoading === "microsoft"
                      ? "Signing in..."
                      : "Continue with Microsoft"}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-2 text-slate-600">
                        Or continue with
                      </span>
                    </div>
                  </div>
                </div>

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
                      "Sign In"
                    )}
                  </Button>
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
