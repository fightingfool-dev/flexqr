"use client";

import { use } from "react";
import { useActionState } from "react";
import { signUp } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type State = { error?: string; message?: string };

type Props = {
  searchParams: Promise<{ prefillUrl?: string }>;
};

export function SignUpForm({ searchParams }: Props) {
  const { prefillUrl } = use(searchParams);
  const [state, action, pending] = useActionState<State, FormData>(signUp, {});

  if (state.message) {
    return (
      <p className="rounded-md bg-muted px-3 py-4 text-sm text-center text-muted-foreground">
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
      {prefillUrl && <input type="hidden" name="prefillUrl" value={prefillUrl} />}
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
