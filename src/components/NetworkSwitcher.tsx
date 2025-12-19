"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { toast } from "sonner";

import { connectWallet } from "../lib/blockchain";
import { NETWORKS, NetworkId } from "../lib/networks";

export function NetworkSwitcher() {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkId>("sepolia");
  const [loading, setLoading] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  const switchNetwork = async (network: NetworkId) => {
    if (!window.ethereum) throw new Error("MetaMask is not available.");

    const chainIdHex = NETWORKS[network].chainId;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
    } catch (err: any) {
      // If chain is not added, try adding it
      if (err?.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [NETWORKS[network]],
        });
      } else {
        throw err;
      }
    }
  };

  const handleConnect = async () => {
    setLoading(true);
    try {
      const address = await connectWallet(); // ✅ no args
      setConnectedAddress(address);
      toast.success(`Connected!`);
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
          Select a network, switch MetaMask, then connect.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={selectedNetwork}
          onValueChange={(v) => setSelectedNetwork(v as NetworkId)}
        >
          {Object.entries(NETWORKS).map(([key, net]) => (
            <div key={key} className="flex items-center space-x-2">
              <RadioGroupItem value={key} id={key} />
              <Label htmlFor={key} className="cursor-pointer">
                {net.chainName} (Chain ID: {parseInt(net.chainId, 16)})
              </Label>
            </div>
          ))}
        </RadioGroup>

        <Button onClick={handleConnect} disabled={loading} className="w-full">
          {loading ? "Connecting..." : "Switch & Connect Wallet"}
        </Button>

        {connectedAddress && (
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-sm font-semibold text-green-800 mb-1">
              Connected
            </p>
            <p className="text-xs text-green-700">
              Network: {NETWORKS[selectedNetwork].chainName}
            </p>
            <p className="text-xs text-green-700 truncate">
              Address: {connectedAddress}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
