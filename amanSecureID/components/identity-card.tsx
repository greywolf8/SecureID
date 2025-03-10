"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, QrCode, Shield, Wallet, Loader2, AlertTriangle, ExternalLink } from "lucide-react"
import { useWeb3 } from "@/components/web3-provider"
import { toast } from "sonner"
import { ethers } from "ethers"
import { generateNFTIdentityMetadata, addNFTToMetaMask } from "@/lib/utils"
import { IDENTITY_CONTRACT_ABI, getContractAddress, isNetworkSupported, getExplorerAddressUrl } from "@/lib/contract-config"

interface IdentityCardProps {
  address: string
}

interface NFTData {
  tokenId: string
  did: string
  tokenURI: string
  imageUrl: string
  metadata: {
    name: string
    description: string
    attributes: Array<{ trait_type: string; value: string }>
    [key: string]: any
  }
}

export function IdentityCard({ address }: IdentityCardProps) {
  const { provider } = useWeb3()
  const [copied, setCopied] = useState(false)
  const [nftData, setNftData] = useState<NFTData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [networkSupported, setNetworkSupported] = useState(false)
  const [chainId, setChainId] = useState<string | null>(null)
  const [contractAddress, setContractAddress] = useState('')

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shortenAddress = (addr: string) => {
    return addr.slice(0, 6) + "..." + addr.slice(-4)
  }

  // Get network information and check if it's supported
  const getNetworkInfo = async () => {
    if (!provider) return
    
    try {
      const network = await provider.getNetwork()
      const currentChainId = network.chainId.toString()
      setChainId(currentChainId)
      
      const supported = isNetworkSupported(currentChainId)
      setNetworkSupported(supported)
      
      const address = getContractAddress(currentChainId)
      setContractAddress(address)
      
      return { chainId: currentChainId, supported, contractAddress: address }
    } catch (error) {
      console.error("Error getting network info:", error)
      setNetworkSupported(false)
      setContractAddress('')
      return null
    }
  }

  // Function to fetch NFT data for the current user
  const fetchNFTData = async () => {
    if (!address || !provider) return
    
    const networkInfo = await getNetworkInfo()
    if (!networkInfo?.supported || !networkInfo.contractAddress) {
      return
    }
    
    setIsLoading(true)
    try {
      // Create contract instance
      const contract = new ethers.Contract(networkInfo.contractAddress, IDENTITY_CONTRACT_ABI, provider)
      
      // Get identity info (returns did, tokenId, and tokenURI)
      const [did, tokenIdBN, tokenURI] = await contract.getIdentity(address)
      const tokenId = tokenIdBN.toString()
      
      if (tokenId === '0') {
        setNftData(null)
        return
      }
      
      // Fetch token metadata from URI
      let metadata
      let imageUrl = ''
      
      if (tokenURI.startsWith('ipfs://')) {
        // Convert IPFS URI to HTTP URL for fetching
        const ipfsGateway = 'https://ipfs.io/ipfs/'
        const ipfsHash = tokenURI.replace('ipfs://', '')
        const metadataUrl = `${ipfsGateway}${ipfsHash}`
        
        const response = await fetch(metadataUrl)
        metadata = await response.json()
        imageUrl = metadata.image.replace('ipfs://', ipfsGateway)
      } else if (tokenURI.startsWith('http')) {
        // Direct HTTP URL
        const response = await fetch(tokenURI)
        metadata = await response.json()
        imageUrl = metadata.image
      } else {
        // Handle base64 encoded data
        if (tokenURI.startsWith('data:application/json;base64,')) {
          const base64Data = tokenURI.replace('data:application/json;base64,', '')
          const decodedData = atob(base64Data)
          metadata = JSON.parse(decodedData)
          
          if (metadata.image.startsWith('data:image')) {
            imageUrl = metadata.image
          }
        }
      }
      
      setNftData({
        tokenId,
        did,
        tokenURI,
        imageUrl,
        metadata
      })
    } catch (error) {
      console.error("Error fetching NFT data:", error)
      toast.error("Failed to load your NFT Identity Card")
    } finally {
      setIsLoading(false)
    }
  }
  
  // Function to generate a new NFT ID Card
  const generateNFTIDCard = async () => {
    if (!address || !provider) {
      toast.error("Wallet not connected")
      return
    }
    
    const networkInfo = await getNetworkInfo()
    if (!networkInfo?.supported) {
      toast.error("Please connect to a supported network")
      return
    }
    
    if (!networkInfo.contractAddress) {
      toast.error("Contract not deployed on this network")
      return
    }
    
    setIsGenerating(true)
    try {
      const signer = provider.getSigner()
      
      // Create contract instance
      const contract = new ethers.Contract(networkInfo.contractAddress, IDENTITY_CONTRACT_ABI, signer)
      
      // Generate a unique DID
      const did = `did:ethr:${address}`
      
      // Generate NFT metadata using our utility function
      const tokenURI = await generateNFTIdentityMetadata(address)
      
      // Call contract function to create identity
      const tx = await contract.createIdentity(did, tokenURI)
      
      toast.info("Creating your NFT Identity, please wait for confirmation...")
      await tx.wait()
      
      toast.success("Successfully created your NFT Identity Card!")
      
      // Fetch updated NFT data
      await fetchNFTData()
    } catch (error) {
      console.error("Error generating NFT:", error)
      toast.error("Failed to generate NFT Identity Card")
    } finally {
      setIsGenerating(false)
    }
  }
  
  // Function to add NFT to MetaMask
  const importToMetaMask = async () => {
    if (!nftData || !window.ethereum) {
      toast.error("NFT data not available or MetaMask not installed")
      return
    }
    
    if (!contractAddress) {
      toast.error("Contract address not available")
      return
    }
    
    setIsImporting(true)
    try {
      // Use utility function to add NFT to MetaMask
      const wasAdded = await addNFTToMetaMask(contractAddress, nftData.tokenId)
      
      if (wasAdded) {
        toast.success("NFT added to your MetaMask wallet!")
      } else {
        toast.info("Cancelled or failed to add NFT to MetaMask")
      }
    } catch (error) {
      console.error("Error adding NFT to MetaMask:", error)
      toast.error("Failed to add NFT to MetaMask")
    } finally {
      setIsImporting(false)
    }
  }
  
  // Fetch NFT data on component mount
  useEffect(() => {
    const initialize = async () => {
      if (provider) {
        const networkInfo = await getNetworkInfo()
        
        // Only fetch NFT data if we're on a supported network
        if (address && networkInfo?.supported && networkInfo.contractAddress) {
          fetchNFTData()
        }
      }
    }
    
    initialize()
  }, [address, provider])
  
  // Update when network changes
  useEffect(() => {
    if (window.ethereum) {
      const handleChainChanged = () => {
        window.location.reload()
      }
      
      window.ethereum.on('chainChanged', handleChainChanged)
      
      return () => {
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>NFT Identity Card</CardTitle>
            <CardDescription>Your unique on-chain identity</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {nftData ? (
              <div className="relative w-full max-w-[300px] aspect-[1.586/1] bg-gradient-to-br from-primary/20 via-primary/10 to-background rounded-xl overflow-hidden border mb-4">
                {nftData.imageUrl && (
                  <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(${nftData.imageUrl})`, opacity: 0.3 }} />
                )}
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Shield className="h-6 w-6 text-primary" />
                      <span className="font-bold">SecureID NFT</span>
                    </div>
                    <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                      Verified On-Chain
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Decentralized Identity</div>
                    <div className="font-mono text-sm">{shortenAddress(address)}</div>
                    <div className="flex justify-between">
                      <div className="text-xs text-muted-foreground">Token ID: #{nftData.tokenId}</div>
                      <div className="text-xs text-muted-foreground">Valid since: {new Date().toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full max-w-[300px] aspect-[1.586/1] bg-gradient-to-br from-primary/20 via-primary/10 to-background rounded-xl overflow-hidden border mb-4">
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Shield className="h-6 w-6 text-primary" />
                      <span className="font-bold">SecureID</span>
                    </div>
                    <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                      Not Generated
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Decentralized Identity</div>
                    <div className="font-mono text-sm">{shortenAddress(address)}</div>
                    <div className="text-xs text-muted-foreground">Generate your NFT ID below</div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1" onClick={copyAddress}>
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy DID
                  </>
                )}
              </Button>
              <Button variant="outline" className="flex-1">
                <QrCode className="mr-2 h-4 w-4" />
                Show QR
              </Button>
            </div>
            
            <div className="flex gap-2 w-full mt-2">
              {!nftData ? (
                <Button variant="default" className="flex-1" onClick={generateNFTIDCard} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate NFT ID Card"
                  )}
                </Button>
              ) : (
                <Button variant="default" className="flex-1" onClick={importToMetaMask} disabled={isImporting}>
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-4 w-4" />
                      Add to MetaMask
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Identity Details</CardTitle>
            <CardDescription>Your decentralized identity information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="text-sm font-medium">DID Method</div>
              <div className="text-sm">ethr</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Network</div>
              <div className="text-sm">Ethereum</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Controller</div>
              <div className="text-sm font-mono truncate">{address}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Status</div>
              <Badge
                variant="outline"
                className="bg-green-500/10 text-green-500 hover:bg-green-500/10 hover:text-green-500"
              >
                Active
              </Badge>
            </div>
          </CardContent>
          <CardFooter>
            {chainId && contractAddress ? (
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => window.open(getExplorerAddressUrl(chainId, contractAddress), '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View on Explorer
              </Button>
            ) : (
              <Button variant="outline" className="w-full" disabled>
                <ExternalLink className="mr-2 h-4 w-4" />
                View on Explorer
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Zero-Knowledge Proofs</CardTitle>
          <CardDescription>Prove your identity without revealing sensitive information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Zero-knowledge proofs allow you to verify your identity without exposing your personal data. Generate a
              proof to authenticate with services that support ZKP.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button disabled={!nftData}>Generate Age Verification Proof</Button>
              <Button disabled={!nftData}>Generate Membership Proof</Button>
            </div>
            {!nftData && (
              <p className="text-xs text-amber-500 italic">
                Please generate your NFT Identity Card first to enable these features
              </p>
            )}
            {!networkSupported && (
              <div className="mt-4 p-3 border border-yellow-400 bg-yellow-50 rounded-md flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Unsupported Network</p>
                  <p className="mt-1">Please connect to a supported network to use NFT features</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

