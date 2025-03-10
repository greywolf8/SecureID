"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useWeb3 } from "@/components/web3-provider"
import { Wallet, Github, Mail, Loader2, ShieldCheck, AlertCircle } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function LoginPage() {
  const { connect, isConnected, isLoading, address, getUserByAddress } = useWeb3()
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [userData, setUserData] = useState<{username?: string; email?: string; address: string} | null>(null)
  const router = useRouter()

  // Check if already connected and retrieve user data
  useEffect(() => {
    const checkExistingConnection = async () => {
      if (isConnected && address) {
        try {
          console.log("Found existing connection with address:", address)
          const user = getUserByAddress(address)
          setUserData(user)
          
          // If we have user data, show success message
          if (user) {
            toast.success(`Welcome back, ${user.username || 'User'}!`)
            setTimeout(() => {
              router.push("/dashboard")
            }, 1000)
          } else {
            console.log("No user data found for connected address:", address)
          }
        } catch (err) {
          console.error("Error checking existing connection:", err)
        }
      }
    }
    
    checkExistingConnection()
  }, [isConnected, address, getUserByAddress, router])
  
  const handleConnect = async () => {
    // Reset state
    setIsAuthenticating(true)
    setConnectionError(null)
    
    try {
      console.log("Initiating wallet connection...")
      
      // First check if window.ethereum exists before showing toast
      if (typeof window !== 'undefined' && window.ethereum) {
        toast.info("Opening MetaMask...", { duration: 2000 })
      } else {
        console.warn("MetaMask not detected in browser")
        throw new Error("MetaMask not detected. Please install the MetaMask extension.")
      }
      
      // Add small delay before calling connect to ensure UI updates first
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Connect to MetaMask - our improved provider will handle retries and fallbacks
      const userAddress = await connect()
      console.log("Successfully connected to address:", userAddress)
      
      // Check if we have data for this wallet
      const user = getUserByAddress(userAddress)
      
      if (user) {
        // User found - show success message and redirect
        setUserData(user)
        toast.success(`Welcome back, ${user.username || 'User'}!`)
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } else {
        // No user data found for this wallet - do not auto-register
        console.log("No user found for address:", userAddress)
        toast.warning('No account found for this wallet. Please register first.')
        
        // Show a button to redirect to registration instead of auto-redirecting
        setConnectionError("This wallet is not registered. Please register first before logging in.")
      }
    } catch (error: any) {
      console.error("Authentication error:", error)
      
      // Get a safe error message
      const errorMessage = error?.message || "Authentication failed"
      setConnectionError(errorMessage)
      
      // Show appropriate error message based on error type
      if (errorMessage.includes("MetaMask not detected") || errorMessage.includes("provider not available")) {
        toast.error("MetaMask not found. Please install the MetaMask extension.")
      } else if (errorMessage.includes("rejected") || errorMessage.includes("denied") || errorMessage.includes("declined")) {
        toast.error("Connection rejected. Please approve the connection request in MetaMask.")
      } else if (errorMessage.includes("type")) {
        // This catches the specific 'Cannot read properties of null (reading 'type')' error
        toast.error("MetaMask encountered an error. Try unlocking your wallet first and refreshing the page.")
      } else {
        toast.error("Failed to connect to wallet. Please refresh the page and try again.")
      }
    } finally {
      setIsAuthenticating(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login to SecureID</CardTitle>
          <CardDescription>Choose your preferred authentication method</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="wallet" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="zkp">Zero-Knowledge</TabsTrigger>
            </TabsList>
            <TabsContent value="wallet" className="space-y-4 mt-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Connect your blockchain wallet to authenticate securely without passwords
                </p>
                
                {connectionError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-3">
                    <p className="text-sm text-red-800 flex items-start">
                      <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                      {connectionError}
                    </p>
                    <p className="text-xs text-red-600 mt-1 pl-6">
                      {connectionError?.includes("not registered") ? (
                        <>
                          Please <Link href="/auth/register" className="underline font-medium">register here</Link> to create a new account.
                        </>
                      ) : (
                        "Make sure MetaMask is installed and unlocked."
                      )}
                    </p>
                  </div>
                )}
                
                {userData ? (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md mb-3">
                    <p className="text-sm font-medium">Connected as {userData.username || 'User'}</p>
                    <p className="text-xs text-green-700 mt-1 truncate">{userData.address}</p>
                  </div>
                ) : null}
                
                <Button 
                  className="w-full" 
                  onClick={handleConnect} 
                  disabled={isLoading || isAuthenticating}
                >
                  {isLoading || isAuthenticating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect Wallet
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground mt-2">
                  {isConnected && address ? 
                    `Connected to: ${address.substring(0, 6)}...${address.substring(address.length - 4)}` : 
                    "Click to connect your MetaMask wallet"}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="social" className="space-y-4 mt-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Use your existing social accounts to login securely</p>
                <Button className="w-full" variant="outline" onClick={handleConnect}>
                  <Github className="mr-2 h-4 w-4" />
                  Continue with GitHub
                </Button>
                <Button className="w-full" variant="outline" onClick={handleConnect}>
                  <Mail className="mr-2 h-4 w-4" />
                  Continue with Email
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="zkp" className="space-y-4 mt-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Authenticate privately using zero-knowledge proofs</p>
                <Button className="w-full" onClick={handleConnect}>
                  Authenticate with ZKP
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Zero-knowledge authentication allows you to prove your identity without revealing any sensitive
                  information
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-center p-6">
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-primary underline underline-offset-4 hover:text-primary/90">
              Create one
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

