"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Wallet, AlertCircle, RefreshCw, LogOut } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useWeb3 } from '@/components/web3-provider'

export function MetamaskCheck() {
  const { disconnect } = useWeb3()
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [ethereumDetails, setEthereumDetails] = useState<{[key: string]: any} | null>(null)
  const [connectionMethod, setConnectionMethod] = useState<string | null>(null)

  // Check if MetaMask is installed when the component loads
  useEffect(() => {
    checkMetaMaskAvailability()
  }, [])

  // Function to check if MetaMask is available in the browser
  const checkMetaMaskAvailability = () => {
    try {
      if (typeof window === 'undefined') {
        console.log('Running in server context, cannot check for MetaMask')
        return
      }

      console.log('Checking for MetaMask availability...')
      const details: {[key: string]: any} = {}

      // Check if ethereum object exists
      if (window.ethereum) {
        details.exists = true
        details.isMetaMask = window.ethereum.isMetaMask || false
        details.selectedAddress = window.ethereum.selectedAddress || null
        details.chainId = window.ethereum.chainId || null
        details.networkVersion = window.ethereum.networkVersion || null
        details.hasEnable = typeof window.ethereum.enable === 'function'
        details.hasRequest = typeof window.ethereum.request === 'function'
        
        setIsMetaMaskInstalled(true)
        setEthereumDetails(details)
      } else {
        setIsMetaMaskInstalled(false)
        setEthereumDetails(null)
      }

      console.log('MetaMask availability details:', details)
    } catch (err) {
      console.error('Error checking MetaMask availability:', err)
      setError(`Error detecting MetaMask: ${err}`)
    }
  }

  // Method 1: Using eth_requestAccounts
  const connectWithRequestAccounts = async () => {
    setLoading(true)
    setError(null)
    setConnectionMethod('eth_requestAccounts')
    
    try {
      if (!window.ethereum || !window.ethereum.request) {
        throw new Error('MetaMask request method not available')
      }

      console.log('Connecting with eth_requestAccounts method...')
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      
      console.log('Accounts received:', accounts)
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0])
        return true
      }
      return false
    } catch (err: any) {
      console.error('eth_requestAccounts error:', err)
      setError(`eth_requestAccounts error: ${err.message || err}`)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Method 2: Using ethereum.enable (legacy)
  const connectWithEnable = async () => {
    setLoading(true)
    setError(null)
    setConnectionMethod('ethereum.enable')
    
    try {
      if (!window.ethereum || !window.ethereum.enable) {
        throw new Error('MetaMask enable method not available')
      }

      console.log('Connecting with ethereum.enable method...')
      const accounts = await window.ethereum.enable()
      
      console.log('Accounts received via enable:', accounts)
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0])
        return true
      }
      return false
    } catch (err: any) {
      console.error('ethereum.enable error:', err)
      setError(`ethereum.enable error: ${err.message || err}`)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Try all available methods
  const connectWallet = async () => {
    setError(null)
    setAccount(null)
    
    if (!window.ethereum) {
      setError('MetaMask not detected. Please install the MetaMask browser extension.')
      return
    }

    try {
      // Try primary method first
      const success = await connectWithRequestAccounts()
      if (success) return
      
      // If primary method fails, try the legacy method
      const legacySuccess = await connectWithEnable()
      if (legacySuccess) return
      
      // If both methods fail
      setError('All connection methods failed. Please make sure MetaMask is unlocked and try again.')
    } catch (err: any) {
      console.error('Wallet connection error:', err)
      setError(`Connection error: ${err.message || 'Unknown error'}`)
    }
  }

  // Handle wallet disconnection
  const handleDisconnect = async () => {
    setIsDisconnecting(true)
    setError(null)
    try {
      // Call the disconnect function from web3-provider which will show guidance toast
      await disconnect()
      setAccount(null)
      console.log('Wallet disconnected')
    } catch (err: any) {
      console.error('Disconnect error:', err)
      setError(`Disconnect error: ${err.message || 'Unknown error'}`)
    } finally {
      setIsDisconnecting(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto my-8">
      <CardHeader>
        <CardTitle>MetaMask Connection Test</CardTitle>
        <CardDescription>
          Troubleshoot your wallet connectivity issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* MetaMask Status Section */}
        <div className="space-y-2">
          <h3 className="font-semibold">Detection Status</h3>
          <div className="p-3 bg-gray-50 border rounded-md">
            <p className="font-medium flex items-center">
              {isMetaMaskInstalled === null ? (
                <span>⏳ Checking...</span>
              ) : isMetaMaskInstalled ? (
                <span className="text-green-600">✅ MetaMask detected</span>
              ) : (
                <span className="text-red-600">❌ MetaMask not detected</span>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-auto h-8 w-8" 
                onClick={checkMetaMaskAvailability}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </p>
            
            {ethereumDetails && (
              <div className="mt-2 text-xs text-gray-600">
                <p><span className="font-medium">Is MetaMask:</span> {ethereumDetails.isMetaMask ? 'Yes' : 'No'}</p>
                <p><span className="font-medium">Has Request Method:</span> {ethereumDetails.hasRequest ? 'Yes' : 'No'}</p>
                <p><span className="font-medium">Has Enable Method:</span> {ethereumDetails.hasEnable ? 'Yes' : 'No'}</p>
                {ethereumDetails.selectedAddress && (
                  <p><span className="font-medium">Selected Address:</span> {ethereumDetails.selectedAddress}</p>
                )}
                {ethereumDetails.chainId && (
                  <p><span className="font-medium">Chain ID:</span> {ethereumDetails.chainId}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Connection Results */}
        {connectionMethod && (
          <div className="text-sm text-gray-600">
            <p>Last connection attempt used: <span className="font-semibold">{connectionMethod}</span></p>
          </div>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">{error}</AlertDescription>
          </Alert>
        )}

        {account && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="font-medium">Connected Account:</p>
            <p className="text-sm break-all">{account}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={connectWithRequestAccounts} 
            className="w-full" 
            disabled={!isMetaMaskInstalled || loading}
            variant="outline"
          >
            {loading && connectionMethod === 'eth_requestAccounts' ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wallet className="mr-2 h-4 w-4" />
            )}
            Connect (Primary)
          </Button>
          
          <Button 
            onClick={connectWithEnable} 
            className="w-full" 
            disabled={!isMetaMaskInstalled || !ethereumDetails?.hasEnable || loading}
            variant="outline"
          >
            {loading && connectionMethod === 'ethereum.enable' ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wallet className="mr-2 h-4 w-4" />
            )}
            Connect (Legacy)
          </Button>
          
          <Button 
            onClick={connectWallet} 
            className="w-full col-span-2" 
            disabled={!isMetaMaskInstalled || loading}
          >
            {loading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wallet className="mr-2 h-4 w-4" />
            )}
            Try All Methods
          </Button>

          {account && (
            <Button
              onClick={handleDisconnect}
              className="w-full col-span-2 mt-4"
              variant="destructive"
              disabled={isDisconnecting}
            >
              {isDisconnecting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Disconnect Wallet
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
