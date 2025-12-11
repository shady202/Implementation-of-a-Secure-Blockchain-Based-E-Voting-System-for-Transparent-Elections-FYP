import { useEffect, useState, ReactNode } from "react";
import { getCurrentUser, isAdmin } from "../lib/auth";
import { Loader2, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
const apuLogo = "/apu-logo.png";

interface AuthGuardProps {
  children: ReactNode;
  requireAdmin?: boolean;
  onNavigate: (page: string) => void;
}

export function AuthGuard({ children, requireAdmin = false, onNavigate }: AuthGuardProps) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const user = getCurrentUser();

      if (!user) {
        setShowLoginPrompt(true);
        setLoading(false);
        return;
      }

      if (requireAdmin && !isAdmin()) {
        onNavigate('home');
        return;
      }

      setAuthorized(true);
      setLoading(false);
    };

    checkAuth();
  }, [requireAdmin, onNavigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
          <p className="text-slate-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (showLoginPrompt) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-emerald-100 p-3">
                <Lock className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center mb-4">
              <img src={apuLogo} alt="Asia Pacific University Logo" className="h-10 w-auto" />
              <CardTitle>Authentication Required</CardTitle>
            </div>
            <CardDescription>
              You need to sign in to your account to access the voting system and participate in elections.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <p className="text-sm text-slate-600">
                To ensure election security and prevent unauthorized voting, all users must be authenticated.
              </p>

              {/* Social Login Options */}
              <div className="space-y-3">
                <p className="text-xs text-slate-600">Quick sign in with your university account:</p>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="w-full h-10 text-xs bg-transparent"
                    onClick={() => onNavigate('login')}
                  >
                    <svg className="mr-1 h-3 w-3" viewBox="0 0 24 24">
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
                    Google
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-10 text-xs bg-transparent"
                    onClick={() => onNavigate('login')}
                  >
                    <svg className="mr-1 h-3 w-3" viewBox="0 0 24 24">
                      <path fill="#F25022" d="M1 1h10v10H1z" />
                      <path fill="#00A4EF" d="M13 1h10v10H13z" />
                      <path fill="#7FBA00" d="M1 13h10v10H1z" />
                      <path fill="#FFB900" d="M13 13h10v10H13z" />
                    </svg>
                    Microsoft
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => onNavigate('login')}
                >
                  Sign In to Your Account
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  size="lg"
                  onClick={() => onNavigate('register')}
                >
                  Create New Account
                </Button>
              </div>
              <div className="pt-4 border-t">
                <p className="text-xs text-slate-600">
                  Don't have an account yet?{" "}
                  <button
                    onClick={() => onNavigate('register')}
                    className="text-emerald-600 hover:underline"
                  >
                    Register here
                  </button>{" "}
                  to get started.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
