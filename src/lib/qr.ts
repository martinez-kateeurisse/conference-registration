import QRCode from "qrcode";

export async function generateQrDataUrl(payload: string): Promise<string> {
  return QRCode.toDataURL(payload, {
    width: 280,
    margin: 2,
    color: { dark: "#1e1b4b", light: "#ffffff" },
  });
}

export function buildQrPayload(registrationId: string, qrCode: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return JSON.stringify({
    type: "event_registration",
    id: registrationId,
    code: qrCode,
    verifyUrl: `${base}/verify/${qrCode}`,
  });
}
