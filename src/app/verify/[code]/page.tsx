import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const reg = await prisma.eventRegistration.findUnique({
    where: { qrCode: code },
    include: { event: true },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-6 auth-gradient">
      <div className="max-w-md w-full p-8 rounded-3xl glass-card">
        <h1 className="text-xl font-bold mb-4">Registration verification</h1>
        {!reg ? (
          <p className="text-red-600">Invalid or unknown QR code.</p>
        ) : (
          <div className="space-y-3 text-sm">
            <p>
              <span className="text-slate-500">Event:</span>{" "}
              <strong>{reg.event.name}</strong>
            </p>
            <p>
              <span className="text-slate-500">Attendee:</span> {reg.attendeeName}
            </p>
            <p>
              <span className="text-slate-500">Email:</span> {reg.attendeeEmail}
            </p>
            <p>
              <span className="text-slate-500">Code:</span>{" "}
              <span className="font-mono">{reg.qrCode}</span>
            </p>
            <StatusBadge status={reg.status} />
            {reg.status === "APPROVED" && (
              <p className="text-green-700 font-medium mt-4">✓ Valid for event entry</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
