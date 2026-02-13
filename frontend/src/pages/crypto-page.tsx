import React, { useMemo, useState } from "react";
import { Search, TrendingUp, Coins } from "lucide-react";
import { Heading, Subheading } from "../ui-kits/heading";
import { Text } from "../ui-kits/text";
import { Badge } from "../ui-kits/badge";
import { Input } from "../ui-kits/input";
import { InputGroup } from "../ui-kits/input";

// Mock crypto market data – replace with API when available
const MOCK_CRYPTO = [
  {
    rank: 1,
    symbol: "BTC",
    name: "Bitcoin",
    price: 43250,
    change24h: 2.4,
    change7d: 5.2,
    marketCap: 848e9,
    volume24h: 28e9,
  },
  {
    rank: 2,
    symbol: "ETH",
    name: "Ethereum",
    price: 2280,
    change24h: -1.2,
    change7d: 3.1,
    marketCap: 274e9,
    volume24h: 12e9,
  },
  {
    rank: 3,
    symbol: "USDT",
    name: "Tether",
    price: 1.0,
    change24h: 0.01,
    change7d: -0.02,
    marketCap: 112e9,
    volume24h: 52e9,
  },
  {
    rank: 4,
    symbol: "BNB",
    name: "BNB",
    price: 312,
    change24h: 1.8,
    change7d: 4.5,
    marketCap: 48e9,
    volume24h: 1.2e9,
  },
  {
    rank: 5,
    symbol: "SOL",
    name: "Solana",
    price: 98.5,
    change24h: 5.8,
    change7d: 12.3,
    marketCap: 42e9,
    volume24h: 2.8e9,
  },
  {
    rank: 6,
    symbol: "XRP",
    name: "XRP",
    price: 0.52,
    change24h: -0.5,
    change7d: 2.1,
    marketCap: 28e9,
    volume24h: 1.5e9,
  },
  {
    rank: 7,
    symbol: "USDC",
    name: "USD Coin",
    price: 1.0,
    change24h: 0.0,
    change7d: 0.0,
    marketCap: 26e9,
    volume24h: 4.2e9,
  },
  {
    rank: 8,
    symbol: "ADA",
    name: "Cardano",
    price: 0.48,
    change24h: 1.2,
    change7d: -1.5,
    marketCap: 17e9,
    volume24h: 0.4e9,
  },
  {
    rank: 9,
    symbol: "AVAX",
    name: "Avalanche",
    price: 35.2,
    change24h: -0.5,
    change7d: 8.2,
    marketCap: 13e9,
    volume24h: 0.6e9,
  },
  {
    rank: 10,
    symbol: "DOGE",
    name: "Dogecoin",
    price: 0.082,
    change24h: 3.1,
    change7d: 6.4,
    marketCap: 12e9,
    volume24h: 0.9e9,
  },
];

function formatPrice(n: number): string {
  if (n >= 1000)
    return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (n >= 1)
    return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
}

function formatCompact(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toFixed(0)}`;
}

const CryptoPage: React.FC = () => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return MOCK_CRYPTO;
    return MOCK_CRYPTO.filter(
      (c) =>
        c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Heading level={1} className="!text-3xl font-bold">
              Crypto
            </Heading>
            <Text className="mt-1">
              Explore prices, market cap, and 24h volume
            </Text>
          </div>
          <div className="w-full sm:w-80">
            <InputGroup>
              <Search
                className="size-5 text-muted-foreground"
                data-slot="icon"
              />
              <Input
                type="search"
                placeholder="Search by name or symbol..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50"
              />
            </InputGroup>
          </div>
        </div>

        {/* Market overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Coins className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <Text className="!text-sm !text-muted-foreground">
                  Market cap
                </Text>
                <p className="text-xl font-bold text-foreground">$2.14T</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <Text className="!text-sm !text-muted-foreground">
                  BTC dominance
                </Text>
                <p className="text-xl font-bold text-foreground">52.4%</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Coins className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <Text className="!text-sm !text-muted-foreground">
                  24h volume
                </Text>
                <p className="text-xl font-bold text-foreground">$98.2B</p>
              </div>
            </div>
          </div>
        </div>

        {/* Crypto table */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <Subheading>Top by market cap</Subheading>
            <Text className="!text-sm mt-1">
              {filtered.length} asset{filtered.length !== 1 ? "s" : ""} shown
            </Text>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground w-14">
                    #
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">
                    Asset
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-muted-foreground">
                    Price
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-muted-foreground">
                    24h
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-muted-foreground">
                    7d
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-muted-foreground">
                    Market cap
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-muted-foreground">
                    Volume (24h)
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 px-6 text-center text-muted-foreground"
                    >
                      No assets match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((crypto) => (
                    <tr
                      key={crypto.symbol}
                      className="border-b border-zinc-100 dark:border-zinc-800/80 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="py-4 px-6 text-sm text-muted-foreground font-medium">
                        {crypto.rank}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                            {crypto.symbol.slice(0, 1)}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {crypto.symbol}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {crypto.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right font-semibold">
                        {formatPrice(crypto.price)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {crypto.change24h >= 0 ? (
                          <Badge color="green">+{crypto.change24h}%</Badge>
                        ) : (
                          <Badge color="red">{crypto.change24h}%</Badge>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {crypto.change7d >= 0 ? (
                          <span className="text-green-500 font-medium">
                            +{crypto.change7d}%
                          </span>
                        ) : (
                          <span className="text-red-500 font-medium">
                            {crypto.change7d}%
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right text-muted-foreground">
                        {formatCompact(crypto.marketCap)}
                      </td>
                      <td className="py-4 px-6 text-right text-muted-foreground">
                        {formatCompact(crypto.volume24h)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoPage;
