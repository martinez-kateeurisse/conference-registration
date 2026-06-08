import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EVENT_CERT_LABELS } from "@/lib/constants";

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
  const certificate = await prisma.eventCertificateRequest.findUnique({
    where: { id },
  });

  if (!certificate) {
    return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
  }
  if (certificate.userId !== session.id && session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (certificate.status !== "ISSUED") {
    return NextResponse.json({ error: "Certificate is not issued yet" }, { status: 400 });
  }

  const typeLabel = EVENT_CERT_LABELS[certificate.type];
  const issued = certificate.issuedAt ?? certificate.updatedAt;
  const event = certificate.eventId
    ? await prisma.event.findUnique({ where: { id: certificate.eventId } })
    : null;
  const eventName = event?.name ?? "Conference Event";
  const eventDate = event
    ? new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(event.startDate)
    : "Event date on record";
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(typeLabel)} - ${escapeHtml(certificate.recipientName)}</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #eef2ff; font-family: Arial, sans-serif; color: #fff; }
    .certificate { width: min(1040px, calc(100vw - 32px)); min-height: 680px; position: relative; overflow: hidden; border-radius: 30px; background: radial-gradient(circle at 78% 22%, rgba(99,102,241,.48), transparent 18rem), radial-gradient(circle at 18% 82%, rgba(34,211,238,.18), transparent 18rem), linear-gradient(135deg, #0f172a 0%, #1e1b4b 52%, #312e81 100%); box-shadow: 0 34px 90px rgba(15,23,42,.34); }
    .inner { position: relative; min-height: 580px; margin: 24px; border: 1px solid rgba(255,255,255,.22); border-radius: 24px; padding: 56px; text-align: center; background: rgba(15,23,42,.36); }
    .kicker { color: #c7d2fe; text-transform: uppercase; letter-spacing: .28em; font-weight: 900; font-size: 12px; }
    h1 { margin: 20px 0 10px; font-size: 46px; line-height: 1.05; letter-spacing: .02em; text-transform: uppercase; }
    .subtitle { color: #cbd5e1; font-size: 17px; line-height: 1.7; }
    .recipient { margin: 34px auto 12px; max-width: 760px; border-bottom: 2px solid rgba(255,255,255,.7); padding-bottom: 12px; color: #bfdbfe; font-size: 42px; font-weight: 900; }
    .event { margin: 18px auto 0; max-width: 720px; color: #e0f2fe; font-size: 21px; font-weight: 900; line-height: 1.45; }
    .meta { margin-top: 18px; color: #cbd5e1; font-size: 15px; }
    .signatures { display: grid; grid-template-columns: repeat(2, 1fr); gap: 80px; margin: 76px auto 0; max-width: 720px; }
    .line { border-top: 1px solid rgba(255,255,255,.72); padding-top: 12px; color: #e2e8f0; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .12em; }
    .cert-id { margin-top: 34px; color: #94a3b8; font-size: 12px; }
    @media (max-width: 720px) { .inner { padding: 34px 24px; } h1 { font-size: 34px; } .recipient { font-size: 30px; } .signatures { grid-template-columns: 1fr; gap: 46px; } }
    @media print { body { background: white; } .certificate { box-shadow: none; border-radius: 0; width: auto; } }
  </style>
</head>
<body>
  <main class="certificate">
    <section class="inner">
      <div class="kicker">Conference Portal</div>
      <h1>${escapeHtml(typeLabel)}</h1>
      <p class="subtitle">This certificate is proudly presented to</p>
      <div class="recipient">${escapeHtml(certificate.recipientName)}</div>
      <p class="subtitle">for successfully attending and participating in</p>
      <div class="event">${escapeHtml(eventName)}</div>
      <p class="meta">Held on ${escapeHtml(eventDate)} | Issued ${issued.toLocaleDateString()}</p>
      ${certificate.paperTitle ? `<p class="meta">Paper: ${escapeHtml(certificate.paperTitle)}</p>` : ""}
      <div class="signatures">
        <div class="line">Event Chairperson</div>
        <div class="line">Authorized Signatory</div>
      </div>
      <p class="cert-id">Certificate ID: ${escapeHtml(certificate.id)}</p>
    </section>
  </main>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
