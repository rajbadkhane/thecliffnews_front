import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.email("Please provide a valid email").max(200),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(5000),
});

const escapeHtml = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export async function POST(request: NextRequest) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  const toAddress = (
    process.env.CONTACT_TO_EMAIL || gmailUser || ""
  ).toLowerCase();

  if (!gmailUser || !gmailPass || !toAddress) {
    console.error("Contact route: missing GMAIL_USER / GMAIL_APP_PASSWORD / CONTACT_TO_EMAIL");
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const { name, email, subject, message } = parsed.data;

  const html = `
    <div style="font-family:system-ui,Segoe UI,Roboto,sans-serif;line-height:1.6;color:#111">
      <h2 style="margin:0 0 16px;color:#ea580c">New contact form submission</h2>
      <table style="border-collapse:collapse">
        <tr><td style="padding:4px 12px 4px 0;color:#666"><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666"><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666"><strong>Subject</strong></td><td>${escapeHtml(subject)}</td></tr>
      </table>
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
      <div style="white-space:pre-wrap">${escapeHtml(message)}</div>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    await transporter.sendMail({
      from: `"The Cliff News Contact" <${gmailUser}>`,
      to: toAddress,
      replyTo: `"${name}" <${email}>`,
      subject: `[Contact] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
