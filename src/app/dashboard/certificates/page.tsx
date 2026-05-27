import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { CertificateRequestForm } from "@/components/CertificateRequestForm";
import { StatusBadge } from "@/components/StatusBadge";
import { EVENT_CERT_LABELS } from "@/lib/constants";

export default async function CertificatesPage() {
  const session = await getSession();
  if (!session) return null;

  const [events, requests] = await Promise.all([
    prisma.event.findMany({ where: { active: true }, select: { id: true, name: true } }),
    prisma.eventCertificateRequest.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Certificate requests</h1>
      <p className="text-slate-600 text-sm mb-8">
        Participation, appearance, recognition, and presentation (research conference).
      </p>

      <CertificateRequestForm eventOptions={events} />

      <section className="mt-12">
        <h2 className="text-lg font-bold mb-4">Your requests</h2>
        <ul className="space-y-3">
          {requests.map((c) => (
            <li key={c.id} className="p-4 bg-white rounded-xl border text-sm">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="font-semibold">{EVENT_CERT_LABELS[c.type]}</span>
                <StatusBadge status={c.status} />
              </div>
              <p className="text-slate-600 mt-1">{c.recipientName}</p>
              {c.paperTitle && <p className="text-slate-500">Paper: {c.paperTitle}</p>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
