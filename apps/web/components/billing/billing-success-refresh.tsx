"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * When Stripe redirects back to ?billing=success the webhook may not have fired yet.
 * This component calls router.refresh() every 2 s for up to 10 s so the page picks
 * up the database update as soon as the webhook lands, without a manual reload.
 */
export function BillingSuccessRefresh({ currentPlan }: { currentPlan: string }) {
  const router = useRouter();

  useEffect(() => {
    if (currentPlan !== "FREE") return; // already upgraded — nothing to do

    let attempts = 0;
    const id = setInterval(() => {
      router.refresh();
      attempts++;
      if (attempts >= 5) clearInterval(id); // stop after 10 s
    }, 2000);

    return () => clearInterval(id);
  }, [router, currentPlan]);

  return null;
}
