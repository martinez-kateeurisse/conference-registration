import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminPanel } from "@/components/AdminPanel";
import { DashboardNav } from "@/components/DashboardNav";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/dashboard");

  const [eventPayments, membershipPayments, certificates, membershipCount] =
    await Promise.all([
      prisma.paymentSubmission.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { registration: true },
      }),
      prisma.membershipPayment.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { membership: true },
      }),
      prisma.eventCertificateRequest.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.membership.count(),
    ]);

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav user={session} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Admin console</h1>
        <p className="text-slate-600 text-sm mb-2">
          Total memberships in database: <strong>{membershipCount}</strong>
        </p>
        <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline mb-8 inline-block">
          ← Dashboard
        </Link>
        <AdminPanel
          eventPayments={eventPayments.map((p) => ({
            id: p.id,
            transactionNo: p.transactionNo,
            amount: p.amount.toString(),
            status: p.status,
            payeeName: p.payeeName,
            registration: {
              attendeeName: p.registration.attendeeName,
              qrCode: p.registration.qrCode,
            },
          }))}
          membershipPayments={membershipPayments.map((p) => ({
            id: p.id,
            transactionNo: p.transactionNo,
            amount: p.amount.toString(),
            status: p.status,
            isRenewal: p.isRenewal,
            membership: { memberId: p.membership.memberId },
          }))}
          certificates={certificates.map((c) => ({
            id: c.id,
            type: c.type,
            status: c.status,
            recipientName: c.recipientName,
          }))}
        />
      </main>
    </div>
  );
}
