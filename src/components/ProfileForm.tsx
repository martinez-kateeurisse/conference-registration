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

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function PasswordField({
  id, name, label, value, onChange, onBlur, error,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          className="input-field pr-11"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          required
          maxLength={72}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
        >
          <EyeIcon open={show} />
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}

export function ProfileForm({ user }: { user: ProfileUser }) {
  const router = useRouter();
  const [tab, setTab] = useState<"profile" | "security">("profile");

  // Profile tab state
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Security tab state
  const [secMessage, setSecMessage] = useState("");
  const [secLoading, setSecLoading] = useState(false);
  const [secIsError, setSecIsError] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [touched, setTouched] = useState({ current: false, new: false, confirm: false });

  function getCurrentError() {
    if (!touched.current) return "";
    if (!currentPw) return "Current password is required";
    return "";
  }

  function getNewError() {
    if (!touched.new) return "";
    if (newPw.length === 0) return "New password is required";
    if (newPw.length < 8) return "Must be at least 8 characters";
    if (newPw === currentPw) return "New password must be different from your current password";
    return "";
  }

  function getConfirmError() {
    if (!touched.confirm) return "";
    if (!confirmPw) return "Please confirm your new password";
    if (confirmPw !== newPw) return "Passwords do not match";
    return "";
  }

  function isSecurityValid() {
    return currentPw.length > 0 && newPw.length >= 8 && newPw === confirmPw && newPw !== currentPw;
  }

  async function submitProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    const fd = new FormData(e.currentTarget);
    const phone = fd.get("phone") as string;

    if (phone) {
      const phPhoneRegex = /^(09|\+639|639)\d{9}$/;
      if (!phPhoneRegex.test(phone.replace(/\s+/g, ""))) {
        setMessage("Invalid phone number format. Please use 09XXXXXXXXX or +639XXXXXXXXX.");
        setIsError(true);
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd)),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setMessage(data.error ?? "Profile update failed.");
        setIsError(true);
        return;
      }
      setMessage("Profile updated successfully.");
      router.refresh();
    } catch {
      setMessage("Something went wrong. Please try again.");
      setIsError(true);
      setLoading(false);
    }
  }

  async function submitSecurity(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ current: true, new: true, confirm: true });
    if (!isSecurityValid()) return;

    setSecLoading(true);
    setSecMessage("");
    setSecIsError(false);

    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw, confirmPassword: confirmPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to change password");
      setSecMessage("Password changed successfully.");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setTouched({ current: false, new: false, confirm: false });
    } catch (err) {
      setSecMessage(err instanceof Error ? err.message : "Something went wrong.");
      setSecIsError(true);
    } finally {
      setSecLoading(false);
    }
  }

  const selectedCountry = countries.find((c) => c.code === user.country) ?? countries[0];

  return (
    <section className="dashboard-card overflow-hidden">
      {/* Header */}
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

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-6">
        {(["profile", "security"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-black capitalize border-b-2 transition ${
              tab === t
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === "profile" && (
        <form onSubmit={submitProfile} className="grid gap-5 p-6">
          {message && (
            <div className={`rounded-2xl border p-4 text-sm font-bold ${
              isError
                ? "border-red-100 bg-red-50 text-red-800"
                : "border-indigo-100 bg-indigo-50 text-indigo-800"
            }`}>
              {message}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="name">Name</label>
              <input id="name" name="name" className="input-field" defaultValue={user.name} required maxLength={100} />
            </div>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" className="input-field bg-slate-50 text-slate-500" defaultValue={user.email} disabled />
            </div>
            <div>
              <label className="label" htmlFor="organization">Organization</label>
              <input id="organization" name="organization" className="input-field" defaultValue={user.organization ?? ""} maxLength={150} />
            </div>
            <div>
              <label className="label" htmlFor="phone">Phone</label>
              <input id="phone" name="phone" className="input-field" defaultValue={user.phone ?? ""} maxLength={13} placeholder="09171234567" />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="country">Country / Region</label>
            <select id="country" name="country" className="input-field" defaultValue={selectedCountry.code}>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
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
      )}

      {/* Security tab */}
      {tab === "security" && (
        <form onSubmit={submitSecurity} className="grid gap-5 p-6" noValidate>
          {secMessage && (
            <div className={`rounded-2xl border p-4 text-sm font-bold ${
              secIsError
                ? "border-red-100 bg-red-50 text-red-800"
                : "border-green-100 bg-green-50 text-green-800"
            }`}>
              {secMessage}
            </div>
          )}

          <div>
            <p className="mb-4 text-sm leading-6 text-slate-500">
              Update your password. You&apos;ll need to enter your current password to confirm the change.
            </p>
            <div className="grid gap-4">
              <PasswordField
                id="currentPassword"
                name="currentPassword"
                label="Current password"
                value={currentPw}
                onChange={setCurrentPw}
                onBlur={() => setTouched((t) => ({ ...t, current: true }))}
                error={getCurrentError()}
              />
              <PasswordField
                id="newPassword"
                name="newPassword"
                label="New password"
                value={newPw}
                onChange={setNewPw}
                onBlur={() => setTouched((t) => ({ ...t, new: true }))}
                error={getNewError()}
              />
              <PasswordField
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm new password"
                value={confirmPw}
                onChange={setConfirmPw}
                onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                error={getConfirmError()}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary justify-self-start" disabled={secLoading}>
            {secLoading ? "Updating..." : "Update password"}
          </button>
        </form>
      )}
    </section>
  );
}
