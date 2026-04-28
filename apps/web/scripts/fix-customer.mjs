/**
 * One-time fix: looks up a customer by email in Supabase and upgrades their plan.
 *
 * With live Stripe key (full sync):
 *   node --env-file=.env.local scripts/fix-customer.mjs fuladija@gmail.com
 *
 * With plan override (skips Stripe lookup, use when .env.local has test keys):
 *   node --env-file=.env.local scripts/fix-customer.mjs fuladija@gmail.com STARTER
 *   node --env-file=.env.local scripts/fix-customer.mjs fuladija@gmail.com PRO
 */

import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const EMAIL = process.argv[2];
const PLAN_OVERRIDE = process.argv[3]?.toUpperCase();

if (!EMAIL) {
  console.error("Usage: node --env-file=.env.local scripts/fix-customer.mjs <email> [STARTER|PRO]");
  process.exit(1);
}

const {
  NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  STRIPE_SECRET_KEY,
  STRIPE_PRICE_STARTER_MONTHLY,
  STRIPE_PRICE_PRO_MONTHLY,
} = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !STRIPE_SECRET_KEY) {
  console.error("Missing env vars — make sure .env.local has SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const stripe = new Stripe(STRIPE_SECRET_KEY);

function planFromPriceId(priceId) {
  if (priceId === STRIPE_PRICE_PRO_MONTHLY) return "PRO";
  if (priceId === STRIPE_PRICE_STARTER_MONTHLY) return "STARTER";
  return null;
}

console.log(`\nFixing account for: ${EMAIL}\n`);

// 1. Find the user in Supabase
const { data: user, error: userError } = await supabase
  .from("users")
  .select("id, email")
  .eq("email", EMAIL)
  .maybeSingle();

if (userError || !user) {
  console.error("User not found in database:", userError?.message ?? "no row");
  process.exit(1);
}
console.log(`✓ Found user: ${user.id}`);

// 2. Get their workspace
const { data: member } = await supabase
  .from("workspace_members")
  .select("workspaces(*)")
  .eq("userId", user.id)
  .limit(1)
  .single();

const workspace = member?.workspaces;
if (!workspace) {
  console.error("No workspace found for this user.");
  process.exit(1);
}
console.log(`✓ Found workspace: ${workspace.id} (current plan: ${workspace.plan})`);

let plan;
let stripeCustomerId = null;
let stripeSubscriptionId = null;
let stripePriceId = null;
let currentPeriodEnd = null;

if (PLAN_OVERRIDE) {
  // --- Manual override: skip Stripe, just set the plan ---
  if (!["STARTER", "PRO", "ENTERPRISE"].includes(PLAN_OVERRIDE)) {
    console.error("Plan must be STARTER, PRO, or ENTERPRISE");
    process.exit(1);
  }
  plan = PLAN_OVERRIDE;
  console.log(`  Using plan override: ${plan}`);
} else {
  // --- Auto-detect from Stripe ---
  // 3. Find their Stripe customer
  const customers = await stripe.customers.list({ email: EMAIL, limit: 5 });
  if (customers.data.length === 0) {
    console.error(
      "No Stripe customer found for this email in the current Stripe mode.\n" +
      "If your .env.local uses test-mode keys but the charge was in live mode, re-run with a plan:\n" +
      `  node --env-file=.env.local scripts/fix-customer.mjs ${EMAIL} STARTER`
    );
    process.exit(1);
  }
  const customer = customers.data[0];
  console.log(`✓ Found Stripe customer: ${customer.id}`);

  // 4. Get their active subscription
  const active = await stripe.subscriptions.list({ customer: customer.id, status: "active", limit: 1 });
  const trialing = await stripe.subscriptions.list({ customer: customer.id, status: "trialing", limit: 1 });
  const subscription = active.data[0] ?? trialing.data[0];

  if (!subscription) {
    console.error("No active subscription found in Stripe for this customer.");
    process.exit(1);
  }

  stripePriceId = subscription.items.data[0]?.price.id ?? null;
  plan = planFromPriceId(stripePriceId);
  stripeCustomerId = customer.id;
  stripeSubscriptionId = subscription.id;
  const periodEndTs = subscription.items.data[0]?.current_period_end;
  currentPeriodEnd = periodEndTs ? new Date(periodEndTs * 1000).toISOString() : null;

  console.log(`✓ Found subscription: ${subscription.id}`);
  console.log(`  Price ID: ${stripePriceId}`);
  console.log(`  Detected plan: ${plan ?? "UNKNOWN"}`);

  if (!plan) {
    console.error(
      `Could not map price ID "${stripePriceId}" to a plan.\n` +
      `Re-run with a plan override: node --env-file=.env.local scripts/fix-customer.mjs ${EMAIL} STARTER`
    );
    process.exit(1);
  }
}

// 5. Update workspace plan
const { error: planError } = await supabase
  .from("workspaces")
  .update({ plan, updatedAt: new Date().toISOString() })
  .eq("id", workspace.id);

if (planError) {
  console.error("Failed to update workspace plan:", planError.message);
  process.exit(1);
}
console.log(`✓ Workspace plan updated → ${plan}`);

// 6. Upsert subscription record (only if we have Stripe data)
if (stripeCustomerId) {
  const { error: subError } = await supabase.from("subscriptions").upsert(
    {
      workspaceId: workspace.id,
      stripeCustomerId,
      stripeSubscriptionId,
      stripePriceId,
      status: "ACTIVE",
      currentPeriodEnd,
    },
    { onConflict: "workspaceId" }
  );
  if (subError) {
    console.error("Failed to upsert subscription:", subError.message);
    process.exit(1);
  }
  console.log(`✓ Subscription record synced`);
} else {
  console.log(`  (Skipped Stripe subscription sync — plan set manually)`);
}

console.log(`\nDone. ${EMAIL} is now on the ${plan} plan.`);
