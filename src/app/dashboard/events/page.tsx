import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { EventRegistrationForms } from "@/components/EventRegistrationForms";
import { StatusBadge } from "@/components/StatusBadge";
import { buildQrPayload, generateQrDataUrl } from "@/lib/qr";

export default async function EventsPage() {
  const session = await getSession();
  if (!session) return null;

  const [events, registrations] = await Promise.all([
    prisma.event.findMany({ where: { active: true }, orderBy: { startDate: "asc" } }),
    prisma.eventRegistration.findMany({
      where: { userId: session.id },
      include: { event: true, payment: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const regsWithQr = await Promise.all(
    registrations
      .filter((r) => r.status === "APPROVED")
      .map(async (r) => ({
        ...r,
        qrDataUrl: await generateQrDataUrl(buildQrPayload(r.id, r.qrCode)),
      })),
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Event registration</h1>
      <EventRegistrationForms events={events} />

      <section className="mt-12">
        <h2 className="text-lg font-bold mb-4">Your registrations</h2>
        {registrations.length === 0 ? (
          <p className="text-slate-500 text-sm">No registrations yet.</p>
        ) : (
          <div className="space-y-6">
            {registrations.map((r) => {
              const qr = regsWithQr.find((x) => x.id === r.id);
              return (
                <div key={r.id} className="p-5 bg-white rounded-2xl border">
                  <div className="flex flex-wrap gap-2 items-center mb-2">
                    <span className="font-semibold">{r.event.name}</span>
                    <StatusBadge status={r.status} />
                    <span className="text-xs font-mono text-slate-500">{r.qrCode}</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {r.attendeeName} · {r.type}
                    {r.payment && ` · Payment: ${r.payment.status}`}
                  </p>
                  {qr && (
                    <div className="mt-4 flex flex-col items-start gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={qr.qrDataUrl} alt="QR" className="w-40" />
                      <a
                        href={`/verify/${r.qrCode}`}
                        className="text-sm text-indigo-600 hover:underline"
                      >
                        Verification link
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
