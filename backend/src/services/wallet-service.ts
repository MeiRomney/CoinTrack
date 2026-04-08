import axios from "axios";
import { ethers } from "ethers";

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

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
];

interface ChainConfig {
  rpcUrl: string;
  etherscanApiUrl: string;
  etherscanApiKey: string;
}

const CHAIN_CONFIGS: Record<number, ChainConfig> = {
  1: {
    rpcUrl: process.env.ETHEREUM_RPC_URL || "https://eth.llamarpc.com",
    etherscanApiUrl: "https://api.etherscan.io/api",
    etherscanApiKey: process.env.ETHERSCAN_API_KEY || "",
  },
  11155111: {
    rpcUrl: process.env.SEPOLIA_RPC_URL || "https://sepolia.drpc.org",
    etherscanApiUrl: "https://api-sepolia.etherscan.io/api",
    etherscanApiKey: process.env.ETHERSCAN_API_KEY || "",
  },
  137: {
    rpcUrl: process.env.POLYGON_RPC_URL || "https://polygon.llamarpc.com",
    etherscanApiUrl: "https://api.polygonscan.com/api",
    etherscanApiKey: process.env.POLYGONSCAN_API_KEY || "",
  },
  42161: {
    rpcUrl: process.env.ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc",
    etherscanApiUrl: "https://api.arbiscan.io/api",
    etherscanApiKey: process.env.ARBISCAN_API_KEY || "",
  },
  10: {
    rpcUrl: process.env.OPTIMISM_RPC_URL || "https://mainnet.optimism.io",
    etherscanApiUrl: "https://api-optimistic.etherscan.io/api",
    etherscanApiKey: process.env.OPTIMISM_ETHERSCAN_API_KEY || "",
  },
};

export async function getNativeBalance(
  address: string,
  chainId: number,
): Promise<string> {
  try {
    const config = CHAIN_CONFIGS[chainId];
    if (!config) {
      throw new Error(`Unsupported chain: ${chainId}`);
    }

    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error("Error fetching native balance:", error);
    throw error;
  }
}

export async function getERC20TokenBalances(
  address: string,
  chainId: number,
  tokenAddresses?: string[],
): Promise<TokenBalance[]> {
  try {
    const config = CHAIN_CONFIGS[chainId];
    if (!config) {
      throw new Error(`Unsupported chain: ${chainId}`);
    }

    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    const balances: TokenBalance[] = [];

    // If token addresses not provided, fetch them from Etherscan
    let tokens = tokenAddresses || [];
    if (tokens.length === 0) {
      tokens = await getTokensFromEtherscan(address, chainId, config);
    }

    // Fetch balance for each token
    for (const tokenAddress of tokens.slice(0, 50)) {
      // Limit to 50 tokens to avoid rate limits
      try {
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

        const balanceOf = contract.getFunction("balanceOf");
        const decimals = contract.getFunction("decimals");
        const symbol = contract.getFunction("symbol");
        const name = contract.getFunction("name");

        if (!balanceOf || !decimals || !symbol || !name) {
          continue;
        }

        const [balance, dec, sym, nm] = await Promise.all([
          balanceOf(address),
          decimals(),
          symbol(),
          name(),
        ]);

        // Only include tokens with non-zero balance
        if (balance > BigInt(0)) {
          balances.push({
            address: tokenAddress,
            balance: ethers.formatUnits(balance as bigint, dec as number),
            decimals: dec as number,
            symbol: sym as string,
            name: nm as string,
            chainId,
          });
        }
      } catch (error) {
        console.error(
          `Error fetching balance for token ${tokenAddress}:`,
          error,
        );
        // Skip this token and continue
        continue;
      }
    }

    return balances;
  } catch (error) {
    console.error("Error fetching ERC20 balances:", error);
    throw error;
  }
}

async function getTokensFromEtherscan(
  address: string,
  chainId: number,
  config: ChainConfig,
): Promise<string[]> {
  try {
    if (!config.etherscanApiKey) {
      console.warn(
        `No API key for chain ${chainId}, returning empty token list`,
      );
      return [];
    }

    const response = await axios.get(config.etherscanApiUrl, {
      params: {
        module: "account",
        action: "tokentx",
        address,
        startblock: 0,
        endblock: 99999999,
        sort: "desc",
        apikey: config.etherscanApiKey,
      },
      timeout: 10000,
    });

    if (response.data.status !== "1") {
      return [];
    }

    const tokenAddresses = Array.from(
      new Set(response.data.result.map((tx: any) => tx.contractAddress)),
    ) as string[];
    return tokenAddresses.slice(0, 50); // Limit to 50 tokens
  } catch (error) {
    console.error("Error fetching tokens from Etherscan:", error);
    return [];
  }
}

export async function getWalletData(
  address: string,
  chainId: number,
): Promise<WalletData> {
  try {
    // Validate address
    if (!ethers.isAddress(address)) {
      throw new Error("Invalid Ethereum address");
    }

    const checkSumAddress = ethers.getAddress(address);

    // Fetch native balance
    const nativeBalance = await getNativeBalance(checkSumAddress, chainId);

    // Fetch token balances
    const tokens = await getERC20TokenBalances(checkSumAddress, chainId);

    // Sort tokens by balance value (in case we had USD prices)
    tokens.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));

    return {
      address: checkSumAddress,
      nativeBalance,
      tokens,
      chainId,
    };
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    throw error;
  }
}

export async function getMultiChainWalletData(
  address: string,
  chainIds: number[] = [1, 137, 42161, 10], // Default: Ethereum, Polygon, Arbitrum, Optimism
): Promise<Record<number, WalletData>> {
  try {
    const results: Record<number, WalletData> = {};

    await Promise.all(
      chainIds.map(async (chainId) => {
        try {
          results[chainId] = await getWalletData(address, chainId);
        } catch (error) {
          console.error(`Error fetching data for chain ${chainId}:`, error);
          results[chainId] = {
            address,
            nativeBalance: "0",
            tokens: [],
            chainId,
          };
        }
      }),
    );

    return results;
  } catch (error) {
    console.error("Error fetching multi-chain wallet data:", error);
    throw error;
  }
}
