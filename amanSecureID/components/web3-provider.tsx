"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"
import { normalizeChainId } from "@/lib/contract-config"

declare global {
  interface Window {
    ethereum?: any
    web3?: any
  }
}

interface User {
  username?: string
  email?: string
  address: string
}

interface Web3ContextType {
  isConnected: boolean
  address: string | null
  connect: (userData?: Partial<User>) => Promise<string>
  disconnect: () => Promise<void>
  isLoading: boolean
  provider: any
  chainId: string | null
  saveUserData: (userData: User) => void
  getUserByAddress: (address: string) => User | null
}

const Web3Context = createContext<Web3ContextType>({
  isConnected: false,
  address: null,
  connect: async () => "",
  disconnect: async () => {},
  isLoading: false,
  provider: null,
  chainId: null,
  saveUserData: () => {},
  getUserByAddress: () => null,
})

// Helper function to manage user data in localStorage
const STORAGE_KEY = "secureId_users"

const saveUserToStorage = (userData: User) => {
  try {
    const existingUsers = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as User[]
    
    // Check if user with this address already exists
    const userIndex = existingUsers.findIndex(user => user.address === userData.address)
    
    if (userIndex >= 0) {
      // Update existing user
      existingUsers[userIndex] = { ...existingUsers[userIndex], ...userData }
    } else {
      // Add new user
      existingUsers.push(userData)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingUsers))
  } catch (error) {
    console.error("Error saving user data:", error)
  }
}

const getUserFromStorage = (address: string): User | null => {
  try {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as User[]
    return users.find(user => user.address === address) || null
  } catch (error) {
    console.error("Error retrieving user data:", error)
    return null
  }
}

