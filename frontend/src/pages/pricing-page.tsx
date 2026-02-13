import React from "react";
import { Check, ArrowRight, Wallet, BarChart3, Bell, Zap } from "lucide-react";
import { Heading, Subheading } from "../ui-kits/heading";
import { Text } from "../ui-kits/text";
import { Badge } from "../ui-kits/badge";
import { Button } from "../ui-kits/button";

const PLANS = [
  {
    name: "Free",
    description: "Get started with basic tracking",
    price: 0,
    period: "forever",
    cta: "Get started",
    href: "#",
    featured: false,
    features: [
      "1 wallet connection",
      "Up to 10 assets",
      "Basic portfolio view",
      "7-day price history",
      "Community support",
    ],
    icon: Wallet,
  },
  {
    name: "Pro",
    description: "For serious traders and investors",
    price: 5,
    period: "month",
    cta: "Start free trial",
    href: "#",
    featured: true,
    features: [
      "Unlimited wallet connections",
      "Unlimited assets",
      "Advanced analytics & charts",
      "Price alerts",
      "Historical data & export",
      "Priority support",
    ],
    icon: BarChart3,
  },
  {
    name: "Enterprise",
    description: "For teams and institutions",
    price: null,
    period: "custom",
    cta: "Contact sales",
    href: "#",
    featured: false,
    features: [
      "Everything in Pro",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
      "SLA & compliance",
    ],
    icon: Zap,
  },
];

const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <Heading level={1} className="!text-3xl sm:!text-4xl font-bold">
            Simple, transparent pricing
          </Heading>
          <Text className="mt-4 !text-lg">
            Start free. Upgrade when you need unlimited wallets, alerts, and
            advanced analytics.
          </Text>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Check className="size-4 text-green-500" />
              14-day free trial
            </span>
            <span className="flex items-center gap-2">
              <Check className="size-4 text-green-500" />
              No credit card required
            </span>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-6 sm:p-8 flex flex-col ${
                  plan.featured
                    ? "border-orange-500/50 dark:border-orange-500/50 bg-gradient-to-b from-orange-500/5 to-transparent dark:from-orange-500/10 shadow-lg shadow-orange-500/10 scale-[1.02] lg:scale-105 z-10"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge color="orange">Most popular</Badge>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      plan.featured
                        ? "bg-orange-500/20 text-orange-500"
                        : "bg-zinc-100 dark:bg-zinc-800 text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <Subheading className="!mb-0">{plan.name}</Subheading>
                    <Text className="!text-sm !mt-0.5">{plan.description}</Text>
                  </div>
                </div>
                <div className="mb-6">
                  {plan.price !== null ? (
                    <>
                      <span className="text-4xl font-bold text-foreground">
                        ${plan.price}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        /{plan.period}
                      </span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-foreground">
                      Custom
                    </span>
                  )}
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <Check className="size-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.featured ? (
                  <Button
                    href={plan.href}
                    className="w-full bg-gradient-to-r from-orange-500 to-blue-500 border-0 text-white hover:shadow-lg hover:shadow-orange-500/25 hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    {plan.cta}
                    <ArrowRight className="size-4" data-slot="icon" />
                  </Button>
                ) : (
                  <Button href={plan.href} outline className="w-full">
                    {plan.cta}
                    <ArrowRight className="size-4" data-slot="icon" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* FAQ or trust */}
        <div className="max-w-3xl mx-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-8 text-center">
          <Subheading className="mb-2">Questions?</Subheading>
          <Text className="!text-muted-foreground mb-6">
            We offer a 14-day free trial on Pro. No credit card required. Cancel
            anytime.
          </Text>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Bell className="size-4 text-orange-500" />
              Price alerts on Pro
            </span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <BarChart3 className="size-4 text-orange-500" />
              Full history & export
            </span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <Wallet className="size-4 text-orange-500" />
              Unlimited wallets
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
