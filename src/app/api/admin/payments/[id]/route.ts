import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildQrPayload, generateQrDataUrl } from "@/lib/qr";
import { MEMBERSHIP_DURATION_YEARS } from "@/lib/constants";

const schema = z.object({
  action: z.enum(["approve", "reject"]),
  adminNotes: z.string().optional(),
  kind: z.enum(["event", "membership"]),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = schema.parse(await req.json());

    if (body.kind === "event") {
      const payment = await prisma.paymentSubmission.findUnique({
        where: { id },
        include: { registration: true },
      });
      if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 });

      const status = body.action === "approve" ? "APPROVED" : "REJECTED";
      await prisma.$transaction([
        prisma.paymentSubmission.update({
          where: { id },
          data: { status, adminNotes: body.adminNotes, reviewedAt: new Date() },
        }),
        prisma.eventRegistration.update({
          where: { id: payment.registrationId },
          data: {
            status: body.action === "approve" ? "APPROVED" : "REJECTED",
          },
        }),
      ]);

      if (body.action === "approve") {
        const payload = buildQrPayload(payment.registrationId, payment.registration.qrCode);
        const qrDataUrl = await generateQrDataUrl(payload);
        return NextResponse.json({ ok: true, qrDataUrl });
      }
      return NextResponse.json({ ok: true });
    }

    const payment = await prisma.membershipPayment.findUnique({
      where: { id },
      include: { membership: true },
    });
    if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const status = body.action === "approve" ? "APPROVED" : "REJECTED";
    await prisma.membershipPayment.update({
      where: { id },
      data: { status, adminNotes: body.adminNotes, reviewedAt: new Date() },
    });

    if (body.action === "approve") {
      const years = MEMBERSHIP_DURATION_YEARS[payment.membership.type];
      const start = new Date();
      const expiry =
        years === null || years === undefined
          ? null
          : new Date(start.getFullYear() + years, start.getMonth(), start.getDate());

      await prisma.membership.update({
        where: { id: payment.membershipId },
        data: {
          status: "ACTIVE",
          startDate: start,
          expiryDate: expiry,
          renewalSent: false,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
