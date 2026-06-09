"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const countries = [
  { code: "PH", name: "Philippines" },
  { code: "US", name: "United States" },
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "ID", name: "Indonesia" },
  { code: "TH", name: "Thailand" },
  { code: "VN", name: "Vietnam" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "CN", name: "China" },
];

type ProfileUser = {
  name: string;
  email: string;
  organization: string | null;
  phone: string | null;
  country: string;
  createdAt: string;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function ProfileForm({ user }: { user: ProfileUser }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(fd)),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMessage(data.error ?? "Profile update failed.");
      return;
    }
    setMessage("Profile updated successfully.");
    router.refresh();
  }

  const selectedCountry = countries.find((country) => country.code === user.country) ?? countries[0];

  return (
    <section className="dashboard-card overflow-hidden">
      <div className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="grid h-20 w-20 place-items-center rounded-full border border-emerald-200 bg-emerald-50 text-2xl font-black text-emerald-700">
            {initials(user.name) || "U"}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-black text-slate-950">{user.name}</h2>
            <p className="truncate text-sm font-semibold text-emerald-700">{user.email}</p>
            <p className="mt-2 text-xs font-semibold text-slate-500">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="grid gap-5 p-6">
        {message && (
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm font-bold text-indigo-800">
            {message}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">
              Name
            </label>
            <input id="name" name="name" className="input-field" defaultValue={user.name} required />
          </div>
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input id="email" className="input-field bg-slate-50 text-slate-500" defaultValue={user.email} disabled />
          </div>
          <div>
            <label className="label" htmlFor="organization">
              Organization
            </label>
            <input id="organization" name="organization" className="input-field" defaultValue={user.organization ?? ""} />
          </div>
          <div>
            <label className="label" htmlFor="phone">
              Phone
            </label>
            <input id="phone" name="phone" className="input-field" defaultValue={user.phone ?? ""} />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="country">
            Country / Region
          </label>
          <select id="country" name="country" className="input-field" defaultValue={selectedCountry.code}>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.code} - {country.name}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs font-semibold text-slate-500">
            Country selection is saved to your profile and can be used for future localization.
          </p>
        </div>

        <button type="submit" className="btn-primary justify-self-start" disabled={loading}>
          {loading ? "Saving..." : "Save profile"}
        </button>
      </form>
    </section>
  );
}
