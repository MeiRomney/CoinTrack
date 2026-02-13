import React, { useMemo } from "react";
import { Wallet, TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Heading, Subheading } from "../ui-kits/heading";
import { Text } from "../ui-kits/text";
import { Badge } from "../ui-kits/badge";

// Mock portfolio data – replace with API/context when available
const MOCK_HOLDINGS = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    amount: 0.42,
    price: 43250,
    value: 18165,
    change24h: 2.4,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    amount: 4.2,
    price: 2280,
    value: 9576,
    change24h: -1.2,
  },
  {
    symbol: "SOL",
    name: "Solana",
    amount: 85,
    price: 98.5,
    value: 8372.5,
    change24h: 5.8,
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    amount: 120,
    price: 35.2,
    value: 4224,
    change24h: -0.5,
  },
  {
    symbol: "MATIC",
    name: "Polygon",
    amount: 2500,
    price: 0.82,
    value: 2050,
    change24h: 1.1,
  },
];

const MOCK_HISTORY = [
  { date: "Mon", value: 38000 },
  { date: "Tue", value: 39500 },
  { date: "Wed", value: 40100 },
  { date: "Thu", value: 38900 },
  { date: "Fri", value: 41200 },
  { date: "Sat", value: 41800 },
  { date: "Sun", value: 42367 },
];

const ALLOCATION_COLORS = [
  "#f97316", // orange
  "#3b82f6", // blue
  "#22c55e", // green
  "#a855f7", // purple
  "#ec4899", // pink
];

const PortfolioPage: React.FC = () => {
  const totalValue = useMemo(
    () => MOCK_HOLDINGS.reduce((sum, h) => sum + h.value, 0),
    [],
  );
  const change24h = 2.8;
  const change7d = 5.2;

  const allocationData = useMemo(
    () =>
      MOCK_HOLDINGS.map((h) => ({
        name: h.symbol,
        value: h.value,
      })),
    [],
  );

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Heading level={1} className="!text-3xl font-bold">
              Portfolio
            </Heading>
            <Text className="mt-1">
              Track your holdings and allocation in one place
            </Text>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <Text className="!text-sm !text-muted-foreground">
                  Total value
                </Text>
                <p className="text-2xl font-bold text-foreground">
                  $
                  {totalValue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
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
                  24h change
                </Text>
                <p className="text-2xl font-bold text-green-500">
                  +{change24h}%
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <PieChartIcon className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <Text className="!text-sm !text-muted-foreground">
                  7d change
                </Text>
                <p className="text-2xl font-bold text-blue-500">+{change7d}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart + Allocation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 shadow-sm">
            <Subheading className="mb-4">Portfolio value (7d)</Subheading>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_HISTORY}>
                  <defs>
                    <linearGradient
                      id="valueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `$${value.toLocaleString()}`,
                      "Value",
                    ]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid var(--color-border)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#f97316"
                    strokeWidth={2}
                    fill="url(#valueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 shadow-sm">
            <Subheading className="mb-4">Allocation</Subheading>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {allocationData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          ALLOCATION_COLORS[index % ALLOCATION_COLORS.length]
                        }
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Holdings table */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <Subheading>Holdings</Subheading>
            <Text className="!text-sm mt-1">Your current crypto positions</Text>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">
                    Asset
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-muted-foreground">
                    Amount
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-muted-foreground">
                    Price
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-muted-foreground">
                    Value
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-muted-foreground">
                    24h
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_HOLDINGS.map((holding) => (
                  <tr
                    key={holding.symbol}
                    className="border-b border-zinc-100 dark:border-zinc-800/80 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                          {holding.symbol.slice(0, 1)}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {holding.symbol}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {holding.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-medium">
                      {holding.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right text-muted-foreground">
                      ${holding.price.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right font-semibold">
                      $
                      {holding.value.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {holding.change24h >= 0 ? (
                        <Badge color="green">+{holding.change24h}%</Badge>
                      ) : (
                        <Badge color="red">{holding.change24h}%</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
