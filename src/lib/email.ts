/** Sends renewal reminder. Uses Resend when RESEND_API_KEY is set; otherwise logs. */
export async function sendRenewalEmail(params: {
  to: string;
  name: string;
  memberId: string;
  expiryDate: Date;
  membershipType: string;
}) {
  const subject = `Membership renewal reminder — ${params.memberId}`;
  const body = `Dear ${params.name},

Your ${params.membershipType} membership (${params.memberId}) will expire on ${params.expiryDate.toLocaleDateString()}.

Please log in to the portal to submit your renewal payment.

Thank you.`;

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "noreply@example.com";

  if (!apiKey) {
    console.log("[email:dev]", { to: params.to, subject, body });
    return { ok: true, mode: "console" as const };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: params.to,
      subject,
      text: body,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Email failed: ${err}`);
  }
  return { ok: true, mode: "resend" as const };
}
