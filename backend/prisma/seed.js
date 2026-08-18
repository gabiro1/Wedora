import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@wedora.com" },
    update: {},
    create: {
      email: "admin@wedora.com",
      passwordHash,
      firstName: "Admin",
      lastName: "Wedora",
      role: "SUPER_ADMIN",
      emailVerified: true,
    },
  });

  const organizer = await prisma.user.upsert({
    where: { email: "organizer@wedora.com" },
    update: {},
    create: {
      email: "organizer@wedora.com",
      passwordHash,
      firstName: "Jean",
      lastName: "Hakizimana",
      role: "ORGANIZER",
      emailVerified: true,
    },
  });

  const mc = await prisma.user.upsert({
    where: { email: "mc@wedora.com" },
    update: {},
    create: {
      email: "mc@wedora.com",
      passwordHash,
      firstName: "David",
      lastName: "Mukamuri",
      role: "MC",
      emailVerified: true,
    },
  });

  console.log("Users created:", { admin: admin.email, organizer: organizer.email, mc: mc.email });
  console.log("Default password: password123");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
