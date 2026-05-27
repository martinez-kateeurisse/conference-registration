"use client";

import { useState } from "react";
import { DEFAULT_MEMBERSHIP_FEES, MEMBERSHIP_CERT_LABELS } from "@/lib/constants";
import type { MembershipCertType } from "@prisma/client";

const TYPES = Object.entries(MEMBERSHIP_CERT_LABELS) as [MembershipCertType, string][];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1] ?? "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function MembershipForms({
  memberships,
}: {
  memberships: {
    id: string;
    memberId: string;
    type: MembershipCertType;
    status: string;
    expiryDate: string | null;
  }[];
}) {
  const [type, setType] = useState<MembershipCertType>("INDIVIDUAL_PROFESSIONAL");
  const [membershipId, setMembershipId] = useState(memberships[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fee = DEFAULT_MEMBERSHIP_FEES[type] ?? 0;
  const needsOrg = type.startsWith("INSTITUTIONAL");

  async function apply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/membership/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, orgName: fd.get("orgName") || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(`Application created. Member ID: ${data.membership.memberId}. Submit payment below.`);
      window.location.reload();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function pay(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!membershipId) {
      setMessage("Apply for membership first");
      return;
    }
    setLoading(true);
    setMessage("");
    const fd = new FormData(e.currentTarget);
    const file = fd.get("proof") as File;
    try {
      const proofBase64 = await fileToBase64(file);
      const res = await fetch("/api/membership/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membershipId,
          method: fd.get("method"),
          transactionDate: fd.get("transactionDate"),
          transactionNo: fd.get("transactionNo"),
          amount: fd.get("amount"),
          paymentFor: fd.get("paymentFor"),
          payeeName: fd.get("payeeName") || undefined,
          proofBase64,
          proofFileName: file.name,
          proofMimeType: file.type,
          isRenewal: fd.get("isRenewal") === "on",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage("Membership payment submitted for verification.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {message && (
        <div className="p-4 rounded-xl bg-indigo-50 text-indigo-900 text-sm">{message}</div>
      )}

      {memberships.length > 0 && (
        <section className="p-6 bg-white rounded-2xl border">
          <h2 className="font-bold mb-4">Your memberships</h2>
          <ul className="space-y-2 text-sm">
            {memberships.map((m) => (
              <li key={m.id} className="flex flex-wrap gap-2 items-center border-b py-2">
                <span className="font-mono font-semibold">{m.memberId}</span>
                <span className="text-slate-600">{MEMBERSHIP_CERT_LABELS[m.type]}</span>
                <span className="badge badge-pending">{m.status}</span>
                {m.expiryDate && (
                  <span className="text-slate-500">Expires {m.expiryDate}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="p-6 bg-white rounded-2xl border">
          <h2 className="font-bold mb-4">D. Apply for membership</h2>
          <form onSubmit={apply} className="space-y-3">
            <div>
              <label className="label">Membership type</label>
              <select
                className="input-field"
                value={type}
                onChange={(e) => setType(e.target.value as MembershipCertType)}
              >
                {TYPES.map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">Suggested fee: ₱{fee.toLocaleString()}</p>
            </div>
            {needsOrg && (
              <div>
                <label className="label">Organization name</label>
                <input name="orgName" className="input-field" required />
              </div>
            )}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              Apply
            </button>
          </form>
        </section>

        <section className="p-6 bg-white rounded-2xl border">
          <h2 className="font-bold mb-4">Membership payment / renewal</h2>
          <form onSubmit={pay} className="space-y-3">
            <div>
              <label className="label">Membership record</label>
              <select
                className="input-field"
                value={membershipId}
                onChange={(e) => setMembershipId(e.target.value)}
                required
              >
                <option value="">Select…</option>
                {memberships.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.memberId} — {m.status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Payment method</label>
              <select name="method" className="input-field" required>
                <option value="BANK">Bank</option>
                <option value="EWALLET">E-Wallet</option>
              </select>
            </div>
            <input name="transactionDate" type="date" className="input-field" required />
            <input name="transactionNo" placeholder="Transaction #" className="input-field" required />
            <input name="amount" type="number" placeholder="Amount" className="input-field" required />
            <input name="paymentFor" placeholder="Payment for" className="input-field" required />
            <input name="payeeName" placeholder="Payee name (OR)" className="input-field" />
            <label className="flex items-center gap-2 text-sm">
              <input name="isRenewal" type="checkbox" />
              This is a renewal payment
            </label>
            <input name="proof" type="file" accept="image/*,.pdf" className="input-field" required />
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              Submit payment
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
