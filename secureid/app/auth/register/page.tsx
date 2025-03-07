"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useWeb3 } from "@/components/web3-provider"
import { Wallet, Github, Mail, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { ethers } from "ethers"

// This would be the real identity contract ABI in production
const identityContractAbi = [
  "function createIdentity(string username, string email) public returns (uint256)",
  "function getIdentityByOwner(address owner) public view returns (uint256, string, string, uint256)"
]

export default function RegisterPage() {
  const { connect, isConnected, isLoading, address, signer, provider } = useWeb3()
  const [isRegistering, setIsRegistering] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<{username?: string, email?: string}>({})
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Sample contract address - would come from environment in production
  const identityContractAddress = "0x4A8B53Da18Ef439C4b8b6eADe3F73A345070FBF4"

  useEffect(() => {
    setIsMounted(true)
    
    // Check if user is already authenticated and registered
    if (isConnected && !isLoading) {
      // In a real app, you would check if user already has an identity
      // For now, we'll just redirect to dashboard
      router.push("/dashboard")
    }
  }, [isConnected, isLoading, router])

  const validateForm = () => {
    const formErrors: {username?: string, email?: string} = {}
    
    if (!username.trim()) {
      formErrors.username = "Username is required"
    } else if (username.length < 3) {
      formErrors.username = "Username must be at least 3 characters"
    }
    
    if (email && !email.includes('@')) {
      formErrors.email = "Please enter a valid email"
    }
    
    setErrors(formErrors)
    return Object.keys(formErrors).length === 0
  }

  const handleConnect = async () => {
    if (!validateForm()) return
    
    setIsRegistering(true)
    try {
      if (!isConnected) {
        await connect()
      }
      
      // Check if we have a valid signer after connection
      if (!signer) {
        throw new Error("Wallet connection failed")
      }
      
      // In a production app, you would interact with the real contract
      // Here we'll simulate the identity creation
      try {
        // Simulate blockchain interaction with delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Show success message
        toast({
          title: "Identity created successfully!",
          description: `Your blockchain identity has been created with username ${username}.`,
          variant: "default",
        })
        
        // Redirect to dashboard
        router.push("/dashboard")
      } catch (contractError) {
        console.error("Contract interaction error:", contractError)
        toast({
          title: "Identity creation failed",
          description: "There was an error creating your identity on the blockchain.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Connection failed",
        description: "Could not connect to your wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRegistering(false)
    }
  }

  const handleSocialRegister = async (method: string) => {
    setIsRegistering(true)
    try {
      await connect()
      
      toast({
        title: "Social registration started",
        description: `Registration with ${method} initiated. Please complete the process.`,
        variant: "default",
      })
      
      // In a real app, we would handle social registration flow
      // For now, simulate success after a delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      router.push("/dashboard")
    } catch (error) {
      console.error(`${method} registration error:`, error)
      toast({
        title: "Registration failed",
        description: `There was a problem registering with ${method}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsRegistering(false)
    }
  }

  // Don't render until we're mounted to avoid hydration mismatch
  if (!isMounted) {
    return null
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create Your SecureID</CardTitle>
          <CardDescription>Set up your decentralized identity in minutes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={errors.username ? "border-red-500" : ""}
            />
            {errors.username && (
              <p className="text-sm text-red-500 mt-1">{errors.username}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="For recovery purposes only"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Your identity will be created on the blockchain. Make sure to securely back up your wallet credentials.
            </AlertDescription>
          </Alert>

          <Button className="w-full" onClick={handleConnect} disabled={isLoading || isRegistering || !username}>
            {isLoading || isRegistering ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Identity...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet & Create Identity
              </>
            )}
          </Button>

          <Separator className="my-4" />

          <div className="space-y-2">
            <p className="text-sm text-center text-muted-foreground">Or create with</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => handleSocialRegister('GitHub')} disabled={isRegistering}>
                {isRegistering ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Github className="mr-2 h-4 w-4" />
                )}
                GitHub
              </Button>
              <Button variant="outline" onClick={() => handleSocialRegister('Email')} disabled={isRegistering}>
                {isRegistering ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                Email
              </Button>
            </div>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-center p-6">
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary underline underline-offset-4 hover:text-primary/90">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

