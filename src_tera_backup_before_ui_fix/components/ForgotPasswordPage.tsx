import { useState, FormEvent } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { UserNav } from "./UserNav";
import { isLoggedIn } from "../lib/session";
const apuLogo = "/apu-logo.png";

interface ForgotPasswordPageProps {
  onNavigate: (page: string) => void;
}

export function ForgotPasswordPage({ onNavigate }: ForgotPasswordPageProps) {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const currentUser = isLoggedIn();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simulate API call to send password reset email
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real implementation, this would call your backend API
      // await sendPasswordResetEmail(email);

      setEmailSent(true);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
      console.error("Password reset error:", err);
    } finally {
      setLoading(false);
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
                  className="gap-1"
                  onClick={() => onNavigate('login')}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <img src={apuLogo} alt="Asia Pacific University Logo" className="h-10 w-auto" />
                <CardTitle>Reset Password</CardTitle>
              </div>
              <CardDescription>
                {emailSent
                  ? "Check your email for reset instructions"
                  : "Enter your student email to receive password reset instructions"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {emailSent ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                  </div>
                  <h3 className="text-slate-900 mb-2">Email Sent!</h3>
                  <p className="text-slate-600 mb-6">
                    We've sent password reset instructions to <span className="text-slate-900">{email}</span>.
                    Please check your inbox and follow the link to reset your password.
                  </p>
                  <p className="text-sm text-slate-500 mb-6">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setEmailSent(false);
                        setEmail("");
                      }}
                    >
                      Try Another Email
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => onNavigate('login')}
                    >
                      Back to Login
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Student Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@student.apu.edu.my"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9"
                        required
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      Enter the email address associated with your student account
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      <p className="text-sm">{error}</p>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Instructions"
                    )}
                  </Button>

                  <div className="text-center text-sm">
                    <span className="text-slate-600">Remember your password? </span>
                    <button
                      type="button"
                      onClick={() => onNavigate('login')}
                      className="text-primary hover:underline"
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              )}
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <p className="text-xs text-slate-600 text-center">
                If you continue to have issues, please contact{" "}
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-primary hover:underline"
                >
                  support
                </button>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="w-full border-t py-6 mt-auto">
        <div className="container mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 md:flex-row px-6 md:px-8">
          <p className="text-sm text-slate-600">
            &copy; {new Date().getFullYear()} APU Vote Chain. All rights reserved.
          </p>
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
