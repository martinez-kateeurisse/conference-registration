"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd)),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

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
              Reset your password securely.
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/72">
              Enter your registered email address and we&apos;ll generate a reset link for you.
            </p>
          </div>
          <div className="relative space-y-3">
            {[
              "Secure one-time reset link",
              "Link expires after 1 hour",
              "No account details exposed",
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
            <h2 className="mt-2 text-3xl font-black text-slate-950">Forgot your password?</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter the email you registered with. The reset link will be logged to the server console.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-green-100 bg-green-50 p-6 text-center">
              <p className="font-black text-green-800">Request received</p>
              <p className="mt-1 text-sm text-green-700">
                If that email exists, a reset link has been sent. Check the server console for the link.
              </p>
              <Link
                href="/login"
                className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:underline"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="input-field"
                    required
                    placeholder="you@university.edu"
                  />
                </div>
                <button type="submit" className="btn-primary mt-2 w-full" disabled={loading}>
                  {loading ? "Please wait..." : "Send reset link"}
                </button>
              </form>
              <p className="mt-6 text-center text-xs text-slate-400">
                <Link href="/login" className="font-semibold text-indigo-600 hover:underline">
                  Back to sign in
                </Link>
              </p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
