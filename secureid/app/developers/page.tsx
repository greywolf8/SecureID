"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileCode, BookOpen, Github } from "lucide-react"

export default function DevelopersPage() {
  return (
    <div className="container py-12 space-y-12 md:py-24">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Developer Resources</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Integrate SecureID's decentralized authentication into your applications
        </p>
      </div>

      <Tabs defaultValue="quickstart" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>
        <TabsContent value="quickstart" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started with SecureID</CardTitle>
              <CardDescription>Follow these steps to integrate SecureID into your application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-bold flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                    1
                  </span>
                  Install the SDK
                </h3>
                <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto">
                  npm install @secureid/sdk
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                    2
                  </span>
                  Initialize the Client
                </h3>
                <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto">
                  {`import { SecureIDClient } from '@secureid/sdk';

const client = new SecureIDClient({
  apiKey: 'YOUR_API_KEY',
  network: 'polygon',
});`}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                    3
                  </span>
                  Implement Authentication
                </h3>
                <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto">
                  {`// Request authentication
const authRequest = await client.createAuthRequest({
  callbackUrl: 'https://your-app.com/callback',
  requiredCredentials: ['email'],
});

// Handle callback
app.get('/callback', async (req, res) => {
  const { token } = req.query;
  const verification = await client.verifyAuthResponse(token);
  
  if (verification.isValid) {
    // User is authenticated
    const userDID = verification.did;
    // Create session, etc.
  }
});`}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <BookOpen className="mr-2 h-4 w-4" />
                View Full Documentation
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API Reference</CardTitle>
              <CardDescription>Comprehensive documentation of the SecureID API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold">Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Endpoints for user authentication and identity verification
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-md">
                      <div className="font-bold">POST /api/auth/request</div>
                      <div className="text-sm text-muted-foreground">Create authentication request</div>
                    </div>
                    <div className="p-4 border rounded-md">
                      <div className="font-bold">POST /api/auth/verify</div>
                      <div className="text-sm text-muted-foreground">Verify authentication response</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold">Identity Management</h3>
                  <p className="text-sm text-muted-foreground">Endpoints for managing decentralized identities</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-md">
                      <div className="font-bold">GET /api/identity/:did</div>
                      <div className="text-sm text-muted-foreground">Retrieve identity information</div>
                    </div>
                    <div className="p-4 border rounded-md">
                      <div className="font-bold">POST /api/identity/update</div>
                      <div className="text-sm text-muted-foreground">Update identity attributes</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold">Verifiable Credentials</h3>
                  <p className="text-sm text-muted-foreground">Endpoints for issuing and verifying credentials</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-md">
                      <div className="font-bold">POST /api/credentials/issue</div>
                      <div className="text-sm text-muted-foreground">Issue a new verifiable credential</div>
                    </div>
                    <div className="p-4 border rounded-md">
                      <div className="font-bold">POST /api/credentials/verify</div>
                      <div className="text-sm text-muted-foreground">Verify a credential's authenticity</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <FileCode className="mr-2 h-4 w-4" />
                Download OpenAPI Specification
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Examples</CardTitle>
              <CardDescription>Sample code for common use cases</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold">Web Application Authentication</h3>
                  <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto">
                    {`// React example with SecureID SDK
import { useSecureID } from '@secureid/react';

function LoginButton() {
  const { login, isAuthenticated, user } = useSecureID();
  
  if (isAuthenticated) {
    return <div>Welcome, {user.did}</div>;
  }
  
  return (
    <button onClick={login}>
      Login with SecureID
    </button>
  );
}`}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold">Verifiable Credential Verification</h3>
                  <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto">
                    {`// Node.js example for verifying credentials
const { SecureIDClient } = require('@secureid/sdk');

async function verifyCredential(credentialJwt) {
  const client = new SecureIDClient({
    apiKey: process.env.SECUREID_API_KEY,
    network: 'polygon',
  });
  
  try {
    const result = await client.verifyCredential(credentialJwt);
    if (result.isValid) {
      // Credential is valid
      return {
        valid: true,
        subject: result.subject,
        issuer: result.issuer,
        claims: result.claims
      };
    }
    return { valid: false };
  } catch (error) {
    console.error('Verification error:', error);
    return { valid: false, error: error.message };
  }
}`}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Github className="mr-2 h-4 w-4" />
                View More Examples on GitHub
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>SDK Documentation</CardTitle>
            <CardDescription>Comprehensive guides for our client libraries</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Detailed documentation for JavaScript, Python, and mobile SDKs with code examples and best practices.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View SDK Docs
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Smart Contract Reference</CardTitle>
            <CardDescription>Technical details of our blockchain contracts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Explore the Solidity smart contracts that power SecureID, including identity management and credential
              verification.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Contracts
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Developer Community</CardTitle>
            <CardDescription>Join our community of developers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connect with other developers, get help with integration, and contribute to the SecureID ecosystem.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Join Community
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

