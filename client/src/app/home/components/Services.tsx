"use client";

import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PricingFeature {
  text: string;
}

interface PricingPlan {
  name: string;
  price: number;
  description: string;
  features: PricingFeature[];
  isPopular?: boolean;
}

const PRICING_FEATURES: PricingFeature[] = [
  { text: "All limited links" },
  { text: "Own analytics platform" },
  { text: "Chat support" },
  { text: "Optimize hashtags" },
  { text: "Unlimited users" },
];

const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Intro",
    price: 19,
    description: "For most businesses that want to optimaize web queries.",
    features: PRICING_FEATURES,
  },
  {
    name: "Base",
    price: 39,
    description: "For most businesses that want to optimaize web queries.",
    features: PRICING_FEATURES,
  },
  {
    name: "Popular",
    price: 99,
    description: "For most businesses that want to optimaize web queries.",
    features: PRICING_FEATURES,
    isPopular: true,
  },
  {
    name: "Enterprise",
    price: 199,
    description: "For most businesses that want to optimaize web queries.",
    features: PRICING_FEATURES,
  },
];

const PricingCard = ({ plan, isYearly }: { plan: PricingPlan; isYearly: boolean }) => {
  const baseClasses =
    "px-6 py-4 transition-colors duration-300 transform rounded-lg";
  const cardClasses = plan.isPopular
    ? `${baseClasses} bg-primary dark:bg-gray-800`
    : `${baseClasses} dark:bg-gray-800`;
  const textColor = plan.isPopular
    ? "text-gray-100"
    : "text-gray-800 dark:text-gray-100";
  const descriptionColor = plan.isPopular
    ? "text-gray-300"
    : "text-gray-500 dark:text-gray-300";
  const featureTextColor = plan.isPopular
    ? "text-gray-300"
    : "text-gray-700 dark:text-gray-300";

  const displayPrice = isYearly ? plan.price * 12 : plan.price;

  return (
    <MagicCard className="cursor-pointer" gradientColor="#D9D9D955">
      <div className={cardClasses}>
        <p className={`text-lg font-medium ${textColor}`}>{plan.name}</p>
        <h4 className={`mt-2 text-3xl font-semibold ${textColor}`}>
        ₱{displayPrice}
          <span className="text-base font-normal text-gray-600 dark:text-gray-400">
            / {isYearly ? "Year" : "Month"}
          </span>
        </h4>
        <p className={`mt-4 ${descriptionColor}`}>{plan.description}</p>

        <div className="mt-8 space-y-8">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <CheckIcon
                className={`w-5 h-5 ${
                  plan.isPopular ? "text-white" : "text-black"
                }`}
              />
              <span className={`mx-4 ${featureTextColor}`}>{feature.text}</span>
            </div>
          ))}
        </div>

        <Button
          className={`w-full mt-10 ${
            plan.isPopular ? "bg-white text-black hover:bg-gray-200" : ""
          }`}
        >
          Book a demo <ArrowRightIcon className="w-4 h-4" />
        </Button>
      </div>
    </MagicCard>
  );
};

const Services = () => {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="relative">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 lg:text-5xl dark:text-gray-100">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              No Contracts. No surprise fees.
            </p>
          </div>

          <div className="flex items-center space-x-2 mt-6">
            <Switch
              id="billing-toggle"
              checked={billing === "yearly"}
              onCheckedChange={(checked) =>
                setBilling(checked ? "yearly" : "monthly")
              }
            />
            <Label htmlFor="billing-toggle">
              {billing === "yearly" ? "Yearly" : "Monthly"} billing
            </Label>
          </div>
        </div>
        <div className="grid gap-6 mt-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {PRICING_PLANS.map((plan) => (
            <PricingCard 
              key={plan.name} 
              plan={plan} 
              isYearly={billing === "yearly"} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
