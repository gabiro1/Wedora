import prisma from "../config/db.js";
import { generateEventToken, generateGuestToken } from "../utils/token.js";
import { NotFoundError, ForbiddenError } from "../utils/errors.js";
import QRCode from "qrcode";

class WeddingService {
  async create(userId, data) {
    const eventToken = generateEventToken();
    return prisma.wedding.create({
      data: {
        coupleName: data.coupleName,
        partnerName: data.partnerName,
        weddingDate: data.weddingDate,
        location: data.location,
        description: data.description,
        coverImage: data.coverImage,
        primaryLanguage: data.primaryLanguage || "en",
        isPrivate: data.isPrivate !== false,
        timezone: data.timezone || "Africa/Kigali",
        eventToken,
        members: { create: { userId, role: "OWNER" } },
        themes: { create: { name: "Default", primary: "#8B7355", secondary: "#F5F0EB", accent: "#C9A96E", background: "#FDFBF7", text: "#2C2C2C" } },
      },
      include: { members: true, themes: true },
    });
  }

  async getByEventToken(eventToken) {
    const wedding = await prisma.wedding.findUnique({
      where: { eventToken },
      select: {
        id: true, coupleName: true, partnerName: true, weddingDate: true, location: true,
        description: true, coverImage: true, primaryLanguage: true, status: true, themes: true,
      },
    });
    if (!wedding) throw new NotFoundError("Wedding");
    return wedding;
  }

  async getById(id) {
    const wedding = await prisma.wedding.findUnique({
      where: { id },
      include: {
        members: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, role: true } } } },
        themes: true,
      },
    });
    if (!wedding) throw new NotFoundError("Wedding");
    return wedding;
  }

  async update(id, userId, data) {
    await this.verifyOwnership(id, userId);
    return prisma.wedding.update({ where: { id }, data, include: { themes: true } });
  }

  async list(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [weddings, total] = await Promise.all([
      prisma.wedding.findMany({
        where: { members: { some: { userId } } },
        skip, take: limit, orderBy: { createdAt: "desc" },
        include: { themes: true, _count: { select: { contributions: true, memories: true, guests: true } } },
      }),
      prisma.wedding.count({ where: { members: { some: { userId } } } }),
    ]);
    return { weddings, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async generateQR(id, type = "main") {
    const wedding = await prisma.wedding.findUnique({ where: { id } });
    if (!wedding) throw new NotFoundError("Wedding");

    const base = process.env.CLIENT_URL || "http://localhost:3000";
    const urls = {
      main: `${base}/w/${wedding.eventToken}`,
      contribution: `${base}/w/${wedding.eventToken}/contribute`,
      memory: `${base}/w/${wedding.eventToken}/capture`,
    };

    const url = urls[type] || urls.main;
    const [png, svg] = await Promise.all([
      QRCode.toDataURL(url, { width: 400, margin: 2, color: { dark: "#2C2C2C", light: "#FDFBF7" } }),
      QRCode.toString(url, { type: "svg", width: 400, margin: 2, color: { dark: "#2C2C2C", light: "#FDFBF7" } }),
    ]);

    return { url, png, svg, type };
  }

  async createGuest(weddingId, name) {
    const wedding = await prisma.wedding.findUnique({ where: { id: weddingId } });
    if (!wedding) throw new NotFoundError("Wedding");
    return prisma.guest.create({
      data: { weddingId, name, token: generateGuestToken(), isAnonymous: !name },
    });
  }

  async verifyOwnership(weddingId, userId) {
    const member = await prisma.weddingMember.findUnique({
      where: { userId_weddingId: { userId, weddingId } },
    });
    if (!member) throw new ForbiddenError("Not a member of this wedding");
    return member;
  }

  async getStats(weddingId) {
    const [contributions, memories, guests, pendingMemories] = await Promise.all([
      prisma.contribution.aggregate({ where: { weddingId }, _count: true, _sum: { monetaryAmount: true } }),
      prisma.memory.aggregate({ where: { weddingId, moderationStatus: "APPROVED" }, _count: true }),
      prisma.guest.count({ where: { weddingId } }),
      prisma.memory.count({ where: { weddingId, moderationStatus: "PENDING" } }),
    ]);

    const mediaByType = await prisma.memory.groupBy({
      by: ["mediaType"], where: { weddingId, moderationStatus: "APPROVED" }, _count: true,
    });

    return {
      totalContributions: contributions._count,
      totalMonetary: Number(contributions._sum.monetaryAmount || 0),
      totalMemories: memories._count,
      totalGuests: guests,
      pendingMemories,
      photos: mediaByType.find((m) => m.mediaType === "PHOTO")?._count || 0,
      videos: mediaByType.find((m) => m.mediaType === "VIDEO")?._count || 0,
    };
  }
}

export const weddingService = new WeddingService();
