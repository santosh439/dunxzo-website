/**
 * Emergent managed email (Resend). Node adaptation of the Resend playbook.
 * Sends a notification to a fixed, config-controlled address on lead submission.
 * Recipient + body are server-side only (never caller-controlled) and all lead
 * data is HTML-escaped. Includes the playbook's structural guardrail gate.
 */

// Managed proxy base URL is a CONSTANT (survives deployment) — never from env.
const EMAIL_BASE_URL = "https://integrations.emergentagent.com";
const EMAIL_KEY = process.env.EMERGENT_EMAIL_KEY;
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "DU-NZO";
const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO;
const NOTIFY = process.env.LEAD_NOTIFY_EMAIL;

const escapeHtml = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/* Guardrail gate (G2/G3) — structural defense in depth. Never weaken or skip. */
const SHORTENERS = ["bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly"];
const CRED_ASK = [
  "reply with your password", "reply with the code", "send your password", "cvv",
  "send us your password", "enter your password below", "confirm your card number",
  "your full card number", "seed phrase", "recovery phrase", "verify your card",
  "social security number", "confirm your bank details",
];
const hostOk = (host) => {
  if (!host || host.includes("xn--")) return false;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(":")) return false; // IP literals
  return !SHORTENERS.some((s) => host === s || host.endsWith("." + s));
};
function assertSafeEmail(subject, html) {
  if (/<\s*(form|input|textarea|select)\b/i.test(html)) throw new Error("No forms or input fields in email (G2)");
  const body = `${subject}\n${html}`.toLowerCase();
  for (const p of CRED_ASK) if (body.includes(p)) throw new Error(`Email asks for credentials: ${p} (G2)`);
  const urls = [...html.matchAll(/(?:href|src)\s*=\s*["']?([^"'\s>]+)/gi)].map((m) => m[1]);
  for (const url of urls) {
    const low = url.trim().toLowerCase();
    if (low.startsWith("mailto:") || low.startsWith("tel:") || low.startsWith("cid:") || low.startsWith("#")) continue;
    if (!low.startsWith("https://")) throw new Error(`Email links/assets must be absolute https: ${url} (G3)`);
    let host = "";
    try { const u = new URL(low); host = u.hostname; if (u.username) throw new Error("creds in url"); } catch { throw new Error(`Bad URL: ${url} (G3)`); }
    if (!hostOk(host)) throw new Error(`Shortened/numeric-host URL: ${url} (G3)`);
  }
}

async function sendEmail({ to, subject, html }) {
  if (!EMAIL_KEY || !to) return null;
  assertSafeEmail(subject, html);
  const payload = { to: [to], subject, html, from_name: EMAIL_FROM_NAME };
  if (EMAIL_REPLY_TO) payload.contact_email = EMAIL_REPLY_TO;
  const resp = await fetch(`${EMAIL_BASE_URL}/api/v1/email/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Email-Key": EMAIL_KEY },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) throw new Error(`Email send failed: ${resp.status} ${await resp.text()}`);
  return (await resp.json()).id || null;
}

const SOURCE_LABEL = {
  contact: "Contact form",
  "trust-center": "Trust Center document request",
  launchpad: "Startup Compliance Launchpad roadmap request",
};

/** Build + send the owner notification. Fire-and-forget; never blocks the API. */
export async function notifyLead(lead) {
  if (!NOTIFY) return;
  const label = SOURCE_LABEL[lead.source] || "Website lead";
  const row = (k, v) => `<tr><td style="padding:4px 12px 4px 0;color:#64748b;font-family:Arial,sans-serif;font-size:13px;vertical-align:top">${escapeHtml(k)}</td><td style="padding:4px 0;color:#0f172a;font-family:Arial,sans-serif;font-size:13px">${escapeHtml(v) || "&mdash;"}</td></tr>`;
  const subject = `New ${label} — ${lead.name || lead.email}`;
  const html = `<table role="presentation" width="100%" style="max-width:560px"><tr><td style="padding:24px;font-family:Arial,sans-serif">
    <p style="margin:0 0 4px;font-size:16px;color:#0f172a"><strong>New ${escapeHtml(label)}</strong></p>
    <p style="margin:0 0 16px;font-size:13px;color:#64748b">A new submission arrived on du-nzo.com.</p>
    <table role="presentation">
      ${row("Name", lead.name)}
      ${row("Email", lead.email)}
      ${row("Company", lead.company)}
      ${row("Size", lead.size)}
      ${row("Frameworks", (lead.frameworks || []).join(", "))}
      ${row("Source", lead.source)}
      ${row("Message", lead.message)}
      ${lead.summary ? row("Summary", lead.summary) : ""}
      ${lead.planId ? row("Plan ID", lead.planId) : ""}
    </table>
    <p style="margin:16px 0 0;font-size:12px;color:#94a3b8">Sent by ${escapeHtml(EMAIL_FROM_NAME)}. We never ask for your password or card details by email.</p>
  </td></tr></table>`;
  return sendEmail({ to: NOTIFY, subject, html });
}
