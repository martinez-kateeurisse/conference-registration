import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { MembershipForms } from "@/components/MembershipForms";

export default async function MembershipPage() {
  const session = await getSession();
  if (!session) return null;

  const memberships = await prisma.membership.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    include: {
      payments: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Membership</h1>
      <p className="text-slate-600 text-sm mb-8">
        Institutional, lifetime, individual, and mechatronics certifications with renewal tracking.
      </p>
      <MembershipForms
        memberships={memberships.map((m) => ({
          id: m.id,
          memberId: m.memberId,
          type: m.type,
          status: m.status,
          expiryDate: m.expiryDate?.toISOString().slice(0, 10) ?? null,
          latestPaymentStatus: m.payments[0]?.status ?? null,
        }))}
      />
    </div>
  );
}
