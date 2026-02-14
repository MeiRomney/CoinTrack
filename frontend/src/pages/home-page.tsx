import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  Bell,
  BarChart3,
  ArrowRight,
  Star,
} from "lucide-react";
import { Heading, Subheading } from "../ui-kits/heading";
import { Text } from "../ui-kits/text";
import { Badge } from "../ui-kits/badge";
import { Button } from "../ui-kits/button";
import { routeConfig } from "../config/navigation/routes";

const HomePage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Wallet className="w-8 h-8" />,
      title: "Universal Wallet Integration",
      description:
        "Connect MetaMask, Coinbase, Ledger, and 50+ wallets seamlessly. All your holdings in one elegant dashboard.",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Real-Time Portfolio Tracking",
      description:
        "Live price feeds, instant balance updates, and portfolio performance metrics that update every second.",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description:
        "Gain deep insights with allocation charts, historical trends, ROI tracking, and performance comparisons.",
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Smart Price Alerts",
      description:
        "Set custom alerts for price movements, portfolio milestones, and market opportunities you can't miss.",
    },
  ];

  const testimonials = [
    {
      quote:
        "CoinTrack transformed how I manage my crypto. The analytics are unmatched.",
      author: "Alex Chen",
      role: "DeFi Investor",
    },
    {
      quote:
        "Finally, a portfolio tracker that doesn't feel like homework. Beautifully designed.",
      author: "Sarah Martinez",
      role: "Crypto Trader",
    },
    {
      quote:
        "The real-time sync across all my wallets is a game-changer. Worth every penny.",
      author: "Michael Kim",
      role: "Blockchain Developer",
    },
  ];

  const walletLogos = [
    "MetaMask",
    "Coinbase",
    "Ledger",
    "Trust Wallet",
    "WalletConnect",
  ];

  const stats = [
    { value: "50+", label: "Wallets supported" },
    { value: "Real-time", label: "Price updates" },
    { value: "10k+", label: "Active users" },
  ];

  return (
    <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen min-h-screen overflow-x-hidden">
      <div className="min-h-screen bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 text-neutral-800 dark:text-white">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse-slower" />
          <div
            className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[80px]"
            style={{
              transform: `translate(-50%, -50%) translateY(${scrollY * 0.3}px)`,
            }}
          />
        </div>

        {/* Hero Section */}
        <section className="relative pt-24 pb-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 animate-slide-up">
                <Heading
                  level={1}
                  className="text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
                >
                  Track All Your Crypto
                  <span className="block mt-2 bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                    In One Place
                  </span>
                </Heading>

                <Text className="!text-xl leading-relaxed max-w-xl">
                  Connect your wallets and watch your portfolio grow in
                  real-time. Everything you need to master your crypto journey.
                </Text>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    href={routeConfig.portfolio}
                    className="group !px-8 !py-4 bg-gradient-to-r from-orange-600 to-blue-600 text-lg font-semibold hover:shadow-2xl hover:shadow-orange-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2 text-white border-0 cursor-pointer"
                  >
                    View Portfolio
                    <ArrowRight
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      data-slot="icon"
                    />
                  </Button>
                  <Button
                    href={routeConfig.pricing}
                    outline
                    className="!px-8 !py-4 text-lg font-semibold border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:!bg-black/10 dark:!hover:bg-white/10 backdrop-blur-sm cursor-pointer"
                  >
                    See pricing
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-x-10 gap-y-4 pt-10 border-t border-black/5 dark:border-white/5 mt-10">
                  {stats.map((stat, i) => (
                    <div key={i} className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dashboard Preview */}
              <div className="relative animate-slide-up-delayed">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-blue-500 rounded-3xl blur-3xl opacity-20" />
                <div className="relative bg-gradient-to-br from-neutral-200/50 to-neutral-300/50 dark:from-neutral-800/50 dark:to-neutral-900/50 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Text>Total Portfolio Value</Text>
                      <Badge color="green">+24.5%</Badge>
                    </div>
                    <div className="text-4xl font-bold">$124,582.40</div>

                    <div className="h-32 bg-gradient-to-r from-orange-500/20 to-blue-500/20 rounded-xl relative overflow-hidden">
                      <svg
                        className="w-full h-full"
                        viewBox="0 0 300 100"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0,80 Q75,20 150,40 T300,30"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="3"
                          className="animate-draw-line"
                        />
                        <path
                          d="M0,80 Q75,20 150,40 T300,30 L300,100 L0,100 Z"
                          fill="url(#gradient-fill)"
                          opacity="0.2"
                        />
                        <defs>
                          <linearGradient
                            id="gradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="green" />
                            <stop offset="100%" stopColor="green" />
                          </linearGradient>
                          <linearGradient
                            id="gradient-fill"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="orange" />
                            <stop offset="100%" stopColor="blue" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { coin: "BTC", amount: "2.5", value: "$85,240" },
                        { coin: "ETH", amount: "18.3", value: "$32,890" },
                        { coin: "SOL", amount: "150", value: "$6,452" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-black/5 dark:border-white/5 animate-fade-in-up"
                          style={{ animationDelay: `${i * 100}ms` }}
                        >
                          <Text className="!text-xs mb-1">{item.coin}</Text>
                          <Text className="!text-foreground font-semibold mb-1">
                            {item.amount}
                          </Text>
                          <Text className="!text-xs !text-green-500">
                            {item.value}
                          </Text>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative py-24 px-6 scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <Heading
                level={2}
                className="!text-4xl lg:!text-5xl !font-bold mb-4"
              >
                Everything you need to
                <span className="block mt-2 bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                  master crypto
                </span>
              </Heading>
              <Subheading className="!text-xl !text-muted-foreground">
                Powerful features designed for both beginners and professional
                traders
              </Subheading>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-neutral-200/40 to-neutral-300/40 dark:from-neutral-800/40 dark:to-neutral-900/40 backdrop-blur-sm border border-black/5 dark:border-white/5 rounded-2xl p-8 hover:border-orange-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <div className="text-orange-400">{feature.icon}</div>
                  </div>
                  <Heading level={3} className="!font-bold mb-3">
                    {feature.title}
                  </Heading>
                  <Text className="leading-relaxed">{feature.description}</Text>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="relative py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <Heading
              level={2}
              className="text-4xl lg:text-5xl font-bold text-center mb-4 animate-fade-in"
            >
              Loved by crypto enthusiasts
            </Heading>
            <Subheading className=" !text-xl !text-muted-foreground text-center mb-16 animate-fade-in">
              Hear from our satisfied users who have transformed their crypto
              experience with CoinTrack
            </Subheading>
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-neutral-200/40 to-neutral-300/40 dark:from-neutral-800/40 dark:to-neutral-900/40 backdrop-blur-sm border border-black/5 dark:border-white/5 rounded-2xl p-8 hover:border-black/10 dark:hover:border-white/10 transition-all animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex gap-0.5 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="size-5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <div className="text-orange-400/80 text-3xl font-serif leading-none mb-2">
                    "
                  </div>
                  <Text className="!text-lg mb-6 leading-relaxed">
                    {testimonial.quote}
                  </Text>
                  <div>
                    <Subheading className="font-semibold">
                      {testimonial.author}
                    </Subheading>
                    <Text>{testimonial.role}</Text>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center animate-fade-in">
              <Text className="mb-6">Supported Wallets</Text>
              <div className="flex flex-wrap justify-center gap-8">
                {walletLogos.map((wallet, index) => (
                  <div
                    key={index}
                    className="px-6 py-3 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-all"
                  >
                    {wallet}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-br from-orange-500/10 to-blue-500/10 backdrop-blur-xl border border-orange-500/20 rounded-3xl p-12 text-center overflow-hidden animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-blue-500/5 blur-3xl" />
              <div className="relative z-10 space-y-6">
                <Heading className="!text-4xl lg:!text-5xl !font-bold">
                  Start tracking for just
                  <span className="block mt-2 text-orange-400">$5/month</span>
                </Heading>
                <Text className="!text-xl max-w-2xl mx-auto">
                  Unlock unlimited wallet connections, advanced analytics, price
                  alerts, and historical charts
                </Text>
                <Button
                  href={routeConfig.pricing}
                  className="!px-10 !py-5 bg-gradient-to-r from-orange-500 to-blue-500 text-lg font-bold hover:shadow-2xl hover:shadow-orange-500/30 transition-all hover:scale-105 inline-flex items-center gap-2 border-0 cursor-pointer"
                >
                  Start Tracking Now
                  <ArrowRight className="w-5 h-5" data-slot="icon" />
                </Button>
                <Text>14-day free trial • No credit card required</Text>
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
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-neutral-500 hover:text-orange-400 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
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

export default HomePage;
