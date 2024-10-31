/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from 'react';
import { Wallet, LayoutDashboard, Settings, History, ChevronDown, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

const WalletApp = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [balance, setBalance] = useState('0.00');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const walletOptions = [
    { name: 'MetaMask', type: 'Web3' },
    { name: 'WalletConnect', type: 'Multi-Chain' },
    { name: 'Ledger', type: 'Hardware' },
    { name: 'Trezor', type: 'Hardware' },
  ];

  const mockConnect = async (walletName:any) => {
    setLoading(true);
    // Simulating connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsConnected(true);
    setSelectedWallet(walletName);
    setBalance('1000.00');
    setLoading(false);
  };

  const handlePurchase = async () => {
    if (!purchaseAmount || !isConnected) return;
    setLoading(true);
    // Simulating purchase delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setPurchaseAmount('');
    // Show success message
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">DecryptoX Platform</h1>
          <div className="flex items-center gap-4">
            {isConnected ? (
              <Alert className="bg-green-50 border-green-200">
                <AlertCircle className="h-4 w-4 text-green-500" />
                <AlertTitle>Connected to {selectedWallet}</AlertTitle>
                <AlertDescription>Balance: {balance} DCRX</AlertDescription>
              </Alert>
            ) : null}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border shadow-sm hover:bg-gray-50">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Security</DropdownMenuItem>
                <DropdownMenuItem>Preferences</DropdownMenuItem>
                <Link href="/wallet">
                <DropdownMenuItem>
                  Wallet</DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wallet Connection Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Connect Wallet
              </CardTitle>
              <CardDescription>
                Choose your preferred wallet to connect and start trading
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {walletOptions.map((wallet) => (
                  <button
                    key={wallet.name}
                    onClick={() => mockConnect(wallet.name)}
                    disabled={
                      loading || (isConnected && selectedWallet === wallet.name)
                    }
                    className={`w-full p-4 rounded-lg border ${
                      isConnected && selectedWallet === wallet.name
                        ? "bg-green-50 border-green-200"
                        : "bg-white hover:bg-gray-50"
                    } flex items-center justify-between`}
                  >
                    <div>
                      <h3 className="font-medium">{wallet.name}</h3>
                      <p className="text-sm text-gray-500">{wallet.type}</p>
                    </div>
                    {isConnected && selectedWallet === wallet.name && (
                      <span className="text-green-500 text-sm">Connected</span>
                    )}
                  </button>
                ))}
              </div>
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
                    disabled={!isConnected}
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
                      ? `${(parseFloat(purchaseAmount) * 0.1).toFixed(2)} ETH`
                      : "0.00 ETH"}
                  </div>
                </div>
                <button
                  onClick={handlePurchase}
                  disabled={!isConnected || !purchaseAmount || loading}
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
                Transaction History
              </CardTitle>
              <CardDescription>
                View your recent transactions and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isConnected ? (
                  <div className="border rounded-lg divide-y">
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Purchase DCRX</h4>
                          <p className="text-sm text-gray-500">
                            Today, 12:30 PM
                          </p>
                        </div>
                        <span className="text-green-500">Completed</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Connect your wallet to view transaction history
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WalletApp;