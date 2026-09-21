import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
// "From" address. Must be on a domain you've verified in Resend.
// Defaults to a safe Resend test sender so it still works before the domain is verified.
const FROM = process.env.RESEND_FROM || "Carlos Picardo <onboarding@resend.dev>";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
}

export interface SendResult {
  ok: boolean;
  id?: string;
  error?: string;
  skipped?: boolean;
}

/**
 * Send a transactional email via Resend.
 * Works in production (pure HTTPS call) — unlike the sandbox-only `send-email` CLI.
 * If RESEND_API_KEY is missing it returns { ok:false, skipped:true } so the
 * caller can still store the message and never crash.
 */
export async function sendEmail(opts: SendEmailOptions): Promise<SendResult> {
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — email not sent (message stored only)");
    return { ok: false, skipped: true };
  }
  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: Array.isArray(opts.to) ? opts.to : [opts.to],
      subject: opts.subject,
      html: opts.html,
      text: opts.text ?? (opts.html ? undefined : opts.subject),
      replyTo: opts.replyTo,
    });
    if (error) {
      console.error("[email] resend error:", error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true, id: data?.id };
  } catch (e) {
    console.error("[email] send failed:", e);
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
