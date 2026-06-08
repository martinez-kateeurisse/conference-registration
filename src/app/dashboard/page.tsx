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
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[1.35rem] bg-slate-950 text-white shadow-2xl shadow-indigo-950/10">
        <div className="relative px-6 py-8 md:px-8 md:py-10">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-500/25 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-200">
                Dashboard overview
              </p>
              <h1 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
                Welcome back, {session.name}.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                Track event registrations, certificate requests, membership records,
                and payment progress from one organized workspace.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-white/8 p-3 backdrop-blur">
              <MiniMetric label="Registrations" value={regs} />
              <MiniMetric label="Certificates" value={certs} />
              <MiniMetric label="Memberships" value={memberships} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Event registrations" value={regs} href="/dashboard/events" tone="indigo" />
        <StatCard label="Certificate requests" value={certs} href="/dashboard/certificates" tone="pink" />
        <StatCard label="Membership records" value={memberships} href="/dashboard/membership" tone="cyan" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="dashboard-card p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="section-kicker">Quick actions</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Continue your workflow</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <QuickCard
              title="Register for an event"
              description="Submit attendee details, create an early registration, or upload proof for payment review."
              href="/dashboard/events"
            />
            <QuickCard
              title="View participation tickets"
              description="Open approved event tickets with QR codes for attendance verification."
              href="/dashboard/tickets"
            />
            <QuickCard
              title="Request certificates"
              description="Prepare participation, appearance, recognition, presentation, and related event certificates."
              href="/dashboard/certificates"
            />
            <QuickCard
              title="Apply for membership"
              description="Manage institutional, individual, lifetime, and certification-based membership records."
              href="/dashboard/membership"
            />
            {session.role === "ADMIN" && (
              <QuickCard
                title="Open admin console"
                description="Review payments, approve records, issue certificates, and manage renewal reminders."
                href="/admin"
                accent
              />
            )}
          </div>
        </div>

        <aside className="dashboard-card p-5 md:p-6">
          <p className="section-kicker">Process guide</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Registration tracking</h2>
          <div className="mt-5 space-y-4">
            {[
              ["1", "Submit registration", "Create an early registration or submit payment details for confirmation."],
              ["2", "Monitor review status", "Check whether payments, certificates, and memberships are pending or approved."],
              ["3", "Use approved records", "Access QR details, certificate updates, and renewal information when available."],
            ].map(([step, title, copy]) => (
              <div key={title} className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-indigo-600 text-sm font-black text-white">
                  {step}
                </span>
                <div>
                  <h3 className="font-black text-slate-900">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-0 rounded-xl bg-white/10 p-3 text-center">
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 truncate text-[11px] font-bold text-slate-300">{label}</p>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
  tone,
}: {
  label: string;
  value: number;
  href: string;
  tone: "indigo" | "pink" | "cyan";
}) {
  const toneClass = {
    indigo: "text-indigo-600 bg-indigo-50",
    pink: "text-pink-600 bg-pink-50",
    cyan: "text-cyan-700 bg-cyan-50",
  }[tone];

  return (
    <Link href={href} className="dashboard-card dashboard-stat-card block p-5">
      <span className={`mb-5 inline-flex rounded-full px-3 py-1 text-xs font-black uppercase ${toneClass}`}>
        {label}
      </span>
      <p className="text-4xl font-black text-slate-950">{value}</p>
      <p className="mt-2 text-sm font-semibold text-slate-500">Open records in this section</p>
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
      className={`dashboard-action-card rounded-2xl border p-5 ${
        accent
          ? "border-pink-100 bg-pink-50/70"
          : "border-slate-100 bg-white"
      }`}
    >
      <h3 className="font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <p className="mt-5 text-sm font-black text-indigo-600">Open section -&gt;</p>
    </Link>
  );
}
