"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { CHAIN_NAMESPACES, SafeEventEmitterProvider, WALLET_ADAPTERS } from "@web3auth/base"
import { Web3Auth } from "@web3auth/modal"
import { OpenloginAdapter } from "@web3auth/openlogin-adapter"
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider"
import { ethers } from "ethers"

// Web3Auth client ID - replace with your own from Web3Auth dashboard
const CLIENT_ID = "YOUR_WEB3AUTH_CLIENT_ID" // You'll need to replace this

interface Web3ContextType {
  isConnected: boolean
  address: string | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  isLoading: boolean
  provider: SafeEventEmitterProvider | null
  web3Auth: Web3Auth | null
  signer: ethers.Signer | null
}

const Web3Context = createContext<Web3ContextType>({
  isConnected: false,
  address: null,
  connect: async () => {},
  disconnect: async () => {},
  isLoading: false,
  provider: null,
  web3Auth: null,
  signer: null,
})

export function Web3Provider({ children }: { children: ReactNode }) {
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null)
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0x89", // Polygon Mainnet
          rpcTarget: "https://polygon-rpc.com",
          displayName: "Polygon Mainnet",
          blockExplorer: "https://polygonscan.com/",
          ticker: "MATIC",
          tickerName: "Polygon",
        }

        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig },
        })

        const web3AuthInstance = new Web3Auth({
          clientId: CLIENT_ID,
          web3AuthNetwork: "cyan",
          chainConfig,
          uiConfig: {
            appName: "SecureID",
            mode: "dark",
            logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
            logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
            defaultLanguage: "en",
            theme: {
              primary: "#4F46E5",
            },
          },
        })

        const openloginAdapter = new OpenloginAdapter({
          privateKeyProvider,
          adapterSettings: {
            uxMode: "popup",
            loginConfig: {
              jwt: {
                verifier: "your-web3auth-verifier-id", // Replace with your Web3Auth Verifier ID
                typeOfLogin: "jwt",
              },
            },
          },
        })
        web3AuthInstance.configureAdapter(openloginAdapter)

        setWeb3Auth(web3AuthInstance)
        await web3AuthInstance.initModal({
          modalConfig: {
            [WALLET_ADAPTERS.OPENLOGIN]: {
              label: "openlogin",
              loginMethods: {
                google: {
                  name: "google",
                  showOnModal: true,
                },
                github: {
                  name: "github",
                  showOnModal: true,
                },
                email_passwordless: {
                  name: "email_passwordless",
                  showOnModal: true,
                },
              },
            },
          },
        })

        // Check if user is already logged in
        if (web3AuthInstance.provider) {
          setProvider(web3AuthInstance.provider)
          setIsConnected(true)
          const ethProvider = new ethers.providers.Web3Provider(web3AuthInstance.provider)
          const userSigner = ethProvider.getSigner()
          setSigner(userSigner)
          const userAddress = await userSigner.getAddress()
          setAddress(userAddress)
        }
      } catch (error) {
        console.error("Error initializing Web3Auth:", error)
      }
    }

    init()
  }, [])

  const connect = async () => {
    if (!web3Auth) {
      console.error("Web3Auth not initialized yet")
      return
    }
    setIsLoading(true)
    try {
      const web3authProvider = await web3Auth.connect()
      setProvider(web3authProvider)
      setIsConnected(true)

      if (web3authProvider) {
        const ethProvider = new ethers.providers.Web3Provider(web3authProvider)
        const userSigner = ethProvider.getSigner()
        setSigner(userSigner)
        const userAddress = await userSigner.getAddress()
        setAddress(userAddress)
      }
    } catch (error) {
      console.error("Error connecting:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = async () => {
    if (!web3Auth) {
      console.error("Web3Auth not initialized yet")
      return
    }
    setIsLoading(true)
    try {
      await web3Auth.logout()
      setProvider(null)
      setIsConnected(false)
      setAddress(null)
      setSigner(null)
    } catch (error) {
      console.error("Error disconnecting:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Web3Context.Provider
      value={{
        isConnected,
        address,
        connect,
        disconnect,
        isLoading,
        provider,
        web3Auth,
        signer,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export const useWeb3 = () => useContext(Web3Context)

