import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash("admin12345", 12);
  const userHash = await bcrypt.hash("user12345", 12);

  await prisma.user.upsert({
    where: { email: "admin@conference.local" },
    update: {},
    create: {
      email: "admin@conference.local",
      passwordHash: adminHash,
      name: "System Admin",
      role: "ADMIN",
      organization: "Conference Secretariat",
    },
  });

  await prisma.user.upsert({
    where: { email: "participant@conference.local" },
    update: {},
    create: {
      email: "participant@conference.local",
      passwordHash: userHash,
      name: "Demo Participant",
      role: "USER",
      organization: "State University",
    },
  });

  const start = new Date("2026-09-15");
  const end = new Date("2026-09-17");

  await prisma.event.upsert({
    where: { id: "seed-event-2026" },
    update: {},
    create: {
      id: "seed-event-2026",
      name: "International Research Conference on Mechatronics 2026",
      description:
        "Annual research conference featuring plenary sessions, paper presentations, and industry forums.",
      venue: "Metro Convention Center",
      startDate: start,
      endDate: end,
      earlyDeadline: new Date("2026-07-31"),
      regularFee: 3500,
      earlyFee: 2500,
      isResearchConf: true,
      active: true,
    },
  });

  console.log("Seed complete.");
  console.log("Admin: admin@conference.local / admin12345");
  console.log("User:  participant@conference.local / user12345");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
