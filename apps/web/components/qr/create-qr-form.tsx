"use client";

import { useActionState } from "react";
import { createQRCode } from "@/actions/qr-codes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type State = { error?: string };

export function CreateQRForm({
  defaultDestinationUrl,
}: {
  defaultDestinationUrl?: string;
}) {
  const [state, action, pending] = useActionState<State, FormData>(
    createQRCode,
    {}
  );

  return (
    <form action={action} className="space-y-5">
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
          placeholder="Summer campaign"
          autoFocus
          required
        />
        <p className="text-xs text-muted-foreground">
          Internal label, not visible to scanners.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="destinationUrl">Destination URL</Label>
        <Input
          id="destinationUrl"
          name="destinationUrl"
          type="url"
          placeholder="https://example.com/landing"
          defaultValue={defaultDestinationUrl}
          required
        />
        <p className="text-xs text-muted-foreground">
          Where scanners are redirected. You can change this later without
          reprinting.
        </p>
      </div>

      <div className="flex gap-3 pt-1">
        <Button type="submit" disabled={pending}>
          {pending ? "Creating…" : "Create QR code"}
        </Button>
        <Button type="button" variant="outline" onClick={() => history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
