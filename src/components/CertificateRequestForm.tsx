"use client";

import { useState } from "react";
import { EVENT_CERT_LABELS } from "@/lib/constants";
import type { EventCertType } from "@prisma/client";

const TYPES = Object.entries(EVENT_CERT_LABELS) as [EventCertType, string][];

export function CertificateRequestForm({ eventOptions }: { eventOptions: { id: string; name: string }[] }) {
  const [type, setType] = useState<EventCertType>("PARTICIPATION");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/certificates/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          eventId: fd.get("eventId") || undefined,
          recipientName: fd.get("recipientName"),
          role: fd.get("role") || undefined,
          paperTitle: fd.get("paperTitle") || undefined,
          presenterName: fd.get("presenterName") || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage("Certificate request submitted successfully.");
      e.currentTarget.reset();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-2xl border space-y-4">
        <h2 className="text-lg font-bold">Request event certificate</h2>
        <div>
          <label className="label">Certificate type</label>
          <select
            className="input-field"
            value={type}
            onChange={(e) => setType(e.target.value as EventCertType)}
          >
            {TYPES.map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
        </div>
        {eventOptions.length > 0 && (
          <div>
            <label className="label">Related event (optional)</label>
            <select name="eventId" className="input-field">
              <option value="">—</option>
              {eventOptions.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="label">Recipient name</label>
          <input name="recipientName" className="input-field" required />
        </div>
        {type === "RECOGNITION" && (
          <div>
            <label className="label">Role (Speaker / Committee / Sponsor)</label>
            <input name="role" className="input-field" required />
          </div>
        )}
        {type === "PRESENTATION" && (
          <>
            <div>
              <label className="label">Presenter name</label>
              <input name="presenterName" className="input-field" required />
            </div>
            <div>
              <label className="label">Research paper title</label>
              <input name="paperTitle" className="input-field" required />
            </div>
          </>
        )}
        {message && <p className="text-sm text-indigo-700">{message}</p>}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          Submit request
        </button>
      </form>
    </div>
  );
}
