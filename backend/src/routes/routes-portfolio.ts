import { Router } from "express";

export const portfolioRouter = Router();

// TODO: Replace with real data source (e.g. Supabase)
portfolioRouter.get("/", (req, res) => {
  const mockHoldings = [
    { symbol: "BTC", name: "Bitcoin", amount: 0.42, valueUsd: 18165, change24h: 2.4 },
    { symbol: "ETH", name: "Ethereum", amount: 4.2, valueUsd: 9576, change24h: -1.2 },
    { symbol: "SOL", name: "Solana", amount: 85, valueUsd: 8372.5, change24h: 5.8 },
  ];

  res.json({
    totalValueUsd: mockHoldings.reduce((sum, h) => sum + h.valueUsd, 0),
    holdings: mockHoldings,
  });
});

