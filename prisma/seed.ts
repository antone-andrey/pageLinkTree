import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Test1234!", 12);

  const user = await prisma.user.upsert({
    where: { email: "test@pagedrop.dev" },
    update: {},
    create: {
      email: "test@pagedrop.dev",
      name: "Test User",
      username: "testuser",
      passwordHash,
      bio: "Hey! I'm a test account for exploring PageDrop.",
      avatarUrl: null,
      plan: "PRO" as any,
      onboardingComplete: true,
      page: {
        create: {
          themeId: "default",
          isPublished: true,
          metaTitle: "Test User | PageDrop",
          metaDesc: "Check out my links and book a session!",
        },
      },
      links: {
        create: [
          { title: "My Portfolio", url: "https://example.com/portfolio", position: 0, isActive: true },
          { title: "Twitter / X", url: "https://x.com/testuser", position: 1, isActive: true },
          { title: "GitHub", url: "https://github.com/testuser", position: 2, isActive: true },
          { title: "YouTube Channel", url: "https://youtube.com/@testuser", position: 3, isActive: true },
        ],
      },
      services: {
        create: [
          { name: "Quick Chat", description: "15-min intro call", durationMins: 15, price: 0, currency: "usd", isActive: true },
          { name: "1-on-1 Consultation", description: "Deep-dive strategy session", durationMins: 60, price: 5000, currency: "usd", isActive: true },
        ],
      },
      availability: {
        create: [
          { dayOfWeek: 1, startTime: "09:00", endTime: "17:00", isActive: true, timezone: "America/New_York" },
          { dayOfWeek: 2, startTime: "09:00", endTime: "17:00", isActive: true, timezone: "America/New_York" },
          { dayOfWeek: 3, startTime: "09:00", endTime: "17:00", isActive: true, timezone: "America/New_York" },
          { dayOfWeek: 4, startTime: "09:00", endTime: "17:00", isActive: true, timezone: "America/New_York" },
          { dayOfWeek: 5, startTime: "09:00", endTime: "12:00", isActive: true, timezone: "America/New_York" },
        ],
      },
    },
  });

  console.log(`\n✅ Test account created successfully!\n`);
  console.log(`   Email:    test@pagedrop.dev`);
  console.log(`   Password: Test1234!`);
  console.log(`   Username: ${user.username}`);
  console.log(`   Plan:     ${user.plan}`);
  console.log(`   Public page: /testuser\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
