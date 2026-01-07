"use client";

import { useEffect, useState, useRef } from "react";
import {
  ArrowLeft,
  Loader2,
  Plus,
  Trash2,
  Users,
  CheckCircle2,
  Clock,
  BarChart3,
  Lock,
  RefreshCw,
  Download,
} from "lucide-react";
import { toast } from "sonner";

import { AuthGuard } from "./AuthGuard";
import { UserNav } from "./UserNav";
import { parseBlockchainError } from "../lib/errorParser";
import { getApiBaseUrlWithoutSuffix } from "../lib/api-config";

import {
  createElection,
  startElection,
  endElection,
  resetSystem,
  getElectionInfo,
  getElectionState,
  getAllCategories,
  createCategory,
  addCandidate,
  deactivateCandidate,
  getCandidatesForCategory,
  pauseSystem,
  unpauseSystem,
} from "../lib/blockchain";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Progress } from "./ui/progress";

const apuLogo = "/apu-logo.png";

// API URL - now automatically detects correct IP!
const API_URL = getApiBaseUrlWithoutSuffix();

// Helper to get current user ID for API calls
const getCurrentUserId = () => localStorage.getItem("user_id");

interface Category {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

interface Candidate {
  id: number;
  name: string;
  party: string;
  categoryId: number;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

interface Voter {
  id: string;
  studentId: string;
  walletAddress: string;
  department: string;
  registrationDate: string;
  hasVoted: boolean;
}

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");

