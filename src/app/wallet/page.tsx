"use client"
import React, { useState, useCallback } from "react";
import {
  Wallet,
  LayoutDashboard,
  Settings,
  History,
  ChevronDown,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet } from "@/lib/web3";

const WalletApp = () => {
  const {
    connect,
    disconnect,
    account,
    chainId,
    error,
    loading,
    balance,
    purchaseTokens,
  } = useWallet();

  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [purchaseError, setPurchaseError] = useState("");

  const handleConnect = useCallback(async () => {
    try {
      await connect();
    } catch (err) {
      console.error("Connection error:", err);
    }
  }, [connect]);

  const handlePurchase = async () => {
    if (!purchaseAmount || !account) return;

    try {
      setPurchaseError("");
      const hash = await purchaseTokens(parseFloat(purchaseAmount));
      setTxHash(hash);
      setPurchaseAmount("");
    } catch (err) {
      setPurchaseError(err.message);
    }
  };

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const getNetworkName = (chainId) => {
    switch (chainId) {
      case 1:
        return "Ethereum Mainnet";
      case 3:
        return "Ropsten Testnet";
      case 4:
        return "Rinkeby Testnet";
      case 5:
        return "Goerli Testnet";
      case 42:
        return "Kovan Testnet";
      default:
        return "Unknown Network";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">DecryptoX Platform</h1>
          <div className="flex items-center gap-4">
            {account ? (
              <Alert className="bg-green-50 border-green-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <AlertTitle>{formatAddress(account)}</AlertTitle>
                    <AlertDescription>
                      Balance: {parseFloat(balance).toFixed(4)} DCRX
                    </AlertDescription>
                    <AlertDescription>
                      Network: {getNetworkName(chainId)}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ) : null}

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border shadow-sm hover:bg-gray-50">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={account ? disconnect : handleConnect}
                >
                  {account ? "Disconnect Wallet" : "Connect Wallet"}
                </DropdownMenuItem>
                <DropdownMenuItem>Security</DropdownMenuItem>
                <DropdownMenuItem>Preferences</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {error && (
          <Alert className="mb-4 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wallet Connection Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Wallet Connection
              </CardTitle>
              <CardDescription>
                Connect your wallet to start trading
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button
                onClick={account ? disconnect : handleConnect}
                disabled={loading}
                className={`w-full p-4 rounded-lg border ${
                  account
                    ? "bg-red-50 hover:bg-red-100"
                    : "bg-blue-50 hover:bg-blue-100"
                }`}
              >
                {loading
                  ? "Connecting..."
                  : account
                  ? "Disconnect Wallet"
                  : "Connect Wallet"}
              </button>

              {account && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm">Connected Address:</p>
                  <p className="font-mono">{account}</p>
                  <p className="text-sm mt-2">Network:</p>
                  <p>{getNetworkName(chainId)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Token Purchase Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />
                Purchase DCRX Tokens
              </CardTitle>
              <CardDescription>
                Enter the amount of DCRX tokens you want to purchase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Amount (DCRX)
                  </label>
                  <input
                    type="number"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                    disabled={!account || loading}
                    placeholder="Enter amount..."
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Estimated Cost
                  </label>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    {purchaseAmount
                      ? `${(parseFloat(purchaseAmount) * 0.1).toFixed(4)} ETH`
                      : "0.00 ETH"}
                  </div>
                </div>

                {purchaseError && (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription>{purchaseError}</AlertDescription>
                  </Alert>
                )}

                <button
                  onClick={handlePurchase}
                  disabled={!account || !purchaseAmount || loading}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
                >
                  {loading ? "Processing..." : "Purchase Tokens"}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Transaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              {txHash ? (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Purchase Transaction</h4>
                      <p className="text-sm text-gray-500 font-mono">
                        {txHash}
                      </p>
                    </div>
                    <a
                      href={`https://etherscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
                    >
                      View <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No recent transactions
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WalletApp;
