import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/ProfileForm";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      name: true,
      email: true,
      organization: true,
      phone: true,
      country: true,
      createdAt: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-3xl">
      <section className="mb-8">
        <p className="section-kicker">Profile</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Account profile</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Manage your personal information, contact details, and country or region.
        </p>
      </section>

      <ProfileForm
        user={{
          name: user.name,
          email: user.email,
          organization: user.organization,
          phone: user.phone,
          country: user.country ?? "PH",
          createdAt: user.createdAt.toISOString(),
        }}
      />
    </div>
  );
}
