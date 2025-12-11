"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { connectWallet } from "../lib/blockchain";
import { toast } from "sonner";
import { NETWORKS } from "../lib/networks";

export function NetworkSwitcher() {
  const [selectedNetwork, setSelectedNetwork] = useState("sepolia");
  const [loading, setLoading] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const address = await connectWallet(selectedNetwork);
      setConnectedAddress(address);
      toast.success(`Connected to ${NETWORKS[selectedNetwork].chainName}!`);
    } catch (error: any) {
      console.error("Connection failed:", error);
      toast.error(error.message || "Failed to connect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Network Switcher</CardTitle>
        <CardDescription>
          Test different networks to find one that works
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={selectedNetwork} onValueChange={setSelectedNetwork}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sepolia" id="sepolia" />
            <Label htmlFor="sepolia" className="cursor-pointer">
              Sepolia Testnet (Chain ID: 11155111) - ✅ Recommended
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hoodi" id="hoodi" />
            <Label htmlFor="hoodi" className="cursor-pointer">
              Ethereum Hoodi (Chain ID: 17000) - ❌ Not Working
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="localhost" id="localhost" />
            <Label htmlFor="localhost" className="cursor-pointer">
              Localhost (Chain ID: 31337) - For local Hardhat
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="polygon" id="polygon" />
            <Label htmlFor="polygon" className="cursor-pointer">
              Polygon Mainnet (Chain ID: 137)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mumbai" id="mumbai" />
            <Label htmlFor="mumbai" className="cursor-pointer">
              Mumbai Testnet (Chain ID: 80001)
            </Label>
          </div>
        </RadioGroup>

        <Button onClick={handleConnect} disabled={loading} className="w-full">
          {loading ? "Connecting..." : "Connect Wallet"}
        </Button>

        {connectedAddress && (
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-sm font-semibold text-green-800 mb-1">
              ✅ Connected Successfully!
            </p>
            <p className="text-xs text-green-700">
              Network: {NETWORKS[selectedNetwork].chainName}
            </p>
            <p className="text-xs text-green-700 truncate">
              Address: {connectedAddress}
            </p>
            <div className="mt-2">
              <p className="text-xs text-green-800 font-semibold">
                ✅ This network works! Update your VoterRegistrationPage.tsx:
              </p>
              <code className="block bg-green-100 text-green-900 p-2 rounded mt-1 text-xs">
                await connectWallet("{selectedNetwork}")
              </code>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
