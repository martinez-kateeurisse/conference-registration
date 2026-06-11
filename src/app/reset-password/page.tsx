"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

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

function PasswordInput({
  id,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
}: {
  id: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          className="input-field pr-11"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          required
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

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [touched, setTouched] = useState({ password: false, confirm: false });

  function getPasswordError() {
    if (!touched.password) return "";
    if (password.length === 0) return "Password is required";
    if (password.length < 8) return "Must be at least 8 characters";
    return "";
  }

  function getConfirmError() {
    if (!touched.confirm) return "";
    if (confirm.length === 0) return "Please confirm your password";
    if (confirm !== password) return "Passwords do not match";
    return "";
  }

  function isValid() {
    return password.length >= 8 && password === confirm;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ password: true, confirm: true });
    if (!isValid()) return;
    setSubmitError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
        <p className="font-black text-red-800">Invalid reset link</p>
        <p className="mt-1 text-sm text-red-700">
          This link is missing a token. Please request a new one.
        </p>
        <Link href="/forgot-password" className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:underline">
          Request new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-green-100 bg-green-50 p-6 text-center">
        <p className="font-black text-green-800">Password updated!</p>
        <p className="mt-1 text-sm text-green-700">
          Your password has been reset. Redirecting to sign in...
        </p>
      </div>
    );
  }

  return (
    <>
      {submitError && (
        <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {submitError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="label" htmlFor="password">New password</label>
          <PasswordInput
            id="password"
            name="password"
            placeholder="Minimum 8 characters"
            value={password}
            onChange={setPassword}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            error={getPasswordError()}
          />
        </div>
        <div>
          <label className="label" htmlFor="confirm">Confirm password</label>
          <PasswordInput
            id="confirm"
            name="confirm"
            placeholder="Repeat your new password"
            value={confirm}
            onChange={setConfirm}
            onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
            error={getConfirmError()}
          />
        </div>
        <button type="submit" className="btn-primary mt-2 w-full" disabled={loading}>
          {loading ? "Please wait..." : "Reset password"}
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-slate-400">
        <Link href="/login" className="font-semibold text-indigo-600 hover:underline">
          Back to sign in
        </Link>
      </p>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="auth-shell flex min-h-screen items-center justify-center px-4 py-8">
      <div className="auth-card grid w-full max-w-5xl overflow-hidden rounded-[1.5rem] md:grid-cols-[0.95fr_1.05fr]">
        <aside className="relative hidden overflow-hidden bg-slate-950 p-8 text-white md:flex md:flex-col md:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_18%,rgba(129,140,248,0.38),transparent_18rem),radial-gradient(circle_at_82%_82%,rgba(244,114,182,0.34),transparent_18rem)]" />
          <div className="relative">
            <Link href="/" className="mb-10 inline-flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-sm font-black text-indigo-600">
                CR
              </span>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">
                Conference Portal
              </span>
            </Link>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-200">
              Account recovery
            </p>
            <h1 className="mt-4 text-3xl font-black leading-tight">
              Choose a new password.
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/72">
              Your new password takes effect immediately. Make it at least 8 characters long.
            </p>
          </div>
          <div className="relative space-y-3">
            {[
              "Minimum 8 characters required",
              "Reset link is single-use",
              "Takes effect immediately",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
                <span className="h-2.5 w-2.5 rounded-full bg-pink-300" />
                <span className="text-sm font-semibold text-white/82">{item}</span>
              </div>
            ))}
          </div>
        </aside>

        <section className="bg-white p-6 sm:p-8 md:p-10">
          <div className="mb-7 flex items-center justify-between gap-4 md:hidden">
            <Link href="/" className="flex items-center gap-3 font-bold text-slate-950">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white">
                CR
              </span>
              <span>Conference Portal</span>
            </Link>
          </div>

          <div className="mb-8">
            <p className="section-kicker">Account recovery</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Set a new password</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter and confirm your new password below.
            </p>
          </div>

          <Suspense fallback={<p className="text-sm text-slate-500">Loading...</p>}>
            <ResetPasswordForm />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
