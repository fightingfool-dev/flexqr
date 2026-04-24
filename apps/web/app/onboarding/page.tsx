import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Create your workspace" };

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  await requireUser();
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Create your workspace</CardTitle>
            <CardDescription>
              Give your workspace a name. You can change it later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OnboardingForm next={next} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
