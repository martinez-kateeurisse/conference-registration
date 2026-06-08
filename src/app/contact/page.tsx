import Link from "next/link";

const contactItems = [
  {
    title: "Email us",
    detail: "support@conferenceportal.local",
    icon: "M",
    tone: "contact-icon-indigo",
  },
  {
    title: "Event questions",
    detail: "Ask about registration, check-in, and payment verification.",
    icon: "?",
    tone: "contact-icon-pink",
  },
  {
    title: "Admin support",
    detail: "Get help with certificates, memberships, and renewals.",
    icon: "!",
    tone: "contact-icon-violet",
  },
];

export default function ContactPage() {
  return (
    <main className="contact-shell min-h-screen text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-6">
        <Link href="/" className="flex items-center gap-3 font-bold">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
            CR
          </span>
          <span className="hidden text-sm uppercase tracking-[0.22em] text-slate-200 sm:inline">
            Conference Portal
          </span>
        </Link>
        <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-sm font-semibold text-slate-300 shadow-sm backdrop-blur">
          <Link href="/#home" className="dark-nav-pill">
            Home
          </Link>
          <Link href="/#about" className="dark-nav-pill">
            About
          </Link>
          <Link href="/#faqs" className="dark-nav-pill">
            FAQs
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 md:grid-cols-[0.95fr_1.05fr] md:py-20">
        <div>
          <p className="inline-flex rounded-full border border-indigo-400/40 bg-indigo-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-indigo-200">
            Contact us
          </p>
          <h1 className="mt-7 text-4xl font-black leading-tight text-white md:text-6xl">
            Let&apos;s get in <span className="text-indigo-300">touch</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
            Have a question, feature request, or deployment concern? Send a
            message and the conference portal team can follow up with the right
            next step.
          </p>

          <div className="mt-9 space-y-5">
            {contactItems.map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <span className={`contact-icon ${item.tone}`}>{item.icon}</span>
                <div>
                  <h2 className="font-black text-slate-100">{item.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form className="contact-card">
          <div>
            <label className="contact-label" htmlFor="name">
              Name
            </label>
            <input id="name" className="contact-field" placeholder="Your name" />
          </div>

          <div>
            <label className="contact-label" htmlFor="email">
              Email
            </label>
            <input id="email" type="email" className="contact-field" placeholder="you@example.com" />
          </div>

          <div>
            <label className="contact-label" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              className="contact-field min-h-32 resize-none"
              placeholder="What's on your mind?"
            />
          </div>

          <button type="button" className="contact-submit">
            Send message -&gt;
          </button>
          <p className="text-center text-xs font-semibold text-slate-500">
            We typically respond within 24 hours.
          </p>
        </form>
      </section>
    </main>
  );
}
