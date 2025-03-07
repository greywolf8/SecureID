"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useWeb3 } from "@/components/web3-provider"
import { Wallet, Github, Mail, Loader2 } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const { connect, isConnected, isLoading } = useWeb3()
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const router = useRouter()

  const handleConnect = async () => {
    setIsAuthenticating(true)
    try {
      await connect()
      // Redirect to dashboard after successful login
      router.push("/dashboard")
    } catch (error) {
      console.error("Authentication error:", error)
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
                <Button className="w-full" onClick={handleConnect} disabled={isLoading || isAuthenticating}>
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

