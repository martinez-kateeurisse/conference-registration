import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="min-h-screen">
      <div className="auth-gradient text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-4">
            Research Conference · Convention · Forum
          </p>
          <h1 className="text-4xl md:text-5xl font-bold max-w-2xl leading-tight mb-6">
            Organization &amp; Event Registration System
          </h1>
          <p className="text-lg text-white/85 max-w-xl mb-10">
            Early registration with QR codes, payment verification, certificate requests, and
            membership management with renewal notifications.
          </p>
          <div className="flex flex-wrap gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl shadow-lg hover:bg-indigo-50"
              >
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl shadow-lg hover:bg-indigo-50"
                >
                  Get started
                </Link>
                <Link
                  href="/login"
                  className="px-6 py-3 border-2 border-white/60 text-white font-semibold rounded-xl hover:bg-white/10"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Early registration",
            desc: "Register early and receive a unique QR code for event check-in.",
          },
          {
            title: "Payment confirmation",
            desc: "Upload bank or e-wallet proof. Admins verify before approval.",
          },
          {
            title: "Certificates",
            desc: "Participation, appearance, recognition, presentation, and membership certs.",
          },
          {
            title: "Membership database",
            desc: "Track institutional, lifetime, individual, and mechatronics certifications.",
          },
          {
            title: "Renewals",
            desc: "Automated email reminders before membership expiry.",
          },
          {
            title: "Admin portal",
            desc: "Approve payments, issue certificates, and manage renewals.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm"
          >
            <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
            <p className="text-slate-600 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
