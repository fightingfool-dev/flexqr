import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { PLANS } from "@/lib/plans";

// Shows live config state — only accessible when signed in.
// Hit GET /api/billing/debug after subscribing to diagnose issues.
export async function GET() {
  try {
    await requireUser();
  } catch {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const starterPriceId = process.env.STRIPE_PRICE_STARTER_MONTHLY ?? null;
  const proPriceId     = process.env.STRIPE_PRICE_PRO_MONTHLY ?? null;
  const webhookSecret  = env.STRIPE_WEBHOOK_SECRET;
  const stripeKey      = process.env.STRIPE_SECRET_KEY ?? "";

  const info: Record<string, unknown> = {
    stripeConfigured: !!stripe,
    stripeKeyMode: stripeKey.startsWith("sk_live_") ? "LIVE" : stripeKey.startsWith("sk_test_") ? "TEST" : "MISSING",
    webhookSecretPresent: !!webhookSecret,
    webhookSecretMode: webhookSecret?.startsWith("whsec_") ? "OK" : "MISSING",
    prices: {
      STARTER: starterPriceId ?? "NOT SET",
      PRO: proPriceId ?? "NOT SET",
    },
    planMapping: {
      STARTER: PLANS.STARTER.priceId ?? "NOT SET — check STRIPE_PRICE_STARTER_MONTHLY",
      PRO: PLANS.PRO.priceId ?? "NOT SET — check STRIPE_PRICE_PRO_MONTHLY",
    },
  };

  // Verify the price IDs actually exist in Stripe
  if (stripe) {
    for (const [label, id] of [["STARTER", starterPriceId], ["PRO", proPriceId]] as const) {
      if (!id) { info[`stripe_${label}`] = "price ID env var not set"; continue; }
      try {
        const price = await stripe.prices.retrieve(id);
        info[`stripe_${label}`] = {
          found: true,
          active: price.active,
          currency: price.currency,
          amount: price.unit_amount,
          mode: price.livemode ? "LIVE" : "TEST",
        };
      } catch {
        info[`stripe_${label}`] = `NOT FOUND in Stripe — price ID "${id}" may be wrong or from wrong mode`;
      }
    }
  }

  return NextResponse.json(info, { status: 200 });
}
