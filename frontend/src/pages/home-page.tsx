import React, { useState, useEffect } from "react";
import {
  Wallet,
  TrendingUp,
  Bell,
  BarChart3,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { Heading } from "../ui-kits/heading";
import { Text } from "../ui-kits/text";

const HomePage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
                  <button className="group px-8 py-4 bg-gradient-to-r from-orange-600 to-blue-600 rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-orange-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2 text-white cursor-pointer">
                    Connect Wallet
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="px-8 py-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-lg font-semibold hover:bg-black/10 dark:hover:bg-white/10 transition-all backdrop-blur-sm cursor-pointer">
                    Get Started
                  </button>
                </div>

                <div className="flex items-center gap-6 pt-6">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-950"
                      />
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold">Join our community</div>
                    <div className="text-slate-400">of successful traders</div>
                  </div>
                </div>
              </div>

              {/* Dashboard Preview */}
              <div className="relative animate-slide-up-delayed">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur-3xl opacity-20" />
                <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-400">
                        Total Portfolio Value
                      </span>
                      <span className="text-xs px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                        +24.5%
                      </span>
                    </div>
                    <div className="text-4xl font-bold">$124,582.40</div>

                    <div className="h-32 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-xl relative overflow-hidden">
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
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                          <linearGradient
                            id="gradient-fill"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#06b6d4" />
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
                          className="bg-white/5 rounded-xl p-4 border border-white/5 animate-fade-in-up"
                          style={{ animationDelay: `${i * 100}ms` }}
                        >
                          <div className="text-xs text-slate-400 mb-1">
                            {item.coin}
                          </div>
                          <div className="text-sm font-semibold mb-1">
                            {item.amount}
                          </div>
                          <div className="text-xs text-emerald-400">
                            {item.value}
                          </div>
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
        <section className="relative py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Everything you need to
                <span className="block mt-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  master crypto
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Powerful features designed for both beginners and professional
                traders
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:border-emerald-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <div className="text-emerald-400">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="relative py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 animate-fade-in">
              Loved by crypto enthusiasts
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="text-emerald-400 text-4xl mb-4">"</div>
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    {testimonial.quote}
                  </p>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-slate-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center animate-fade-in">
              <p className="text-sm text-slate-400 mb-6">Supported Wallets</p>
              <div className="flex flex-wrap justify-center gap-8">
                {walletLogos.map((wallet, index) => (
                  <div
                    key={index}
                    className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-sm font-medium hover:bg-white/10 transition-all"
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
            <div className="relative bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-12 text-center overflow-hidden animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 blur-3xl" />
              <div className="relative z-10 space-y-6">
                <h2 className="text-4xl lg:text-5xl font-bold">
                  Start tracking for just
                  <span className="block mt-2 text-emerald-400">$5/month</span>
                </h2>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                  Unlock unlimited wallet connections, advanced analytics, price
                  alerts, and historical charts
                </p>
                <button className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-lg font-bold hover:shadow-2xl hover:shadow-emerald-500/30 transition-all hover:scale-105 inline-flex items-center gap-2">
                  Start Tracking Now
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-sm text-slate-400">
                  14-day free trial • No credit card required
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative border-t border-white/5 py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-slate-950" />
                  </div>
                  <span className="text-xl font-bold">CoinTrack</span>
                </div>
                <p className="text-sm text-slate-400">
                  The most elegant way to track your crypto portfolio.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <div className="space-y-2">
                  <a
                    href="#"
                    className="block text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    Features
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    Pricing
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    API
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <div className="space-y-2">
                  <a
                    href="#"
                    className="block text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    About
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    Privacy
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    Terms
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Connect</h3>
                <div className="space-y-2">
                  <a
                    href="#"
                    className="block text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    Twitter
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    Discord
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-slate-400">
                © 2026 CoinTrack. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a
                  href="#"
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
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
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
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
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
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

        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'DM Sans', sans-serif;
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }

        @keyframes pulse-slower {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.12; }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes draw-line {
          from {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
          }
          to {
            stroke-dasharray: 1000;
            stroke-dashoffset: 0;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 6s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }

        .animate-slide-up-delayed {
          animation: slide-up 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-draw-line {
          animation: draw-line 2s ease-out forwards;
        }
      `}</style>
      </div>
    </div>
  );
};

export default HomePage;
