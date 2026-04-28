import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getUser, getUserWorkspaces } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateShortCode } from "@/lib/qr";
import { PLAN_LIMITS } from "@/lib/plans";
import { getUseCaseConfig } from "@/lib/use-cases";
import type { Plan } from "@/lib/database.types";

export default async function CreateConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string; usecase?: string }>;
}) {
  const { url: rawUrl, usecase } = await searchParams;
  if (!rawUrl) redirect("/");

  let destinationUrl: string;
  try {
    destinationUrl = new URL(rawUrl).toString();
  } catch {
    redirect("/");
  }

  const encodedUrl = encodeURIComponent(destinationUrl);
  const selfParams = new URLSearchParams({ url: encodedUrl });
  if (usecase) selfParams.set("usecase", usecase);
  const selfPath = `/create/confirm?${selfParams.toString()}`;

  // Auth — bounce to sign-up so the next param is preserved
  const user = await getUser();
  if (!user) {
    redirect(`/sign-up?next=${encodeURIComponent(selfPath)}`);
  }

  // Workspace — new users must onboard first
  const workspaces = await getUserWorkspaces(user.id);
  if (workspaces.length === 0) {
    redirect(`/onboarding?next=${encodeURIComponent(selfPath)}`);
  }

  const workspace = workspaces[0]!;

  // Plan limit check
  const { count } = await supabaseAdmin
    .from("qr_codes")
    .select("*", { count: "exact", head: true })
    .eq("workspaceId", workspace.id);

  const limit = PLAN_LIMITS[workspace.plan as Plan];
  if (count !== null && count >= limit) {
    redirect("/dashboard/settings");
  }

  // Name: use suggested name from use-case config, fall back to hostname
  const useCaseConfig = usecase ? getUseCaseConfig(usecase) : null;
  let name: string;
  if (useCaseConfig) {
    name = useCaseConfig.suggestedName;
  } else {
    try {
      name = new URL(destinationUrl).hostname.replace(/^www\./, "");
    } catch {
      name = "My QR Code";
    }
  }

  const shortCode = await generateShortCode();

  // contentJson: store url + usecase for future reference; does not affect redirect
  const contentJson: Record<string, string> = { url: destinationUrl };
  if (usecase) contentJson.usecase = usecase;

  const { data: created, error } = await supabaseAdmin
    .from("qr_codes")
    .insert({
      workspaceId: workspace.id,
      shortCode,
      name,
      destinationUrl,
      type: "URL",
      tags: [],
      contentJson,
      updatedAt: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !created) redirect(`/create?url=${encodedUrl}`);

  revalidatePath("/dashboard/qr-codes");
  revalidatePath("/dashboard");
  redirect(`/dashboard/qr-codes/${created.id}?new=1`);
}
