"use client"

import { MetamaskCheck } from "@/components/metamask-check"

export default function WalletTestPage() {
  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold mb-8 text-center">Wallet Connection Test</h1>
      <MetamaskCheck />
    </div>
  )
}
