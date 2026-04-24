"use client";

import { use } from "react";
import { useActionState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { signUp } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type State = { error?: string; message?: string };

type Props = {
  searchParams: Promise<{ prefillUrl?: string; next?: string }>;
};

export function SignUpForm({ searchParams }: Props) {
  const { prefillUrl, next } = use(searchParams);
  const [state, action, pending] = useActionState<State, FormData>(signUp, {});

  if (state.message) {
    return (
      <div className="rounded-xl border bg-card p-6 text-center space-y-3">
        <div className="flex justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
            <MailCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Check your email</p>
          <p className="text-sm text-muted-foreground">{state.message}</p>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
      {next && <input type="hidden" name="next" value={next} />}
      {prefillUrl && !next && <input type="hidden" name="prefillUrl" value={prefillUrl} />}
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          disabled={pending}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          disabled={pending}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            Creating account…
          </>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  );
}
