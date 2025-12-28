import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { UserNav } from "./UserNav";
import { isLoggedIn } from "../lib/session";
const apuLogo = "/apu-logo.png";
import { useState, useEffect } from "react";

interface ElectionsPageProps {
  onNavigate: (page: string) => void;
}

export function ElectionsPage({ onNavigate }: ElectionsPageProps) {
  const currentUser = isLoggedIn();
  const [activeTab, setActiveTab] = useState<"active" | "upcoming" | "past">(
    "active"
  );

  useEffect(() => {
    // Check if user is logged in
    if (!currentUser) {
      console.log("❌ Not logged in - redirecting to login");
      localStorage.setItem("intendedDestination", "elections");
      onNavigate("login");
      return;
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl flex h-16 items-center px-6 md:px-8">
          <div className="flex items-center gap-2 w-48">
            <img src={apuLogo} alt="APU Logo" className="h-8 w-8" />
            <span className="font-semibold text-slate-900">Elections</span>
          </div>
          <nav className="hidden md:flex gap-6 flex-1 justify-center">
            <button
              onClick={() => onNavigate("home")}
              className="text-sm font-normal text-slate-600 hover:text-slate-900 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate("elections")}
              className="text-sm text-primary"
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
      <main className="flex-1 container mx-auto max-w-7xl px-6 md:px-8 py-8">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Elections</h1>
            <p className="text-slate-600">
              View active, upcoming, and past elections.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 border-b border-slate-200">
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "active"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
              onClick={() => setActiveTab("active")}
            >
              Active
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "upcoming"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "past"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
              onClick={() => setActiveTab("past")}
            >
              Past
            </button>
          </div>

          {/* Content */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeTab === "active" && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>Student Council Election 2024</CardTitle>
                    <Badge className="bg-emerald-500">Active</Badge>
                  </div>
                  <CardDescription>
                    Cast your vote for the next student council representatives.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                    onClick={() => onNavigate("vote")}
                  >
                    Vote Now
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === "upcoming" && (
              <div className="col-span-full text-center py-12 text-slate-500">
                No upcoming elections scheduled.
              </div>
            )}

            {activeTab === "past" && (
              <Card className="opacity-75">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>Club President Election 2023</CardTitle>
                    <Badge variant="secondary">Ended</Badge>
                  </div>
                  <CardDescription>
                    Election for Computer Science Club President.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => onNavigate("results")}
                  >
                    View Results
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
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
