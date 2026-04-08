import React from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useWallet } from "../../contexts/wallet-context";

export const WalletConnectButton: React.FC = () => {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { disconnectWallet } = useWallet();

  const handleDisconnect = () => {
    disconnect();
    disconnectWallet();
  };

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return "Not connected";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        🔗 Connect Wallet
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {address ? formatAddress(address) : "Not connected"}
        </span>
        {chain && (
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {chain.name}
          </span>
        )}
      </div>
      <button
        onClick={handleDisconnect}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium transition-colors"
      >
        Disconnect
      </button>
    </div>
  );
};
