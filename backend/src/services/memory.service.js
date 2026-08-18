import prisma from "../config/db.js";
import { NotFoundError } from "../utils/errors.js";
import { cloudinary } from "../config/cloudinary.js";
import { generateThumbnailUrl } from "../utils/helpers.js";
import { emitToWall, emitToWedding } from "../config/socket.js";

class MemoryService {
  async upload(weddingId, file, data) {
    let guestId = null;
    if (data.guestToken) {
      const guest = await prisma.guest.findUnique({ where: { token: data.guestToken } });
      if (guest && guest.weddingId === weddingId) guestId = guest.id;
    }

    const mediaType = file.mimetype.startsWith("video/") ? "VIDEO" : "PHOTO";
    const thumbnailUrl = mediaType === "PHOTO" ? generateThumbnailUrl(file.path) : null;

    const memory = await prisma.memory.create({
      data: {
        weddingId, guestId, guestName: data.guestName,
        mediaType, storageUrl: file.path, thumbnailUrl,
        publicId: file.filename, fileSize: file.size,
        mimeType: file.mimetype, caption: data.caption,
        moderationStatus: "PENDING",
      },
    });

    emitToWedding(weddingId, "memory:uploaded", {
      id: memory.id, mediaType, guestName: data.guestName, timestamp: memory.createdAt,
    });

    return memory;
  }

  async list(weddingId, filters) {
    const { page = 1, limit = 20, mediaType, moderationStatus, sort } = filters;
    const skip = (page - 1) * limit;

    const where = { weddingId };
    if (mediaType) where.mediaType = mediaType;
    if (moderationStatus) where.moderationStatus = moderationStatus;
    else where.moderationStatus = { not: "REMOVED" };

    const orderBy = sort === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };

    const [memories, total] = await Promise.all([
      prisma.memory.findMany({ where, skip, take: limit, orderBy }),
      prisma.memory.count({ where }),
    ]);

    return { memories, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async approve(id) {
    const memory = await prisma.memory.findUnique({ where: { id } });
    if (!memory) throw new NotFoundError("Memory");

    const updated = await prisma.memory.update({
      where: { id }, data: { moderationStatus: "APPROVED" },
    });

    emitToWall(memory.weddingId, "memory:approved", {
      id: updated.id, storageUrl: updated.storageUrl, thumbnailUrl: updated.thumbnailUrl,
      mediaType: updated.mediaType, guestName: updated.guestName, caption: updated.caption,
    });

    return updated;
  }

  async reject(id) {
    const m = await prisma.memory.findUnique({ where: { id } });
    if (!m) throw new NotFoundError("Memory");
    return prisma.memory.update({ where: { id }, data: { moderationStatus: "REJECTED" } });
  }

  async remove(id) {
    const m = await prisma.memory.findUnique({ where: { id } });
    if (!m) throw new NotFoundError("Memory");
    if (m.publicId) {
      try { await cloudinary.uploader.destroy(m.publicId); } catch { /* continue */ }
    }
    return prisma.memory.update({ where: { id }, data: { moderationStatus: "REMOVED" } });
  }

  async report(id, reason, reporterIp) {
    const m = await prisma.memory.findUnique({ where: { id } });
    if (!m) throw new NotFoundError("Memory");
    await prisma.memoryReport.create({ data: { memoryId: id, reason, reporterIp } });
    return prisma.memory.update({ where: { id }, data: { moderationStatus: "REPORTED" } });
  }

  async getTimeline(weddingId) {
    const memories = await prisma.memory.findMany({
      where: { weddingId, moderationStatus: "APPROVED" },
      orderBy: { createdAt: "asc" },
      select: { id: true, createdAt: true, mediaType: true, storageUrl: true, thumbnailUrl: true, guestName: true },
    });

    const groups = {};
    memories.forEach((m) => {
      const hour = new Date(m.createdAt).getHours();
      const period = hour < 10 ? "MORNING" : hour < 14 ? "CEREMONY" : hour < 17 ? "RECEPTION" : hour < 20 ? "CELEBRATION" : "FINAL_MOMENTS";
      if (!groups[period]) groups[period] = [];
      groups[period].push(m);
    });

    return Object.entries(groups).map(([period, items]) => ({ period, count: items.length, memories: items }));
  }

  async getApprovedForWall(weddingId) {
    return prisma.memory.findMany({
      where: { weddingId, moderationStatus: "APPROVED" },
      orderBy: { createdAt: "desc" }, take: 50,
      select: { id: true, storageUrl: true, thumbnailUrl: true, mediaType: true, guestName: true, caption: true, createdAt: true },
    });
  }

  async toggleFavorite(id) {
    const m = await prisma.memory.findUnique({ where: { id } });
    if (!m) throw new NotFoundError("Memory");
    return prisma.memory.update({ where: { id }, data: { isFavorite: !m.isFavorite } });
  }
}

export const memoryService = new MemoryService();
