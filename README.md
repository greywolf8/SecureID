# SecureID: Blockchain-Based Identity Management System

A decentralized identity platform built with Next.js, Web3Auth, and Ethereum that enables secure authentication, verifiable credentials, and identity management on the blockchain.

## Table of Contents
1. Features
2. Technology Stack
3. Installation
4. Configuration
5. Usage
6. Smart Contracts
7. Architecture
8. Troubleshooting
9. Contributing
10. License

## Features
- **Blockchain Authentication:** Secure wallet-based login with Web3Auth integration.
- **Decentralized Identity:** Self-sovereign identity management with DIDs (Decentralized Identifiers).
- **Verifiable Credentials:** Issue, store, and verify blockchain-based credentials.
- **Social Recovery:** Guardian-based account recovery system.
- **Zero-Knowledge Proofs:** Privacy-preserving identity verification.
- **Multi-Platform Support:** Works across desktop and mobile devices.

## Technology Stack
- **Frontend:** Next.js, React, TypeScript, TailwindCSS.
- **Blockchain Integration:** Web3Auth, ethers.js.
- **UI Components:** Radix UI, shadcn/ui.
- **Smart Contracts:** Solidity (Ethereum/Polygon).

## Installation
### Prerequisites
- Node.js 18.0.0 or later.
- npm 8.0.0 or later.
- A Web3Auth account (for CLIENT_ID).

### Setup Steps
1. Clone or extract the project files:
   ```sh
   git clone https://github.com/greywolf8/secureID.git
   cd secureid
   ```
2. Install dependencies:
   ```sh
   npm install --legacy-peer-deps
   ```
   > ⚠️ Note: The `--legacy-peer-deps` flag is important to resolve dependency conflicts with the Web3Auth libraries.
3. ## Environment Variables Setup

  a. Find the `.env.local.example` file in the project root directory.
  b. Copy it to create a new file named `.env.local`:
     ```bash
     cp .env.local.example .env.local
     ```
  c. Open `.env.local` and replace the placeholder values with your actual credentials:
     - Get a Web3Auth CLIENT_ID from [Web3Auth Developer Dashboard](https://dashboard.web3auth.io/)
     - Replace smart contract addresses with your deployed contract addresses
     - Adjust network configuration as needed

  d. Save the file. The application will automatically use these environment variables when you start it.

  > ⚠️ IMPORTANT: Never commit your actual `.env.local` file to version control or share it. It contains sensitive credentials.
4. Run the development server:
   ```sh
   npm run dev
   ```
5. Access the application:
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration
### Web3Auth Setup
1. Create an account at [Web3Auth Developer Dashboard](https://web3auth.io/).
2. Create a new project and obtain your `CLIENT_ID`.
3. Configure allowed domains and callback URLs.
4. Replace the `CLIENT_ID` in the `.env.local` file or directly in `components/web3-provider.tsx`.

### Blockchain Network Configuration
- The default configuration uses **Polygon Mainnet**. To change the network:
  - Open `components/web3-provider.tsx`.
  - Modify the `chainConfig` object accordingly.

## Usage
### Authentication
1. Navigate to the login page (`/auth/login`).
2. Choose your preferred authentication method:
   - Wallet login (MetaMask, etc.).
   - Social login (Google, GitHub).
   - Email passwordless login.
3. Complete the authentication flow.

### Identity Management
- View your decentralized identity card.
- Export your identity credentials.
- Share your identity via QR code.
- Generate zero-knowledge proofs.

### Recovery Setup
1. Add trusted guardians (minimum **2** recommended).
2. Set your recovery threshold.
3. Save your recovery configuration.
4. In case of wallet loss, use the recovery process to regain access.

## Smart Contracts
This project includes three main smart contracts:
- **Identity.sol:** Manages decentralized identities.
- **VerifiableCredentials.sol:** Handles credential issuance and verification.
- **ZKProofs.sol:** Enables zero-knowledge proof generation and verification.

### Deployment
1. Use Hardhat, Truffle, or Remix IDE.
2. Deploy to your preferred network (Ethereum, Polygon, etc.).
3. Update the contract addresses in your `.env.local` file.

## Architecture
- **Frontend:** Client-side components with React.
- **Backend:** Server-side rendering with Next.js.
- **Blockchain:** Web3Auth for authentication, ethers.js for contract interaction.

## Troubleshooting
### Common Issues
#### Dependencies Installation Fails
   ```sh
   npm install --legacy-peer-deps
   ```
#### Web3Auth Connection Issues
- Ensure your `CLIENT_ID` is correct.
- Check if your domain is whitelisted in Web3Auth dashboard.
- Verify browser console for specific errors.

#### Smart Contract Interaction Fails
- Confirm you're connected to the correct network.
- Verify contract addresses in your environment variables.
- Check if you have sufficient gas for transactions.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
For questions or support, please reach out to [your contact information].

