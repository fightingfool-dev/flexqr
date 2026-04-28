"use client";

import { useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { Lock, Loader2 } from "lucide-react";
import { createQRCode } from "@/actions/qr-codes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type State = { error?: string };

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";

export function CreateQRForm({
  defaultDestinationUrl,
  isPaidPlan = false,
}: {
  defaultDestinationUrl?: string;
  isPaidPlan?: boolean;
}) {
  const [state, action, pending] = useActionState<State, FormData>(
    createQRCode,
    {}
  );
  const [customCode, setCustomCode] = useState("");

  function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Normalize on input: lowercase, strip anything not [a-z0-9-]
    setCustomCode(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
  }

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
          disabled={pending}
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
          type="text"
          placeholder="example.com or https://example.com/landing"
          defaultValue={defaultDestinationUrl}
          disabled={pending}
          required
        />
        <p className="text-xs text-muted-foreground">
          Where scanners are redirected. You can change this later without
          reprinting.
        </p>
      </div>

      {isPaidPlan ? (
        <div className="space-y-1.5">
          <Label htmlFor="customShortCode">
            Short code{" "}
            <span className="text-xs font-normal text-muted-foreground">
              (optional)
            </span>
          </Label>
          <Input
            id="customShortCode"
            name="customShortCode"
            value={customCode}
            onChange={handleCodeChange}
            placeholder="my-brand"
            maxLength={30}
            autoComplete="off"
            spellCheck={false}
            disabled={pending}
          />
          <p className="text-xs text-muted-foreground">
            {customCode ? (
              <span className="font-mono">
                {APP_URL}/r/{customCode}
              </span>
            ) : (
              "Lowercase letters, numbers, hyphens (3–30 chars). Leave blank to auto-generate."
            )}
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          <Label className="text-muted-foreground">Short code</Label>
          <div className="flex items-center justify-between rounded-md border border-input bg-muted/60 px-3 py-2">
            <div className="flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Custom short codes require a paid plan
              </span>
            </div>
            <Link
              href="/dashboard/settings"
              className="text-xs font-medium text-primary hover:underline underline-offset-2 transition-colors shrink-0 ml-3"
            >
              Upgrade
            </Link>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Creating…
            </>
          ) : (
            "Create QR code"
          )}
        </Button>
        <Button type="button" variant="outline" disabled={pending} onClick={() => history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
