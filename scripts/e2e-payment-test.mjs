#!/usr/bin/env node
/**
 * End-to-end payment test against live or local site.
 * Usage: BASE_URL=https://conference-registration-live.vercel.app node scripts/e2e-payment-test.mjs
 */
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const EMAIL = process.env.TEST_EMAIL ?? "participant@conference.local";
const PASS = process.env.TEST_PASS ?? "user12345";

const PNG_B64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

function getCookie(res) {
  const h = res.headers.getSetCookie?.() ?? [];
  const single = res.headers.get("set-cookie");
  const parts = h.length ? h : single ? [single] : [];
  return parts.map((c) => c.split(";")[0]).join("; ");
}

async function login() {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASS }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Login failed: ${data.error}`);
  return getCookie(res);
}

async function main() {
  console.log("Testing", BASE);
  const cookie = await login();
  console.log("Login OK");

  const membershipsRes = await fetch(`${BASE}/dashboard/membership`, {
    headers: { cookie },
  });
  if (!membershipsRes.ok) throw new Error("Dashboard fetch failed");
  const html = await membershipsRes.text();
  const match = html.match(/value="(c[a-z0-9]+)"[^>]*>MEM-/i);
  const membershipId = match?.[1];
  if (!membershipId) {
    console.log("No membership in page — apply first via UI or API");
    const applyRes = await fetch(`${BASE}/api/membership/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json", cookie },
      body: JSON.stringify({ type: "INDIVIDUAL_STUDENT" }),
    });
    const applyData = await applyRes.json();
    if (!applyRes.ok) throw new Error(`Apply failed: ${applyData.error}`);
    console.log("Applied:", applyData.membership.memberId);
    return main();
  }

  const payRes = await fetch(`${BASE}/api/membership/payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify({
      membershipId,
      method: "BANK",
      transactionDate: new Date().toISOString().slice(0, 10),
      transactionNo: `TEST-${Date.now()}`,
      amount: 1000,
      paymentFor: "Individual Membership — Student",
      payeeName: "Test User",
      proofBase64: PNG_B64,
      proofFileName: "proof.png",
      proofMimeType: "image/png",
      isRenewal: false,
    }),
  });
  const payData = await payRes.json();
  console.log("Membership payment:", payRes.status, payData);
  if (!payRes.ok) process.exit(1);

  const eventsRes = await fetch(`${BASE}/dashboard/events`, { headers: { cookie } });
  const eventsHtml = await eventsRes.text();
  const eventMatch = eventsHtml.match(/value="(seed-event-2026|c[a-z0-9]+)"/);
  const eventId = eventsHtml.includes("seed-event-2026")
    ? "seed-event-2026"
    : eventMatch?.[1];

  if (eventId) {
    const evPay = await fetch(`${BASE}/api/registrations/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json", cookie },
      body: JSON.stringify({
        eventId,
        attendeeName: "Test Attendee",
        attendeeEmail: EMAIL,
        organization: "Test U",
        method: "EWALLET",
        transactionDate: new Date().toISOString().slice(0, 10),
        transactionNo: `EVT-${Date.now()}`,
        amount: 2500,
        paymentFor: "Conference registration",
        proofBase64: PNG_B64,
        proofFileName: "proof.png",
        proofMimeType: "image/png",
      }),
    });
    const evData = await evPay.json();
    console.log("Event payment:", evPay.status, evData);
    if (!evPay.ok) process.exit(1);
  }

  console.log("All payment API tests passed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
