"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { createPortalSession } from "@/actions/billing";
import { Button } from "@/components/ui/button";

export function ManageSubscriptionButton() {
  const [state, action, pending] = useActionState(createPortalSession, {});

  return (
    <div className="space-y-1.5">
      <form action={action}>
        <Button type="submit" variant="outline" size="sm" disabled={pending}>
          {pending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
          Manage subscription
        </Button>
      </form>
      {state?.error && (
        <p className="text-xs text-destructive">{state.error}</p>
      )}
    </div>
  );
}
