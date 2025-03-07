"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/web3-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserCircle, Shield, FileCheck, RefreshCw, LogOut } from "lucide-react"
import { IdentityCard } from "@/components/identity-card"
import { CredentialsList } from "@/components/credentials-list"
import { RecoverySetup } from "@/components/recovery-setup"

export default function DashboardPage() {
  const { isConnected, address, disconnect, isLoading } = useWeb3()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Redirect to login if not connected
    if (!isLoading && !isConnected) {
      router.push("/auth/login")
    }
  }, [isConnected, isLoading, router])

  const handleLogout = async () => {
    await disconnect()
    router.push("/")
  }

  if (!isClient || isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p>Loading your secure identity...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Manage your decentralized identity and credentials</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Identity Status</CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground">Your decentralized identity is active and secure</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wallet Address</CardTitle>
              <UserCircle className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="font-mono text-sm truncate">{address || "0x1234...5678"}</div>
              <p className="text-xs text-muted-foreground">Connected to Polygon Network</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Credentials</CardTitle>
              <FileCheck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Active verifiable credentials in your wallet</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="identity" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="identity">Identity</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="recovery">Recovery</TabsTrigger>
          </TabsList>
          <TabsContent value="identity" className="space-y-4 mt-4">
            <IdentityCard address={address || "0x1234...5678"} />
          </TabsContent>
          <TabsContent value="credentials" className="space-y-4 mt-4">
            <CredentialsList />
          </TabsContent>
          <TabsContent value="recovery" className="space-y-4 mt-4">
            <RecoverySetup />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

