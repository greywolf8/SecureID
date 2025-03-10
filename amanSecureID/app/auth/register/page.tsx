"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useWeb3 } from "@/components/web3-provider"
import { Wallet, Github, Mail, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

export default function RegisterPage() {
  const { connect, isConnected, isLoading, address } = useWeb3()
  const [isRegistering, setIsRegistering] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const router = useRouter()

  const handleConnect = async () => {
    if (!username) {
      toast.error("Please enter a username")
      return
    }
    
    setIsRegistering(true)
    try {
      // First check if window.ethereum exists before showing toast
      if (typeof window !== 'undefined' && window.ethereum) {
        toast.info("Opening MetaMask for wallet connection...", { duration: 3000 })
      } else {
        console.warn("MetaMask not detected in browser")
        throw new Error("MetaMask not detected. Please install the MetaMask extension first.")
      }
      
      // Add small delay to ensure UI updates first
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Connect to MetaMask and pass user data to save
      const newAddress = await connect({
        username, 
        email: email || undefined
      })
      
      // Update wallet address in state
      setWalletAddress(newAddress)
      
      // Show success message
      toast.success("Identity created successfully!")
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (error: any) {
      console.error("Registration error:", error)
      
      // More specific error messages
      if (error.message?.includes("MetaMask not detected")) {
        toast.error("MetaMask not detected. Please install the MetaMask extension first.")
      } else if (error.message?.includes("rejected") || error.message?.includes("denied")) {
        toast.error("You rejected the connection request. Please approve the MetaMask connection to register.")
      } else {
        toast.error(error.message || "Failed to create identity. Please try again.")
      }
    } finally {
      setIsRegistering(false)
    }
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="For recovery purposes only"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Alert>
            <AlertDescription>
              Your identity will be created on the blockchain. You will need to connect your MetaMask wallet to continue.
            </AlertDescription>
          </Alert>

          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertDescription className="text-yellow-800">
              <strong>Important:</strong> Make sure you have the MetaMask extension installed and unlocked before proceeding.
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
              <Button variant="outline">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
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

