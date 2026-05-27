import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MEMBERSHIP_CERT_LABELS } from "@/lib/constants";
import { sendRenewalEmail } from "@/lib/email";

/** Send renewal emails for memberships expiring within 30 days */
export async function POST() {
  try {
    await requireAdmin();
    const in30 = new Date();
    in30.setDate(in30.getDate() + 30);

    const memberships = await prisma.membership.findMany({
      where: {
        status: "ACTIVE",
        expiryDate: { lte: in30, gte: new Date() },
        renewalSent: false,
      },
      include: { user: true },
    });

    const results = [];
    for (const m of memberships) {
      if (!m.expiryDate) continue;
      await sendRenewalEmail({
        to: m.user.email,
        name: m.user.name,
        memberId: m.memberId,
        expiryDate: m.expiryDate,
        membershipType: MEMBERSHIP_CERT_LABELS[m.type],
      });
      await prisma.membership.update({
        where: { id: m.id },
        data: { renewalSent: true },
      });
      results.push(m.memberId);
    }

    return NextResponse.json({ sent: results.length, memberIds: results });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
