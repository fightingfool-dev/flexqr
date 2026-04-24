import type { Plan } from "@/lib/database.types";

export type PlanMeta = {
  label: string;
  qrLimit: number;       // Infinity = unlimited
  priceMonthly: number;  // USD cents, 0 = free
  priceId: string | null;
  features: string[];
};

export const PLANS: Record<Plan, PlanMeta> = {
  FREE: {
    label: "Free",
    qrLimit: 5,
    priceMonthly: 0,
    priceId: null,
    features: [
      "5 QR codes",
      "Basic analytics",
      "Dynamic redirects",
    ],
  },
  STARTER: {
    label: "Starter",
    qrLimit: 50,
    priceMonthly: 900,
    priceId: process.env.STRIPE_PRICE_STARTER_MONTHLY ?? null,
    features: [
      "50 QR codes",
      "Full analytics",
      "Dynamic redirects",
      "Priority support",
    ],
  },
  PRO: {
    label: "Pro",
    qrLimit: Infinity,
    priceMonthly: 2900,
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY ?? null,
    features: [
      "Unlimited QR codes",
      "Full analytics",
      "Dynamic redirects",
      "Custom domains",
      "Priority support",
    ],
  },
  ENTERPRISE: {
    label: "Enterprise",
    qrLimit: Infinity,
    priceMonthly: 0,
    priceId: null,
    features: [
      "Unlimited QR codes",
      "Full analytics",
      "Custom domains",
      "SSO",
      "SLA guarantee",
      "Dedicated support",
    ],
  },
};

// Map used in createQRCode to enforce limits.
export const PLAN_LIMITS: Record<Plan, number> = Object.fromEntries(
  Object.entries(PLANS).map(([plan, meta]) => [plan, meta.qrLimit])
) as Record<Plan, number>;

export function planFromPriceId(priceId: string | null | undefined): Plan {
  if (!priceId) return "FREE";
  for (const [plan, meta] of Object.entries(PLANS) as [Plan, PlanMeta][]) {
    if (meta.priceId && meta.priceId === priceId) return plan;
  }
  return "FREE";
}

export function formatPrice(cents: number): string {
  if (cents === 0) return "Free";
  return `$${(cents / 100).toFixed(0)}/mo`;
}
