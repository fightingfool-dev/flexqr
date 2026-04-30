"use client";

import { useActionState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContact, type ContactState } from "@/actions/contact";

const initial: ContactState = {};

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(
    submitContact,
    initial
  );

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-5 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-semibold tracking-tight">Message sent</h2>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            We read every message and usually reply within one business day.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Your name"
            autoComplete="name"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="subject">
          Subject{" "}
          <span className="text-xs text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Input
          id="subject"
          name="subject"
          placeholder="What's this about?"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us how we can help..."
          className="min-h-[140px] resize-y"
          required
        />
      </div>

      {state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" disabled={pending} className="w-full sm:w-auto px-8">
        {pending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {pending ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
