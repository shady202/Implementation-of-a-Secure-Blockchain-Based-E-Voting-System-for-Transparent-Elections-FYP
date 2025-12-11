"use client"

import { useEffect, useState } from "react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import {
  getCurrentNetwork,
  switchNetwork,
  onNetworkChanged,
  formatAddress,
  isTestnet,
  type NetworkConfig
} from "../lib/networks"
import { getCurrentWalletAddress } from "../lib/blockchain"
import { AlertCircle, CheckCircle2, Wifi, WifiOff, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface NetworkStatusProps {
  requiredNetwork?: string // e.g., "holesky"
  showWalletAddress?: boolean
  className?: string
}

export function NetworkStatus({
  requiredNetwork,
  showWalletAddress = true,
  className = ""
}: NetworkStatusProps) {
  const [currentNetwork, setCurrentNetwork] = useState<NetworkConfig | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isWrongNetwork, setIsWrongNetwork] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadNetworkInfo = async () => {
    try {
      const network = await getCurrentNetwork()
      setCurrentNetwork(network)

      const address = await getCurrentWalletAddress()
      setWalletAddress(address)
      setIsConnected(!!address)

      // Check if on wrong network
      if (requiredNetwork && network) {
        const isCorrect = network.chainName.toLowerCase().includes(requiredNetwork.toLowerCase())
        setIsWrongNetwork(!isCorrect)
      }
    } catch (error) {
      console.error("Error loading network info:", error)
      setIsConnected(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNetworkInfo()

    // Listen for network changes
    const cleanupNetwork = onNetworkChanged(() => {
      loadNetworkInfo()
    })

    // Listen for account changes
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        setWalletAddress(accounts[0] || null)
        setIsConnected(accounts.length > 0)
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)

      return () => {
        cleanupNetwork()
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        }
      }
    }

    return cleanupNetwork
  }, [requiredNetwork])

  const handleSwitchNetwork = async () => {
    if (!requiredNetwork) return

    setLoading(true)
    try {
      await switchNetwork(requiredNetwork)
      toast.success(`Switched to ${requiredNetwork}`)
      await loadNetworkInfo()
    } catch (error: any) {
      console.error("Failed to switch network:", error)
      toast.error(error.message || "Failed to switch network")
    } finally {
      setLoading(false)
    }
  }

  const copyAddress = async () => {
    if (!walletAddress) return

    try {
      await navigator.clipboard.writeText(walletAddress)
      toast.success("Address copied to clipboard")
    } catch (error) {
      toast.error("Failed to copy address")
    }
  }

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge variant="outline" className="animate-pulse">
          <Wifi className="h-3 w-3 mr-1" />
          Loading...
        </Badge>
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Network Badge */}
      <div className="flex items-center gap-2 flex-wrap">
        {isConnected ? (
          <>
            <Badge
              variant={isWrongNetwork ? "destructive" : "default"}
              className="flex items-center gap-1"
            >
              {isWrongNetwork ? (
                <AlertCircle className="h-3 w-3" />
              ) : (
                <CheckCircle2 className="h-3 w-3" />
              )}
              {currentNetwork?.chainName || "Unknown Network"}
              {currentNetwork && isTestnet(currentNetwork.chainIdDecimal) && (
                <span className="text-xs opacity-75">(Testnet)</span>
              )}
            </Badge>

            {/* Wallet Address Badge */}
            {showWalletAddress && walletAddress && (
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={copyAddress}
                title="Click to copy address"
              >
                {formatAddress(walletAddress)}
              </Badge>
            )}
          </>
        ) : (
          <Badge variant="outline" className="flex items-center gap-1">
            <WifiOff className="h-3 w-3" />
            Not Connected
          </Badge>
        )}
      </div>

      {/* Wrong Network Alert */}
      {isConnected && isWrongNetwork && requiredNetwork && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wrong Network</AlertTitle>
          <AlertDescription className="mt-2 space-y-3">
            <p>
              You're connected to <strong>{currentNetwork?.chainName}</strong>,
              but this application requires <strong>{requiredNetwork}</strong>.
            </p>
            <Button
              size="sm"
              onClick={handleSwitchNetwork}
              disabled={loading}
              className="w-full"
            >
              Switch to {requiredNetwork}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Block Explorer Link */}
      {isConnected && walletAddress && currentNetwork?.blockExplorerUrls && (
        <a
          href={`${currentNetwork.blockExplorerUrls[0]}/address/${walletAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
        >
          View on Block Explorer
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  )
}

/**
 * Compact version for header/navbar
 */
export function NetworkStatusCompact({
  requiredNetwork,
  className = ""
}: Omit<NetworkStatusProps, "showWalletAddress">) {
  const [currentNetwork, setCurrentNetwork] = useState<NetworkConfig | null>(null)
  const [isWrongNetwork, setIsWrongNetwork] = useState(false)

  useEffect(() => {
    const loadNetwork = async () => {
      const network = await getCurrentNetwork()
      setCurrentNetwork(network)

      if (requiredNetwork && network) {
        const isCorrect = network.chainName.toLowerCase().includes(requiredNetwork.toLowerCase())
        setIsWrongNetwork(!isCorrect)
      }
    }

    loadNetwork()
    const cleanup = onNetworkChanged(() => loadNetwork())
    return cleanup
  }, [requiredNetwork])

  const handleSwitch = async () => {
    if (!requiredNetwork) return
    try {
      await switchNetwork(requiredNetwork)
      toast.success("Network switched")
    } catch (error: any) {
      toast.error(error.message || "Failed to switch")
    }
  }

  return (
    <div className={className}>
      {isWrongNetwork ? (
        <Button
          variant="destructive"
          size="sm"
          onClick={handleSwitch}
          className="gap-1"
        >
          <AlertCircle className="h-3 w-3" />
          Wrong Network
        </Button>
      ) : (
        <Badge variant="outline" className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
          {currentNetwork?.chainName || "Unknown"}
        </Badge>
      )}
    </div>
  )
}