  const [election, setElection] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const [newElection, setNewElection] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    position: "",
    party: "",
    category: "",
    contractId: "",
  });
  // Initialize showResultsDuringVoting from localStorage
  const [showResultsDuringVoting, setShowResultsDuringVoting] = useState(() => {
    const saved = localStorage.getItem("showResultsDuringVoting");
    return saved === "true";
  });
  // Capacity testing settings
  const [capacityTestingEnabled, setCapacityTestingEnabled] = useState(false);
  const [maxConcurrentUsers, setMaxConcurrentUsers] = useState(10);
  // Active users monitoring
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [activeUsersList, setActiveUsersList] = useState<any[]>([]);
  const [capacityStatus, setCapacityStatus] = useState<any>(null);
  const [isAtCapacity, setIsAtCapacity] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [voters, setVoters] = useState<Voter[]>([]);

  // Track if component has mounted to prevent saving default value
  const isFirstRender = useRef(true);

  // Wallet verification state
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [adminWalletAddress, setAdminWalletAddress] = useState<string | null>(
    null
  );
  const [walletVerified, setWalletVerified] = useState(false);

  // Admin data derived from election state and fetched data
  const adminData = {
    registeredVoters: election?.totalVoters || voters.length || 0,
    totalVoters: 100, // Placeholder - you can adjust
    votesCount: election?.totalVotes || 0,
    electionStatus:
      election?.state === 0
        ? "Not Started"
        : election?.state === 1
        ? "Setup Phase" // Created state - can add categories/candidates
        : election?.state === 2
        ? "Active"
        : election?.state === 3
        ? "Ended"
        : "Not Started",
    electionTitle: election?.title || "No Election Created",
    startDate: election?.startTime
      ? new Date(election.startTime * 1000).toISOString()
      : "",
    endDate: election?.endTime
      ? new Date(election.endTime * 1000).toISOString()
      : "",
    candidates: candidates.map((c) => ({
      id: c.id,
      name: c.name,
      position:
        categories.find((cat) => cat.id === c.categoryId)?.name || "Unknown",
      party: c.party,
    })),
    voters: voters,
    activities: activities,
  };

  // Fetch activities from backend
  const fetchActivities = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/activities`);
      const data = await response.json();
      setActivities(data.activities || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setActivities([]);
    }
  };

  // Fetch voters from backend
  const fetchVoters = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/voters`);
      const data = await response.json();
      setVoters(data.voters || []);
    } catch (error) {
      console.error("Error fetching voters:", error);
      setVoters([]);
    }
  };

  // Fetch election description from database
  const fetchElectionDescription = async () => {
    try {
      const response = await fetch(`${API_URL}/api/elections/current`);
      const data = await response.json();
      if (data.election && data.election.description) {
        return data.election.description;
      }
      return "";
    } catch (error) {
      console.error("Error fetching election description:", error);
      return "";
    }
  };

  // Fetch capacity testing settings
  const fetchCapacitySettings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/capacity-settings`);
      const data = await response.json();
      setCapacityTestingEnabled(data.capacityTestingEnabled || false);
      setMaxConcurrentUsers(data.maxConcurrentUsers || 10);
    } catch (error) {
      console.error("Error fetching capacity settings:", error);
    }
  };

  // Fetch active users count and status
  const fetchActiveUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/active-users`);
      const data = await response.json();
      if (data.success) {
        setActiveUsersCount(data.activeCount);
        setActiveUsersList(data.activeUsers || []);
        setIsAtCapacity(data.isAtCapacity);
        setCapacityStatus(data);
      }
    } catch (error) {
      console.error("Error fetching active users:", error);
    }
  };

  // Save capacity testing settings
  const saveCapacitySettings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/capacity-settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          capacityTestingEnabled,
          maxConcurrentUsers,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save capacity settings");
      }

      toast.success(
        `Capacity testing ${capacityTestingEnabled ? "enabled" : "disabled"}`
      );
    } catch (error) {
      console.error("Error saving capacity settings:", error);
      toast.error("Failed to save capacity settings");
    }
  };

  const loadAll = async () => {
    try {
      setLoading(true);
      const e = await getElectionInfo();
      const cats = await getAllCategories();

      const allCandidates: Candidate[] = [];
      if (cats.length > 0) {
        await Promise.all(
          cats.map(async (cat: Category) => {
            const catCands = await getCandidatesForCategory(cat.id);
            (catCands as any[]).forEach((c: any) => {
              allCandidates.push({
                id: Number(c.id),
                name: String(c.name),
                party: String(c.party),
                categoryId: cat.id,
              });
            });
          })
        );
      }

      setCategories(cats as Category[]);
      setCandidates(allCandidates);

      // Fetch activities and voters from backend
      await fetchActivities();
      await fetchVoters();

      // Fetch election description from database FIRST
      const description = await fetchElectionDescription();

      // Set newElection with all data including description
      if (e && e.title) {
        const startDate = e.startTime
          ? new Date(e.startTime * 1000).toISOString().slice(0, 16)
          : "";
        const endDate = e.endTime
          ? new Date(e.endTime * 1000).toISOString().slice(0, 16)
          : "";

        setNewElection({
          title: e.title || "",
          description: description || "",
          startDate: startDate,
          endDate: endDate,
        });
      }

      // Set election LAST to avoid triggering useEffect before description is set
      setElection(e);
    } catch (err: any) {
      console.error("Create category error:", err);
      const errorDetail =
        err?.response?.data || err?.message || JSON.stringify(err);
      toast.error(`RAW ERROR: ${JSON.stringify(errorDetail, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  // Wallet verification function
  const verifyAdminWallet = async () => {
    try {
      // Get admin data from session/localStorage
      const adminData = JSON.parse(localStorage.getItem("currentUser") || "{}");
      const expectedWalletAddress =
        adminData.wallet_address || adminData.walletAddress;

      if (!expectedWalletAddress) {
        toast.error("No wallet address found for admin account");
        return false;
      }

      setAdminWalletAddress(expectedWalletAddress);

      // SAFE MetaMask detection - check for MetaMask specifically
      const ethereum = (window as any).ethereum;
      if (typeof window === "undefined" || !ethereum) {
        toast.error("Please install MetaMask", {
          style: { background: "#fee2e2", color: "#dc2626" },
        });
        setWalletVerified(false);
        return false;
      }

      // Prefer MetaMask if multiple wallets are installed
      let provider = ethereum;
      if (ethereum.providers?.length) {
        provider =
          ethereum.providers.find((p: any) => p.isMetaMask) || ethereum;
      }

      if (!provider) {
        toast.error("MetaMask not found", {
          style: { background: "#fee2e2", color: "#dc2626" },
        });
        setWalletVerified(false);
        return false;
      }

      // Use eth_requestAccounts which prompts unlock if needed
      const accounts = await provider.request({
        method: "eth_requestAccounts", // This will prompt unlock if locked!
      });

      if (!accounts || accounts.length === 0) {
        toast.error("Please connect your wallet first", {
          style: { background: "#fee2e2", color: "#dc2626" },
        });
        setWalletConnected(false);
        setWalletVerified(false);
        return false;
      }

      const connectedAddress = accounts[0];

      // CRITICAL: Require signature to verify MetaMask is ACTUALLY unlocked
      // personal_sign REQUIRES private key access - fails if locked!
      try {
        const message = `Verify admin wallet: ${Date.now()}`;
        await provider.request({
          method: "personal_sign",
          params: [message, connectedAddress],
        });
      } catch (signError: any) {
        // Signature failed - MetaMask locked or user rejected
        if (signError.code === 4001) {
          toast.error("Signature request rejected", {
            style: { background: "#fee2e2", color: "#dc2626" },
          });
        } else {
          toast.error("Please unlock MetaMask first", {
            style: { background: "#fee2e2", color: "#dc2626" },
          });
        }
        setWalletConnected(false);
        setWalletVerified(false);
        return false;
      }

      // Signature successful - MetaMask is unlocked!
      setWalletAddress(connectedAddress);
      setWalletConnected(true);

      // Compare addresses (case-insensitive)
      if (
        connectedAddress.toLowerCase() !== expectedWalletAddress.toLowerCase()
      ) {
        toast.error(
          "Please change your wallet address to the admin wallet address",
          {
            style: { background: "#fee2e2", color: "#dc2626" },
            duration: 5000,
          }
        );
        setWalletVerified(false);
        return false;
      }

      // Success!
      setWalletVerified(true);
      toast.success("Admin wallet verified!");
      return true;
    } catch (error: any) {
      console.error("Wallet verification error:", error);
      // User rejected the connection request
      if (error.code === 4001) {
        toast.error("Wallet connection rejected");
      } else {
        toast.error("Failed to verify wallet");
      }
      setWalletVerified(false);
      return false;
    }
  };

  useEffect(() => {
    loadAll();
    fetchCapacitySettings(); // Fetch capacity settings on mount
    fetchActiveUsers(); // Fetch active users on mount

    // Initial wallet verification
    verifyAdminWallet();

    // Auto-refresh active users every 5 seconds
    const interval = setInterval(() => {
      fetchActiveUsers();
    }, 5000);

    // Set up auto-refresh polling every 10 seconds for more responsive updates
    const refreshInterval = setInterval(() => {
      fetchActivities();
      fetchVoters();
    }, 10000); // 10 seconds (reduced from 30)

    // Listen for account changes - SAFE MetaMask detection
    const ethereum = (window as any).ethereum;
    if (ethereum && ethereum.isMetaMask) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setWalletConnected(false);
          setWalletVerified(false);
          toast.error("Please connect your wallet first", {
            style: { background: "#fee2e2", color: "#dc2626" },
          });
        } else {
          // Re-verify when account changes
          verifyAdminWallet();
        }
      };

      try {
        ethereum.on("accountsChanged", handleAccountsChanged);
      } catch (error) {
        console.warn("Could not attach MetaMask listener:", error);
      }

      return () => {
        clearInterval(interval);
        clearInterval(refreshInterval); // Clear the refresh interval as well
        try {
          if (ethereum.removeListener) {
            ethereum.removeListener("accountsChanged", handleAccountsChanged);
          }
        } catch (error) {
          console.warn("Could not remove MetaMask listener:", error);
        }
      };
    }

    // If MetaMask is not detected, still clean up the intervals
    return () => {
      clearInterval(interval);
      clearInterval(refreshInterval);
    };
  }, []);

  // Populate form fields when election data is loaded
  useEffect(() => {
    if (election && election.title) {
      // Convert timestamps to local date strings for input fields
      // Use local timezone instead of UTC to prevent AM/PM conversion issues
      const formatLocalDateTime = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      const startDate = election.startTime
        ? formatLocalDateTime(election.startTime)
        : "";
      const endDate = election.endTime
        ? formatLocalDateTime(election.endTime)
        : "";

      // Use functional setState to preserve description if it exists
      setNewElection((prev) => ({
        title: election.title || "",
        description: prev.description, // Keep existing description from loadAll
        startDate: startDate,
        endDate: endDate,
      }));
    }
  }, [election]);

  // Save showResultsDuringVoting to localStorage whenever it changes (skip first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem(
      "showResultsDuringVoting",
      String(showResultsDuringVoting)
    );
  }, [showResultsDuringVoting]);

  // Automatically end election when end time is reached
  useEffect(() => {
    const checkAndEndElection = async () => {
      console.log("🔍 Auto-end check running...");
      console.log("Election:", election);
      console.log("Wallet verified:", walletVerified);
      console.log("Submitting:", submitting);

      // Only proceed if:
      // 1. Election exists
      // 2. Election is in Active state (state 2)
      // 3. Wallet is verified (admin is connected)
      // 4. Not currently submitting
      if (!election || election.state !== 2 || !walletVerified || submitting) {
        console.log("❌ Auto-end skipped - Reasons:");
        console.log("  - No election?", !election);
        console.log(
          "  - State not 2?",
          election?.state !== 2,
          "(current state:",
          election?.state,
          ")"
        );
        console.log("  - Wallet not verified?", !walletVerified);
        console.log("  - Currently submitting?", submitting);
        return;
      }

      // Check if current time has passed the end time
      const now = new Date();
      const endTime = new Date(election.endTime * 1000);
      console.log("✅ Conditions met! Checking time...");
      console.log("Current time:", now);
      console.log("End time:", endTime);
      console.log("Time expired?", now > endTime);

      if (now > endTime) {
        console.log(
          "⏰ Election time expired, automatically ending election..."
        );
        toast.info(
          "Election time has expired. Automatically ending election...",
          {
            duration: 3000,
          }
        );

        try {
          await handleEndElection();
          toast.success("✅ Election automatically ended due to time expiry!");
        } catch (error: any) {
          console.error("Failed to auto-end election:", error);
          toast.error("Failed to auto-end election. Please try manually.");
        }
      }
    };

    // Run check immediately on mount
    checkAndEndElection();

    // Then run every 10 seconds for continuous monitoring
    const intervalId = setInterval(checkAndEndElection, 10000);

    // Cleanup on unmount
    return () => {
      console.log("🛑 Clearing auto-end polling timer");
      clearInterval(intervalId);
    };
  }, [election, walletVerified, submitting]);

  const handleCreateElection = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!walletVerified) {
      toast.error("Please connect and verify your admin wallet first", {
        style: { background: "#fee2e2", color: "#dc2626" },
      });
      return;
    }

    try {
      setSubmitting(true);

      // Step 1: Save to DATABASE first
      const response = await fetch(`${API_URL}/api/elections/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: newElection.title,
          description: newElection.description,
          startDate: newElection.startDate,
          endDate: newElection.endDate,
          showResultsDuringVoting: showResultsDuringVoting,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save election to database");
      }

      // Step 2: Save to BLOCKCHAIN
      const start = Math.floor(
        new Date(newElection.startDate).getTime() / 1000
      );
      const end = Math.floor(new Date(newElection.endDate).getTime() / 1000);
      await createElection(newElection.title, start, end);

      toast.success("Election settings saved successfully!", {
        duration: 4000,
      });

      // Show guidance message if no categories/candidates exist yet
      if (categories.length === 0 || candidates.length === 0) {
        setTimeout(() => {
          toast.info(
            "📋 Next steps: Add Categories and Candidates before starting the election",
            {
              duration: 6000,
              description:
                "Go to the Categories tab to add voting positions, then add candidates for each category.",
            }
          );
        }, 500);
      }

      await loadAll();
    } catch (err: any) {
      toast.error(parseBlockchainError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartElection = async () => {
    if (!walletVerified) {
      toast.error("Please connect and verify your admin wallet first", {
        style: { background: "#fee2e2", color: "#dc2626" },
      });
      return;
    }

    try {
      setSubmitting(true);

      // Step 1: Start election on blockchain
      console.log("🔗 Starting election on blockchain...");
      await startElection();
      console.log("✅ Blockchain updated successfully");

      // Step 2: Sync to database with retry logic
      console.log("💾 Syncing to database...");
      let dbSyncSuccess = false;
      let retries = 3;

      while (retries > 0 && !dbSyncSuccess) {
        try {
          const dbResponse = await fetch(`${API_URL}/api/elections/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });

          if (!dbResponse.ok) {
            const errorText = await dbResponse.text();
            throw new Error(`Database sync failed: ${errorText}`);
          }

          const result = await dbResponse.json();
          console.log("✅ Database synced:", result);
          dbSyncSuccess = true;
        } catch (dbErr: any) {
          retries--;
          console.warn(
            `⚠️ Database sync attempt failed (${3 - retries}/3):`,
            dbErr.message
          );

          if (retries > 0) {
            console.log(`🔄 Retrying in 1 second...`);
            await new Promise((r) => setTimeout(r, 1000));
          } else {
            console.error("❌ All database sync retries failed");
            toast.error(
              "⚠️ Election started on blockchain but database sync failed. Some devices may show incorrect state.",
              { duration: 8000 }
            );
          }
        }
      }

      // Step 3: Verify sync by checking both sources
      if (dbSyncSuccess) {
        try {
          console.log("🔍 Verifying sync...");
          const [blockchainState, dbElectionResponse] = await Promise.all([
            getElectionState(),
            fetch(`${API_URL}/api/elections/latest`).then((r) => r.json()),
          ]);

          const blockchainActive = blockchainState.isActive;
          const dbActive = dbElectionResponse.election?.isActive || false;

          if (blockchainActive !== dbActive) {
            console.error("❌ Sync verification failed:", {
              blockchain: blockchainActive,
              database: dbActive,
            });
            toast.warning(
              "⚠️ Blockchain and database may be out of sync. Please refresh and verify.",
              { duration: 6000 }
            );
          } else {
            console.log("✅ Sync verified - both sources match");
          }
        } catch (verifyErr) {
          console.warn("⚠️ Could not verify sync:", verifyErr);
        }
      }

      // Step 4: Log activity to database
      try {
        await fetch(`${API_URL}/api/admin/log-activity`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "election_started",
            description: "Election started",
          }),
        });
      } catch (logErr) {
        console.warn("⚠️ Failed to log activity:", logErr);
      }

      toast.success("Election started successfully!");
      await loadAll();
    } catch (err: any) {
      console.error("Failed to start election:", err);
      toast.error(parseBlockchainError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEndElection = async () => {
    if (!walletVerified) {
      toast.error("Please connect and verify your admin wallet first", {
        style: { background: "#fee2e2", color: "#dc2626" },
      });
      return;
    }

    try {
      setSubmitting(true);

      // Step 1: End election on blockchain
      console.log("🔗 Ending election on blockchain...");
      await endElection();
      console.log("✅ Blockchain updated successfully");

      // Step 2: Sync to database with retry logic
      console.log("💾 Syncing to database...");
      let dbSyncSuccess = false;
      let retries = 3;

      while (retries > 0 && !dbSyncSuccess) {
        try {
          const dbResponse = await fetch(`${API_URL}/api/elections/end`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });

          if (!dbResponse.ok) {
            const errorText = await dbResponse.text();
            throw new Error(`Database sync failed: ${errorText}`);
          }

          const result = await dbResponse.json();
          console.log("✅ Database synced:", result);
          dbSyncSuccess = true;
        } catch (dbErr: any) {
          retries--;
          console.warn(
            `⚠️ Database sync attempt failed (${3 - retries}/3):`,
            dbErr.message
          );

          if (retries > 0) {
            console.log(`🔄 Retrying in 1 second...`);
            await new Promise((r) => setTimeout(r, 1000));
          } else {
            console.error("❌ All database sync retries failed");
            toast.error(
              "⚠️ Election ended on blockchain but database sync failed. Some devices may show incorrect state.",
              { duration: 8000 }
            );
          }
        }
      }

      // Step 3: Verify sync by checking both sources
      if (dbSyncSuccess) {
        try {
          console.log("🔍 Verifying sync...");
          const [blockchainState, dbElectionResponse] = await Promise.all([
            getElectionState(),
            fetch(`${API_URL}/api/elections/latest`).then((r) => r.json()),
          ]);

          const blockchainEnded = blockchainState.hasEnded;
          const dbActive = dbElectionResponse.election?.isActive || false;

          // When ended, blockchain should show hasEnded=true and db should show isActive=false
          if (blockchainEnded && dbActive) {
            console.error("❌ Sync verification failed:", {
              blockchain: "ended",
              database: "still active",
            });
            toast.warning(
              "⚠️ Blockchain and database may be out of sync. Please refresh and verify.",
              { duration: 6000 }
            );
          } else {
            console.log("✅ Sync verified - both sources match");
          }
        } catch (verifyErr) {
          console.warn("⚠️ Could not verify sync:", verifyErr);
        }
      }

      // Step 4: Log activity to database
      try {
        await fetch(`${API_URL}/api/admin/log-activity`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "election_ended",
            description: "Election ended",
          }),
        });
      } catch (logErr) {
        console.warn("⚠️ Failed to log activity:", logErr);
      }

      toast.success("✅ Election ended successfully!");
      await loadAll();
    } catch (err: any) {
      console.error("❌ Failed to end election:", err);
      toast.error(parseBlockchainError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handlePause = async () => {
    if (!walletVerified) {
      toast.error("Please connect and verify your admin wallet first", {
        style: { background: "#fee2e2", color: "#dc2626" },
      });
      return;
    }

    try {
      setSubmitting(true);
      await pauseSystem();
      await loadAll();
    } catch (err: any) {
      toast.error(parseBlockchainError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnpause = async () => {
    if (!walletVerified) {
      toast.error("Please connect and verify your admin wallet first", {
        style: { background: "#fee2e2", color: "#dc2626" },
      });
      return;
    }

    try {
      setSubmitting(true);
      await unpauseSystem();
      await loadAll();
    } catch (err: any) {
      toast.error(parseBlockchainError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetSystem = async () => {
    if (!walletVerified) {
      toast.error("Please connect and verify your admin wallet first", {
        style: { background: "#fee2e2", color: "#dc2626" },
      });
      return;
    }

    const confirmed = window.confirm(
      "⚠️ WARNING: This will completely reset the system!\n\n" +
        "This action will DELETE:\n" +
        "• All elections\n" +
        "• All categories\n" +
        "• All candidates\n" +
        "• All voters\n" +
        "• All votes\n\n" +
        "This cannot be undone. Are you absolutely sure?"
    );

    if (!confirmed) {
      toast.info("Reset cancelled");
      return;
    }

    try {
      setSubmitting(true);

      // Auto-handle state transitions for reset
      // States: 0=None, 1=Created (Setup Phase), 2=Active, 3=Ended
      const currentState = election?.state || 0;

      console.log(`Current election state: ${currentState}`);

      // CRITICAL: Always try to end the election before reset
      // The blockchain state might not match the UI state, so we force-end it
      if (currentState !== 0) {
        if (currentState === 1) {
          // If in Setup Phase (Created), start first
          try {
            toast.info("Starting election before ending...");
            await startElection();
            console.log("✅ Election started!");
          } catch (err: any) {
            console.warn("Election might already be started:", err);
          }
        }

        // ALWAYS try to end the election, even if UI shows state 3
        // This ensures blockchain state is properly synchronized
        try {
          toast.info("Ending election on blockchain...");
          await endElection();
          console.log("✅ Election ended on blockchain!");
          toast.success("Election ended successfully!");
        } catch (err: any) {
          const errMsg = err?.message || "";
          // Only ignore if it's already ended, otherwise throw
          if (
            errMsg.includes("already ended") ||
            errMsg.includes("Election ended") ||
            errMsg.includes("Not active")
          ) {
            console.log(
              "Election was already ended on blockchain, continuing with reset..."
            );
            toast.info("Election already ended. Proceeding with reset...");
          } else {
            // If it's a different error, throw it
            console.error("Failed to end election:", err);
            throw err;
          }
        }
      } else {
        toast.info("No active election. Proceeding with system reset...");
      }

      console.log("✅ Election ended. Starting reset process...");

      // Step 1: Reset blockchain (only if election exists)
      if (currentState !== 0) {
        console.log("Step 1: Resetting blockchain...");
        toast.info("Resetting blockchain...");
        try {
          await resetSystem();
          console.log("✅ Blockchain reset successful!");
          toast.success("✅ Blockchain reset complete!");
        } catch (resetErr: any) {
          console.error("❌ Blockchain reset failed:", resetErr);
          throw resetErr; // Re-throw to be caught by outer catch
        }
      } else {
        console.log("Step 1: No election on blockchain to reset, skipping...");
        toast.info("No blockchain election to reset");
      }

      // Step 2: Reset database
      console.log("Step 2: Resetting database...");
      toast.info("Resetting database...");
      try {
        const { resetDatabase } = await import("../lib/api");
        await resetDatabase();
        console.log("✅ Database reset successful!");
        toast.success("Database reset complete!");
      } catch (dbErr: any) {
        console.error("❌ Database reset failed:", dbErr);
        toast.error("Database reset failed, but blockchain was reset.");
      }

      console.log("✅ RESET COMPLETE - Showing success message");
      toast.success(
        "🎉 System reset successfully! You can now create a new election.",
        { duration: 5000 }
      );

      console.log("Reloading data...");
      await loadAll();

      // Clear the form fields for a fresh start
      setNewElection({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
      });
      setShowResultsDuringVoting(false);
      localStorage.removeItem("showResultsDuringVoting");

      console.log("✅ All done!");
    } catch (err: any) {
      console.error("❌ Reset process failed:", err);
      toast.error(parseBlockchainError(err), { duration: 8000 });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!walletVerified) {
      toast.error("Please connect and verify your admin wallet first", {
        style: { background: "#fee2e2", color: "#dc2626" },
      });
      return;
    }

    try {
      setSubmitting(true);

      // Check if election is in Setup Phase (state = 1 = Created)
      if (!election || election.state !== 1) {
        toast.error("❌ Categories can only be added during Setup Phase!");
        return;
      }

      // Step 1: Create on blockchain (user signs with MetaMask)
      const result = await createCategory(
        newCategory.name,
        newCategory.description
      );

      // Step 2: Sync to PostgreSQL database
      const userId = getCurrentUserId();
      const response = await fetch(`${API_URL}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(userId ? { "x-user-id": userId } : {}),
        },
        body: JSON.stringify({
          txHash: result.txHash,
          categoryId: result.categoryId,
          name: newCategory.name,
          description: newCategory.description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Backend error:", errorData);
        throw new Error(`Database sync failed: ${errorData}`);
      }

      setNewCategory({ name: "", description: "" });
      toast.success("Category saved to database and blockchain!");
      await loadAll();
    } catch (err: any) {
      console.error("Full error:", err);
      const rawError = err?.message || JSON.stringify(err);
      toast.error(`❌ ERROR: ${rawError}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!walletVerified) {
      toast.error("Please connect and verify your admin wallet first", {
        style: { background: "#fee2e2", color: "#dc2626" },
      });
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this category? This will deactivate it on the blockchain."
    );

    if (!confirmed) return;

    try {
      setSubmitting(true);
      toast.info("Deactivating category on blockchain...");

      // Deactivate on blockchain using ethers directly
      if (typeof window === "undefined" || !(window as any).ethereum) {
        throw new Error("MetaMask is not installed");
      }

      const { ethers } = await import("ethers");
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      const VotingSystemABI = (await import("../lib/VotingSystemABI")).default;
      const CONTRACT_ADDRESS = (await import("../lib/blockchain"))
        .CONTRACT_ADDRESS;

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        VotingSystemABI,
        signer
      );
      const tx = await contract.deactivateCategory(categoryId);
      await tx.wait();

      toast.success("Category deactivated on blockchain!");

      // Also delete from database to prevent duplicate key errors
      toast.info("Removing from database...");
      const userId = getCurrentUserId();
      const dbResponse = await fetch(
        `${API_URL}/api/categories/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(userId ? { "x-user-id": userId } : {}),
          },
        }
      );

      if (!dbResponse.ok) {
        console.warn("Database deletion failed, but blockchain succeeded");
        toast.warning(
          "Category removed from blockchain but database cleanup failed"
        );
      } else {
        toast.success("Category deleted completely!");
      }

      await loadAll();
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(parseBlockchainError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!walletVerified) {
      toast.error("Please connect and verify your admin wallet first", {
        style: { background: "#fee2e2", color: "#dc2626" },
      });
      return;
    }

    try {
      setSubmitting(true);
      if (!newCandidate.category) {
        toast.error("Please select a category");
        return;
      }
      // Find category ID from name
      const category = categories.find((c) => c.name === newCandidate.category);
      if (!category) {
        toast.error("Invalid category selected");
        return;
      }

      // Step 1: Add to blockchain (user signs with MetaMask)
      const result = await addCandidate(
        category.id,
        newCandidate.name,
        newCandidate.party
      );

      // Step 2: Sync to PostgreSQL database
      const userId = getCurrentUserId();
      const response = await fetch(`${API_URL}/api/candidates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(userId ? { "x-user-id": userId } : {}),
        },
        body: JSON.stringify({
          txHash: result.txHash,
          candidateId: result.candidateId,
          name: newCandidate.name,
          party: newCandidate.party,
          categoryName: newCandidate.category,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to sync candidate to database");
      }

      setNewCandidate({
        name: "",
        position: "",
        party: "",
        category: "",
        contractId: "",
      });
      toast.success("Candidate saved to blockchain and database!");
      await loadAll();
    } catch (err: any) {
      toast.error(parseBlockchainError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveCandidate = async (candidateId: number) => {
    if (!walletVerified) {
      toast.error("Please connect and verify your admin wallet first", {
        style: { background: "#fee2e2", color: "#dc2626" },
      });
      return;
    }

    try {
      setSubmitting(true);
      // Find the candidate to get its categoryId
      const candidate = candidates.find((c) => c.id === candidateId);
      if (!candidate) {
        toast.error("Candidate not found");
        return;
      }
      await deactivateCandidate(candidate.categoryId, candidateId);
      toast.success("Candidate removed");
      await loadAll();
    } catch (err: any) {
      toast.error(err?.message || "Failed to remove candidate");
    } finally {
      setSubmitting(false);
    }
  };

  const exportVotersToExcel = (voters: any[]) => {
    toast.info("Export feature - voter data is stored on blockchain");
  };

  const fetchAdminData = async () => {
    await loadAll();
  };

  const handleSyncCandidates = async () => {
    toast.info("Candidates are automatically synced to blockchain");
  };

  // Format dates
  const formatDate = (timestamp: number) => {
    if (!timestamp) return "TBD";
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
        <div className="flex flex-col items-center space-y-6">
          <div className="bg-emerald-500 rounded-full p-6 shadow-xl">
            <Loader2 className="h-16 w-16 animate-spin text-white" />
          </div>
          <p className="text-xl font-medium text-slate-700">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requireAdmin={true} onNavigate={onNavigate}>
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-white">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto max-w-7xl flex h-16 items-center px-6 md:px-8">
            <div className="flex items-center gap-2 w-48">
              <img src={apuLogo} alt="APU Logo" className="h-8 w-8" />
              <span className="font-semibold text-slate-900">APU VOTE</span>
              <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 text-xs">
                Admin
              </Badge>
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
              <UserNav onNavigate={onNavigate} />
            </div>
          </div>
        </header>

        <div className="container mx-auto py-12 px-6">
          <div className="flex flex-col max-w-6xl mx-auto">
            <div className="w-full mb-8">
              <div className="mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => onNavigate("home")}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <img
                  src={apuLogo}
                  alt="Asia Pacific University Logo"
                  className="h-10 w-auto"
                />
                <h1 className="text-slate-900">Admin Dashboard</h1>
              </div>
              <p className="text-slate-600">
                Manage elections, candidates, and monitor voting activity
              </p>
            </div>

            {/* Wallet Verification Alert */}
            {!walletVerified && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-blue-700 font-medium">
                      {!walletConnected
                        ? "Please connect your authorized admin wallet to access full functionality."
                        : "Wallet connected but address doesn't match. Please switch to your admin wallet."}
                    </p>
                    {adminWalletAddress && walletAddress && walletConnected && (
                      <p className="text-xs text-blue-600 mt-1">
                        Expected: {adminWalletAddress.slice(0, 6)}...
                        {adminWalletAddress.slice(-4)} | Connected:{" "}
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                      </p>
                    )}
                  </div>
                  <div className="ml-auto">
                    <Button
                      size="sm"
                      onClick={verifyAdminWallet}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Verify Wallet
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">
                    Registered Voters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="text-slate-900">
                      {adminData.registeredVoters}
                    </div>
                    <div className="text-slate-600">
                      of {adminData.totalVoters} eligible
                    </div>
                  </div>
                  <Progress
                    value={
                      (adminData.registeredVoters / adminData.totalVoters) * 100
                    }
                    className="mt-2 bg-slate-200"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">
                    Votes Cast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    // Calculate expected total votes
                    // Each registered voter can vote once per category
                    const numberOfCategories = categories.length || 1;
                    const expectedTotalVotes =
                      adminData.registeredVoters * numberOfCategories;
                    const completionPercentage =
                      expectedTotalVotes > 0
                        ? (adminData.votesCount / expectedTotalVotes) * 100
                        : 0;

                    return (
                      <>
                        <div className="flex items-baseline justify-between">
                          <div className="text-slate-900">
                            {adminData.votesCount}
                          </div>
                          <div className="text-slate-600">
                            of {expectedTotalVotes} possible votes
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {adminData.registeredVoters} voters ×{" "}
                          {numberOfCategories}{" "}
                          {numberOfCategories === 1 ? "category" : "categories"}
                        </div>
                        <Progress
                          value={Math.min(completionPercentage, 100)}
                          className="mt-2 bg-slate-200"
                        />
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">
                    Election Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-slate-900 flex items-center gap-2">
                      {adminData.electionStatus}
                      {election?.isPaused && (
                        <Badge variant="destructive" className="animate-pulse">
                          PAUSED
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center">
                      {adminData.electionStatus === "Active" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : adminData.electionStatus === "Ended" ? (
                        <Lock className="h-5 w-5 text-gray-500" />
                      ) : adminData.electionStatus === "Setup Phase" ? (
                        <Clock className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-amber-500" />
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={handleStartElection}
                      disabled={!walletVerified || submitting}
                      className="bg-emerald-600 hover:bg-emerald-700 text-xs px-3"
                    >
                      Start Election
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleEndElection}
                      disabled={
                        !walletVerified ||
                        (adminData.electionStatus !== "Active" &&
                          adminData.electionStatus !== "Setup Phase") ||
                        submitting
                      }
                      className="text-xs px-3"
                    >
                      End Election
                    </Button>
                    <Button
                      size="sm"
                      variant={election?.isPaused ? "default" : "destructive"}
                      onClick={election?.isPaused ? handleUnpause : handlePause}
                      disabled={
                        !walletVerified ||
                        submitting ||
                        adminData.electionStatus === "Not Started"
                      }
                      className="text-xs px-3"
                    >
                      {election?.isPaused ? "Unpause" : "Emergency Stop"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-5 mb-8 h-14 w-full p-2">
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="candidates">Candidates</TabsTrigger>
                <TabsTrigger value="voters">Voters</TabsTrigger>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Election Overview</CardTitle>
                    <CardDescription>
                      Current election status and statistics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-slate-900">
                            {adminData.electionTitle}
                          </p>
                          <p className="text-slate-600">
                            {adminData.startDate && adminData.endDate
                              ? `${formatDateTime(
                                  adminData.startDate
                                )} - ${formatDateTime(adminData.endDate)}`
                              : "No dates set"}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onNavigate("results")}
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Results
                        </Button>
                      </div>

                      <div>
                        <h3 className="text-slate-900 mb-4">
                          Recent Activity (Last Hour)
                        </h3>
                        <div className="space-y-4">
                          {adminData.activities.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                              <Clock className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                              <p>No recent activity in the last hour</p>
                            </div>
                          ) : (
                            adminData.activities.map((activity) => (
                              <div
                                key={activity.id}
                                className="flex items-start gap-4"
                              >
                                <div className="rounded-full bg-emerald-100 p-2">
                                  {activity.type === "voter_registered" ? (
                                    <Users className="h-4 w-4 text-emerald-600" />
                                  ) : activity.type === "vote_cast" ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                  ) : activity.type === "candidate_added" ? (
                                    <Plus className="h-4 w-4 text-emerald-600" />
                                  ) : (
                                    <Clock className="h-4 w-4 text-emerald-600" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-slate-900">
                                    {activity.description}
                                  </p>
                                  <p className="text-slate-600">
                                    {new Date(
                                      activity.timestamp
                                    ).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="candidates" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Candidates</CardTitle>
                    <CardDescription>
                      Add or remove candidates for the election
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={handleAddCandidate}
                      className="space-y-4 mb-8"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Candidate Name</Label>
                          <Input
                            id="name"
                            value={newCandidate.name}
                            onChange={(e) =>
                              setNewCandidate({
                                ...newCandidate,
                                name: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={newCandidate.category}
                            onValueChange={(value: string) =>
                              setNewCandidate({
                                ...newCandidate,
                                category: value,
                                position: value, // Auto-set position to match category
                              })
                            }
                            required
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.name}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="party">Party/Affiliation</Label>
                          <Input
                            id="party"
                            value={newCandidate.party}
                            onChange={(e) =>
                              setNewCandidate({
                                ...newCandidate,
                                party: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={!walletVerified || submitting}
                        className="bg-slate-900 hover:bg-slate-800 text-white"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Candidate
                          </>
                        )}
                      </Button>
                    </form>

                    <div>
                      <h3 className="text-slate-900 mb-4">
                        Current Candidates
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Party</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {adminData.candidates.map((candidate) => (
                            <TableRow
                              key={`${candidate.position}-${candidate.id}`}
                            >
                              <TableCell className="text-slate-900">
                                {candidate.name}
                              </TableCell>
                              <TableCell className="text-slate-600">
                                {candidate.position}
                              </TableCell>
                              <TableCell className="text-slate-600">
                                {candidate.party}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveCandidate(candidate.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="voters" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Registered Voters</CardTitle>
                    <CardDescription>
                      View and manage registered voters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Search voters..."
                          className="w-64"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={fetchAdminData}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportVotersToExcel(adminData.voters)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export List
                      </Button>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student ID</TableHead>
                          <TableHead>Wallet Address</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Registration Date</TableHead>
                          <TableHead>Voted</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {adminData.voters.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-8 text-slate-500"
                            >
                              No registered voters yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          adminData.voters.map((voter) => (
                            <TableRow key={voter.id}>
                              <TableCell className="text-slate-900 font-mono">
                                {/* Mask Student ID: TP123456 → TP***456 */}
                                TP***{voter.studentId.slice(-3)}
                              </TableCell>
                              <TableCell className="font-mono text-slate-600">
                                {/* Mask Wallet Address: 0x1234567890abcdef → 0x123456...cdef */}
                                {voter.walletAddress ? (
                                  <>
                                    {voter.walletAddress.substring(0, 8)}...
                                    {voter.walletAddress.slice(-4)}
                                  </>
                                ) : (
                                  <span className="text-gray-400 italic">
                                    Not registered
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-slate-600">
                                {voter.department}
                              </TableCell>
                              <TableCell className="text-slate-600">
                                {new Date(
                                  voter.registrationDate
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {voter.hasVoted ? (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                ) : (
                                  <div className="h-4 w-4 rounded-full border border-slate-400" />
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="categories" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Voting Categories</CardTitle>
                    <CardDescription>
                      Manage voting categories and positions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateCategory();
                      }}
                      className="space-y-4 mb-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="categoryName">Category Name</Label>
                          <Input
                            id="categoryName"
                            placeholder="e.g., President, Secretary"
                            value={newCategory.name}
                            onChange={(e) =>
                              setNewCategory({
                                ...newCategory,
                                name: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="categoryDescription">
                            Description
                          </Label>
                          <Input
                            id="categoryDescription"
                            placeholder="Describe this position"
                            value={newCategory.description}
                            onChange={(e) =>
                              setNewCategory({
                                ...newCategory,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={
                          !walletVerified || submitting || !newCategory.name
                        }
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Category
                          </>
                        )}
                      </Button>
                    </form>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Existing Categories</h3>
                      {categories.length === 0 ? (
                        <p className="text-center text-slate-500 py-8">
                          No categories yet. Add your first category above.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <div
                              key={category.id}
                              className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
                            >
                              <div>
                                <p className="text-sm font-medium">
                                  {category.name}
                                </p>
                                <p className="text-sm text-slate-600">
                                  {category.description}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDeleteCategory(category.id)
                                }
                                disabled={submitting}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Election Settings</CardTitle>
                    <CardDescription>
                      Configure election parameters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateElection} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Election Title</Label>
                        <Input
                          id="title"
                          value={newElection.title}
                          onChange={(e) =>
                            setNewElection({
                              ...newElection,
                              title: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">
                          Description{" "}
                          <span className="text-slate-500">(Optional)</span>
                        </Label>
                        <textarea
                          id="description"
                          value={newElection.description}
                          onChange={(e) =>
                            setNewElection({
                              ...newElection,
                              description: e.target.value,
                            })
                          }
                          placeholder="Describe the purpose of this election (e.g., 'Vote for your student representatives for academic year 2024-2025')"
                          className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex min-h-[80px] w-full min-w-0 rounded-md border px-3 py-2 text-base bg-input-background transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-y"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startDate">Start Date</Label>
                          <Input
                            id="startDate"
                            type="datetime-local"
                            value={newElection.startDate}
                            onChange={(e) =>
                              setNewElection({
                                ...newElection,
                                startDate: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endDate">End Date</Label>
                          <Input
                            id="endDate"
                            type="datetime-local"
                            value={newElection.endDate}
                            onChange={(e) =>
                              setNewElection({
                                ...newElection,
                                endDate: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="allowResults">
                            Show Results During Voting
                          </Label>
                          <Switch
                            id="allowResults"
                            checked={showResultsDuringVoting}
                            onCheckedChange={setShowResultsDuringVoting}
                          />
                        </div>
                        <p className="text-sm text-slate-500">
                          {showResultsDuringVoting
                            ? "✓ Voters can see live results while voting is active"
                            : "✗ Results will be hidden until voting ends"}
                        </p>
                      </div>
                      {/* Capacity Testing Toggle */}
                      <div className="space-y-4 border-t pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="capacityTesting">
                              Enable Capacity Testing Mode
                            </Label>
                            <Switch
                              id="capacityTesting"
                              checked={capacityTestingEnabled}
                              onCheckedChange={(checked) => {
                                setCapacityTestingEnabled(checked);
                                saveCapacitySettings();
                              }}
                            />
                          </div>
                          <p className="text-sm text-slate-500">
                            {capacityTestingEnabled
                              ? "✓ Capacity limits are enforced for load testing"
                              : "✗ Normal login flow (no capacity restrictions)"}
                          </p>
                        </div>
                        {capacityTestingEnabled && (
                          <div className="space-y-2">
                            <Label htmlFor="maxUsers">
                              Maximum Concurrent Users
                            </Label>
                            <div className="flex items-center gap-3">
                              <Input
                                id="maxUsers"
                                type="number"
                                min="1"
                                max="1000"
                                value={maxConcurrentUsers}
                                onChange={(e) =>
                                  setMaxConcurrentUsers(
                                    parseInt(e.target.value) || 10
                                  )
                                }
                                onBlur={saveCapacitySettings}
                                className="w-32"
                              />
                              <span className="text-sm text-slate-500">
                                users
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              When this limit is reached, new logins will be
                              blocked with a "capacity reached" message.
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          type="submit"
                          size="lg"
                          disabled={
                            !walletVerified ||
                            submitting ||
                            adminData.electionStatus !== "Not Started" // Disable if election already created
                          }
                          className="bg-blue-600 hover:bg-blue-700 flex-1 min-w-[160px]"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Settings"
                          )}
                        </Button>
                        {adminData.electionStatus !== "Not Started" && (
                          <p className="w-full text-xs text-amber-600">
                            ⚠️ Settings are locked after initial save. you may
                            start the election or reset the system to create a
                            new election.
                          </p>
                        )}
                        <Button
                          type="button"
                          size="lg"
                          variant="default"
                          className="bg-emerald-600 hover:bg-emerald-700 flex-1 min-w-[160px]"
                          onClick={handleStartElection}
                          disabled={
                            !walletVerified ||
                            submitting ||
                            adminData.electionStatus === "Active" ||
                            !election?.title || // Election not created/saved
                            categories.length === 0 || // No categories
                            candidates.length < 2 // Less than 2 candidates
                          }
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Starting...
                            </>
                          ) : (
                            "Start Election"
                          )}
                        </Button>
                        {/* Warning messages for Start Election button */}
                        {!election?.title && (
                          <p className="w-full text-xs text-amber-600">
                            ⚠️ Please save election settings first (title and
                            dates are required)
                          </p>
                        )}
                        {election?.title && categories.length === 0 && (
                          <p className="w-full text-xs text-amber-600">
                            ⚠️ Please add at least one category before starting
                            the election
                          </p>
                        )}
                        {election?.title &&
                          categories.length > 0 &&
                          candidates.length < 2 && (
                            <p className="w-full text-xs text-amber-600">
                              ⚠️ Please add at least two candidates per category
                              before starting the election
                            </p>
                          )}
                        <Button
                          type="button"
                          size="lg"
                          variant="outline"
                          className="flex-1 min-w-[160px]"
                          onClick={handleEndElection}
                          disabled={
                            !walletVerified ||
                            submitting ||
                            adminData.electionStatus !== "Active"
                          }
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Ending...
                            </>
                          ) : (
                            "End Election"
                          )}
                        </Button>
                        <Button
                          type="button"
                          size="lg"
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700 flex-1 min-w-[160px]"
                          onClick={handleResetSystem}
                          disabled={!walletVerified || submitting}
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Resetting...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Reset System
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Active Users Monitoring Panel */}
                      {capacityTestingEnabled && (
                        <div className="mt-6 space-y-4 border-t pt-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-900">
                              Active Users Monitoring
                            </h3>
                            <Badge
                              variant={isAtCapacity ? "destructive" : "default"}
                              className={
                                isAtCapacity ? "bg-red-500" : "bg-emerald-500"
                              }
                            >
                              {isAtCapacity ? "At Capacity" : "Available"}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Active Users Count */}
                            <Card>
                              <CardHeader className="pb-3">
                                <CardDescription>Active Users</CardDescription>
                                <CardTitle className="text-3xl">
                                  {activeUsersCount}/{maxConcurrentUsers}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Progress
                                  value={
                                    (activeUsersCount / maxConcurrentUsers) *
                                    100
                                  }
                                  className="h-2"
                                />
                              </CardContent>
                            </Card>

                            {/* Utilization Percentage */}
                            <Card>
                              <CardHeader className="pb-3">
                                <CardDescription>Utilization</CardDescription>
                                <CardTitle className="text-3xl">
                                  {maxConcurrentUsers > 0
                                    ? Math.round(
                                        (activeUsersCount /
                                          maxConcurrentUsers) *
                                          100
                                      )
                                    : 0}
                                  %
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-slate-500">
                                  {activeUsersCount} of {maxConcurrentUsers}{" "}
                                  slots filled
                                </p>
                              </CardContent>
                            </Card>

                            {/* Available Slots */}
                            <Card>
                              <CardHeader className="pb-3">
                                <CardDescription>
                                  Available Slots
                                </CardDescription>
                                <CardTitle className="text-3xl">
                                  {Math.max(
                                    0,
                                    maxConcurrentUsers - activeUsersCount
                                  )}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-slate-500">
                                  {Math.max(
                                    0,
                                    maxConcurrentUsers - activeUsersCount
                                  ) > 0
                                    ? `${Math.max(
                                        0,
                                        maxConcurrentUsers - activeUsersCount
                                      )} slot${
                                        Math.max(
                                          0,
                                          maxConcurrentUsers - activeUsersCount
                                        ) === 1
                                          ? ""
                                          : "s"
                                      } available`
                                    : "At maximum capacity"}
                                </p>
                                {isAtCapacity && (
                                  <p className="text-xs text-red-600 mt-1">
                                    New logins are currently blocked
                                  </p>
                                )}
                              </CardContent>
                            </Card>
                          </div>

                          {/* Active Users List */}
                          {activeUsersList && activeUsersList.length > 0 && (
                            <Card>
                              <CardHeader>
                                <CardTitle>Currently Logged In</CardTitle>
                                <CardDescription>
                                  Active sessions (logged in within last 15
                                  minutes)
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Student ID</TableHead>
                                      <TableHead>Name</TableHead>
                                      <TableHead>Email</TableHead>
                                      <TableHead>Last Login</TableHead>
                                      <TableHead>Status</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {activeUsersList.map((user, index) => {
                                      // Privacy masking functions
                                      const maskStudentId = (id: string) => {
                                        if (!id || id.length < 3)
                                          return "TP***";
                                        // Show TP prefix + stars + last 3 digits
                                        return "TP***" + id.slice(-3);
                                      };

                                      const maskName = (fullName: string) => {
                                        if (!fullName) return "N/A";
                                        const parts = fullName
                                          .trim()
                                          .split(" ");
                                        if (parts.length === 1) {
                                          return (
                                            parts[0].charAt(0).toUpperCase() +
                                            "."
                                          );
                                        }
                                        const firstInitial = parts[0]
                                          .charAt(0)
                                          .toUpperCase();
                                        const lastInitial = parts[
                                          parts.length - 1
                                        ]
                                          .charAt(0)
                                          .toUpperCase();
                                        return `${firstInitial}. ${lastInitial}.`;
                                      };

                                      const maskEmail = (email: string) => {
                                        if (!email) return "N/A";
                                        const [localPart, domain] =
                                          email.split("@");
                                        if (!domain) return "TP***";
                                        // Show TP prefix + stars + last 3 digits
                                        if (localPart.length < 3)
                                          return "TP***@" + domain;
                                        const masked =
                                          "TP***" + localPart.slice(-3);
                                        return `${masked}@${domain}`;
                                      };

                                      return (
                                        <TableRow key={index}>
                                          <TableCell>
                                            {maskStudentId(user.studentId)}
                                          </TableCell>
                                          <TableCell>
                                            {maskName(user.fullName)}
                                          </TableCell>
                                          <TableCell>
                                            {maskEmail(user.email)}
                                          </TableCell>
                                          <TableCell>
                                            {user.lastLoginAt
                                              ? new Date(
                                                  user.lastLoginAt
                                                ).toLocaleString()
                                              : "N/A"}
                                          </TableCell>
                                          <TableCell>
                                            <Badge
                                              variant={
                                                user.hasVoted
                                                  ? "default"
                                                  : "secondary"
                                              }
                                            >
                                              {user.hasVoted
                                                ? "Voted"
                                                : "Not Voted"}
                                            </Badge>
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              </CardContent>
                            </Card>
                          )}

                          {/* No Active Users Message */}
                          {(!activeUsersList ||
                            activeUsersList.length === 0) && (
                            <Card>
                              <CardContent className="pt-6">
                                <p className="text-center text-slate-500">
                                  No active users at the moment
                                </p>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

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
    </AuthGuard>
  );
}
