"use server";

import { sendContactEmail } from "@/lib/email";

export type ContactState = {
  success?: boolean;
  error?: string;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const subject = (formData.get("subject") as string)?.trim() || "Contact form message";
  const message = (formData.get("message") as string)?.trim();

  if (!name) return { error: "Name is required." };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: "A valid email address is required." };
  if (!message || message.length < 10)
    return { error: "Message must be at least 10 characters." };

  try {
    await sendContactEmail(name, email, subject, message);
    return { success: true };
  } catch {
    return { error: "Failed to send your message. Please email us directly." };
  }
}
