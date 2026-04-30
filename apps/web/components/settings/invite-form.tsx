"use client";

import { useActionState } from "react";
import { Loader2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { inviteMember } from "@/actions/invitations";

type State = { error?: string; success?: string };
const initial: State = {};

export function InviteForm() {
  const [state, action, pending] = useActionState<State, FormData>(inviteMember, initial);

  return (
    <form action={action} className="space-y-3">
      {state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      {state.success && (
        <p className="text-sm text-emerald-600">{state.success}</p>
      )}
      <div className="flex gap-2">
        <Input
          name="email"
          type="email"
          placeholder="colleague@company.com"
          required
          className="flex-1"
        />
        <select
          name="role"
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="MEMBER">Member</option>
          <option value="ADMIN">Admin</option>
        </select>
        <Button type="submit" disabled={pending} size="sm" className="gap-1.5 shrink-0">
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          Invite
        </Button>
      </div>
    </form>
  );
}
