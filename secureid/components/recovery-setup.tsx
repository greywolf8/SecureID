"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { UserPlus, Shield, AlertTriangle, Loader2, Check, Copy } from "lucide-react"
import { useWeb3 } from "@/components/web3-provider"
import { useToast } from "@/hooks/use-toast"
import { ethers } from "ethers"

export function RecoverySetup() {
  const [guardians, setGuardians] = useState<string[]>([])
  const [newGuardian, setNewGuardian] = useState("")
  const [threshold, setThreshold] = useState(2)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isRecovering, setIsRecovering] = useState(false)
  const [copied, setCopied] = useState(false)
  const { address, signer, isConnected } = useWeb3()
  const { toast } = useToast()

  useEffect(() => {
    if (isConnected) {
      loadGuardians()
    }
  }, [isConnected])

  const loadGuardians = async () => {
    setIsLoading(true)
    try {
      // In a real app, we would fetch guardians from a smart contract
      // For now, let's simulate loading with sample data
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Sample guardians - in a real app, these would come from blockchain
      const sampleGuardians = [
        "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        "0x8Fc6bB3E7c68F03A8A67486AF6234BBee154ad89"
      ]
      
      setGuardians(sampleGuardians)
      setThreshold(Math.min(2, sampleGuardians.length))
    } catch (error) {
      console.error("Error loading guardians:", error)
      toast({
        title: "Error loading guardians",
        description: "There was a problem fetching your recovery guardians.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const validateAddress = (address: string) => {
    try {
      return ethers.utils.isAddress(address)
    } catch (error) {
      return false
    }
  }

  const addGuardian = () => {
    if (!newGuardian.trim()) {
      toast({
        title: "Empty address",
        description: "Please enter a valid Ethereum address.",
        variant: "destructive",
      })
      return
    }
    
    if (!validateAddress(newGuardian)) {
      toast({
        title: "Invalid address",
        description: "The address you entered is not a valid Ethereum address.",
        variant: "destructive",
      })
      return
    }
    
    if (guardians.includes(newGuardian)) {
      toast({
        title: "Duplicate guardian",
        description: "This address is already in your guardians list.",
        variant: "destructive",
      })
      return
    }
    
    if (newGuardian.toLowerCase() === address?.toLowerCase()) {
      toast({
        title: "Invalid guardian",
        description: "You cannot add yourself as a guardian.",
        variant: "destructive",
      })
      return
    }

    setGuardians([...guardians, newGuardian])
    setNewGuardian("")
    
    toast({
      title: "Guardian added",
      description: "The guardian has been added to your recovery list.",
      variant: "default",
    })
  }

  const removeGuardian = (index: number) => {
    setGuardians(guardians.filter((_, i) => i !== index))
    
    if (threshold > guardians.length - 1) {
      setThreshold(Math.max(2, guardians.length - 1))
    }
    
    toast({
      title: "Guardian removed",
      description: "The guardian has been removed from your recovery list.",
      variant: "default",
    })
  }
  
  const saveRecoverySetup = async () => {
    if (guardians.length < threshold) {
      toast({
        title: "Invalid setup",
        description: `You need at least ${threshold} guardians for your current threshold.`,
        variant: "destructive",
      })
      return
    }
    
    setIsSaving(true)
    try {
      // In a real app, we would send this to a smart contract
      // For now, let's simulate a blockchain interaction
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Recovery setup saved",
        description: `Your social recovery has been configured with ${threshold} out of ${guardians.length} guardians required.`,
        variant: "default",
      })
    } catch (error) {
      console.error("Error saving recovery setup:", error)
      toast({
        title: "Error saving setup",
        description: "There was a problem saving your recovery configuration.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  const initiateRecovery = async () => {
    setIsRecovering(true)
    try {
      // In a real app, we would interact with a recovery contract
      // For now, let's simulate the process
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Recovery initiated",
        description: "Recovery process has started. Your guardians will be notified.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error initiating recovery:", error)
      toast({
        title: "Error starting recovery",
        description: "There was a problem initiating the recovery process.",
        variant: "destructive",
      })
    } finally {
      setIsRecovering(false)
    }
  }
  
  const shortenAddress = (addr: string) => {
    return addr.slice(0, 6) + "..." + addr.slice(-4)
  }
  
  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    
    toast({
      title: "Address copied",
      description: "The guardian address has been copied to your clipboard.",
      variant: "default",
    })
  }

  return (
    <div className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Social recovery allows you to regain access to your identity if you lose access to your wallet. Choose trusted
          guardians who can help you recover your account.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Social Recovery Setup</CardTitle>
          <CardDescription>Add trusted guardians who can help recover your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="threshold">Recovery Threshold</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="threshold" 
                    type="number" 
                    min={guardians.length > 0 ? 1 : 2} 
                    max={Math.max(guardians.length, 2)} 
                    value={threshold}
                    onChange={(e) => setThreshold(parseInt(e.target.value))}
                    className="w-20" 
                  />
                  <span className="text-sm text-muted-foreground">out of {guardians.length} guardians required</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  This is the minimum number of guardians needed to recover your account
                </p>
              </div>

              <div className="space-y-2">
                <Label>Current Guardians</Label>
                {guardians.length === 0 ? (
                  <div className="flex items-center justify-center p-4 border rounded-md border-dashed">
                    <p className="text-sm text-muted-foreground">No guardians added yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {guardians.map((guardian, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center gap-2">
                          <div className="font-mono text-sm">{shortenAddress(guardian)}</div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => copyAddress(guardian)}
                          >
                            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGuardian(index)}
                          className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-guardian">Add Guardian</Label>
                <div className="flex gap-2">
                  <Input
                    id="new-guardian"
                    placeholder="Enter wallet address"
                    value={newGuardian}
                    onChange={(e) => setNewGuardian(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={addGuardian}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Add trustworthy people who can help you recover your account in case you lose access
                </p>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={saveRecoverySetup}
            disabled={isLoading || isSaving || guardians.length < threshold}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Save Recovery Setup
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Initiate Recovery</CardTitle>
          <CardDescription>If you've lost access to your wallet, start the recovery process</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            If you've lost access to your wallet, you can initiate the recovery process. Your guardians will need to
            approve the recovery request.
          </p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={initiateRecovery}
            disabled={isRecovering || guardians.length < threshold}
          >
            {isRecovering ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initiating Recovery...
              </>
            ) : (
              "Start Recovery Process"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

