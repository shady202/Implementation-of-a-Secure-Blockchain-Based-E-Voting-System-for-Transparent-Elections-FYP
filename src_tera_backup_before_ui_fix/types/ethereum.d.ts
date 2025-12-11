/**
 * TypeScript definitions for MetaMask and Ethereum providers
 * Extends the Window interface to include ethereum object
 */

interface RequestArguments {
  method: string;
  params?: unknown[] | Record<string, unknown>;
}

interface ProviderRpcError extends Error {
  code: number;
  data?: unknown;
}

interface ProviderMessage {
  type: string;
  data: unknown;
}

interface ProviderConnectInfo {
  chainId: string;
}

interface EthereumProvider {
  // Core methods
  request(args: RequestArguments): Promise<unknown>;
  
  // Connection methods
  isMetaMask?: boolean;
  isConnected(): boolean;
  
  // Account and network info
  selectedAddress: string | null;
  chainId: string | null;
  networkVersion: string | null;
  
  // Event listeners
  on(event: 'connect', listener: (connectInfo: ProviderConnectInfo) => void): void;
  on(event: 'disconnect', listener: (error: ProviderRpcError) => void): void;
  on(event: 'accountsChanged', listener: (accounts: string[]) => void): void;
  on(event: 'chainChanged', listener: (chainId: string) => void): void;
  on(event: 'message', listener: (message: ProviderMessage) => void): void;
  
  // Remove event listeners
  removeListener(event: 'connect', listener: (connectInfo: ProviderConnectInfo) => void): void;
  removeListener(event: 'disconnect', listener: (error: ProviderRpcError) => void): void;
  removeListener(event: 'accountsChanged', listener: (accounts: string[]) => void): void;
  removeListener(event: 'chainChanged', listener: (chainId: string) => void): void;
  removeListener(event: 'message', listener: (message: ProviderMessage) => void): void;
  
  // Legacy methods (still supported)
  enable?(): Promise<string[]>;
  send?(method: string, params?: unknown[]): Promise<unknown>;
  sendAsync?(request: { method: string; params?: unknown[] }, callback: (error: Error | null, response: unknown) => void): void;
}

// Extend the Window interface
interface Window {
  ethereum?: EthereumProvider;
}

// Web3 types for better type safety
declare namespace Web3Types {
  interface TransactionReceipt {
    blockHash: string;
    blockNumber: number;
    contractAddress: string | null;
    cumulativeGasUsed: bigint;
    from: string;
    gasUsed: bigint;
    logs: Log[];
    logsBloom: string;
    status: bigint;
    to: string | null;
    transactionHash: string;
    transactionIndex: number;
  }

  interface Log {
    address: string;
    blockHash: string;
    blockNumber: number;
    data: string;
    logIndex: number;
    removed: boolean;
    topics: string[];
    transactionHash: string;
    transactionIndex: number;
  }

  interface Block {
    number: number;
    hash: string;
    parentHash: string;
    nonce: string;
    sha3Uncles: string;
    logsBloom: string;
    transactionsRoot: string;
    stateRoot: string;
    receiptsRoot: string;
    miner: string;
    difficulty: bigint;
    totalDifficulty: bigint;
    extraData: string;
    size: number;
    gasLimit: bigint;
    gasUsed: bigint;
    timestamp: number;
    transactions: string[];
    uncles: string[];
  }
}

export {};
