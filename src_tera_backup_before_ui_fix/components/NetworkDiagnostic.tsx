"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { NETWORKS } from "../lib/networks";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

export function NetworkDiagnostic() {
  const [results, setResults] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const testRPC = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_chainId",
          params: [],
          id: 1,
        }),
      });
      const data = await response.json();
      return !!data.result;
    } catch (error) {
      return false;
    }
  };

  const runDiagnostics = async () => {
    setTesting(true);
    const hoodiNetwork = NETWORKS.hoodi;
    
    // Test all RPC URLs
    const rpcResults = await Promise.all(
      hoodiNetwork.rpcUrls.map(async (url) => ({
        url,
        working: await testRPC(url),
      }))
    );

    // Check MetaMask
    const hasMetaMask = typeof window !== "undefined" && !!(window as any).ethereum;
    
    let currentChainId = null;
    if (hasMetaMask) {
      try {
        currentChainId = await (window as any).ethereum.request({
          method: "eth_chainId",
        });
      } catch (error) {
        console.error("Failed to get chain ID:", error);
      }
    }

    setResults({
      network: hoodiNetwork,
      rpcResults,
      hasMetaMask,
      currentChainId,
      expectedChainId: hoodiNetwork.chainId,
    });
    setTesting(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Network Diagnostic Tool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runDiagnostics} disabled={testing}>
          {testing ? "Testing..." : "Run Network Diagnostics"}
        </Button>

        {results && (
          <div className="space-y-4">
            {/* MetaMask Status */}
            <div className="flex items-center gap-2">
              {results.hasMetaMask ? (
                <CheckCircle className="text-green-500" size={20} />
              ) : (
                <XCircle className="text-red-500" size={20} />
              )}
              <span>
                MetaMask: {results.hasMetaMask ? "Installed" : "Not Installed"}
              </span>
            </div>

            {/* Current Network */}
            {results.currentChainId && (
              <div>
                <p className="font-semibold">Current Network:</p>
                <p className="text-sm">
                  Chain ID: {results.currentChainId} (
                  {parseInt(results.currentChainId, 16)})
                </p>
                <p className="text-sm">
                  Expected: {results.expectedChainId} (
                  {results.network.chainIdDecimal})
                </p>
                {results.currentChainId === results.expectedChainId ? (
                  <Badge className="bg-green-500">✓ Correct Network</Badge>
                ) : (
                  <Badge className="bg-red-500">✗ Wrong Network</Badge>
                )}
              </div>
            )}

            {/* RPC Status */}
            <div>
              <p className="font-semibold mb-2">RPC Endpoints Status:</p>
              <div className="space-y-2">
                {results.rpcResults.map((rpc: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {rpc.working ? (
                      <CheckCircle className="text-green-500" size={16} />
                    ) : (
                      <XCircle className="text-red-500" size={16} />
                    )}
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {rpc.url}
                    </code>
                    <Badge variant={rpc.working ? "default" : "destructive"}>
                      {rpc.working ? "Working" : "Failed"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Network Config */}
            <div>
              <p className="font-semibold mb-2">Configured Network:</p>
              <div className="bg-gray-50 p-4 rounded text-sm space-y-1">
                <p>
                  <strong>Name:</strong> {results.network.chainName}
                </p>
                <p>
                  <strong>Chain ID:</strong> {results.network.chainIdDecimal} (
                  {results.network.chainId})
                </p>
                <p>
                  <strong>Currency:</strong>{" "}
                  {results.network.nativeCurrency.symbol}
                </p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="text-yellow-600 mt-1" size={20} />
                <div className="space-y-2">
                  <p className="font-semibold">Recommendations:</p>
                  {!results.hasMetaMask && (
                    <p className="text-sm">
                      • Install MetaMask extension first
                    </p>
                  )}
                  {!results.rpcResults.some((r: any) => r.working) && (
                    <p className="text-sm">
                      • All RPC endpoints are unreachable. You may need to use a
                      different network or provide custom RPC URLs.
                    </p>
                  )}
                  {results.currentChainId &&
                    results.currentChainId !== results.expectedChainId && (
                      <p className="text-sm">
                        • Switch to the correct network in MetaMask
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
