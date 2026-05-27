import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const [regs, certs, memberships] = await Promise.all([
    prisma.eventRegistration.count({ where: { userId: session.id } }),
    prisma.eventCertificateRequest.count({ where: { userId: session.id } }),
    prisma.membership.count({ where: { userId: session.id } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome, {session.name}</h1>
      <p className="text-slate-600 mb-8">Manage your event registrations, certificates, and membership.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Event registrations" value={regs} href="/dashboard/events" />
        <StatCard label="Certificate requests" value={certs} href="/dashboard/certificates" />
        <StatCard label="Memberships" value={memberships} href="/dashboard/membership" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <QuickCard
          title="Register for an event"
          description="Early registration (instant QR) or confirmed registration with payment proof."
          href="/dashboard/events"
        />
        <QuickCard
          title="Request certificates"
          description="Participation, appearance, recognition, presentation, and more."
          href="/dashboard/certificates"
        />
        <QuickCard
          title="Apply for membership"
          description="Institutional, individual, lifetime, and mechatronics certifications."
          href="/dashboard/membership"
        />
        {session.role === "ADMIN" && (
          <QuickCard
            title="Admin console"
            description="Verify payments, issue certificates, send renewal emails."
            href="/admin"
            accent
          />
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="block p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 transition"
    >
      <p className="text-3xl font-bold text-indigo-600">{value}</p>
      <p className="text-sm text-slate-600 mt-1">{label}</p>
    </Link>
  );
}

function QuickCard({
  title,
  description,
  href,
  accent,
}: {
  title: string;
  description: string;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block p-6 rounded-2xl border transition ${
        accent
          ? "bg-pink-50 border-pink-200 hover:border-pink-400"
          : "bg-white border-slate-200 hover:border-indigo-300"
      }`}
    >
      <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </Link>
  );
}
