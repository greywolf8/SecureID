"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { UserPlus, Shield, AlertTriangle } from "lucide-react"

export function RecoverySetup() {
  const [guardians, setGuardians] = useState<string[]>(["0x1234...5678", "0x8765...4321"])
  const [newGuardian, setNewGuardian] = useState("")

  const addGuardian = () => {
    if (newGuardian && !guardians.includes(newGuardian)) {
      setGuardians([...guardians, newGuardian])
      setNewGuardian("")
    }
  }

  const removeGuardian = (index: number) => {
    setGuardians(guardians.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Social recovery allows you to regain access to your identity if you lose access to your wallet. Choose trusted
          guardians who can help you recover your account.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Social Recovery Setup</CardTitle>
          <CardDescription>Add trusted guardians who can help recover your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="threshold">Recovery Threshold</Label>
            <div className="flex items-center gap-2">
              <Input id="threshold" type="number" min="2" max="5" defaultValue="2" className="w-20" />
              <span className="text-sm text-muted-foreground">out of {guardians.length} guardians required</span>
            </div>
            <p className="text-xs text-muted-foreground">
              This is the minimum number of guardians needed to recover your account
            </p>
          </div>

          <div className="space-y-2">
            <Label>Current Guardians</Label>
            <div className="space-y-2">
              {guardians.map((guardian, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="font-mono text-sm">{guardian}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGuardian(index)}
                    className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-guardian">Add Guardian</Label>
            <div className="flex gap-2">
              <Input
                id="new-guardian"
                placeholder="Enter wallet address"
                value={newGuardian}
                onChange={(e) => setNewGuardian(e.target.value)}
                className="flex-1"
              />
              <Button onClick={addGuardian}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            <Shield className="mr-2 h-4 w-4" />
            Save Recovery Setup
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Initiate Recovery</CardTitle>
          <CardDescription>If you've lost access to your wallet, start the recovery process</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            If you've lost access to your wallet, you can initiate the recovery process. Your guardians will need to
            approve the recovery request.
          </p>
          <Button variant="outline" className="w-full">
            Start Recovery Process
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

