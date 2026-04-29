"use server";

import { redirect } from "next/navigation";
import { requireUser, getUserWorkspaces } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { logError, isNextInternalError } from "@/lib/logger";

export async function createCheckoutSession(
  priceId: string,
  _formData: FormData
): Promise<void> {
  try {
    if (!stripe) throw new Error("Stripe is not configured.");

    const user = await requireUser();
    const workspaces = await getUserWorkspaces(user.id);
    const workspace = workspaces[0]!;

    const { data: existingSub } = await supabaseAdmin
      .from("subscriptions")
      .select("stripeCustomerId")
      .eq("workspaceId", workspace.id)
      .maybeSingle();

    let customerId: string;
    if (existingSub?.stripeCustomerId) {
      customerId = existingSub.stripeCustomerId as string;
    } else {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { workspaceId: workspace.id },
      });
      customerId = customer.id;
    }

    const appUrl = new URL(env.APP_URL).origin;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard/settings?billing=success`,
      cancel_url: `${appUrl}/dashboard/settings?billing=cancelled`,
      metadata: { workspaceId: workspace.id },
      subscription_data: { metadata: { workspaceId: workspace.id } },
      allow_promotion_codes: true,
    });

    if (!session.url) throw new Error("Stripe did not return a checkout URL.");
    redirect(session.url);
  } catch (err) {
    if (isNextInternalError(err)) throw err;
    logError("action:createCheckoutSession", err, { priceId });
    throw err;
  }
}

export async function createPortalSession(
  _prev: { error?: string },
  _formData: FormData
): Promise<{ error?: string }> {
  try {
    if (!stripe) return { error: "Billing is not configured. Please contact support." };

    const user = await requireUser();
    const workspaces = await getUserWorkspaces(user.id);
    const workspace = workspaces[0]!;

    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("stripeCustomerId")
      .eq("workspaceId", workspace.id)
      .maybeSingle();

    if (!sub?.stripeCustomerId) {
      return { error: "No billing record found. Please contact support@analogqr.com." };
    }

    const appUrl = new URL(env.APP_URL).origin;

    let session;
    try {
      session = await stripe.billingPortal.sessions.create({
        customer: sub.stripeCustomerId as string,
        return_url: `${appUrl}/dashboard/settings`,
      });
    } catch (stripeErr: unknown) {
      const msg = stripeErr instanceof Error ? stripeErr.message : String(stripeErr);
      logError("action:createPortalSession:stripe", stripeErr);
      // Most common cause: portal not configured in Stripe dashboard
      if (msg.includes("No configuration")) {
        return { error: "The billing portal is not configured yet. Please contact support@analogqr.com." };
      }
      return { error: `Stripe error: ${msg}` };
    }

    redirect(session.url);
  } catch (err) {
    if (isNextInternalError(err)) throw err;
    logError("action:createPortalSession", err);
    return { error: "Something went wrong. Please try again or contact support." };
  }
}
