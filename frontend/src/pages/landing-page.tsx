import React from "react";
import { Link } from "react-router-dom";
import { Wallet, TrendingUp, Bell, BarChart3, ArrowRight } from "lucide-react";
import { Heading, Subheading } from "../ui-kits/heading";
import { Text } from "../ui-kits/text";
import { Badge } from "../ui-kits/badge";
import { Button } from "../ui-kits/button";
import { routeConfig } from "../config/navigation/routes";

// Mock top crypto for landing table – keep in sync with crypto-page or API
const TOP_CRYPTO = [
  { rank: 1, symbol: "BTC", name: "Bitcoin", price: 43250, change24h: 2.4 },
  { rank: 2, symbol: "ETH", name: "Ethereum", price: 2280, change24h: -1.2 },
  { rank: 3, symbol: "SOL", name: "Solana", price: 98.5, change24h: 5.8 },
  { rank: 4, symbol: "BNB", name: "BNB", price: 312, change24h: 1.8 },
  { rank: 5, symbol: "XRP", name: "XRP", price: 0.52, change24h: -0.5 },
  { rank: 6, symbol: "AVAX", name: "Avalanche", price: 35.2, change24h: -0.5 },
];

function formatPrice(n: number): string {
  if (n >= 1000)
    return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (n >= 1)
    return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
}

const features = [
  {
    icon: <Wallet className="w-8 h-8" />,
    title: "Universal Wallet Integration",
    description:
      "Connect MetaMask, Coinbase, Ledger, and 50+ wallets. All your holdings in one dashboard.",
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Real-Time Portfolio Tracking",
    description:
      "Live price feeds, instant balance updates, and performance metrics that update every second.",
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Advanced Analytics",
    description:
      "Allocation charts, historical trends, ROI tracking, and performance comparisons.",
  },
  {
    icon: <Bell className="w-8 h-8" />,
    title: "Smart Price Alerts",
    description:
      "Custom alerts for price movements, portfolio milestones, and market opportunities.",
  },
];

const stats = [
  { value: "50+", label: "Wallets supported" },
  { value: "Real-time", label: "Price updates" },
  { value: "10k+", label: "Active users" },
];

