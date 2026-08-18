import prisma from "../config/db.js";
import { NotFoundError, BadRequestError } from "../utils/errors.js";
import { emitToMC, emitToWedding } from "../config/socket.js";

class ContributionService {
  async create(weddingId, data, guestToken) {
    let guestId = null;
    if (guestToken) {
      const guest = await prisma.guest.findUnique({ where: { token: guestToken } });
      if (guest && guest.weddingId === weddingId) guestId = guest.id;
    }

    const queueCount = await prisma.contributionQueue.count({
      where: { weddingId, isAcknowledged: false },
    });

    const contribution = await prisma.contribution.create({
      data: {
        weddingId, guestId, guestName: data.guestName, guestPhone: data.guestPhone,
        type: data.type, description: data.description,
        monetaryAmount: data.monetaryAmount, currency: data.currency || "RWF", notes: data.notes,
        queueEntries: {
          create: { weddingId, position: queueCount + 1, isCurrent: queueCount === 0 },
        },
      },
      include: { queueEntries: true },
    });

    emitToMC(weddingId, "contribution:created", {
      guestName: contribution.guestName, type: contribution.type, timestamp: contribution.createdAt,
    });

    return contribution;
  }

  async getQueue(weddingId) {
    const entries = await prisma.contributionQueue.findMany({
      where: { weddingId, isAcknowledged: false },
      orderBy: { position: "asc" },
      include: { contribution: { select: { id: true, guestName: true, type: true, createdAt: true } } },
    });

    return {
      current: entries.find((e) => e.isCurrent) || null,
      next: entries.filter((e) => !e.isCurrent).slice(0, 5),
      total: entries.length,
    };
  }

  async acknowledgeNext(weddingId) {
    const current = await prisma.contributionQueue.findFirst({
      where: { weddingId, isCurrent: true, isAcknowledged: false },
      include: { contribution: true },
    });
    if (!current) throw new NotFoundError("No one in queue");

    await prisma.contributionQueue.update({
      where: { id: current.id },
      data: { isAcknowledged: true, isCurrent: false, acknowledgedAt: new Date() },
    });

    await prisma.contribution.update({
      where: { id: current.contributionId },
      data: { isAcknowledged: true, acknowledgedAt: new Date(), status: "ACKNOWLEDGED" },
    });

    const next = await prisma.contributionQueue.findFirst({
      where: { weddingId, isAcknowledged: false, isCurrent: false },
      orderBy: { position: "asc" },
    });

    if (next) {
      await prisma.contributionQueue.update({ where: { id: next.id }, data: { isCurrent: true } });
    }

    const queue = await this.getQueue(weddingId);
    emitToMC(weddingId, "queue:updated", queue);
    return { acknowledged: current.contribution.guestName, queue };
  }

  async undoAcknowledge(weddingId, queueEntryId) {
    const entry = await prisma.contributionQueue.findUnique({
      where: { id: queueEntryId }, include: { contribution: true },
    });
    if (!entry || entry.weddingId !== weddingId) throw new NotFoundError("Queue entry");
    if (!entry.isAcknowledged) throw new BadRequestError("Entry not yet acknowledged");

    const currentEntry = await prisma.contributionQueue.findFirst({
      where: { weddingId, isCurrent: true },
    });

    await prisma.contributionQueue.update({
      where: { id: entry.id },
      data: { isAcknowledged: false, isCurrent: !currentEntry, acknowledgedAt: null },
    });

    if (currentEntry) {
      await prisma.contributionQueue.update({
        where: { id: currentEntry.id },
        data: { isCurrent: false, position: currentEntry.position + 1 },
      });
    }

    await prisma.contribution.update({
      where: { id: entry.contributionId },
      data: { isAcknowledged: false, acknowledgedAt: null, status: "PENDING" },
    });

    const queue = await this.getQueue(weddingId);
    emitToMC(weddingId, "queue:updated", queue);
    return queue;
  }

  async list(weddingId, filters) {
    const { page = 1, limit = 20, type, status, search, sort } = filters;
    const skip = (page - 1) * limit;

    const where = { weddingId };
    if (type) where.type = type;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { guestName: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy = sort === "oldest" ? { createdAt: "asc" } : sort === "name" ? { guestName: "asc" } : { createdAt: "desc" };

    const [contributions, total] = await Promise.all([
      prisma.contribution.findMany({ where, skip, take: limit, orderBy }),
      prisma.contribution.count({ where }),
    ]);

    return { contributions, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async update(id, data) {
    const c = await prisma.contribution.findUnique({ where: { id } });
    if (!c) throw new NotFoundError("Contribution");
    return prisma.contribution.update({ where: { id }, data });
  }
}

export const contributionService = new ContributionService();
