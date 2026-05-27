import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  eventId: z.string(),
  attendeeName: z.string().min(2),
  attendeeEmail: z.string().email(),
  organization: z.string().optional(),
  paperTitle: z.string().optional(),
  method: z.enum(["BANK", "EWALLET"]),
  transactionDate: z.string(),
  transactionNo: z.string().min(3),
  amount: z.coerce.number().positive(),
  paymentFor: z.string().min(3),
  payeeName: z.string().optional(),
  proofBase64: z.string(),
  proofFileName: z.string(),
  proofMimeType: z.string(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = schema.parse(await req.json());
    const event = await prisma.event.findUnique({ where: { id: body.eventId } });
    if (!event?.active) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    const proofData = Buffer.from(body.proofBase64, "base64");
    if (proofData.length > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Proof file too large (max 5MB)" }, { status: 400 });
    }

    const qrCode = `REG-${uuidv4().slice(0, 8).toUpperCase()}`;

    const result = await prisma.$transaction(async (tx) => {
      const reg = await tx.eventRegistration.upsert({
        where: { userId_eventId: { userId: session.id, eventId: body.eventId } },
        create: {
          userId: session.id,
          eventId: body.eventId,
          type: "CONFIRMED",
          status: "PAYMENT_SUBMITTED",
          qrCode,
          attendeeName: body.attendeeName,
          attendeeEmail: body.attendeeEmail,
          organization: body.organization,
          paperTitle: body.paperTitle,
        },
        update: {
          type: "CONFIRMED",
          status: "PAYMENT_SUBMITTED",
          attendeeName: body.attendeeName,
          attendeeEmail: body.attendeeEmail,
          organization: body.organization,
          paperTitle: body.paperTitle,
        },
      });

      const payment = await tx.paymentSubmission.upsert({
        where: { registrationId: reg.id },
        create: {
          userId: session.id,
          registrationId: reg.id,
          method: body.method,
          status: "PENDING",
          transactionDate: new Date(body.transactionDate),
          transactionNo: body.transactionNo,
          amount: body.amount,
          paymentFor: body.paymentFor,
          payeeName: body.payeeName,
          proofFileName: body.proofFileName,
          proofMimeType: body.proofMimeType,
          proofData,
        },
        update: {
          method: body.method,
          status: "PENDING",
          transactionDate: new Date(body.transactionDate),
          transactionNo: body.transactionNo,
          amount: body.amount,
          paymentFor: body.paymentFor,
          payeeName: body.payeeName,
          proofFileName: body.proofFileName,
          proofMimeType: body.proofMimeType,
          proofData,
        },
      });

      return { reg, payment };
    });

    return NextResponse.json({ ok: true, registration: result.reg, payment: { id: result.payment.id, status: result.payment.status } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Payment submission failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
