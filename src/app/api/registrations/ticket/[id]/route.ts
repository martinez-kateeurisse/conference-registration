import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildQrPayload, generateQrDataUrl } from "@/lib/qr";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession();
  const { id } = await params;
  const registration = await prisma.eventRegistration.findUnique({
    where: { id },
    include: { event: true },
  });

  if (!registration) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }
  if (registration.userId !== session.id && session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (registration.status !== "APPROVED") {
    return NextResponse.json({ error: "Registration is not approved yet" }, { status: 400 });
  }

  const qrDataUrl = await generateQrDataUrl(
    buildQrPayload(registration.id, registration.qrCode),
  );
  const eventDate = new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
    registration.event.startDate,
  );

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Event Ticket - ${escapeHtml(registration.attendeeName)}</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #eef2ff; font-family: Arial, sans-serif; color: #fff; }
    .ticket { width: min(920px, calc(100vw - 32px)); display: grid; grid-template-columns: 1fr 250px; overflow: hidden; border: 1px solid rgba(129,140,248,.35); border-radius: 26px; background: radial-gradient(circle at 70% 30%, rgba(99,102,241,.45), transparent 18rem), radial-gradient(circle at 15% 80%, rgba(34,211,238,.18), transparent 16rem), #0f172a; box-shadow: 0 30px 80px rgba(15,23,42,.34); }
    .main { padding: 38px; }
    .side { display: grid; place-items: center; border-left: 1px dashed rgba(255,255,255,.18); background: rgba(15,23,42,.42); padding: 28px; text-align: center; }
    .kicker { text-transform: uppercase; letter-spacing: .2em; font-weight: 800; font-size: 12px; color: #c7d2fe; }
    h1 { margin: 12px 0 24px; font-size: 34px; line-height: 1.1; text-transform: uppercase; }
    .name { font-size: 24px; font-weight: 900; margin-bottom: 28px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .label { color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: .12em; font-weight: 800; }
    p { margin: 7px 0 0; font-size: 14px; font-weight: 900; color: #bfdbfe; }
    img { width: 170px; border-radius: 18px; background: white; padding: 12px; }
    .valid { margin-top: 18px; color: #86efac; font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; }
    @media (max-width: 720px) { .ticket { grid-template-columns: 1fr; } .side { border-left: 0; border-top: 1px dashed rgba(255,255,255,.18); } .grid { grid-template-columns: 1fr; } }
    @media print { body { background: white; } .ticket { box-shadow: none; } }
  </style>
</head>
<body>
  <main class="ticket">
    <section class="main">
      <div class="kicker">Conference Portal QR Ticket</div>
      <h1>${escapeHtml(registration.event.name)}</h1>
      <div class="name">${escapeHtml(registration.attendeeName)}</div>
      <div class="grid">
        <div>
        <div class="label">Attendee</div>
        <p>${escapeHtml(registration.attendeeName)}</p>
        </div>
        <div>
        <div class="label">Event date</div>
        <p>${escapeHtml(eventDate)}</p>
        </div>
        <div>
        <div class="label">QR code</div>
        <p>${escapeHtml(registration.qrCode)}</p>
        </div>
      </div>
    </section>
    <section class="side">
      <div>
        <img src="${qrDataUrl}" alt="Registration QR code" />
        <div class="label">Status</div>
        <p class="valid">${registration.checkedIn ? "Checked in" : "Paid and valid"}</p>
      </div>
    </section>
  </main>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
