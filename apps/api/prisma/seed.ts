import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const MODULE_NAMES = [
  "STUDENT_PROFILE",
  "PROGRAMS",
  "PROJECTS",
  "JOB_MARKETPLACE",
  "INTERNSHIPS",
  "HIRING_PARTNERS",
  "CHAT",
  "REFERRALS",
  "FREELANCE",
  "WALLET",
  "TALKS",
  "SPONSORSHIP",
  "MARATHON",
  "PLACEMENT_PARTNERS",
  "CAMPUS_AMBASSADOR",
  "RECOMMENDATIONS",
  "SMART_SEARCH",
];

async function main() {
  for (const name of MODULE_NAMES) {
    await prisma.module.upsert({
      where: { name },
      update: {},
      create: { name, isEnabled: true },
    });
  }

  const adminEmail = "admin@c2cw.dev";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("Admin@123", 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: "C2CW Admin",
        role: "ADMIN",
      },
    });
    console.log(`Seeded admin user: ${adminEmail} / Admin@123`);
  }

  console.log(`Seeded ${MODULE_NAMES.length} modules.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
