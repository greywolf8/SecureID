"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileCheck, Plus, ExternalLink, Download, X, Check, Loader2 } from "lucide-react"
import { useWeb3 } from "@/components/web3-provider"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

interface Credential {
  id: string
  name: string
  issuer: string
  issuedAt: string
  expiresAt: string
  status: "active" | "expired" | "revoked"
  type: string
  content?: any
}

export function CredentialsList() {
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null)
  const [isAddingCredential, setIsAddingCredential] = useState(false)
  const [newCredential, setNewCredential] = useState({
    name: "",
    type: "identity",
    content: ""
  })
  const { address, isConnected } = useWeb3()
  const { toast } = useToast()

  const loadCredentials = async () => {
    setIsLoading(true)
    try {
      // In a real app, we would fetch credentials from the blockchain
      // For now, let's simulate loading with sample data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock credentials data
      const mockCredentials: Credential[] = [
        {
          id: "1",
          name: "Email Verification",
          issuer: "SecureID Verification Service",
          issuedAt: "2023-10-15",
          expiresAt: "2024-10-15",
          status: "active",
          type: "identity"
        },
        {
          id: "2",
          name: "KYC Verification",
          issuer: "VerifyChain",
          issuedAt: "2023-09-22",
          expiresAt: "2024-09-22",
          status: "active",
          type: "verification"
        },
        {
          id: "3",
          name: "Professional Membership",
          issuer: "Blockchain Association",
          issuedAt: "2023-11-05",
          expiresAt: "2024-11-05",
          status: "active",
          type: "membership"
        },
      ]
      
      setCredentials(mockCredentials)
    } catch (error) {
      console.error("Error loading credentials:", error)
      toast({
        title: "Error loading credentials",
        description: "There was a problem fetching your credentials.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    if (isConnected) {
      loadCredentials()
    }
  }, [isConnected])

  const handleAddCredential = async () => {
    if (!newCredential.name || !newCredential.type) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      })
      return
    }
    
    setIsAddingCredential(true)
    try {
      // Simulate blockchain interaction
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create a new credential
      const newCredentialObj: Credential = {
        id: Date.now().toString(),
        name: newCredential.name,
        type: newCredential.type,
        issuer: "Self-attested",
        issuedAt: new Date().toISOString().split('T')[0],
        expiresAt: new Date(Date.now() + 31536000000).toISOString().split('T')[0], // 1 year from now
        status: "active",
        content: newCredential.content ? JSON.parse(newCredential.content) : undefined
      }
      
      setCredentials(prev => [...prev, newCredentialObj])
      
      toast({
        title: "Credential added",
        description: "Your new credential has been added successfully.",
        variant: "default",
      })
      
      // Reset form
      setNewCredential({
        name: "",
        type: "identity",
        content: ""
      })
      setIsAddingCredential(false)
    } catch (error) {
      console.error("Error adding credential:", error)
      toast({
        title: "Error adding credential",
        description: "There was a problem adding your credential. Please try again.",
        variant: "destructive",
      })
      setIsAddingCredential(false)
    }
  }

  const shareCredential = (credential: Credential) => {
    // In a real app, this would generate a shareable proof
    
    // Create a verifiable presentation
    const presentation = {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      "type": ["VerifiablePresentation"],
      "id": `urn:uuid:${Date.now()}`,
      "holder": `did:ethr:polygon:${address}`,
      "verifiableCredential": {
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        "id": `urn:uuid:${credential.id}`,
        "type": ["VerifiableCredential", credential.type],
        "issuer": credential.issuer,
        "issuanceDate": credential.issuedAt,
        "expirationDate": credential.expiresAt,
        "credentialSubject": {
          "id": `did:ethr:polygon:${address}`,
          "name": credential.name
        }
      }
    }
    
    const shareUrl = `https://secureid.example/verify?id=${credential.id}&holder=${address}`
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl)
    
    toast({
      title: "Credential ready to share",
      description: "Shareable link copied to clipboard.",
      variant: "default",
    })
  }

  const downloadCredential = (credential: Credential) => {
    const vc = {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      "id": `urn:uuid:${credential.id}`,
      "type": ["VerifiableCredential", credential.type],
      "issuer": credential.issuer,
      "issuanceDate": credential.issuedAt,
      "expirationDate": credential.expiresAt,
      "credentialSubject": {
        "id": `did:ethr:polygon:${address}`,
        "name": credential.name
      }
    }
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(vc, null, 2))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `${credential.name.replace(/\s+/g, '_')}_credential.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
    
    toast({
      title: "Credential downloaded",
      description: "Your credential has been downloaded as JSON.",
      variant: "default",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Verifiable Credentials</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Credential
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Credential</DialogTitle>
              <DialogDescription>
                Create a new self-attested credential or import an existing one.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Credential Name</Label>
                <Input 
                  id="name" 
                  value={newCredential.name}
                  onChange={(e) => setNewCredential({...newCredential, name: e.target.value})}
                  placeholder="e.g., Professional Certificate" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Credential Type</Label>
                <Select 
                  value={newCredential.type}
                  onValueChange={(value) => setNewCredential({...newCredential, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select credential type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="identity">Identity</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="employment">Employment</SelectItem>
                    <SelectItem value="membership">Membership</SelectItem>
                    <SelectItem value="verification">Verification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Credential Content (Optional JSON)</Label>
                <Textarea 
                  id="content" 
                  value={newCredential.content}
                  onChange={(e) => setNewCredential({...newCredential, content: e.target.value})}
                  placeholder='{"key": "value"}' 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewCredential({
                name: "",
                type: "identity",
                content: ""
              })}>
                Reset
              </Button>
              <Button onClick={handleAddCredential} disabled={isAddingCredential}>
                {isAddingCredential ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Credential"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : credentials.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">You don't have any credentials yet</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Credential
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  {/* Same content as above dialog */}
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ) : (
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
                  className={`
                    ${credential.status === "active" ? "bg-green-500/10 text-green-500 hover:bg-green-500/10 hover:text-green-500" : 
                      credential.status === "expired" ? "bg-orange-500/10 text-orange-500 hover:bg-orange-500/10 hover:text-orange-500" :
                      "bg-red-500/10 text-red-500 hover:bg-red-500/10 hover:text-red-500"}
                  `}
                >
                  {credential.status === "active" ? "Active" : 
                   credential.status === "expired" ? "Expired" : "Revoked"}
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
                <Button variant="outline" size="sm" onClick={() => shareCredential(credential)}>
                  <FileCheck className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={() => downloadCredential(credential)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

