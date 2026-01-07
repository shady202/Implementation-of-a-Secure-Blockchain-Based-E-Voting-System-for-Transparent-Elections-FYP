import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import {
  User,
  Wallet,
  Bell,
  Shield,
  Camera,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  Lock,
  Globe,
  Vote,
  Clock,
  Award,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { UserNav } from "./UserNav";
import { getCurrentUser, updateUserProfile } from "../lib/auth";
import { isLoggedIn } from "../lib/session";
import { toast } from "sonner";

const apuLogo = "/apu-logo.png";

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

interface VotingHistory {
  id: string;
  electionTitle: string;
  date: string;
  status: string;
  transactionHash: string;
}

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [currentMetaMaskWallet, setCurrentMetaMaskWallet] = useState("");
  const [walletsMatch, setWalletsMatch] = useState(true);
  const [votingHistory, setVotingHistory] = useState<VotingHistory[]>([]);

  const [stats, setStats] = useState({
    totalElections: 0,
    participated: 0,
    upcoming: 0,
    walletConnected: false,
  });

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    department: "",
    yearOfStudy: "",
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    publicProfile: false,
  });

  const currentUser = isLoggedIn();

  // Faculty mapping (same as RegisterPage)
  const facultyMap: Record<string, string> = {
    computing: "School of Computing",
    engineering: "School of Engineering",
    business: "School of Business",
    media: "School of Media & Design",
    science: "School of Science",
  };

  // Re-check wallet match when registered wallet is loaded
  useEffect(() => {
    if (walletAddress) {
      checkCurrentMetaMaskWallet();
    }
  }, [walletAddress]);

  useEffect(() => {
    // Check if user is authenticated
    if (!currentUser) {
      onNavigate("login");
      return;
    }

    // Load user data
    loadUserData();
    checkWalletConnection();

    // Voting history will be fetched from database/blockchain
    // For now, leave empty - no mock data
    setVotingHistory([]);
  }, [currentUser, onNavigate]);

  const loadUserData = () => {
    const userData = getCurrentUser();
    if (userData) {
      setUser(userData);

      // Map faculty code to full name
      const facultyCode = userData.department || "";
      const facultyFullName =
        facultyMap[facultyCode.toLowerCase()] || facultyCode;

      setProfileData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        studentId: userData.studentId || "",
        department: facultyFullName,
        yearOfStudy: userData.yearOfStudy || "",
      });
    }
  };

  const checkWalletConnection = async () => {
    // Fetch registered wallet from database (not from MetaMask!)
    const userData = getCurrentUser();
    if (!userData || !userData.studentId) {
      console.log("No user session found");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/voters/registered-wallet/${
          userData.studentId
        }`
      );
      const data = await response.json();

      if (data.success && data.walletAddress) {
        console.log(
          "✅ Fetched registered wallet from database:",
          data.walletAddress
        );
        setWalletAddress(data.walletAddress);
        setStats((prev) => ({ ...prev, walletConnected: true }));
      } else {
        console.log("ℹ️  No wallet registered for this user");
        setWalletAddress("");
        setStats((prev) => ({ ...prev, walletConnected: false }));
      }
    } catch (err) {
      console.error("Error fetching registered wallet:", err);
    }
  };

  const checkCurrentMetaMaskWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          const currentWallet = accounts[0];
          setCurrentMetaMaskWallet(currentWallet);

          // Check if current MetaMask wallet matches registered wallet
          if (walletAddress) {
            const match =
              currentWallet.toLowerCase() === walletAddress.toLowerCase();
            setWalletsMatch(match);
            console.log(
              match
                ? "✅ MetaMask wallet matches registered wallet"
                : "⚠️  MetaMask wallet does NOT match registered wallet"
            );
          }
        }
      } catch (err) {
        console.error("Error checking MetaMask wallet:", err);
      }
    }
  };

  // Wallet connection is handled via Voter Registration page only
  // Settings page only displays the registered wallet (read-only)

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Simulate saving to backend/blockchain
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update local storage
      const updatedUser = { ...user, ...profileData };
      updateUserProfile(updatedUser);
      setUser(updatedUser);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecurity = async () => {
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Security settings updated!");
    } catch (error) {
      toast.error("Failed to update security settings");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    return `${profileData.firstName?.[0] || ""}${
      profileData.lastName?.[0] || ""
    }`.toUpperCase();
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
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

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-5xl px-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <User className="h-8 w-8 text-emerald-600" />
              <h1 className="text-3xl font-bold text-slate-900">
                Account Settings
              </h1>
            </div>
            <p className="text-slate-600">
              Welcome back, {user?.firstName}! Manage your profile, view your
              voting activity, and customize your preferences.
            </p>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 mb-8 h-auto">
              <TabsTrigger value="profile" className="py-3">
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Profile</span>
                <span className="sm:hidden">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="wallet" className="py-3">
                <Wallet className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Wallet & Security</span>
                <span className="sm:hidden">Wallet</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="py-3">
                <Globe className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Preferences</span>
                <span className="sm:hidden">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal details and student information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Photo */}
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="text-2xl bg-emerald-100 text-emerald-700">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <h3 className="text-slate-900">Profile Photo</h3>
                      <p className="text-sm text-slate-600">
                        Upload a profile picture to personalize your account
                      </p>
                      <Button size="sm" variant="outline" disabled>
                        <Camera className="h-4 w-4 mr-2" />
                        Upload Photo (Coming Soon)
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-slate-900">Personal Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          readOnly
                          disabled
                          className="bg-slate-100 cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          readOnly
                          disabled
                          className="bg-slate-100 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="studentId">
                        TP Number / Student ID *
                      </Label>
                      <Input
                        id="studentId"
                        value={profileData.studentId}
                        readOnly
                        disabled
                        className="bg-slate-100 cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          readOnly
                          disabled
                          className="pl-10 bg-slate-100 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Academic Information */}
                  <div className="space-y-4">
                    <h3 className="text-slate-900">Academic Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department">Faculty</Label>
                        <Input
                          id="department"
                          value={profileData.department}
                          readOnly
                          disabled
                          className="bg-slate-100 cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="yearOfStudy">Year of Study</Label>
                        <Input
                          id="yearOfStudy"
                          value={
                            profileData.yearOfStudy === "1"
                              ? "First Year"
                              : profileData.yearOfStudy === "2"
                              ? "Second Year"
                              : profileData.yearOfStudy === "3"
                              ? "Third Year"
                              : profileData.yearOfStudy === "4"
                              ? "Fourth Year"
                              : profileData.yearOfStudy === "5"
                              ? "Postgraduate"
                              : profileData.yearOfStudy
                          }
                          readOnly
                          disabled
                          className="bg-slate-100 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save button removed - data is read-only from database */}
                </CardContent>
              </Card>
            </TabsContent>

            {/* History tab removed - use My Votes page instead */}

            {/* Wallet & Security Tab */}
            <TabsContent value="wallet">
              <div className="space-y-6">
                {/* Wallet Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-emerald-600" />
                      Connected Wallet
                    </CardTitle>
                    <CardDescription>
                      Your blockchain wallet used for voting and identity
                      verification
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-3">
                      {walletAddress ? (
                        <Alert
                          className={
                            walletsMatch
                              ? "bg-emerald-50 border-emerald-200"
                              : "bg-red-50 border-red-200"
                          }
                        >
                          {walletsMatch ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                          <AlertDescription>
                            <p
                              className={`font-semibold ${
                                walletsMatch
                                  ? "text-emerald-900"
                                  : "text-red-900"
                              }`}
                            >
                              {walletsMatch
                                ? "Registered Wallet"
                                : "Wallet Mismatch"}
                            </p>
                            <p
                              className={`font-mono text-xs mt-2 break-all ${
                                walletsMatch
                                  ? "text-emerald-900"
                                  : "text-red-900"
                              }`}
                            >
                              {walletAddress}
                            </p>
                            {walletsMatch ? (
                              <>
                                <p className="text-xs mt-2 text-emerald-700">
                                  This is your registered wallet. It cannot be
                                  changed.
                                </p>
                                <p className="text-xs mt-1 text-emerald-700">
                                  ✅ You can vote in all elections with this
                                  wallet.
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-xs mt-2 text-red-700">
                                  ⚠️ Your current MetaMask wallet does not match
                                  your registered wallet.
                                </p>
                                <p className="text-xs mt-1 text-red-700">
                                  Please switch to your registered wallet to
                                  vote.
                                </p>
                              </>
                            )}
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert className="bg-amber-50 border-amber-200">
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                          <AlertDescription>
                            <p className="font-semibold text-amber-900">
                              No Wallet Registered
                            </p>
                            <p className="text-sm mt-2 text-amber-800">
                              You have not registered a wallet yet. Please go to
                              the Voter Registration page to register your
                              MetaMask wallet.
                            </p>
                            <Button
                              onClick={() => onNavigate("voter-registration")}
                              className="mt-3 bg-amber-600 hover:bg-amber-700"
                              size="sm"
                            >
                              Go to Voter Registration
                            </Button>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <h4 className="text-sm text-blue-900 mb-2">Important:</h4>
                      <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                        <li>
                          You must use a MetaMask wallet to participate in
                          voting
                        </li>
                        <li>
                          Your wallet address is used to verify your identity
                        </li>
                        <li>
                          You must be connected to the Hoodi Network Testnet
                        </li>
                        <li>
                          Ensure you have a minimum of 0.01 ETH in your wallet
                          for transaction fees
                        </li>
                        <li>Each wallet can only vote once per election</li>
                        <li>
                          You cannot vote if you change your wallet address -
                          votes are tied to the registered wallet
                        </li>
                        <li>Never share your wallet private key with anyone</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Settings removed - not implemented */}
              </div>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-emerald-600" />
                      General Preferences
                    </CardTitle>
                    <CardDescription>
                      Customize your APU VOTE experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="english" disabled>
                        <SelectTrigger id="language" disabled>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="malay">Bahasa Melayu</SelectItem>
                          <SelectItem value="chinese">中文</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500">
                        Choose your preferred language for the interface
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="malaysia" disabled>
                        <SelectTrigger id="timezone" disabled>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="malaysia">
                            Malaysia (GMT+8)
                          </SelectItem>
                          <SelectItem value="singapore">
                            Singapore (GMT+8)
                          </SelectItem>
                          <SelectItem value="thailand">
                            Thailand (GMT+7)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500">
                        All dates and times will be shown in this timezone
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <Label>Privacy</Label>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900 mb-2">
                          Your voting choices are always private and encrypted
                          on the blockchain.
                        </p>
                        <p className="text-xs text-blue-800">
                          Only you can see your voting history. Election results
                          show aggregate vote counts without revealing
                          individual votes.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button disabled variant="outline">
                        Save Preferences (Coming Soon)
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Achievements</CardTitle>
                    <CardDescription>
                      Badges earned through active participation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50">
                        <Award className="h-12 w-12 text-emerald-600 mb-2" />
                        <h3 className="font-semibold text-slate-900 text-center">
                          First Vote
                        </h3>
                        <p className="text-sm text-slate-600 text-center mt-1">
                          Cast your first vote
                        </p>
                        <Badge className="mt-2 bg-emerald-500">Earned</Badge>
                      </div>
                      <div className="flex flex-col items-center justify-center p-6 border rounded-lg opacity-50">
                        <TrendingUp className="h-12 w-12 text-slate-400 mb-2" />
                        <h3 className="font-semibold text-slate-900 text-center">
                          Active Voter
                        </h3>
                        <p className="text-sm text-slate-600 text-center mt-1">
                          Vote in 5 elections
                        </p>
                        <Badge variant="outline" className="mt-2">
                          Locked
                        </Badge>
                      </div>
                      <div className="flex flex-col items-center justify-center p-6 border rounded-lg opacity-50">
                        <Shield className="h-12 w-12 text-slate-400 mb-2" />
                        <h3 className="font-semibold text-slate-900 text-center">
                          Verified Voter
                        </h3>
                        <p className="text-sm text-slate-600 text-center mt-1">
                          Complete wallet verification
                        </p>
                        <Badge variant="outline" className="mt-2">
                          Locked
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
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
