import { Router } from "express";
import axios from "axios";
import { z } from "zod";

export const cryptoRouter = Router();

const querySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 10))
    .pipe(z.number().int().min(1).max(100)),
});

cryptoRouter.get("/top", async (req, res, next) => {
  try {
    const parseResult = querySchema.safeParse(req.query);
    if (!parseResult.success) {
      return res.status(400).json({ error: "Invalid query", details: parseResult.error.format() });
    }

    const { limit } = parseResult.data;

    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: limit,
          page: 1,
          price_change_percentage: "24h,7d",
        },
      },
    );

    const data = response.data as Array<{
      id: string;
      symbol: string;
      name: string;
      image: string;
      current_price: number;
      market_cap: number;
      total_volume: number;
      price_change_percentage_24h: number | null;
      price_change_percentage_7d_in_currency?: number | null;
    }>;

    const mapped = data.map((coin, index) => ({
      rank: index + 1,
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image,
      price: coin.current_price,
      marketCap: coin.market_cap,
      volume24h: coin.total_volume,
      change24h: coin.price_change_percentage_24h,
      change7d: coin.price_change_percentage_7d_in_currency ?? null,
    }));

    res.json({ data: mapped });
  } catch (error) {
    next(error);
  }
});

