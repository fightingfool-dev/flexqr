"use client";

import { useActionState } from "react";
import { createWorkspace } from "@/actions/workspaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type State = { error?: string };

export function OnboardingForm() {
  const [state, action, pending] = useActionState<State, FormData>(
    createWorkspace,
    {}
  );

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="name">Workspace name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Acme Inc."
          autoFocus
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating…" : "Create workspace"}
      </Button>
    </form>
  );
}