const LandingPage: React.FC = () => {
  return (
    <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen min-h-screen overflow-x-hidden">
      <div className="min-h-screen bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 text-neutral-800 dark:text-white">
        {/* Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px]" />
        </div>

        {/* Hero */}
        <section className="relative pt-16 sm:pt-24 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <Heading
                level={1}
                className="!text-4xl sm:!text-5xl lg:!text-6xl font-bold leading-tight tracking-tight"
              >
                Track all your crypto
                <span className="block mt-2 bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                  in one place
                </span>
              </Heading>
              <Text className="mt-6 !text-lg sm:!text-xl text-muted-foreground">
                Connect your wallets, watch your portfolio in real-time, and get
                alerts. Simple, elegant, and built for serious traders.
              </Text>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  href={routeConfig.portfolio}
                  className="group !px-8 !py-4 bg-gradient-to-r from-orange-600 to-blue-600 hover:shadow-xl hover:shadow-orange-500/25 transition-all hover:scale-105 text-white border-0"
                >
                  Get started
                  <ArrowRight
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    data-slot="icon"
                  />
                </Button>
                <Button
                  href={routeConfig.pricing}
                  outline
                  className="!px-8 !py-4"
                >
                  View pricing
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 mt-10 pt-10 border-t border-black/5 dark:border-white/5">
                {stats.map((stat, i) => (
                  <div key={i} className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-foreground">
                      {stat.value}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="relative py-20 px-6 scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Heading
                level={2}
                className="!text-3xl lg:!text-4xl !font-bold mb-3"
              >
                Everything you need to
                <span className="block mt-1 bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                  master crypto
                </span>
              </Heading>
              <Subheading className="!text-muted-foreground">
                Built for both beginners and professional traders
              </Subheading>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-neutral-200/40 to-neutral-300/40 dark:from-neutral-800/40 dark:to-neutral-900/40 backdrop-blur-sm border border-black/5 dark:border-white/5 rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mb-4 text-orange-400">
                    {feature.icon}
                  </div>
                  <Heading level={3} className="!font-bold !text-lg mb-2">
                    {feature.title}
                  </Heading>
                  <Text className="!text-sm leading-relaxed">
                    {feature.description}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top cryptocurrencies table */}
        <section className="relative py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <Heading level={2} className="!text-2xl !font-bold">
                Top cryptocurrencies
              </Heading>
              <Link
                to={routeConfig.crypto}
                className="text-orange-500 hover:text-orange-600 dark:text-orange-400 font-medium text-sm inline-flex items-center gap-1"
              >
                View all
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground w-12">
                        #
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">
                        Asset
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground">
                        Price
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground">
                        24h
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {TOP_CRYPTO.map((row) => (
                      <tr
                        key={row.symbol}
                        className="border-b border-zinc-100 dark:border-zinc-800/80 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-muted-foreground font-medium">
                          {row.rank}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                              {row.symbol.slice(0, 1)}
                            </div>
                            <div>
                              <span className="font-semibold text-foreground">
                                {row.symbol}
                              </span>
                              <span className="text-muted-foreground text-sm ml-1">
                                {row.name}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-sm">
                          {formatPrice(row.price)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {row.change24h >= 0 ? (
                            <Badge color="green">+{row.change24h}%</Badge>
                          ) : (
                            <Badge color="red">{row.change24h}%</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-br from-orange-500/10 to-blue-500/10 backdrop-blur-xl border border-orange-500/20 rounded-3xl p-10 sm:p-12 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-blue-500/5 blur-3xl" />
              <div className="relative z-10 space-y-5">
                <Heading className="!text-3xl sm:!text-4xl !font-bold">
                  Start tracking for just
                  <span className="block mt-1 text-orange-400">$5/month</span>
                </Heading>
                <Text className="!text-lg max-w-xl mx-auto">
                  Unlock unlimited wallets, advanced analytics, price alerts,
                  and historical charts.
                </Text>
                <Button
                  href={routeConfig.pricing}
                  className="!px-10 !py-4 bg-gradient-to-r from-orange-500 to-blue-500 text-lg font-bold hover:shadow-xl hover:shadow-orange-500/25 transition-all hover:scale-105 border-0 text-white"
                >
                  Start Tracking Now
                  <ArrowRight className="w-5 h-5 ml-2" data-slot="icon" />
                </Button>
                <Text className="!text-sm">
                  14-day free trial • No credit card required
                </Text>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative border-t border-black/5 dark:border-white/5 py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-slate-950" />
                  </div>
                  <span className="text-xl font-bold">CoinTrack</span>
                </div>
                <Text>
                  The most elegant way to track your crypto portfolio.
                </Text>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <div className="space-y-2">
                  <Link
                    to="#features"
                    className="block text-sm text-neutral-500 hover:text-orange-400 transition-colors"
                  >
                    Features
                  </Link>
                  <Link
                    to={routeConfig.pricing}
                    className="block text-sm text-neutral-500 hover:text-orange-400 transition-colors"
                  >
                    Pricing
                  </Link>
                  <Link
                    to={routeConfig.portfolio}
                    className="block text-sm text-neutral-500 hover:text-orange-400 transition-colors"
                  >
                    Portfolio
                  </Link>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Explore</h3>
                <div className="space-y-2">
                  <Link
                    to={routeConfig.portfolio}
                    className="block text-sm text-neutral-500 hover:text-orange-400 transition-colors"
                  >
                    Portfolio
                  </Link>
                  <Link
                    to={routeConfig.crypto}
                    className="block text-sm text-neutral-500 hover:text-orange-400 transition-colors"
                  >
                    Crypto
                  </Link>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Connect</h3>
                <div className="space-y-2">
                  <a
                    href="#"
                    className="block text-sm text-neutral-500 hover:text-orange-400 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-neutral-500 hover:text-orange-400 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Discord
                  </a>
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-neutral-500">
                © 2026 CoinTrack. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a
                  href="#"
                  className="text-neutral-500 hover:text-orange-400 transition-colors"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-neutral-500 hover:text-orange-400 transition-colors"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
