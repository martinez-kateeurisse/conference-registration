import nodemailer from "nodemailer";

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/** Sends password reset email via Gmail SMTP. Falls back to console.log in dev if credentials are missing. */
export async function sendPasswordResetEmail(params: { to: string; resetUrl: string }) {
  const subject = "Reset your password — Conference Portal";
  const html = `
    <p>You requested a password reset for your Conference Portal account.</p>
    <p><a href="${params.resetUrl}">Click here to reset your password</a></p>
    <p>This link expires in 1 hour. If you did not request this, ignore this email.</p>
  `;
  const text = `Reset your password here: ${params.resetUrl}\n\nThis link expires in 1 hour.`;

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log("[email:dev] Password reset link:", params.resetUrl);
    return { ok: true, mode: "console" as const };
  }

  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Conference Portal" <${process.env.GMAIL_USER}>`,
    to: params.to,
    subject,
    text,
    html,
  });

  return { ok: true, mode: "gmail" as const };
}

/** Sends renewal reminder via Gmail SMTP. Falls back to console.log in dev if credentials are missing. */
export async function sendRenewalEmail(params: {
  to: string;
  name: string;
  memberId: string;
  expiryDate: Date;
  membershipType: string;
}) {
  const subject = `Membership renewal reminder — ${params.memberId}`;
  const text = `Dear ${params.name},

Your ${params.membershipType} membership (${params.memberId}) will expire on ${params.expiryDate.toLocaleDateString()}.

Please log in to the portal to submit your renewal payment.

Thank you.`;

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log("[email:dev]", { to: params.to, subject, text });
    return { ok: true, mode: "console" as const };
  }

  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Conference Portal" <${process.env.GMAIL_USER}>`,
    to: params.to,
    subject,
    text,
    html: `<pre>${text}</pre>`,
  });

  return { ok: true, mode: "gmail" as const };
}
