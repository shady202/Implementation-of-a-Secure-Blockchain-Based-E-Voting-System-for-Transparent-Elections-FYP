# APU VOTE Deployments

This directory contains deployment information for the VotingSystem smart contract across different networks.

## Deployment Files

Deployment files are automatically generated when you deploy the contract using the deployment scripts. Each deployment creates two files:

1. `{network}-{timestamp}.json` - Historical deployment record
2. `{network}-latest.json` - Latest deployment for quick reference

## File Format

Each deployment file contains:

```json
{
  "network": "sepolia",
  "contractAddress": "0x...",
  "adminAddress": "0x...",
  "deploymentTime": "2025-10-16T10:30:00.000Z",
  "blockNumber": 12345678
}
```

## Networks

### Local Development
- Network: `localhost` or `hardhat`
- Chain ID: 31337
- RPC: http://127.0.0.1:8545

### Testnets
- **Sepolia** (Recommended)
  - Chain ID: 11155111
  - Explorer: https://sepolia.etherscan.io
  
- **Goerli** (Deprecated)
  - Chain ID: 5
  - Explorer: https://goerli.etherscan.io

- **Mumbai** (Polygon Testnet)
  - Chain ID: 80001
  - Explorer: https://mumbai.polygonscan.com

### Mainnet
- **Ethereum Mainnet**
  - Chain ID: 1
  - Explorer: https://etherscan.io

- **Polygon Mainnet**
  - Chain ID: 137
  - Explorer: https://polygonscan.com

## Usage

### View Latest Deployment

```bash
cat deployments/sepolia-latest.json
```

### Deploy to Network

```bash
# Local
npm run deploy:local

# Testnet
npm run deploy:testnet

# Mainnet
npm run deploy:mainnet
```

## Important Notes

1. **Security**: Never commit deployment files containing sensitive information
2. **Backup**: Always backup deployment information
3. **Verification**: Verify contract address before using in production
4. **Admin Key**: Secure the admin private key used for deployment

## Contract Addresses

Update this section after each deployment:

### Testnet Deployments
- Sepolia: TBD
- Mumbai: TBD

### Mainnet Deployments
- Ethereum: TBD
- Polygon: TBD
