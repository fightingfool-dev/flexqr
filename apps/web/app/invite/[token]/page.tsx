"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { acceptInvitation } from "@/actions/invitations";

export default function AcceptInvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function accept() {
      const { token } = await params;
      const result = await acceptInvitation(token);
      if (result.error) {
        setMessage(result.error);
        setStatus("error");
      } else {
        setStatus("success");
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    }
    accept();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="rounded-2xl border bg-card shadow-sm p-8 text-center max-w-sm w-full space-y-4">
        {status === "loading" && (
          <>
            <Loader2 className="h-10 w-10 mx-auto text-primary animate-spin" />
            <h1 className="text-lg font-semibold">Accepting invitation…</h1>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle className="h-10 w-10 mx-auto text-emerald-500" />
            <h1 className="text-lg font-semibold">Invitation accepted!</h1>
            <p className="text-sm text-muted-foreground">Redirecting to your dashboard…</p>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="h-10 w-10 mx-auto text-destructive" />
            <h1 className="text-lg font-semibold">Unable to accept invitation</h1>
            <p className="text-sm text-muted-foreground">{message}</p>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href="/sign-in">Sign in with the invited email</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">Go to dashboard</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
