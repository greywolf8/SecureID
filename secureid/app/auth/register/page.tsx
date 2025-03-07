"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useWeb3 } from "@/components/web3-provider"
import { Wallet, Github, Mail, Loader2 } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RegisterPage() {
  const { connect, isConnected, isLoading } = useWeb3()
  const [isRegistering, setIsRegistering] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const router = useRouter()

  const handleConnect = async () => {
    setIsRegistering(true)
    try {
      await connect()
      // After connecting wallet, we would typically register the user
      // For now, we'll just redirect to the dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Registration error:", error)
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

