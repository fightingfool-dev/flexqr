"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { createWorkspace } from "@/actions/workspaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type State = { error?: string };

export function OnboardingForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<State, FormData>(
    createWorkspace,
    {}
  );

  return (
    <form action={action} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}
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
          disabled={pending}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            Creating…
          </>
        ) : (
          "Create workspace"
        )}
      </Button>
    </form>
  );
}
