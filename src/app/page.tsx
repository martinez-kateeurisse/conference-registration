import Link from "next/link";
import { getSession } from "@/lib/auth";

const features = [
  {
    label: "01",
    title: "Early registration",
    desc: "Open attendee signups early, collect details, and issue a unique QR code for smooth event check-in.",
  },
  {
    label: "02",
    title: "Payment confirmation",
    desc: "Participants upload bank or e-wallet proof while admins review approvals from one organized portal.",
  },
  {
    label: "03",
    title: "Certificates",
    desc: "Request and manage participation, recognition, appearance, presentation, and membership certificates.",
  },
  {
    label: "04",
    title: "Membership database",
    desc: "Track institutional, lifetime, individual, and certification memberships in a searchable database.",
  },
  {
    label: "05",
    title: "Renewal reminders",
    desc: "Keep members informed with renewal notices before their membership reaches expiry.",
  },
  {
    label: "06",
    title: "Admin portal",
    desc: "Approve payments, manage registrations, issue certificates, and monitor renewal activity.",
  },
];

const faqs = [
  {
    question: "Can participants register before the event?",
    answer:
      "Yes. Participants can register early, submit their details, and receive a QR code after their registration is processed.",
  },
  {
    question: "How are payments verified?",
    answer:
      "Users upload proof of payment, then admins review and approve the payment before marking the registration or membership as confirmed.",
  },
  {
    question: "What certificate requests are supported?",
    answer:
      "The system supports event-related certificates plus membership certificates, depending on the participant or member record.",
  },
  {
    question: "Is there an admin dashboard?",
    answer:
      "Yes. Admins can manage registrations, payments, certificate requests, memberships, and renewal tracking from the portal.",
  },
];

export default async function HomePage() {
  const session = await getSession();
  const primaryHref = session ? "/dashboard" : "/register";
  const primaryText = session ? "Go to dashboard" : "Get started";

  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      <header className="sticky top-0 z-30 border-b border-white/30 bg-white/85 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" className="flex items-center gap-3 font-bold text-slate-950">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25">
              CR
            </span>
            <span className="hidden text-sm uppercase tracking-[0.22em] text-slate-700 sm:inline">
              Conference Portal
            </span>
          </Link>

          <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 text-sm font-semibold text-slate-600 shadow-sm">
            <a href="#home" className="nav-pill">
              Home
            </a>
            <a href="#about" className="nav-pill">
              About
            </a>
            <a href="#faqs" className="nav-pill">
              FAQs
            </a>
            <Link href="/contact" className="nav-pill">
              Contact
            </Link>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            {!session && (
              <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-700">
                Sign in
              </Link>
            )}
            <Link href={primaryHref} className="btn-primary px-5 py-2.5 text-sm">
              {primaryText}
            </Link>
          </div>
        </nav>
      </header>

      <main id="home">
        <section className="hero-gradient text-white">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-20">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-white/75">
                Research Conference - Convention - Forum
              </p>
              <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
                Organization &amp; Event Registration System
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/86 md:text-lg">
                A responsive service portal for event registration, QR check-ins, payment
                verification, certificate requests, and membership renewal management.
              </p>
            </div>

            <div className="relative min-h-[380px]">
              <div className="pointer-events-none absolute left-5 top-8 h-36 w-36 rounded-full bg-white/20 blur-3xl" />
              <div className="pointer-events-none absolute bottom-10 right-0 h-44 w-44 rounded-full bg-indigo-300/20 blur-3xl" />
              <div className="relative mx-auto max-w-md rounded-[2rem] border border-white/30 bg-white/18 p-4 shadow-2xl backdrop-blur-xl">
                <div className="rounded-[1.5rem] bg-white p-4 text-slate-950 shadow-xl">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-500">
                        Live overview
                      </p>
                      <h2 className="text-xl font-black">Event dashboard</h2>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      Active
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      ["248", "Registered"],
                      ["91%", "Approved"],
                      ["36", "Requests"],
                    ].map(([value, label]) => (
                      <div key={label} className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-xl font-black text-slate-950">{value}</p>
                        <p className="mt-1 text-[11px] font-semibold text-slate-500">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 space-y-3">
                    {["QR code ready", "Payment for review", "Certificate queued"].map((item, index) => (
                      <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3">
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-sm font-black text-indigo-600">
                          {index + 1}
                        </span>
                        <span className="text-sm font-bold text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="section-kicker">Intro to the service</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black text-slate-950 md:text-4xl">
                Built to keep conference operations simple, clear, and organized.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-slate-600">
              From first registration to final certificate release, the portal gives
              participants and admins a consistent place to manage the full event journey.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <article key={f.title} className="feature-card group">
                <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-sm font-black text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                  {f.label}
                </span>
                <h3 className="text-lg font-black text-slate-950">{f.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{f.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-3">
            {[
              ["Register", "Participants submit event and membership details from a clean guided form."],
              ["Verify", "Admins review payment proofs and keep approvals transparent."],
              ["Release", "QR codes, certificates, and renewal updates stay connected to each record."],
            ].map(([title, copy]) => (
              <div key={title}>
                <h3 className="text-xl font-black text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="faqs" className="mx-auto max-w-4xl px-5 py-16 md:py-20">
          <div className="mb-8 text-center">
            <p className="section-kicker">FAQs</p>
            <h2 className="mt-3 text-3xl font-black text-slate-950 md:text-4xl">
              Common questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="faq-item group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-bold text-slate-950">
                  {faq.question}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo-50 text-indigo-600 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer text-white">
        <section className="border-b border-white/10 px-5 py-16 text-center md:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-black leading-tight md:text-5xl">
              Ready to simplify your next conference?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
              Bring registration, payment review, certificate requests, and membership
              renewals into one organized portal built for busy event teams.
            </p>
            <Link href={primaryHref} className="footer-cta mt-8">
              {primaryText}
              <span aria-hidden="true">-&gt;</span>
            </Link>
          </div>
        </section>

        <section className="px-5 py-9">
          <div className="mx-auto flex max-w-6xl flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div className="max-w-md text-sm leading-7 text-slate-400">
              <p className="font-semibold text-slate-200">(c) 2026 Conference Portal. All rights reserved.</p>
              <p className="mt-3">
                Conference Portal helps event organizers manage registrations,
                approvals, certificate workflows, and member records with clarity.
              </p>
            </div>
            <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-300">
              <a href="#home" className="hover:text-white">
                Home
              </a>
              <a href="#about" className="hover:text-white">
                About
              </a>
              <a href="#faqs" className="hover:text-white">
                FAQs
              </a>
              <Link href="/contact" className="hover:text-white">
                Contact Us
              </Link>
              {!session && (
                <Link href="/login" className="hover:text-white">
                  Sign in
                </Link>
              )}
            </nav>
          </div>
        </section>
      </footer>
    </div>
  );
}
