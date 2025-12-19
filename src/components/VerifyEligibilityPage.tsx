"use client";

import { useState, FormEvent } from "react";
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
import { ArrowLeft, CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import { UserNav } from "./UserNav";
import { isLoggedIn } from "../lib/session";

const apuLogo = "/apu-logo.png";

interface VerifyEligibilityPageProps {
  onNavigate: (page: string) => void;
}

export function VerifyEligibilityPage({
  onNavigate,
}: VerifyEligibilityPageProps) {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    studentId: "",
    matricNumber: "",
    department: "",
    level: "",
  });

  const currentUser = isLoggedIn();

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ Temporary verification (compiles now).
      // Replace this later with a real backend call once your API route exists.
      const ok =
        formData.studentId.trim().length >= 3 &&
        formData.matricNumber.trim().length >= 3 &&
        !!formData.department &&
        !!formData.level;

      if (!ok) {
        setError("Please fill in all fields correctly before verifying.");
      } else {
        setVerified(true);
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("An error occurred during verification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-white">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-6 md:px-8">
          <div className="flex items-center gap-3">
            <img
              src={apuLogo}
              alt="Asia Pacific University Logo"
              className="h-10 w-auto"
            />
            <span>APU VOTE</span>
          </div>

          <nav className="hidden md:flex gap-6">
            <button
              onClick={() => onNavigate("home")}
              className="text-sm transition-colors hover:text-primary"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate("voter")}
              className="text-sm transition-colors hover:text-primary"
            >
              Elections
            </button>
            <button
              onClick={() => onNavigate("results")}
              className="text-sm transition-colors hover:text-primary"
            >
              Results
            </button>
            <button
              onClick={() => onNavigate("about")}
              className="text-sm transition-colors hover:text-primary"
            >
              About
            </button>
            <button
              onClick={() => onNavigate("contact")}
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
              onClick={() => onNavigate("login")}
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
                <CardTitle>Verify Eligibility</CardTitle>
              </div>

              <CardDescription>
                Verify your eligibility to vote in APU VOTE elections.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {verified ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
                  <h3 className="text-slate-900">Verification Successful</h3>
                  <div className="text-slate-600 mt-2 mb-6">
                    You can proceed to wallet registration.
                  </div>
                  <Button onClick={() => onNavigate("voter-registration")}>
                    Register to Vote
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleVerify} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      placeholder="e.g., TP123456"
                      value={formData.studentId}
                      onChange={(e) =>
                        setFormData({ ...formData, studentId: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="matricNumber">Matriculation Number</Label>
                    <Input
                      id="matricNumber"
                      placeholder="e.g., APU1234567"
                      value={formData.matricNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          matricNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) =>
                        setFormData({ ...formData, department: value })
                      }
                      required
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="computer-science">
                          Computer Science
                        </SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="management">Management</SelectItem>
                        <SelectItem value="law">Law</SelectItem>
                        <SelectItem value="arts">Arts & Humanities</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Select
                      value={formData.level}
                      onValueChange={(value) =>
                        setFormData({ ...formData, level: value })
                      }
                      required
                    >
                      <SelectTrigger id="level">
                        <SelectValue placeholder="Select your level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100</SelectItem>
                        <SelectItem value="200">200</SelectItem>
                        <SelectItem value="300">300</SelectItem>
                        <SelectItem value="400">400</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                      <ShieldAlert className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">{error}</div>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify Eligibility"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>

            <CardFooter className="flex justify-center border-t pt-4">
              <div className="text-xs text-slate-600 text-center">
                Note: This screen is currently using a temporary client-side
                check until the backend verification endpoint is added.
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
