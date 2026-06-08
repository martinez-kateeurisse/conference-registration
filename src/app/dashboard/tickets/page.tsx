import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { StatusBadge } from "@/components/StatusBadge";
import { buildQrPayload, generateQrDataUrl } from "@/lib/qr";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function TicketsPage() {
  const session = await getSession();
  if (!session) return null;

  const registrations = await prisma.eventRegistration.findMany({
    where: { userId: session.id },
    include: { event: true, payment: true },
    orderBy: { createdAt: "desc" },
  });

  const approvedTickets = await Promise.all(
    registrations
      .filter((registration) => registration.status === "APPROVED")
      .map(async (registration) => ({
        ...registration,
        qrDataUrl: await generateQrDataUrl(
          buildQrPayload(registration.id, registration.qrCode),
        ),
      })),
  );

  return (
    <div className="space-y-8">
      <section>
        <p className="section-kicker">Attendance tickets</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Participation tickets</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          Approved registrations receive a valid QR ticket. Tickets tied to payment
          submissions become valid after admin payment verification.
        </p>
      </section>

      {registrations.length === 0 ? (
        <div className="dashboard-card p-5 text-sm text-slate-600">
          No tickets yet. Register for an event first.
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {registrations.map((registration) => {
            const approved = approvedTickets.find((ticket) => ticket.id === registration.id);
            const isValid = registration.status === "APPROVED";
            return (
              <article key={registration.id} className="ticket-card">
                <div className="ticket-card-main">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-200">
                    Event boarding pass
                  </p>
                  <h2 className="mt-3 text-2xl font-black leading-tight text-white">
                    {registration.event.name}
                  </h2>
                  <p className="mt-4 text-lg font-black text-white">{registration.attendeeName}</p>
                  <div className="mt-5 grid gap-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-400 sm:grid-cols-3">
                    <span>
                      <span className="block text-slate-500">Date</span>
                      <strong className="text-indigo-200">{formatDate(registration.event.startDate)}</strong>
                    </span>
                    <span>
                      <span className="block text-slate-500">Code</span>
                      <strong className="text-indigo-200">{registration.qrCode}</strong>
                    </span>
                    <span>
                      <span className="block text-slate-500">Status</span>
                      <strong className={isValid ? "text-emerald-300" : "text-amber-300"}>
                        {isValid ? "Valid" : "Pending"}
                      </strong>
                    </span>
                  </div>
                </div>
                <div className="ticket-card-side">
                  {approved ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={approved.qrDataUrl} alt="Ticket QR code" className="mx-auto w-32 rounded-xl bg-white p-2" />
                      <a
                        href={`/api/registrations/ticket/${registration.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex rounded-xl bg-white px-3 py-2 text-xs font-black text-indigo-700"
                      >
                        View ticket
                      </a>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-center">
                      <StatusBadge status={registration.status} />
                      <p className="mt-3 text-xs font-semibold leading-5 text-slate-300">
                        QR becomes valid after admin approval.
                      </p>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
