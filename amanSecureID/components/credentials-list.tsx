"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileCheck, Plus, ExternalLink } from "lucide-react"

export function CredentialsList() {
  // Mock credentials data
  const credentials = [
    {
      id: "1",
      name: "Email Verification",
      issuer: "SecureID Verification Service",
      issuedAt: "2023-10-15",
      expiresAt: "2024-10-15",
      status: "active",
    },
    {
      id: "2",
      name: "KYC Verification",
      issuer: "VerifyChain",
      issuedAt: "2023-09-22",
      expiresAt: "2024-09-22",
      status: "active",
    },
    {
      id: "3",
      name: "Professional Membership",
      issuer: "Blockchain Association",
      issuedAt: "2023-11-05",
      expiresAt: "2024-11-05",
      status: "active",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Verifiable Credentials</h3>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Credential
        </Button>
      </div>

      <div className="grid gap-4">
        {credentials.map((credential) => (
          <Card key={credential.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-base">{credential.name}</CardTitle>
                <CardDescription>Issued by: {credential.issuer}</CardDescription>
              </div>
              <Badge
                variant="outline"
                className="bg-green-500/10 text-green-500 hover:bg-green-500/10 hover:text-green-500"
              >
                Active
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-muted-foreground">Issued Date</div>
                  <div>{credential.issuedAt}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Expiry Date</div>
                  <div>{credential.expiresAt}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                <FileCheck className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

