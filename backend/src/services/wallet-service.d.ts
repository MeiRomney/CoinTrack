interface TokenBalance {
    symbol: string;
    name: string;
    decimals: number;
    balance: string;
    address: string;
    chainId: number;
}
interface WalletData {
    address: string;
    nativeBalance: string;
    tokens: TokenBalance[];
    chainId: number;
}
export declare function getNativeBalance(address: string, chainId: number): Promise<string>;
export declare function getERC20TokenBalances(address: string, chainId: number, tokenAddresses?: string[]): Promise<TokenBalance[]>;
export declare function getWalletData(address: string, chainId: number): Promise<WalletData>;
export declare function getMultiChainWalletData(address: string, chainIds?: number[]): Promise<Record<number, WalletData>>;
export {};
//# sourceMappingURL=wallet-service.d.ts.map