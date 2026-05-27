"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Mode = "signin" | "signup";

export function AuthModal({ initialMode = "signin" }: { initialMode?: Mode }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const endpoint = mode === "signin" ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd)),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 auth-gradient">
      <div className="w-full max-w-[920px] grid md:grid-cols-2 rounded-3xl overflow-hidden glass-card shadow-2xl">
        {/* Left panel — Dribbble-style hero */}
        <div className="hidden md:flex flex-col justify-between p-10 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-violet-600/80 to-pink-500/90" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold mb-8">
              CR
            </div>
            <h1 className="text-3xl font-bold leading-tight mb-3">
              Research Conference &amp; Membership Portal
            </h1>
            <p className="text-white/80 text-sm leading-relaxed">
              Early registration with QR badges, payment verification, certificates, and
              membership renewals — all in one place.
            </p>
          </div>
          <div className="relative z-10 space-y-3 text-sm text-white/70">
            <p>✓ Unique QR per participant</p>
            <p>✓ Bank &amp; e-wallet payment approval</p>
            <p>✓ Event &amp; membership certificates</p>
          </div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
        </div>

        {/* Right panel — form */}
        <div className="p-8 md:p-10 bg-white">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-8">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
                mode === "signin"
                  ? "bg-white shadow text-indigo-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
                mode === "signup"
                  ? "bg-white shadow text-indigo-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Sign up
            </button>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">
            {mode === "signin" ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            {mode === "signin"
              ? "Enter your credentials to access your dashboard"
              : "Register to join events and apply for membership"}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="label" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  className="input-field"
                  required
                  placeholder="Juan Dela Cruz"
                />
              </div>
            )}

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

            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="input-field"
                required
                minLength={8}
                placeholder="••••••••"
              />
            </div>

            {mode === "signup" && (
              <>
                <div>
                  <label className="label" htmlFor="organization">
                    Organization (optional)
                  </label>
                  <input
                    id="organization"
                    name="organization"
                    className="input-field"
                    placeholder="University / Company"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="phone">
                    Phone (optional)
                  </label>
                  <input id="phone" name="phone" className="input-field" placeholder="+63..." />
                </div>
              </>
            )}

            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            <Link href="/" className="text-indigo-600 hover:underline">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
