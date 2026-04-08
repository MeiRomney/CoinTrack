import React, { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { useNotifications } from "./notification-context";

export interface WalletToken {
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  balanceUsd?: number;
  address: string;
  chainId: number;
}

export interface WalletInfo {
  address: string | undefined;
  isConnected: boolean;
  chainId: number | undefined;
  balance: string;
  balanceUsd?: number;
  tokens: WalletToken[];
  loading: boolean;
  error: string | null;
}

interface WalletContextType {
  wallet: WalletInfo;
  refreshBalance: () => Promise<void>;
  disconnectWallet: () => void;
  fetchWalletTokens: (
    address: string,
    chainId: number,
  ) => Promise<WalletToken[]>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balanceData } = useBalance({ address });
  const { addNotification } = useNotifications();
  const [wallet, setWallet] = useState<WalletInfo>({
    address: undefined,
    isConnected: false,
    chainId: undefined,
    balance: "0",
    tokens: [],
    loading: false,
    error: null,
  });

  // Update wallet state when account or balance changes
  useEffect(() => {
    if (isConnected && address) {
      const balance = balanceData ? String(balanceData.value) : "0";
      setWallet((prev) => ({
        ...prev,
        address,
        isConnected: true,
        chainId,
        balance: balance,
        error: null,
      }));
    } else {
      setWallet({
        address: undefined,
        isConnected: false,
        chainId: undefined,
        balance: "0",
        tokens: [],
        loading: false,
        error: null,
      });
    }
  }, [isConnected, address, balanceData, chainId]);

  const fetchWalletTokens = async (
    walletAddress: string,
    walletChainId: number,
  ): Promise<WalletToken[]> => {
    try {
      setWallet((prev) => ({ ...prev, loading: true, error: null }));

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/wallet/tokens`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({
            address: walletAddress,
            chainId: walletChainId,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch tokens: ${response.statusText}`);
      }

      const data = await response.json();
      const tokens = data.tokens || [];

      setWallet((prev) => ({
        ...prev,
        tokens,
        loading: false,
      }));

      return tokens;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch wallet tokens";
      setWallet((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      addNotification({
        type: "error",
        title: "Wallet Error",
        message: errorMessage,
      });
      return [];
    }
  };

  const refreshBalance = async () => {
    if (!isConnected || !address) return;
    try {
      setWallet((prev) => ({ ...prev, loading: true }));
      // Fetch tokens will handle the refresh
      await fetchWalletTokens(address, chainId || 1);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to refresh balance";
      setWallet((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
    }
  };

  const disconnectWallet = () => {
    setWallet({
      address: undefined,
      isConnected: false,
      chainId: undefined,
      balance: "0",
      tokens: [],
      loading: false,
      error: null,
    });
    addNotification({
      type: "info",
      title: "Wallet Disconnected",
      message: "Your wallet has been disconnected",
    });
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        refreshBalance,
        disconnectWallet,
        fetchWalletTokens,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
