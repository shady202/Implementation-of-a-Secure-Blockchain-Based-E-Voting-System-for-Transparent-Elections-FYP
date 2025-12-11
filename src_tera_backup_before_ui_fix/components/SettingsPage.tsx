import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
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
  Globe
} from "lucide-react";
import { UserNav } from "./UserNav";
import { getCurrentUser, updateUserProfile } from "../lib/auth";
import { isLoggedIn } from "../lib/session";
import { toast } from "sonner";

const apuLogo = "/apu-logo.png";

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    studentId: "",
    department: "",
    yearOfStudy: "",
    program: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNewElections: true,
    emailDeadlines: true,
    emailResults: true,
    emailUpdates: false,
    smsAlerts: false,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    publicProfile: false,
  });

  const currentUser = isLoggedIn();

  useEffect(() => {
    // Check if user is authenticated
    if (!currentUser) {
      onNavigate('login');
      return;
    }

    // Load user data
    loadUserData();
    checkWalletConnection();
  }, [currentUser, onNavigate]);

  const loadUserData = () => {
    const userData = getCurrentUser();
    if (userData) {
      setUser(userData);
      setProfileData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        studentId: userData.studentId || "",
        department: userData.department || "",
        yearOfStudy: userData.yearOfStudy || "",
        program: userData.program || "",
      });
    }
  };

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } catch (err) {
        console.error("Error checking wallet connection:", err);
      }
    }
  };

  const handleConnectWallet = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        toast.error("MetaMask is not installed");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        toast.success("Wallet connected successfully!");
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Simulate saving to backend/blockchain
      await new Promise(resolve => setTimeout(resolve, 1500));

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

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Notification preferences saved!");
    } catch (error) {
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecurity = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Security settings updated!");
    } catch (error) {
      toast.error("Failed to update security settings");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    return `${profileData.firstName?.[0] || ""}${profileData.lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-6 md:px-8">
          <div className="flex items-center gap-3">
            <img src={apuLogo} alt="APU Logo" className="h-10 w-auto" />
            <span className="text-slate-900">APU VOTE</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <button
              onClick={() => onNavigate('home')}
              className="text-sm transition-colors hover:text-slate-900 text-slate-600"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('vote')}
              className="text-sm transition-colors hover:text-slate-900 text-slate-600"
            >
              Elections
            </button>
            <button
              onClick={() => onNavigate('results')}
              className="text-sm transition-colors hover:text-slate-900 text-slate-600"
            >
              Results
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="text-sm transition-colors hover:text-slate-900 text-slate-600"
            >
              About
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

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-5xl px-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <User className="h-8 w-8 text-emerald-600" />
              <h1 className="text-slate-900">Account Settings</h1>
            </div>
            <p className="text-slate-600">
              Manage your profile information, security settings, and preferences
            </p>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="wallet">
                <Wallet className="h-4 w-4 mr-2" />
                Wallet & Security
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <Globe className="h-4 w-4 mr-2" />
                Preferences
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
                          onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="studentId">TP Number / Student ID *</Label>
                      <Input
                        id="studentId"
                        value={profileData.studentId}
                        onChange={(e) => setProfileData({ ...profileData, studentId: e.target.value })}
                        placeholder="e.g., TP12345"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            placeholder="your.email@student.apu.edu.my"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            id="phone"
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            placeholder="+60 12-345 6789"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Academic Information */}
                  <div className="space-y-4">
                    <h3 className="text-slate-900">Academic Information</h3>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department / Faculty *</Label>
                      <Select
                        value={profileData.department}
                        onValueChange={(value) => setProfileData({ ...profileData, department: value })}
                      >
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="computer-science">School of Computing</SelectItem>
                          <SelectItem value="engineering">School of Engineering</SelectItem>
                          <SelectItem value="business">School of Business</SelectItem>
                          <SelectItem value="accounting">School of Accounting & Finance</SelectItem>
                          <SelectItem value="foundation">Foundation Studies</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="program">Program / Course</Label>
                        <Input
                          id="program"
                          value={profileData.program}
                          onChange={(e) => setProfileData({ ...profileData, program: e.target.value })}
                          placeholder="e.g., BSc (Hons) in Computer Science"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="yearOfStudy">Year of Study</Label>
                        <Select
                          value={profileData.yearOfStudy}
                          onValueChange={(value) => setProfileData({ ...profileData, yearOfStudy: value })}
                        >
                          <SelectTrigger id="yearOfStudy">
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Year 1</SelectItem>
                            <SelectItem value="2">Year 2</SelectItem>
                            <SelectItem value="3">Year 3</SelectItem>
                            <SelectItem value="4">Year 4</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

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
                      Your blockchain wallet used for voting and identity verification
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {walletAddress ? (
                      <Alert className="bg-emerald-50 border-emerald-200">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <AlertDescription className="ml-2">
                          <div className="space-y-1">
                            <p className="text-sm text-emerald-800">
                              Wallet Connected Successfully
                            </p>
                            <p className="text-xs text-emerald-700 font-mono break-all">
                              {walletAddress}
                            </p>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert className="bg-amber-50 border-amber-200">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="ml-2 text-amber-800">
                          No wallet connected. Connect your MetaMask wallet to participate in voting.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-3">
                      {walletAddress ? (
                        <Button variant="outline" disabled>
                          Wallet Connected
                        </Button>
                      ) : (
                        <Button
                          onClick={handleConnectWallet}
                          className="bg-gray-600 hover:bg-gray-700"
                        >
                          <Wallet className="mr-2 h-4 w-4" />
                          Connect MetaMask
                        </Button>
                      )}
                      <Button variant="outline" onClick={() => onNavigate('voter-registration')}>
                        View Wallet Details
                      </Button>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <h4 className="text-sm text-blue-900 mb-2">Important:</h4>
                      <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                        <li>Your wallet address is used to verify your identity</li>
                        <li>You can only vote once per election per wallet</li>
                        <li>Never share your wallet private key with anyone</li>
                        <li>Ensure you have some ETH for transaction fees</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-emerald-600" />
                      Security Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your account security and privacy preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-slate-600">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch
                        checked={securitySettings.twoFactorAuth}
                        onCheckedChange={(checked) =>
                          setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })
                        }
                        disabled
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Public Profile</Label>
                        <p className="text-sm text-slate-600">
                          Allow other students to view your profile
                        </p>
                      </div>
                      <Switch
                        checked={securitySettings.publicProfile}
                        onCheckedChange={(checked) =>
                          setSecuritySettings({ ...securitySettings, publicProfile: checked })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label>Password</Label>
                      <p className="text-sm text-slate-600 mb-3">
                        Change your password to keep your account secure
                      </p>
                      <Button variant="outline" disabled>
                        <Lock className="mr-2 h-4 w-4" />
                        Change Password (Coming Soon)
                      </Button>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={handleSaveSecurity}
                        disabled={saving}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Security Settings
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-emerald-600" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to receive updates about elections and voting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-slate-900">Email Notifications</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>New Elections</Label>
                          <p className="text-sm text-slate-600">
                            Get notified when new elections are announced
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.emailNewElections}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, emailNewElections: checked })
                          }
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Voting Deadlines</Label>
                          <p className="text-sm text-slate-600">
                            Reminders about upcoming voting deadlines
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.emailDeadlines}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, emailDeadlines: checked })
                          }
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Election Results</Label>
                          <p className="text-sm text-slate-600">
                            Get notified when election results are announced
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.emailResults}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, emailResults: checked })
                          }
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>System Updates</Label>
                          <p className="text-sm text-slate-600">
                            News about APU VOTE features and improvements
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.emailUpdates}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, emailUpdates: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-slate-900">SMS Notifications</h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>SMS Alerts</Label>
                        <p className="text-sm text-slate-600">
                          Receive text messages for critical voting reminders
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.smsAlerts}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, smsAlerts: checked })
                        }
                        disabled
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      SMS notifications require phone number verification (Coming soon)
                    </p>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleSaveNotifications}
                      disabled={saving}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Preferences
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
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
                    <Select defaultValue="english">
                      <SelectTrigger id="language">
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
                    <Select defaultValue="malaysia">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="malaysia">Malaysia (GMT+8)</SelectItem>
                        <SelectItem value="singapore">Singapore (GMT+8)</SelectItem>
                        <SelectItem value="thailand">Thailand (GMT+7)</SelectItem>
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
                        Your voting choices are always private and encrypted on the blockchain.
                      </p>
                      <p className="text-xs text-blue-800">
                        Only you can see your voting history. Election results show aggregate vote counts without revealing individual votes.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      disabled
                      variant="outline"
                    >
                      Save Preferences (Coming Soon)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
