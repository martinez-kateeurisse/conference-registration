import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  membershipId: z.string(),
  method: z.enum(["BANK", "EWALLET"]),
  transactionDate: z.string(),
  transactionNo: z.string().min(3),
  amount: z.coerce.number().positive(),
  paymentFor: z.string().min(3),
  payeeName: z.string().optional(),
  proofBase64: z.string(),
  proofFileName: z.string(),
  proofMimeType: z.string(),
  isRenewal: z.boolean().optional(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = schema.parse(await req.json());
    const membership = await prisma.membership.findFirst({
      where: { id: body.membershipId, userId: session.id },
    });
    if (!membership) return NextResponse.json({ error: "Membership not found" }, { status: 404 });

    const proofData = Buffer.from(body.proofBase64, "base64");
    const payment = await prisma.membershipPayment.create({
      data: {
        userId: session.id,
        membershipId: membership.id,
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
        isRenewal: body.isRenewal ?? false,
      },
    });

    await prisma.membership.update({
      where: { id: membership.id },
      data: { status: "PENDING_PAYMENT" },
    });

    return NextResponse.json({ payment: { id: payment.id, status: payment.status } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Payment failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
