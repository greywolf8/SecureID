"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { IdentityCard } from "@/components/identity-card"
import { useWeb3 } from "@/components/web3-provider"
import { MetamaskCheck } from "@/components/metamask-check"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { CHAIN_METADATA, isNetworkSupported } from "@/lib/contract-config"

export default function TestNFTPage() {
  const { address, provider, chainId, connect } = useWeb3()
  const [networkInfo, setNetworkInfo] = useState<{
    name: string;
    supported: boolean;
  } | null>(null)
  
  // Check network when chainId changes
  useEffect(() => {
    if (chainId) {
      const supported = isNetworkSupported(chainId)
      const name = CHAIN_METADATA[chainId]?.name || "Unknown Network"
      setNetworkInfo({ name, supported })
    } else {
      setNetworkInfo(null)
    }
  }, [chainId])
  
  // Switch network function
  const switchToSupportedNetwork = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not installed")
      return
    }
    
    try {
      // Try to switch to Sepolia testnet (chainId 11155111)
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // 11155111 in hex
      })
      toast.success("Switched to Sepolia testnet")
    } catch (switchError: any) {
      // If the chain hasn't been added to MetaMask, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xaa36a7', // 11155111 in hex
              chainName: 'Sepolia Testnet',
              nativeCurrency: {
                name: 'Sepolia ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://rpc.sepolia.org'],
              blockExplorerUrls: ['https://sepolia.etherscan.io']
            }]
          })
          toast.success("Added and switched to Sepolia testnet")
        } catch (addError) {
          console.error("Error adding chain:", addError)
          toast.error("Could not add Sepolia network")
        }
      } else {
        console.error("Error switching chain:", switchError)
        toast.error("Could not switch network")
      }
    }
  }
  
  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">NFT Integration Test</h1>
        <p className="text-lg text-muted-foreground">
          Test the NFT generation and MetaMask integration features of SecureID
        </p>
      </div>
      
      <div className="space-y-8">
        {/* Network Status */}
        <Card>
          <CardHeader>
            <CardTitle>Network Status</CardTitle>
            <CardDescription>Check if you&apos;re connected to a supported network</CardDescription>
          </CardHeader>
          <CardContent>
            {!address ? (
              <MetamaskCheck />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Current Network:</span>
                  {networkInfo ? (
                    <Badge variant={networkInfo.supported ? "success" : "destructive"}>
                      {networkInfo.name}
                    </Badge>
                  ) : (
                    <Badge variant="outline">Not Connected</Badge>
                  )}
                </div>
                
                {networkInfo && !networkInfo.supported && (
                  <div className="bg-amber-50 p-4 rounded-md text-amber-700 border border-amber-200">
                    <p className="font-medium mb-2">Unsupported Network</p>
                    <p className="text-sm mb-4">
                      You are currently connected to {networkInfo.name}, which is not supported by SecureID.
                      Please switch to a supported network like Sepolia testnet.
                    </p>
                    <Button size="sm" onClick={switchToSupportedNetwork}>
                      Switch to Sepolia Testnet
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Identity Card */}
        {address && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Identity Card</h2>
            <IdentityCard address={address} />
          </div>
        )}
      </div>
    </div>
  )
}
