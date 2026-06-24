import { NextResponse, type NextRequest } from "next/server";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_TO = "juanluisperezc1996@gmail.com";
const MAX_LEN = { name: 120, email: 160, company: 160, projectType: 80, message: 4000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Minimal in-memory rate limit (best-effort; resets per server instance).
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

type Payload = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  message: string;
};

async function sendViaSmtp(to: string, data: Payload, text: string, html: string) {
  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM || `Portfolio <${process.env.SMTP_USER}>`,
    to,
    replyTo: `${data.name} <${data.email}>`,
    subject: `Nuevo contacto del portfolio — ${data.name}`,
    text,
    html,
  });
}

async function sendViaFormsubmit(to: string, data: Payload, origin: string) {
  // FormSubmit rejects requests without a browser-like Origin/Referer.
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: origin,
      Referer: `${origin}/`,
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      company: data.company || "—",
      projectType: data.projectType || "—",
      message: data.message,
      _subject: `Nuevo contacto del portfolio — ${data.name}`,
      _template: "table",
    }),
  });
  if (!res.ok) throw new Error(`formsubmit responded ${res.status}`);
  const json = (await res.json().catch(() => ({}))) as { success?: string | boolean; message?: string };
  const ok = json.success === true || json.success === "true";
  // First-ever submission returns an activation notice (one-time setup); treat as accepted.
  const pendingActivation = /activat/i.test(json.message ?? "");
  if (!ok && !pendingActivation) {
    throw new Error(`formsubmit did not confirm delivery: ${json.message ?? "unknown"}`);
  }
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field.
  if (clean(body._gotcha, 200)) {
    return NextResponse.json({ ok: true });
  }

  const data: Payload = {
    name: clean(body.name, MAX_LEN.name),
    email: clean(body.email, MAX_LEN.email),
    company: clean(body.company, MAX_LEN.company),
    projectType: clean(body.projectType, MAX_LEN.projectType),
    message: clean(body.message, MAX_LEN.message),
  };

  if (!data.name || !data.message || !EMAIL_RE.test(data.email)) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 422 });
  }

  const to = process.env.CONTACT_TO || DEFAULT_TO;
  const text =
    `Nombre: ${data.name}\n` +
    `Email: ${data.email}\n` +
    `Empresa: ${data.company || "—"}\n` +
    `Tipo de proyecto: ${data.projectType || "—"}\n\n` +
    `${data.message}\n`;
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const html =
    `<h2>Nuevo contacto del portfolio</h2>` +
    `<p><strong>Nombre:</strong> ${esc(data.name)}<br/>` +
    `<strong>Email:</strong> ${esc(data.email)}<br/>` +
    `<strong>Empresa:</strong> ${esc(data.company || "—")}<br/>` +
    `<strong>Tipo de proyecto:</strong> ${esc(data.projectType || "—")}</p>` +
    `<p style="white-space:pre-wrap">${esc(data.message)}</p>`;

  try {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      await sendViaSmtp(to, data, text, html);
    } else {
      const origin = request.nextUrl.origin.startsWith("https") ? request.nextUrl.origin : SITE_URL;
      await sendViaFormsubmit(to, data, origin);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("contact form send failed:", error);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
