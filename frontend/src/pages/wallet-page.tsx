import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Heading, Subheading } from "../ui-kits/heading";
import { Text } from "../ui-kits/text";
import { useWallet } from "../contexts/wallet-context";

const WalletPage: React.FC = () => {
  const { isConnected, address, chain } = useAccount();
  const { fetchWalletTokens, wallet: walletState } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      loadWalletData();
    }
  }, [isConnected, address]);

  const loadWalletData = async () => {
    if (!address) return;
    setIsLoading(true);
    try {
      await fetchWalletTokens(address, chain?.id || 1);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <Heading level={1} className="!text-4xl font-bold">
            Connect Your Wallet
          </Heading>
          <Text className="!text-lg text-muted-foreground">
            View your cryptocurrency holdings across multiple blockchain
            networks
          </Text>
          <div className="mt-8">
            <ConnectButton />
          </div>
          <div className="mt-12 p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <strong>Supported Networks:</strong> Ethereum, Polygon, Arbitrum,
              Optimism, Base, and Sepolia (testnet)
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return "Not connected";
    return `${addr.slice(0, 10)}...${addr.slice(-8)}`;
  };

  const formatBalance = (balance: string, decimals = 4) => {
    const num = parseFloat(balance);
    if (num === 0) return "0";
    if (num < 0.0001) return "< 0.0001";
    return num.toFixed(decimals);
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Heading level={1} className="!text-3xl font-bold">
              Wallet Explorer
            </Heading>
            <Text className="mt-1">View your holdings across all chains</Text>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadWalletData}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              {isLoading ? "Syncing..." : "Refresh"}
            </button>
            <ConnectButton />
          </div>
        </div>

        {/* Address Info */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Text className="!text-sm !text-muted-foreground">Address</Text>
              <p className="font-mono font-medium text-foreground mt-1">
                {address ? formatAddress(address) : "Not connected"}
              </p>
            </div>
            <div>
              <Text className="!text-sm !text-muted-foreground">Network</Text>
              <p className="font-medium text-foreground mt-1">
                {chain?.name || "Unknown"}
              </p>
            </div>
            <div>
              <Text className="!text-sm !text-muted-foreground">
                Total Tokens
              </Text>
              <p className="font-medium text-foreground mt-1">
                {walletState.tokens.length}
              </p>
            </div>
          </div>
        </div>

        {/* Native Balance */}
        {walletState.balance && parseFloat(walletState.balance) > 0 && (
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Native Balance ({chain?.nativeCurrency?.symbol})
            </p>
            <p className="text-3xl font-bold text-foreground">
              {formatBalance(walletState.balance, 6)}
            </p>
            {walletState.balanceUsd && (
              <p className="text-sm text-muted-foreground mt-2">
                ≈ $
                {walletState.balanceUsd.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            )}
          </div>
        )}

        {/* Error Message */}
        {walletState.error && (
          <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 dark:text-red-200">
                Error
              </p>
              <p className="text-sm text-red-800 dark:text-red-300 mt-1">
                {walletState.error}
              </p>
            </div>
          </div>
        )}

        {/* Tokens List */}
        <div className="space-y-4">
          <Subheading>Token Holdings</Subheading>

          {walletState.tokens.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 p-8 text-center">
              <p className="text-muted-foreground">
                {walletState.loading
                  ? "Loading tokens..."
                  : "No tokens found in this wallet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {walletState.tokens.map((token) => (
                <div
                  key={`${token.address}-${token.chainId}`}
                  className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                        {token.symbol.slice(0, 1)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {token.symbol}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {token.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {formatBalance(token.balance, 6)}
                      </p>
                      {token.balanceUsd && (
                        <p className="text-xs text-muted-foreground">
                          $
                          {token.balanceUsd.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Token Details */}
                  <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-muted-foreground">
                    <p>Contract: {formatAddress(token.address)}</p>
                    <p>Decimals: {token.decimals}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 p-6">
          <Subheading className="!text-base mb-2">
            ℹ️ About Wallet Integration
          </Subheading>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              ✓ View real-time token balances across Ethereum, Polygon,
              Arbitrum, Optimism, and Base
            </li>
            <li>
              ✓ All data is fetched directly from blockchain RPC providers
            </li>
            <li>✓ No private keys or sensitive data is stored</li>
            <li>✓ ERC-20 token balances are automatically detected</li>
            <li>✓ Data updates when you click the Refresh button</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
