import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Key, UserCircle, Lock, Fingerprint } from "lucide-react"
import { HeroSection } from "@/components/hero-section"
import { FeatureCard } from "@/components/feature-card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      <section className="container py-12 space-y-6 md:py-24">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            SecureID provides a comprehensive solution for decentralized authentication
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Key className="h-10 w-10 text-primary" />}
            title="Passwordless Login"
            description="Authenticate using decentralized identity via blockchain without traditional passwords"
          />
          <FeatureCard
            icon={<UserCircle className="h-10 w-10 text-primary" />}
            title="Self-Sovereign Identity"
            description="Own and control your identity data, reducing reliance on centralized providers"
          />
          <FeatureCard
            icon={<Shield className="h-10 w-10 text-primary" />}
            title="Verifiable Credentials"
            description="Present credentials without revealing private data using blockchain verification"
          />
          <FeatureCard
            icon={<Lock className="h-10 w-10 text-primary" />}
            title="Anonymous Authentication"
            description="Verify yourself without exposing sensitive information using zero-knowledge proofs"
          />
          <FeatureCard
            icon={<Fingerprint className="h-10 w-10 text-primary" />}
            title="NFT-Based ID Cards"
            description="Receive a unique NFT-based ID stored securely on-chain for authentication"
          />
          <FeatureCard
            icon={<Shield className="h-10 w-10 text-primary" />}
            title="Recovery Mechanism"
            description="Recover lost accounts using social recovery with multi-sig smart contracts"
          />
        </div>
      </section>

      <section className="bg-muted py-12 md:py-24">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Get Started</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Join the future of decentralized authentication today
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Create Your Identity</CardTitle>
                <CardDescription>Set up your decentralized identity in minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Generate your Self-Sovereign Identity and take control of your digital presence with blockchain
                  security.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/auth/register" className="w-full">
                  <Button className="w-full">Create Identity</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Login with SecureID</CardTitle>
                <CardDescription>Access your account securely without passwords</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Use your blockchain wallet or social accounts to authenticate securely with zero-knowledge proofs.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/auth/login" className="w-full">
                  <Button className="w-full">Login</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Developer API</CardTitle>
                <CardDescription>Integrate SecureID into your applications</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Our comprehensive API allows developers to implement decentralized authentication in any application.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/developers" className="w-full">
                  <Button className="w-full" variant="outline">
                    View Documentation
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

