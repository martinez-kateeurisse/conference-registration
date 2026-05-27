import Link from "next/link";
import type { SessionUser } from "@/lib/auth";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/events", label: "Events" },
  { href: "/dashboard/certificates", label: "Certificates" },
  { href: "/dashboard/membership", label: "Membership" },
];

export function DashboardNav({ user }: { user: SessionUser }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <Link href="/dashboard" className="font-bold text-indigo-600 text-lg">
          Conference Portal
        </Link>
        <nav className="flex flex-wrap gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
            >
              {l.label}
            </Link>
          ))}
          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="px-3 py-2 text-sm font-medium text-pink-600 hover:bg-pink-50 rounded-lg"
            >
              Admin
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-500 hidden sm:inline">{user.name}</span>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="text-slate-600 hover:text-red-600 font-medium"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
