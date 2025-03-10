/**
 * Contract configuration and deployment helpers
 */

// Deployed contract addresses by network ID
export const CONTRACT_ADDRESSES: Record<string, string> = {
  '1': '', // Ethereum Mainnet - Not deployed yet
  '5': '', // Goerli Testnet - Not deployed yet
  '11155111': '0x8B45D5A8617E9d267d27C56F7fC3aF1469A951Df', // Sepolia Testnet
  '31337': '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Hardhat Local
  '80001': '', // Polygon Mumbai - Not deployed yet
}

// Contract ABIs
export const IDENTITY_CONTRACT_ABI = [
  // Only include the functions we need for the frontend
  "function createIdentity(string memory did, string memory tokenURI) external returns (uint256)",
  "function getIdentity(address owner) external view returns (string, uint256, string)",
  "function tokenURI(uint256 tokenId) external view returns (string)"
]

/**
 * Convert a chainId to decimal format for consistent lookup
 * @param chainId The chain ID (hex or decimal format)
 * @returns The chainId in decimal format
 */
export function normalizeChainId(chainId: string | null): string | null {
  if (!chainId) return null
  
  // If it's a hex string (starts with 0x), convert to decimal
  if (chainId.startsWith('0x')) {
    return parseInt(chainId, 16).toString()
  }
  
  return chainId
}

/**
 * Get the deployed contract address for the current network
 * @param chainId The current chain ID
 * @returns The contract address or empty string if not deployed
 */
export function getContractAddress(chainId: string | null): string {
  const normalizedChainId = normalizeChainId(chainId)
  if (!normalizedChainId) return ''
  return CONTRACT_ADDRESSES[normalizedChainId] || ''
}

/**
 * Determine if the current network is supported
 * @param chainId The current chain ID
 * @returns True if the network is supported
 */
export function isNetworkSupported(chainId: string | null): boolean {
  const normalizedChainId = normalizeChainId(chainId)
  if (!normalizedChainId) return false
  return !!CONTRACT_ADDRESSES[normalizedChainId]
}

// Chain metadata for UI display
export const CHAIN_METADATA: Record<string, { name: string, blockExplorer: string }> = {
  '1': { 
    name: 'Ethereum Mainnet', 
    blockExplorer: 'https://etherscan.io' 
  },
  '5': { 
    name: 'Goerli Testnet', 
    blockExplorer: 'https://goerli.etherscan.io' 
  },
  '11155111': { 
    name: 'Sepolia Testnet', 
    blockExplorer: 'https://sepolia.etherscan.io' 
  },
  '31337': { 
    name: 'Hardhat Local', 
    blockExplorer: '' 
  },
  '80001': { 
    name: 'Polygon Mumbai', 
    blockExplorer: 'https://mumbai.polygonscan.com' 
  }
}

/**
 * Get a block explorer URL for a transaction hash
 * @param chainId The current chain ID
 * @param txHash The transaction hash
 * @returns A URL to view the transaction on the block explorer
 */
export function getExplorerTxUrl(chainId: string | null, txHash: string): string {
  const normalizedChainId = normalizeChainId(chainId)
  if (!normalizedChainId || !CHAIN_METADATA[normalizedChainId]?.blockExplorer) return ''
  return `${CHAIN_METADATA[normalizedChainId].blockExplorer}/tx/${txHash}`
}

/**
 * Get a block explorer URL for a contract address
 * @param chainId The current chain ID
 * @param address The contract address
 * @returns A URL to view the contract on the block explorer
 */
export function getExplorerAddressUrl(chainId: string | null, address: string): string {
  const normalizedChainId = normalizeChainId(chainId)
  if (!normalizedChainId || !CHAIN_METADATA[normalizedChainId]?.blockExplorer) return ''
  return `${CHAIN_METADATA[normalizedChainId].blockExplorer}/address/${address}`
}
