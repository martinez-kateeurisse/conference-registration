import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_MEMBERSHIP_FEES } from "@/lib/constants";

const schema = z.object({
  type: z.enum([
    "INSTITUTIONAL_COMPANY",
    "INSTITUTIONAL_UNIVERSITY",
    "LIFETIME",
    "INDIVIDUAL_PROFESSIONAL",
    "INDIVIDUAL_STUDENT",
    "MECHATRONICS_ENGINEER",
    "MECHATRONICS_SPECIALIST",
    "MECHATRONICS_TECHNICIAN",
  ]),
  orgName: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = schema.parse(await req.json());
    const needsOrg =
      body.type === "INSTITUTIONAL_COMPANY" || body.type === "INSTITUTIONAL_UNIVERSITY";
    if (needsOrg && !body.orgName) {
      return NextResponse.json({ error: "Organization name required" }, { status: 400 });
    }

    const memberId = `MEM-${Date.now().toString(36).toUpperCase()}`;
    const membership = await prisma.membership.create({
      data: {
        userId: session.id,
        type: body.type,
        status: "PENDING_PAYMENT",
        orgName: body.orgName,
        memberId,
      },
    });

    const fee = DEFAULT_MEMBERSHIP_FEES[body.type] ?? 0;
    return NextResponse.json({ membership, suggestedFee: fee });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Application failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
