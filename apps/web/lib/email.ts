import { Resend } from "resend";
import { env } from "@/lib/env";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
const FROM = `AnalogQR <${env.RESEND_FROM}>`;

function wrap(body: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9fafb;margin:0;padding:0}.wrap{max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb}.header{background:linear-gradient(135deg,#6d28d9,#4f46e5);padding:32px 40px}.logo{color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.5px;text-decoration:none}.body{padding:36px 40px;color:#111827}.h1{font-size:22px;font-weight:700;margin:0 0 16px;color:#111827}.p{font-size:15px;line-height:1.6;margin:0 0 16px;color:#374151}.btn{display:inline-block;background:linear-gradient(135deg,#6d28d9,#4f46e5);color:#fff!important;text-decoration:none;padding:13px 28px;border-radius:8px;font-weight:700;font-size:15px;margin:8px 0 20px}.divider{border:none;border-top:1px solid #e5e7eb;margin:28px 0}.small{font-size:13px;color:#9ca3af;line-height:1.5}.footer{background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center}.footer-text{font-size:12px;color:#9ca3af}</style></head><body><div class="wrap"><div class="header"><a class="logo" href="https://www.analogqr.com">AnalogQR</a></div><div class="body">${body}</div><div class="footer"><p class="footer-text">AnalogQR · Dynamic QR codes for the real world<br><a href="https://www.analogqr.com" style="color:#6d28d9;text-decoration:none">analogqr.com</a></p></div></div></body></html>`;
}

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  if (!resend) return;
  const first = name.split(" ")[0] || "there";
  const html = wrap(`
    <h1 class="h1">Welcome to AnalogQR, ${first}! 👋</h1>
    <p class="p">You're set up and ready to go. Here's how to create your first dynamic QR code in under 60 seconds:</p>
    <p class="p" style="background:#f3f4f6;border-radius:8px;padding:16px;margin:0 0 16px">
      <strong>1.</strong> Go to your dashboard and click <strong>"New QR Code"</strong><br>
      <strong>2.</strong> Choose your type: URL, business card, restaurant menu, and more<br>
      <strong>3.</strong> Download your QR and print or share it anywhere
    </p>
    <p class="p">The best part? You can <strong>update the destination URL anytime</strong> — no reprinting needed. Ever.</p>
    <a class="btn" href="https://www.analogqr.com/dashboard/qr-codes/new">Create My First QR Code →</a>
    <hr class="divider">
    <p class="small">Questions? Reply to this email — we read every one.</p>
  `);
  try {
    await resend.emails.send({ from: FROM, to, subject: "Welcome to AnalogQR — create your first QR code", html });
  } catch {
    // non-fatal — don't block workspace creation
  }
}

export async function sendInviteEmail(to: string, workspaceName: string, inviterName: string, token: string): Promise<void> {
  if (!resend) return;
  const acceptUrl = `${env.APP_URL}/invite/${token}`;
  const html = wrap(`
    <h1 class="h1">You're invited to ${workspaceName}</h1>
    <p class="p"><strong>${inviterName || "Someone"}</strong> has invited you to join their AnalogQR workspace <strong>${workspaceName}</strong>.</p>
    <p class="p">Click below to accept the invitation and start collaborating on QR codes:</p>
    <a class="btn" href="${acceptUrl}">Accept Invitation →</a>
    <hr class="divider">
    <p class="small">This invitation expires in 7 days. If you didn't expect this email, you can safely ignore it.</p>
  `);
  try {
    await resend.emails.send({ from: FROM, to, subject: `You've been invited to join ${workspaceName} on AnalogQR`, html });
  } catch {
    // non-fatal
  }
}

export async function sendContactEmail(
  name: string,
  fromEmail: string,
  subject: string,
  message: string
): Promise<void> {
  if (!resend) throw new Error("Email not configured");
  const to = process.env.CONTACT_EMAIL ?? env.RESEND_FROM;
  const safe = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const html = wrap(`
    <h1 class="h1">New message: ${safe(subject)}</h1>
    <p class="p"><strong>From:</strong> ${safe(name)} &lt;${safe(fromEmail)}&gt;</p>
    <hr class="divider">
    <p class="p" style="white-space:pre-wrap">${safe(message)}</p>
    <hr class="divider">
    <p class="small">Sent via analogqr.com/contact</p>
  `);
  await resend.emails.send({
    from: FROM,
    to,
    replyTo: fromEmail,
    subject: `[Contact] ${subject}`,
    html,
  });
}

export async function sendScanMilestoneEmail(
  to: string,
  qrName: string,
  milestone: number,
  qrId: string
): Promise<void> {
  if (!resend) return;
  const analyticsUrl = `${env.APP_URL}/dashboard/qr-codes/${qrId}/analytics`;
  const html = wrap(`
    <h1 class="h1">🎉 ${milestone} scans on "${qrName}"!</h1>
    <p class="p">Your QR code <strong>"${qrName}"</strong> just hit <strong>${milestone.toLocaleString()} scans</strong>. People are scanning — keep it up!</p>
    <p class="p">Head to your analytics dashboard to see where scans are coming from, what devices people use, and when traffic peaks.</p>
    <a class="btn" href="${analyticsUrl}">View Analytics →</a>
    <hr class="divider">
    <p class="small">You'll receive another notification at the next milestone. These emails can be managed in your dashboard settings.</p>
  `);
  try {
    await resend.emails.send({ from: FROM, to, subject: `🎉 "${qrName}" just hit ${milestone.toLocaleString()} scans!`, html });
  } catch {
    // non-fatal
  }
}
