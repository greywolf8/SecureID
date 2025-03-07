import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Key, Lock, Fingerprint, RefreshCw, Users, Wallet, Globe, FileCheck, Zap } from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="container py-12 space-y-12 md:py-24">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Discover the powerful features that make SecureID the leading decentralized authentication solution
        </p>
      </div>

      <Tabs defaultValue="core" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="core">Core Features</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Features</TabsTrigger>
          <TabsTrigger value="security">Security & Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="core" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Key className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Passwordless Login</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Authenticate using decentralized identity (DID) via blockchain without traditional passwords. Simply
                  connect your wallet or use social login for a seamless experience.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Self-Sovereign Identity</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Own and control your identity data, reducing reliance on centralized providers. Your identity exists
                  on the blockchain and you decide who can access your information.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Globe className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Multi-Chain Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Work with Ethereum L2s like Arbitrum, Optimism, or use Solana for lower fees. Your identity works
                  across multiple blockchains for maximum flexibility.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <FileCheck className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Verifiable Credentials</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Allow users to present credentials (e.g., KYC, certificates) without revealing private data.
                  Cryptographically verify claims without exposing sensitive information.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Anonymous Authentication</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Verify yourself without exposing sensitive info. Prove you meet certain criteria without revealing
                  your actual data or identity.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Zap className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Gasless Transactions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Use meta-transactions to sponsor gas fees. Users can interact with the blockchain without needing to
                  pay for gas, removing a major barrier to adoption.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Wallet className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Social Login Integration</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Enable Web2 logins using Web3Auth for onboarding Web2 users. Seamlessly transition traditional users
                  to decentralized authentication without friction.
                </CardDescription>
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
                <CardDescription className="text-base">
                  Enable privacy-preserving identity verification using advanced cryptography. Prove statements about
                  your data without revealing the data itself.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Fingerprint className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>NFT-Based ID Cards</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Assign users a unique NFT-based ID stored securely on-chain. Your digital identity card is a
                  non-fungible token that represents your verified identity.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <RefreshCw className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Recovery Mechanism</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Implement Social Recovery with multi-sig smart contracts to recover lost accounts. Designate trusted
                  guardians who can help you regain access to your identity.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Blockchain Security</CardTitle>
                <CardDescription>Enterprise-grade security for your identity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  SecureID leverages the security of blockchain technology to ensure your identity is protected by the
                  same cryptographic principles that secure billions in digital assets.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-primary mt-0.5" />
                    <span>Immutable identity records that cannot be tampered with</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-primary mt-0.5" />
                    <span>Cryptographic signatures for all authentication requests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-primary mt-0.5" />
                    <span>Decentralized architecture eliminates single points of failure</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy by Design</CardTitle>
                <CardDescription>Control your data and protect your privacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  SecureID is built with privacy as a core principle, giving you complete control over your personal
                  information and how it's shared.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Lock className="h-4 w-4 text-primary mt-0.5" />
                    <span>Zero-knowledge proofs allow verification without data exposure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="h-4 w-4 text-primary mt-0.5" />
                    <span>Selective disclosure lets you share only what's necessary</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="h-4 w-4 text-primary mt-0.5" />
                    <span>No centralized database of user information</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Security Audits & Compliance</CardTitle>
                <CardDescription>Rigorous testing and industry standards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  SecureID undergoes regular security audits and follows industry best practices to ensure the highest
                  level of security and compliance.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-md">
                    <h4 className="font-bold mb-2">Smart Contract Audits</h4>
                    <p className="text-sm text-muted-foreground">
                      All smart contracts are audited by leading security firms before deployment.
                    </p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <h4 className="font-bold mb-2">Penetration Testing</h4>
                    <p className="text-sm text-muted-foreground">
                      Regular penetration testing to identify and address potential vulnerabilities.
                    </p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <h4 className="font-bold mb-2">Compliance Standards</h4>
                    <p className="text-sm text-muted-foreground">
                      Designed to meet GDPR, CCPA, and other privacy regulations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

