import { AztecWalletSdk, obsidion } from '@nemi-fi/wallet-sdk';

// This is the singleton instance of the Aztec Wallet SDK.
// It is configured once and can be imported and used throughout the application.

// In a real application, the Aztec Node URL would likely come from an environment variable.
const AZTEC_NODE_URL = process.env.NEXT_PUBLIC_AZTEC_NODE_URL || 'http://localhost:8080';

export const aztecSdk = new AztecWalletSdk({
  aztecNode: AZTEC_NODE_URL,
  connectors: [obsidion(), ],
}); 