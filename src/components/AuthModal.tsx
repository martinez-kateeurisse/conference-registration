"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

type Mode = "signin" | "signup";

const benefits = [
  "Unique QR code per participant",
  "Bank and e-wallet payment approval",
  "Event and membership certificate requests",
];

export function AuthModal({ initialMode = "signin" }: { initialMode?: Mode }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    
    // Client-side phone validation before sending data to backend
    if (mode === "signup") {
      const phone = fd.get("phone") as string;
      if (phone) {
        // Regex validation: Allows standard PH mobile formats: 09171234567, +639171234567, or 639171234567
        const phPhoneRegex = /^(09|\+639|639)\d{9}$/;
        if (!phPhoneRegex.test(phone.replace(/\s+/g, ""))) {
          setError("Invalid phone number format. Please use 09XXXXXXXXX or +639XXXXXXXXX.");
          setLoading(false);
          return;
        }
      }
    }

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
              Secure access
            </p>
            <h1 className="mt-4 text-3xl font-black leading-tight">
              Manage registrations, approvals, and certificates in one place.
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/72">
              Sign in to continue event operations, or create an account to begin a
              registration and membership workflow.
            </p>
          </div>

          <div className="relative space-y-3">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
                <span className="h-2.5 w-2.5 rounded-full bg-pink-300" />
                <span className="text-sm font-semibold text-white/82">{benefit}</span>
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

          <div className="mb-8 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => { setMode("signin"); setError(""); }}
              className={`rounded-xl px-4 py-3 text-sm font-black transition ${
                mode === "signin"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => { setMode("signup"); setError(""); }}
              className={`rounded-xl px-4 py-3 text-sm font-black transition ${
                mode === "signup"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Sign up
            </button>
          </div>

          <div className="mb-6">
            <p className="section-kicker">{mode === "signin" ? "Welcome back" : "Create access"}</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">
              {mode === "signin" ? "Sign in to your dashboard" : "Create your account"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {mode === "signin"
                ? "Enter your credentials to continue managing conference records."
                : "Register to join events, request certificates, and manage membership details."}
            </p>
          </div>

          {mode === "signin" && (
            <div className="mb-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-xs text-indigo-900">
              <p className="font-black">Demo accounts after deployment</p>
              <p className="mt-1">Admin: admin@conference.local / admin12345</p>
              <p>User: participant@conference.local / user12345</p>
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="label" htmlFor="name">
                  Full name *
                </label>
                <input 
                  id="name" 
                  name="name" 
                  className="input-field" 
                  required 
                  maxLength={100} // FIX: Prevent database text-bloat
                  placeholder="Juan Dela Cruz" 
                />
              </div>
            )}

            <div>
              <label className="label" htmlFor="email">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="input-field"
                required
                maxLength={150} // FIX: Prevent database text-bloat
                placeholder="you@university.edu"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="label mb-0" htmlFor="password">
                  Password *
                </label>
                {mode === "signin" && (
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="input-field pr-11"
                  required
                  minLength={8}   // Maintained for sign-in and sign-up uniformity
                  maxLength={72}  // FIX: Safety limit for standard hashing frameworks (Bcrypt maxes out at 72)
                  placeholder="Minimum 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="organization">
                    Organization
                  </label>
                  <input
                    id="organization"
                    name="organization"
                    className="input-field"
                    maxLength={150} // FIX: Prevent database text-bloat
                    placeholder="University / Company"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="phone">
                    Phone
                  </label>
                  <input 
                    id="phone" 
                    name="phone" 
                    className="input-field" 
                    maxLength={13} // FIX: Maximum length for standard "+639171234567"
                    placeholder="09171234567" 
                  />
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary mt-2 w-full" disabled={loading}>
              {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            <Link href="/" className="font-semibold text-indigo-600 hover:underline">
              Back to home
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}