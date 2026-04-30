"use server";

import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser, getUserWorkspaces, getDbUser, getUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendInviteEmail } from "@/lib/email";
import { logError, isNextInternalError } from "@/lib/logger";

type State = { error?: string; success?: string };

export async function inviteMember(
  _prev: State,
  formData: FormData
): Promise<State> {
  try {
    const authUser = await requireUser();
    const workspaces = await getUserWorkspaces(authUser.id);
    const workspace = workspaces[0];
    if (!workspace) return { error: "No workspace found." };

    const email = (formData.get("email") as string).trim().toLowerCase();
    const role = (formData.get("role") as string) === "ADMIN" ? "ADMIN" : "MEMBER";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: "A valid email address is required." };
    }

    // Check plan allows team features (PRO+)
    if (workspace.plan === "FREE" || workspace.plan === "STARTER") {
      return { error: "Team invitations require a Pro or Enterprise plan." };
    }

    // Don't invite existing members
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      const { data: existingMember } = await supabaseAdmin
        .from("workspace_members")
        .select("id")
        .eq("workspaceId", workspace.id)
        .eq("userId", existingUser.id)
        .maybeSingle();
      if (existingMember) return { error: `${email} is already a member of this workspace.` };
    }

    // Don't create duplicate pending invitations
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: existing } = await supabaseAdmin
      .from("invitations")
      .select("id")
      .eq("workspaceId", workspace.id)
      .eq("email", email)
      .is("acceptedAt", null)
      .gt("expiresAt", new Date().toISOString())
      .maybeSingle();

    if (existing) return { error: `An invitation is already pending for ${email}.` };

    const token = randomBytes(32).toString("hex");
    const { error: insertError } = await supabaseAdmin.from("invitations").insert({
      workspaceId: workspace.id,
      email,
      role,
      token,
      expiresAt: expires,
    });

    if (insertError) return { error: insertError.message };

    const inviterDbUser = await getDbUser(authUser.id);
    const inviterName = inviterDbUser?.name ?? authUser.email ?? "Someone";
    await sendInviteEmail(email, workspace.name, inviterName, token);

    revalidatePath("/dashboard/settings");
    return { success: `Invitation sent to ${email}.` };
  } catch (err) {
    if (isNextInternalError(err)) throw err;
    logError("action:inviteMember", err);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function revokeInvitation(invitationId: string): Promise<void> {
  try {
    await requireUser();
    await supabaseAdmin.from("invitations").delete().eq("id", invitationId);
    revalidatePath("/dashboard/settings");
  } catch (err) {
    logError("action:revokeInvitation", err, { invitationId });
  }
}

export async function removeMember(memberId: string): Promise<void> {
  try {
    const authUser = await requireUser();
    const workspaces = await getUserWorkspaces(authUser.id);
    const workspace = workspaces[0];
    if (!workspace) return;

    // Cannot remove the owner
    const { data: member } = await supabaseAdmin
      .from("workspace_members")
      .select("role, userId")
      .eq("id", memberId)
      .single();

    if (!member) return;
    if ((member.role as string) === "OWNER") return;
    if ((member.userId as string) === authUser.id) return;

    await supabaseAdmin.from("workspace_members").delete().eq("id", memberId);
    revalidatePath("/dashboard/settings");
  } catch (err) {
    logError("action:removeMember", err, { memberId });
  }
}

export async function acceptInvitation(token: string): Promise<{ error?: string; workspaceId?: string }> {
  try {
    // Use getUser (no redirect) so we can send back to the invite URL after sign-in
    const authUser = await getUser();
    if (!authUser) {
      redirect(`/sign-in?next=${encodeURIComponent(`/invite/${token}`)}`);
    }

    const { data: invite } = await supabaseAdmin
      .from("invitations")
      .select("*")
      .eq("token", token)
      .is("acceptedAt", null)
      .gt("expiresAt", new Date().toISOString())
      .maybeSingle();

    if (!invite) return { error: "This invitation is invalid or has expired." };

    // Check email matches if the invited user already has an account
    if ((invite.email as string).toLowerCase() !== authUser.email?.toLowerCase()) {
      return { error: `This invitation was sent to ${invite.email}. Please sign in with that email address.` };
    }

    // Check not already a member
    const { data: existing } = await supabaseAdmin
      .from("workspace_members")
      .select("id")
      .eq("workspaceId", invite.workspaceId)
      .eq("userId", authUser.id)
      .maybeSingle();

    if (!existing) {
      const { error: memberError } = await supabaseAdmin.from("workspace_members").insert({
        workspaceId: invite.workspaceId,
        userId: authUser.id,
        role: invite.role,
      });
      if (memberError) return { error: memberError.message };
    }

    await supabaseAdmin
      .from("invitations")
      .update({ acceptedAt: new Date().toISOString() })
      .eq("id", invite.id);

    return { workspaceId: invite.workspaceId as string };
  } catch (err) {
    if (isNextInternalError(err)) throw err;
    logError("action:acceptInvitation", err, { token });
    return { error: "Something went wrong." };
  }
}
