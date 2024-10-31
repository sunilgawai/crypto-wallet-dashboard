// utils/config.js
export const validateEnvVariables = () => {
  const required = [
    "NEXT_PUBLIC_INFURA_ID",
    "NEXT_PUBLIC_CONTRACT_ADDRESS",
    "NEXT_PUBLIC_CHAIN_ID",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        "Please check your .env.local file"
    );
  }
};

// pages/_app.js
// import { validateEnvVariables } from "../utils/config";

// if (process.env.NODE_ENV !== "production") {
//   validateEnvVariables();
// }

// Check if contract address exists before using
// if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
//     console.error("Contract address not set in environment variables");
//     // Handle the error appropriately
// }

// Add network checking
// const checkNetwork = async (provider) => {
//     const network = await provider.getNetwork();
//     const expectedChainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID);
    
//     if (network.chainId !== expectedChainId) {
//         throw new Error(`Please connect to ${expectedChainId === 1 ? 'Mainnet' : 'Testnet'}`);
//     }
// };

// Add fallback RPC providers
// const FALLBACK_PROVIDERS = {
//     1: ['https://eth-mainnet.g.alchemy.com/v2/your-key'],
//     5: ['https://eth-goerli.g.alchemy.com/v2/your-key']
// };