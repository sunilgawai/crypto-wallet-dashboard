/* eslint-disable @typescript-eslint/no-explicit-any */
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";

// Add contract address fallback
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x123..."; // Add your deployed contract address here


// ABI for your token contract
const TOKEN_ABI = [
  // Transfer event
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  // Balances
  "function balanceOf(address owner) view returns (uint256)",
  // Approve
  "function approve(address spender, uint256 value) returns (bool)",
  // Transfer
  "function transfer(address to, uint256 value) returns (bool)",
];

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    },
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: "DecryptoX",
      infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    },
  },
};

export const web3Modal =
  typeof window !== "undefined"
    ? new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
        providerOptions,
      })
    : null;

export const getContract = (provider: any) => {
      if (!CONTRACT_ADDRESS) {
        throw new Error("Contract address not configured");
      }
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS!,
    TOKEN_ABI,
    provider
  );
  return contract;
};

export const useWallet = () => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState("0");

  const connect = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const instance = await web3Modal?.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      const network = await provider.getNetwork();

      // Get token balance
      const contract = getContract(provider);
      const balance = await contract.balanceOf(account);

      setProvider(provider);
      setAccount(account);
      setChainId(network.chainId);
      setBalance(ethers.utils.formatEther(balance));

      // Setup listeners
      instance.on("accountsChanged", handleAccountsChanged);
      instance.on("chainChanged", handleChainChanged);
      instance.on("disconnect", handleDisconnect);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (web3Modal) {
      web3Modal.clearCachedProvider();
      setProvider(null);
      setAccount(null);
      setChainId(null);
      setBalance("0");
    }
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      updateBalance(accounts[0]);
    } else {
      disconnect();
    }
  };

  const handleChainChanged = (chainId) => {
    setChainId(parseInt(chainId, 16));
    connect(); // Reconnect on chain change
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const updateBalance = async (address) => {
    if (provider) {
      const contract = getContract(provider);
      const balance = await contract.balanceOf(address);
      setBalance(ethers.utils.formatEther(balance));
    }
  };

  // Purchase tokens function
  const purchaseTokens = async (amount) => {
    try {
      setLoading(true);
      setError(null);

      if (!provider || !account) {
        throw new Error("Wallet not connected");
      }

      const signer = provider.getSigner();
      const contract = getContract(signer);

      // Calculate price (implement your pricing logic here)
      const price = ethers.utils.parseEther((amount * 0.1).toString()); // Example price calculation

      // Create and send transaction
      const tx = await contract.purchase(
        ethers.utils.parseEther(amount.toString()),
        {
          value: price,
        }
      );

      // Wait for transaction confirmation
      await tx.wait();

      // Update balance
      await updateBalance(account);

      return tx.hash;
    } catch (err) {
      console.error(err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (web3Modal && web3Modal.cachedProvider) {
      connect();
    }
  }, [connect]);

  return {
    connect,
    disconnect,
    account,
    chainId,
    provider,
    error,
    loading,
    balance,
    purchaseTokens,
  };
};
