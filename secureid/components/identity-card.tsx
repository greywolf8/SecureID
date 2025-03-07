"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, QrCode, Shield } from "lucide-react"

interface IdentityCardProps {
  address: string
}

export function IdentityCard({ address }: IdentityCardProps) {
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shortenAddress = (addr: string) => {
    return addr.slice(0, 6) + "..." + addr.slice(-4)
  }

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
                  <div className="text-xs text-muted-foreground">Valid since: {new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </div>
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
              <div className="text-sm">Polygon</div>
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
            <Button variant="outline" className="w-full">
              View on Explorer
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
              <Button>Generate Age Verification Proof</Button>
              <Button>Generate Membership Proof</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

