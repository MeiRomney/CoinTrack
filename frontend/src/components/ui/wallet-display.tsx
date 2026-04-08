import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useWallet } from "../../contexts/wallet-context";

export const WalletDisplay: React.FC = () => {
  const { address, isConnected, chain } = useAccount();
  const { wallet, fetchWalletTokens } = useWallet();
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

  if (!isConnected || !address) {
    return null;
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 10)}...${addr.slice(-8)}`;
  };

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    return num.toFixed(4);
  };

  return (
    <div className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Connected Wallet
        </h3>
        <span className="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded-full">
          Connected
        </span>
      </div>

      {/* Address and Chain Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
          <p className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
            {formatAddress(address)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Network</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {chain?.name || "Unknown"}
          </p>
        </div>
      </div>

      {/* Balance */}
      <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Native Balance
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatBalance(wallet.balance)} {chain?.nativeCurrency?.symbol}
        </p>
        {wallet.balanceUsd && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ${wallet.balanceUsd.toFixed(2)} USD
          </p>
        )}
      </div>

      {/* Tokens List */}
      {wallet.tokens.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Token Holdings ({wallet.tokens.length})
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {wallet.tokens.map((token) => (
              <div
                key={`${token.address}-${token.chainId}`}
                className="p-2 rounded bg-gray-50 dark:bg-gray-800 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {token.symbol}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {token.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {parseFloat(token.balance).toFixed(4)}
                  </p>
                  {token.balanceUsd && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      ${token.balanceUsd.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <button
        onClick={loadWalletData}
        disabled={isLoading}
        className="w-full mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-lg transition-colors"
      >
        {isLoading ? "Syncing..." : "Refresh Balances"}
      </button>

      {/* Error Display */}
      {wallet.error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-400">
            {wallet.error}
          </p>
        </div>
      )}
    </div>
  );
};
