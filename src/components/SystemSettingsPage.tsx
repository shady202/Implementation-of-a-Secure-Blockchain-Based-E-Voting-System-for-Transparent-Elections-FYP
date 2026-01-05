import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { ArrowLeft, Info, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const apuLogo = "/apu-logo.png";

interface SystemSettingsPageProps {
  onNavigate: (page: string) => void;
}

interface Settings {
  showResultsDuringVoting: boolean;
  visitorLimit: number | null;
}

export function SystemSettingsPage({ onNavigate }: SystemSettingsPageProps) {
  const [settings, setSettings] = useState<Settings>({
    showResultsDuringVoting: false,
    visitorLimit: null,
  });
  const [visitorLimitInput, setVisitorLimitInput] = useState("");
  const [inputError, setInputError] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const stored = localStorage.getItem("systemSettings");
    if (stored) {
      const parsed = JSON.parse(stored);
      setSettings(parsed);
      setVisitorLimitInput(parsed.visitorLimit?.toString() || "");
    }
  };

  const saveSettings = (updatedSettings: Settings) => {
    localStorage.setItem("systemSettings", JSON.stringify(updatedSettings));
    setSettings(updatedSettings);
  };

  const handleToggleResults = (checked: boolean) => {
    const updated = { ...settings, showResultsDuringVoting: checked };
    saveSettings(updated);
    toast.success("Changes saved successfully.");
  };

  const handleVisitorLimitChange = (value: string) => {
    setVisitorLimitInput(value);
    setInputError("");
  };

  const handleSaveVisitorLimit = () => {
    if (visitorLimitInput === "") {
      const updated = { ...settings, visitorLimit: null };
      saveSettings(updated);
      toast.success("Settings updated.");
      return;
    }

    const numValue = parseInt(visitorLimitInput);
    if (isNaN(numValue) || numValue < 1) {
      setInputError("Value must be a positive number.");
      return;
    }

    const updated = { ...settings, visitorLimit: numValue };
    saveSettings(updated);
    toast.success("Settings updated.");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={apuLogo} alt="APU Logo" className="h-10 w-10" />
            <h2 className="text-slate-900">APU VOTE</h2>
          </div>
          <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
            Administrator
          </Badge>
        </div>
      </header>

      <div className="container mx-auto py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => onNavigate("admin")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-slate-900 mb-2">System Settings</h1>
            <p className="text-slate-600">
              Configure voting behavior and system access controls
            </p>
          </div>

          <div className="space-y-6">
            {/* Voting Behavior Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Voting Behavior Settings</CardTitle>
                <CardDescription>
                  Control how results are displayed to voters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="show-results">
                        Show Results During Voting
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-slate-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>
                              If enabled, voters can see real-time results. If
                              disabled, results remain hidden until the voting
                              ends.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-sm text-slate-600">
                      {settings.showResultsDuringVoting
                        ? "Live results visible to voters."
                        : "Results hidden until election ends."}
                    </p>
                  </div>
                  <Switch
                    id="show-results"
                    checked={settings.showResultsDuringVoting}
                    onCheckedChange={handleToggleResults}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-900">
                      Changes to this setting will apply immediately.
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      This setting is blockchain-bound and affects the smart
                      contract behavior.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Website Access Control */}
            <Card>
              <CardHeader>
                <CardTitle>Website Traffic Limit</CardTitle>
                <CardDescription>
                  Control the maximum number of simultaneously allowed visitors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="visitor-limit">
                        Maximum Active Visitors Allowed
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-slate-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>
                              This helps prevent overload during peak activity.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="visitor-limit"
                      type="number"
                      min="1"
                      value={visitorLimitInput}
                      onChange={(e) => handleVisitorLimitChange(e.target.value)}
                      placeholder="Enter max visitors (e.g., 3) or leave blank for unlimited."
                    />
                    {inputError && (
                      <p className="text-sm text-red-600">{inputError}</p>
                    )}
                    <p className="text-sm text-slate-600">
                      Limit how many users can access the system simultaneously.
                      Extra users will see a capacity message.
                    </p>
                  </div>

                  <Button
                    onClick={handleSaveVisitorLimit}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Save Visitor Limit
                  </Button>
                </div>

                <div className="bg-slate-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="h-4 w-4 text-slate-600" />
                    <p className="text-sm text-slate-900">Current Status</p>
                  </div>
                  <p className="text-sm text-slate-600 ml-6">
                    {settings.visitorLimit
                      ? `Current limit: ${settings.visitorLimit} visitor${
                          settings.visitorLimit > 1 ? "s" : ""
                        }`
                      : "Unlimited access enabled"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
