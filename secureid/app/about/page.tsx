import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Key, Lock, Fingerprint, RefreshCw, Users } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container py-12 space-y-12 md:py-24">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About SecureID</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          A blockchain-based decentralized authentication system that eliminates passwords and puts you in control of
          your digital identity.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              SecureID aims to revolutionize digital authentication by eliminating passwords and centralized identity
              providers. We believe that individuals should have complete control over their digital identities while
              maintaining the highest levels of security and privacy.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>The Problem We Solve</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Traditional authentication systems rely on passwords that can be forgotten, stolen, or hacked. Centralized
              identity providers create single points of failure and privacy concerns. SecureID addresses these issues
              with a decentralized approach that puts users in control.
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="technology" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="technology">Technology</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
        </TabsList>
        <TabsContent value="technology" className="space-y-4 mt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Blockchain-Based</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p>Built on Ethereum/Polygon for secure, transparent, and immutable identity management.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Key className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Self-Sovereign Identity</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p>Users own and control their identity data using decentralized identifiers (DIDs).</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Lock className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Zero-Knowledge Proofs</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p>Verify identity without revealing sensitive information using advanced cryptography.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="benefits" className="space-y-4 mt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Fingerprint className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Enhanced Security</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p>No passwords to hack or steal, and blockchain-level security for your identity.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>User Control</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p>You own your identity data and control who can access it and what they can see.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <RefreshCw className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Seamless Experience</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p>Quick and easy authentication across services without remembering passwords.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="roadmap" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Development Roadmap</CardTitle>
              <CardDescription>Our plan for evolving SecureID</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-bold">Phase 1: Core Infrastructure</h3>
                <p className="text-sm">Smart contract deployment, basic identity management, and wallet integration.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">Phase 2: Advanced Features</h3>
                <p className="text-sm">Zero-knowledge proofs, verifiable credentials, and multi-chain support.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">Phase 3: Enterprise Integration</h3>
                <p className="text-sm">API development, enterprise solutions, and integration with existing systems.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">Phase 4: Ecosystem Growth</h3>
                <p className="text-sm">Developer tools, partner network, and expanded use cases.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Ready to experience passwordless authentication?</h2>
        <div className="flex justify-center gap-4">
          <Link href="/auth/register">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/developers">
            <Button size="lg" variant="outline">
              Developer Docs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

