import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  action: z.enum(["approve", "issue", "reject"]),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = schema.parse(await req.json());

    const statusMap = {
      approve: "APPROVED" as const,
      issue: "ISSUED" as const,
      reject: "REJECTED" as const,
    };

    const cert = await prisma.eventCertificateRequest.update({
      where: { id },
      data: {
        status: statusMap[body.action],
        issuedAt: body.action === "issue" ? new Date() : undefined,
      },
    });
    return NextResponse.json({ certificate: cert });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
