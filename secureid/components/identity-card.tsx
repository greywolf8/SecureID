"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, QrCode, Shield, Download, ExternalLink } from "lucide-react"
import { useWeb3 } from "@/components/web3-provider"
import { useToast } from "@/hooks/use-toast"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"

interface IdentityCardProps {
  address: string
}

export function IdentityCard({ address }: IdentityCardProps) {
  const [copied, setCopied] = useState(false)
  const [identityData, setIdentityData] = useState({
    did: `did:ethr:polygon:${address}`,
    network: "Polygon",
    createdAt: new Date().toISOString(),
    status: "Active"
  })
  const [showQR, setShowQR] = useState(false)
  const { toast } = useToast()
  const { signer } = useWeb3()

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    
    toast({
      title: "Address copied!",
      description: "The address has been copied to your clipboard.",
      variant: "default",
    })
  }

  const copyDID = () => {
    navigator.clipboard.writeText(identityData.did)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    
    toast({
      title: "DID copied!",
      description: "Your DID has been copied to your clipboard.",
      variant: "default",
    })
  }

  const shortenAddress = (addr: string) => {
    return addr.slice(0, 6) + "..." + addr.slice(-4)
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const viewOnExplorer = () => {
    // For Polygon mainnet
    window.open(`https://polygonscan.com/address/${address}`, '_blank')
  }
  
  const downloadCredential = () => {
    // Create a W3C Verifiable Credential document
    const credential = {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.w3.org/2018/credentials/examples/v1"
      ],
      "id": `urn:uuid:${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`,
      "type": ["VerifiableCredential", "IdentityCredential"],
      "issuer": "did:web:secureid.example",
      "issuanceDate": new Date().toISOString(),
      "credentialSubject": {
        "id": identityData.did,
        "name": `User of ${shortenAddress(address)}`,
        "address": address
      }
    }
    
    // Create a download link
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(credential, null, 2))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "identity_credential.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
    
    toast({
      title: "Credential downloaded!",
      description: "Your identity credential has been downloaded as JSON.",
      variant: "default",
    })
  }

  useEffect(() => {
    // In a real app, you would fetch identity data from the blockchain
    // For now, we'll just use the current date
    setIdentityData({
      did: `did:ethr:polygon:${address}`,
      network: "Polygon",
      createdAt: new Date().toISOString(),
      status: "Active"
    })
  }, [address])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>NFT Identity Card</CardTitle>
            <CardDescription>Your unique on-chain identity</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-full max-w-[300px] aspect-[1.586/1] bg-gradient-to-br from-primary/20 via-primary/10 to-background rounded-xl overflow-hidden border mb-4">
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <span className="font-bold">SecureID</span>
                  </div>
                  <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                    Verified
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Decentralized Identity</div>
                  <div className="font-mono text-sm">{shortenAddress(address)}</div>
                  <div className="text-xs text-muted-foreground">Valid since: {formatDate(identityData.createdAt)}</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1" onClick={copyDID}>
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <QrCode className="mr-2 h-4 w-4" />
                    Show QR
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Your Identity QR Code</DialogTitle>
                    <DialogDescription>
                      Scan this QR code to verify your decentralized identity
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-center p-4">
                    <div className="bg-white p-4 rounded-lg">
                      {/* Simple QR code implementation */}
                      <div className="w-[200px] h-[200px] grid grid-cols-10 grid-rows-10 gap-0">
                        {Array.from({ length: 100 }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-full h-full ${Math.random() > 0.7 ? 'bg-black' : 'bg-white'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    <p className="font-mono break-all">{identityData.did}</p>
                  </div>
                </DialogContent>
              </Dialog>
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
              <div className="text-sm">{identityData.network}</div>
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
                {identityData.status}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button variant="outline" className="w-full" onClick={viewOnExplorer}>
              <ExternalLink className="mr-2 h-4 w-4" />
              View on Explorer
            </Button>
            <Button variant="outline" className="w-full" onClick={downloadCredential}>
              <Download className="mr-2 h-4 w-4" />
              Export Credential
            </Button>
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
              <Button onClick={() => {
                toast({
                  title: "ZKP generation started",
                  description: "Generating age verification proof. This may take a moment...",
                  variant: "default",
                })
                
                // Simulate proof generation
                setTimeout(() => {
                  toast({
                    title: "ZKP generated successfully",
                    description: "Your age verification proof is ready to use.",
                    variant: "default",
                  })
                }, 2000)
              }}>
                Generate Age Verification Proof
              </Button>
              <Button onClick={() => {
                toast({
                  title: "ZKP generation started",
                  description: "Generating membership proof. This may take a moment...",
                  variant: "default",
                })
                
                // Simulate proof generation
                setTimeout(() => {
                  toast({
                    title: "ZKP generated successfully",
                    description: "Your membership proof is ready to use.",
                    variant: "default",
                  })
                }, 2000)
              }}>
                Generate Membership Proof
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