export function Web3Provider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentChainId, setCurrentChainId] = useState<string | null>(null)

  // Check if already connected on page load and setup event listeners
  useEffect(() => {
    let isUnmounted = false;
    
    const setupEthereumListeners = () => {
      if (typeof window === 'undefined' || !window.ethereum) return;
      
      // Setup proper event listeners with specific handlers
      const handleAccountsChanged = (accounts: string[]) => {
        console.log('MetaMask accounts changed:', accounts);
        if (accounts.length === 0) {
          // User disconnected their account or locked MetaMask
          setIsConnected(false);
          setAddress(null);
          console.log('MetaMask disconnected');
        } else {
          // Accounts available - user is connected
          setIsConnected(true);
          setAddress(accounts[0]);
          console.log('MetaMask connected to account:', accounts[0]);
        }
      };
      
      const handleChainChanged = (chainId: string) => {
        const normalized = normalizeChainId(chainId);
        console.log('MetaMask network changed (hex):', chainId);
        console.log('MetaMask network changed (decimal):', normalized);
        // Update chainId state instead of forcing reload
        setCurrentChainId(chainId);
      };
      
      const handleConnect = (connectInfo: { chainId: string }) => {
        console.log('MetaMask connected event:', connectInfo);
      };
      
      const handleDisconnect = (error: { code: number; message: string }) => {
        console.log('MetaMask disconnect event:', error);
        setIsConnected(false);
        setAddress(null);
      };
      
      // Register event listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('connect', handleConnect);
      window.ethereum.on('disconnect', handleDisconnect);
      
      // Return cleanup function
      return () => {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
          window.ethereum.removeListener('connect', handleConnect);
          window.ethereum.removeListener('disconnect', handleDisconnect);
        }
      };
    };
    
    // Check for existing connection
    const checkConnection = async () => {
      if (typeof window === 'undefined' || !window.ethereum) {
        console.log('Window or ethereum object not available');
        return;
      }
      
      try {
        console.log('Checking for existing connection...');
        // Check if we already have access (user previously connected)
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        
        if (!isUnmounted) {
          if (accounts && accounts.length > 0) {
            console.log('Found existing connected account:', accounts[0]);
            setIsConnected(true);
            setAddress(accounts[0]);
          } else {
            console.log('No existing connection found');
          }
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    };
    
    // Run initial connection check
    checkConnection();
    
    // Setup event listeners and store cleanup function
    const cleanupListeners = setupEthereumListeners();
    
    // Return combined cleanup
    return () => {
      isUnmounted = true;
      if (cleanupListeners) cleanupListeners();
    };
  }, [])

  // Helper function to delay execution
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Function to retry an async operation multiple times
  const retryOperation = async (operation: () => Promise<any>, retries = 3, delay = 500) => {
    let lastError;
    
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        console.log(`Attempt ${attempt + 1}/${retries}...`);
        const result = await operation();
        console.log(`Attempt ${attempt + 1} succeeded!`);
        return result;
      } catch (err) {
        console.warn(`Attempt ${attempt + 1} failed:`, err);
        lastError = err;
        
        // Wait before next attempt
        if (attempt < retries - 1) {
          console.log(`Waiting ${delay}ms before next attempt...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  };
  
  // Function to safely check if MetaMask is available
  const isMetaMaskAvailable = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    // Check if ethereum object exists
    const ethereum = window.ethereum;
    if (!ethereum) return false;
    
    // Check if it's actually MetaMask
    try {
      return Boolean(ethereum.isMetaMask);
    } catch (err) {
      console.error("Error checking if MetaMask is available:", err);
      return false;
    }
  };

  // Function to attempt to connect with multiple methods
  const tryConnectWithFallbacks = async (): Promise<string[]> => {
    console.log("Starting MetaMask connection process...");
    
    // First, check if we're running in a browser
    if (typeof window === 'undefined') {
      throw new Error("Cannot connect to MetaMask in server-side context");
    }
    
    // Get ethereum object safely
    const ethereum = window.ethereum;
    
    // Verify ethereum object existence
    if (!ethereum) {
      console.error("No window.ethereum object found!");
      const message = "MetaMask not detected. Please install MetaMask extension and refresh the page.";
      throw new Error(message);
    }
    
    // Safer logging of ethereum object properties
    try {
      console.log("Ethereum object found with properties:", {
        isMetaMask: Boolean(ethereum.isMetaMask),
        hasEnable: typeof ethereum.enable === 'function',
        hasRequest: typeof ethereum.request === 'function',
        hasSelectedAddress: Boolean(ethereum.selectedAddress),
        hasChainId: Boolean(ethereum.chainId),
        hasNetworkVersion: Boolean(ethereum.networkVersion)
      });
    } catch (err) {
      console.warn("Could not log all ethereum properties", err);
    }
    
    // Primary connection method with error handling
    try {
      console.log("Attempting eth_requestAccounts...");
      
      // First, check if MetaMask is initialized and ready
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Define a safer request method that wraps ethereum.request in a try-catch
      const safeRequest = async () => {
        try {
          if (!ethereum) {
            throw new Error("Ethereum provider not available");
          }
          
          if (typeof ethereum.request !== 'function') {
            throw new Error("Ethereum provider missing request method");
          }
          
          // Create a separate function to make the actual request
          // This helps isolate the potential null pointer issue
          const makeRequest = async () => {
            try {
              // Create a proper request object to avoid type errors
              const requestArgs = { method: 'eth_requestAccounts' };
              return await ethereum.request(requestArgs);
            } catch (innerErr: any) {
              console.error("Error in ethereum.request call:", innerErr);
              throw innerErr;
            }
          };
          
          // Execute the request with proper error boundaries
          const result = await makeRequest();
          
          // Validate the result
          if (!Array.isArray(result)) {
            throw new Error("Expected array of accounts, got: " + typeof result);
          }
          
          if (result.length === 0) {
            throw new Error("MetaMask returned empty accounts array");
          }
          
          return result;
        } catch (err: any) {
          // Handle specific MetaMask errors
          if (err?.code === 4001) {
            throw new Error("MetaMask connection rejected by user");
          }
          throw err;
        }
      };
      
      // Attempt the request with retries, but fewer retries and longer delay
      const accounts = await retryOperation(safeRequest, 1, 800);
      
      console.log("Successfully connected with eth_requestAccounts:", accounts);
      return accounts;
    } catch (error) {
      console.error("Primary connection method failed:", error);
      
      // If user rejected, don't try other methods
      if (error && typeof error === 'object' && 'message' in error && 
          typeof (error as any).message === 'string' && 
          (error as any).message.includes("rejected")) {
        throw error;
      }
    }
    
    // No fallbacks worked
    throw new Error("Could not connect to MetaMask. Please ensure MetaMask is installed, unlocked, and refresh the page.");
  };

  // Connect to MetaMask and return the address
  const connect = async (userData?: Partial<User>): Promise<string> => {
    setIsLoading(true);
    console.log("Attempting to connect to MetaMask...");
    
    try {
      // Add a small delay to ensure everything is initialized properly
      await delay(100);
      
      // First check if we're in a browser
      if (typeof window === 'undefined') {
        throw new Error("Cannot connect to MetaMask in server environment");
      }
      
      // Check for MetaMask in a safer way
      // This is a very careful check to avoid null reference errors
      const hasMetaMask = Boolean(
        window && 
        window.ethereum && 
        (window.ethereum.isMetaMask !== undefined)
      );
      
      // Make sure MetaMask is installed
      if (!hasMetaMask) {
        throw new Error("MetaMask not detected. Please install the MetaMask extension.");
      }
      
      // Make sure we don't try to access properties on a null object
      if (!window.ethereum) {
        throw new Error("MetaMask provider not available");
      }
      
      // Short delay to let MetaMask initialize completely
      await delay(200);
      
      // Try to connect using safer methods
      const accounts = await tryConnectWithFallbacks();
      
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts returned from MetaMask");
      }
      
      const currentAddress = accounts[0];
      console.log("Successfully connected to address:", currentAddress);
      
      // Update state
      setIsConnected(true);
      setAddress(currentAddress);
      
      // Get and set current chain ID
      if (window.ethereum.chainId) {
        setCurrentChainId(window.ethereum.chainId);
        const normalized = normalizeChainId(window.ethereum.chainId);
        console.log("Current chain ID (hex):", window.ethereum.chainId);
        console.log("Current chain ID (decimal):", normalized);
      }
      
      // Save user data if provided
      if (userData) {
        console.log("Saving user data for address:", currentAddress);
        saveUserToStorage({
          ...userData,
          address: currentAddress,
        });
      }
      
      return currentAddress;
    } catch (error: any) {
      console.error("Error connecting to MetaMask:", error);
      
      // Sanitize error message for better user experience
      const errorMessage = error?.message || "Unknown error connecting to wallet";
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const disconnect = async () => {
    setIsLoading(true)
    try {
      // Clear our local state
      setIsConnected(false)
      setAddress(null)
      
      // First check if MetaMask is available
      if (typeof window !== 'undefined' && window.ethereum) {
        console.log("Opening MetaMask extension for disconnection...")
        
        // Open MetaMask extension directly - this will take user to their wallet interface
        // where they can disconnect
        if (window.ethereum.isMetaMask) {
          // Show toast notification to guide the user
          toast.info(
            "Please follow these steps to disconnect your wallet:", 
            {
              description: "1. Click the MetaMask extension icon\n2. Click on your account icon\n3. Select 'Connected sites'\n4. Find this site and click the three dots\n5. Select 'Disconnect'",
              duration: 10000,
              action: {
                label: "Open MetaMask",
                onClick: () => {
                  // Open MetaMask extension using the deep link (settings page)
                  window.open('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#settings/connections', '_blank')
                }
              }
            }
          )
        }
      }
    } catch (error) {
      console.error("Error disconnecting:", error)
      toast.error("Error disconnecting your wallet")
    } finally {
      setIsLoading(false)
    }
  }

  // Save user data to localStorage
  const saveUserData = (userData: User) => {
    saveUserToStorage(userData)
  }

  // Get user by address
  const getUserByAddress = (address: string): User | null => {
    return getUserFromStorage(address)
  }

  // Safely get the provider
  const getProvider = () => {
    if (typeof window === 'undefined') return null;
    return window.ethereum || null;
  };
  
  return (
    <Web3Context.Provider
      value={{
        isConnected,
        address,
        connect,
        disconnect,
        isLoading,
        provider: getProvider(),
        chainId: currentChainId,
        saveUserData,
        getUserByAddress,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export const useWeb3 = () => useContext(Web3Context)

