"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2, Check } from "lucide-react";
import { updateQRCode } from "@/actions/qr-codes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DbQRCode } from "@/lib/database.types";

type State = { error?: string };

export function EditQRForm({ qrCode }: { qrCode: DbQRCode }) {
  const action = updateQRCode.bind(null, qrCode.id);
  const [state, boundAction, pending] = useActionState<State, FormData>(
    action,
    {}
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state.error) {
      setShowSuccess(true);
      const t = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(t);
    }
    wasPending.current = pending;
  }, [pending, state.error]);

  return (
    <form action={boundAction} className="space-y-5">
      {state.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      {showSuccess && (
        <div className="flex items-center gap-2 rounded-md bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300">
          <Check className="h-3.5 w-3.5 shrink-0" />
          Changes saved
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={qrCode.name}
          disabled={pending}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="destinationUrl">Destination URL</Label>
        <Input
          id="destinationUrl"
          name="destinationUrl"
          type="url"
          defaultValue={qrCode.destinationUrl}
          disabled={pending}
          required
        />
        <p className="text-xs text-muted-foreground">
          Changing this updates the redirect immediately. No reprinting needed.
        </p>
      </div>

      <div className="flex gap-3 pt-1">
        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Saving…
            </>
          ) : (
            "Save changes"
          )}
        </Button>
        <Button type="button" variant="outline" disabled={pending} onClick={() => history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
