import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Helper function to generate a base64 encoded data URI for NFT metadata
 * This is useful for quick testing or when IPFS is not available
 */
export function generateNFTMetadataURI(
  name: string,
  description: string,
  image: string,
  attributes: Array<{ trait_type: string, value: string | number }> = []
): string {
  const metadata = {
    name,
    description,
    image,  // Can be a URL, base64 data URI, or IPFS URI
    attributes,
  }
  
  const metadataStr = JSON.stringify(metadata)
  const metadataBase64 = btoa(metadataStr)
  return `data:application/json;base64,${metadataBase64}`
}

/**
 * Generate a basic ID card image as a base64 data URI
 * For production, you would use IPFS or another storage solution
 */
export async function generateIDCardImage(
  address: string,
  did: string
): Promise<string> {
  // This is a simplified placeholder - in a real app, you'd use a canvas or image generation API
  // For now, we'll just return a placeholder
  return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgMTkwIj48c3R5bGU+Omhvc3R7ZmlsbDojZmZmfTwvc3R5bGU+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIxOTAiIGZpbGw9IiMwZjE3MmEiIHJ4PSIxMCIvPjxwYXRoIGZpbGw9IiMzYjgyZjYiIGQ9Ik0wIDBoMzAwdjE5MEgweiIgb3BhY2l0eT0iLjIiLz48dGV4dCB4PSIxNSIgeT0iMzAiIGZpbGw9IiNmZmYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZvbnQtc2l6ZT0iMTYiPlNlY3VyZUlEIE5GVDwvdGV4dD48dGV4dCB4PSIxNSIgeT0iNjAiIGZpbGw9IiNmZmYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgb3BhY2l0eT0iLjgiPkRlY2VudHJhbGl6ZWQgSWRlbnRpdHkgQ2FyZDwvdGV4dD48dGV4dCB4PSIxNSIgeT0iOTAiIGZpbGw9IiNmZmYiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTIiPkFkZHJlc3M6IDB4Li4uICAgICAgICAgICAgPC90ZXh0Pjx0ZXh0IHg9IjE1IiB5PSIxMjAiIGZpbGw9IiNmZmYiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTIiPkRJRDogZGlkOmV0aHI6Li4uICAgICAgICA8L3RleHQ+PHRleHQgeD0iMTUiIHk9IjE1MCIgZmlsbD0iI2ZmZiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBvcGFjaXR5PSIuOCI+VmFsaWQgc2luY2U6ICAgICAgICAgICA8L3RleHQ+PGNpcmNsZSBjeD0iMjcwIiBjeT0iMzAiIHI9IjIwIiBmaWxsPSIjM2I4MmY2IiBvcGFjaXR5PSIuMyIvPjxyZWN0IHg9IjE1IiB5PSIxNzAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAiIGZpbGw9IiMzYjgyZjYiIG9wYWNpdHk9Ii40IiByeD0iNSIvPjxyZWN0IHg9IjE4MCIgeT0iMTcwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjM2I4MmY2IiBvcGFjaXR5PSIuNCIgcng9IjUiLz48L3N2Zz4='
}

/**
 * Generate metadata for an NFT identity card
 */
export async function generateNFTIdentityMetadata(address: string) {
  const did = `did:ethr:${address}`
  const creationDate = new Date().toISOString()
  
  // Generate card image
  const image = await generateIDCardImage(address, did)
  
  // Create the full metadata 
  return generateNFTMetadataURI(
    "SecureID NFT Identity",
    "Decentralized identity card stored securely on the blockchain",
    image,
    [
      {
        trait_type: "Creation Date",
        value: creationDate
      },
      {
        trait_type: "Authentication Method",
        value: "Ethereum Blockchain"
      },
      {
        trait_type: "ID Type",
        value: "Decentralized"
      },
      {
        trait_type: "Wallet Address",
        value: address.slice(0, 10) + '...' + address.slice(-8)
      }
    ]
  )
}

/**
 * Add an NFT to MetaMask wallet
 */
export async function addNFTToMetaMask(
  contractAddress: string,
  tokenId: string,
  tokenType: 'ERC721' | 'ERC1155' = 'ERC721'
): Promise<boolean> {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed")
  }
  
  try {
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: tokenType,
        options: {
          address: contractAddress,
          tokenId: tokenId
        },
      },
    })
    
    return !!wasAdded
  } catch (error) {
    console.error("Error adding NFT to MetaMask:", error)
    throw error
  }
}
