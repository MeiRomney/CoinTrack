import express from "express";
import { getWalletData, getMultiChainWalletData, getNativeBalance, getERC20TokenBalances, } from "../services/wallet-service.js";
export const walletRouter = express.Router();
/**
 * @route GET /api/wallet/test
 * @description Test endpoint to verify wallet routes are loaded
 */
walletRouter.get("/test", async (req, res) => {
    res.json({ message: "Wallet routes are working!" });
});
/**
 * @route POST /api/wallet/data
 * @description Get wallet data (native balance + tokens) for a specific address and chain
 * @param {string} address - Wallet address
 * @param {number} chainId - Chain ID (default: 1 for Ethereum)
 */
walletRouter.post("/data", async (req, res) => {
    try {
        const { address, chainId = 1 } = req.body;
        if (!address) {
            return res.status(400).json({
                error: "Wallet address is required",
            });
        }
        const walletData = await getWalletData(address, chainId);
        res.json({
            success: true,
            data: walletData,
        });
    }
    catch (error) {
        console.error("Error in /wallet/data:", error);
        res.status(500).json({
            error: error instanceof Error ? error.message : "Failed to fetch wallet data",
        });
    }
});
/**
 * @route POST /api/wallet/tokens
 * @description Get ERC20 token balances for a wallet
 * @param {string} address - Wallet address
 * @param {number} chainId - Chain ID
 * @param {string[]} tokenAddresses - (Optional) Specific token addresses to check
 */
walletRouter.post("/tokens", async (req, res) => {
    try {
        const { address, chainId = 1, tokenAddresses } = req.body;
        if (!address) {
            return res.status(400).json({
                error: "Wallet address is required",
            });
        }
        const tokens = await getERC20TokenBalances(address, chainId, tokenAddresses);
        res.json({
            success: true,
            tokens,
            count: tokens.length,
        });
    }
    catch (error) {
        console.error("Error in /wallet/tokens:", error);
        res.status(500).json({
            error: error instanceof Error ? error.message : "Failed to fetch tokens",
        });
    }
});
/**
 * @route POST /api/wallet/balance
 * @description Get native balance for a wallet
 * @param {string} address - Wallet address
 * @param {number} chainId - Chain ID
 */
walletRouter.post("/balance", async (req, res) => {
    try {
        const { address, chainId = 1 } = req.body;
        if (!address) {
            return res.status(400).json({
                error: "Wallet address is required",
            });
        }
        const balance = await getNativeBalance(address, chainId);
        res.json({
            success: true,
            address,
            chainId,
            balance,
        });
    }
    catch (error) {
        console.error("Error in /wallet/balance:", error);
        res.status(500).json({
            error: error instanceof Error ? error.message : "Failed to fetch balance",
        });
    }
});
/**
 * @route POST /api/wallet/multi-chain
 * @description Get wallet data across multiple chains
 * @param {string} address - Wallet address
 * @param {number[]} chainIds - Array of chain IDs to query
 */
walletRouter.post("/multi-chain", async (req, res) => {
    try {
        const { address, chainIds = [1, 137, 42161, 10] } = req.body;
        if (!address) {
            return res.status(400).json({
                error: "Wallet address is required",
            });
        }
        const multiChainData = await getMultiChainWalletData(address, chainIds);
        // Calculate total balance across chains
        let totalNativeBalance = 0;
        let totalTokens = 0;
        Object.values(multiChainData).forEach((chainData) => {
            if (chainData && chainData.nativeBalance && chainData.tokens) {
                totalNativeBalance += parseFloat(chainData.nativeBalance);
                totalTokens += chainData.tokens.length;
            }
        });
        res.json({
            success: true,
            address,
            chains: multiChainData,
            summary: {
                totalNativeBalance,
                totalUniqueTokens: totalTokens,
                chainsQueried: chainIds.length,
            },
        });
    }
    catch (error) {
        console.error("Error in /wallet/multi-chain:", error);
        res.status(500).json({
            error: error instanceof Error ? error.message : "Failed to fetch multi-chain data",
        });
    }
});
//# sourceMappingURL=wallet-routes.js.map