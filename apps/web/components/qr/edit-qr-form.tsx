"use client";

import { useActionState } from "react";
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

  return (
    <form action={boundAction} className="space-y-5">
      {state.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={qrCode.name}
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
          required
        />
        <p className="text-xs text-muted-foreground">
          Changing this updates the redirect immediately. No reprinting needed.
        </p>
      </div>

      <div className="flex gap-3 pt-1">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
