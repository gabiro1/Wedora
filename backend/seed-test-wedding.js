import { PrismaClient } from "@prisma/client";
import QRCode from "qrcode";

const prisma = new PrismaClient();

async function main() {
  // Find or create the organizer user
  let user = await prisma.user.findUnique({ where: { email: "organizer@wedora.com" } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "organizer@wedora.com",
        passwordHash: "$2a$10$dummyhash",
        firstName: "Jean",
        lastName: "Hakizimana",
        role: "ORGANIZER",
      },
    });
    console.log("Created organizer user");
  }

  // Generate event token (24 char hex)
  const eventToken = crypto.randomUUID().replace(/-/g, "").substring(0, 24);

  // Create test wedding
  const wedding = await prisma.wedding.create({
    data: {
      eventToken,
      coupleName: "Jean & Marie",
      partnerName: "Marie Claire",
      weddingDate: new Date("2026-09-15T14:00:00Z"),
      location: "Kigali Convention Centre",
      description: "A beautiful celebration of love",
      primaryLanguage: "en",
      timezone: "Africa/Kigali",
      status: "ACTIVE",
      isPrivate: false,
      settings: "{}",
      members: {
        create: { userId: user.id, role: "OWNER" },
      },
      themes: {
        create: {
          name: "Classic Gold",
          primary: "#8B7355",
          secondary: "#F5F0EB",
          accent: "#C9A96E",
          background: "#FDFBF7",
          text: "#2C2C2C",
          font: "Inter",
        },
      },
    },
    include: { members: true, themes: true },
  });

  console.log("\n=== TEST WEDDING CREATED ===");
  console.log(`Wedding ID: ${wedding.id}`);
  console.log(`Event Token: ${wedding.eventToken}`);

  const clientUrl = "https://wedora-chi.vercel.app";
  const urls = {
    main: `${clientUrl}/w/${wedding.eventToken}`,
    contribute: `${clientUrl}/w/${wedding.eventToken}/contribute`,
    capture: `${clientUrl}/w/${wedding.eventToken}/capture`,
    mc: `${clientUrl}/mc/${wedding.id}`,
  };

  console.log("\n=== GUEST URLS ===");
  console.log(`Welcome:   ${urls.main}`);
  console.log(`Contribute: ${urls.contribute}`);
  console.log(`Capture:   ${urls.capture}`);
  console.log(`MC Queue:  ${urls.mc}`);

  // Generate QR code as PNG file
  await QRCode.toFile("qr-main.png", urls.main, {
    width: 400,
    margin: 2,
    color: { dark: "#2C2C2C", light: "#FDFBF7" },
  });
  console.log("\nQR code saved to: qr-main.png");
  console.log("\nScan this QR code with your phone to test the guest flow!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
