import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getUser, getUserWorkspaces } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateShortCode } from "@/lib/qr";
import { PLAN_LIMITS } from "@/lib/plans";
import type { Plan } from "@/lib/database.types";

export default async function CreateConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string }>;
}) {
  const { url: rawUrl } = await searchParams;
  if (!rawUrl) redirect("/");

  let destinationUrl: string;
  try {
    destinationUrl = new URL(rawUrl).toString();
  } catch {
    redirect("/");
  }

  const encodedUrl = encodeURIComponent(destinationUrl);
  const selfPath = `/create/confirm?url=${encodedUrl}`;

  // Auth — bounce to sign-up (not sign-in) so the next param is preserved
  const user = await getUser();
  if (!user) {
    redirect(`/sign-up?next=${encodeURIComponent(selfPath)}`);
  }

  // Workspace — new users must onboard first; thread selfPath through
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

  // Derive a readable name from the hostname
  let name: string;
  try {
    name = new URL(destinationUrl).hostname.replace(/^www\./, "");
  } catch {
    name = "My QR Code";
  }

  const shortCode = await generateShortCode();

  const { error } = await supabaseAdmin.from("qr_codes").insert({
    workspaceId: workspace.id,
    shortCode,
    name,
    destinationUrl,
    type: "URL",
    tags: [],
    updatedAt: new Date().toISOString(),
  });

  if (error) redirect(`/create?url=${encodedUrl}`);

  revalidatePath("/dashboard/qr-codes");
  revalidatePath("/dashboard");
  redirect("/dashboard/qr-codes?created=1");
}
