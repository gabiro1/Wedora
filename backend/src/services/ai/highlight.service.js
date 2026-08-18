import prisma from "../../config/db.js";

/**
 * AI Highlight Generation
 * Selects the best memories based on quality, diversity, uniqueness, and timing.
 */

class HighlightService {
  async generate(weddingId, targetCount = 25) {
    const memories = await prisma.memory.findMany({
      where: { weddingId, mediaType: "PHOTO", moderationStatus: "APPROVED" },
      include: { analysis: true },
      orderBy: { createdAt: "asc" },
    });

    if (memories.length === 0) return { highlights: [], total: 0 };

    const scored = this.#scoreMemories(memories);
    const selected = this.#selectDiverse(scored, targetCount);

    // Clear existing highlights
    const existing = await prisma.weddingHighlights.findUnique({ where: { weddingId } });
    if (existing) {
      await prisma.highlightItem.deleteMany({ where: { highlightsId: existing.id } });
      await prisma.weddingHighlights.delete({ where: { weddingId } });
    }

    const categories = { COUPLE: 0, FAMILY: 0, CEREMONY: 0, RECEPTION: 0, FRIENDS: 0, OTHER: 0 };
    const items = selected.map((m, i) => {
      const cat = this.#categorizeMemory(m);
      categories[cat] = (categories[cat] || 0) + 1;
      return { memoryId: m.id, position: i + 1, category: cat, reason: m.reason, score: m.highlightScore };
    });

    const highlights = await prisma.weddingHighlights.create({
      data: {
        weddingId,
        totalCount: items.length,
        coupleMoments: categories.COUPLE,
        familyMoments: categories.FAMILY,
        ceremonyMoments: categories.CEREMONY,
        receptionMoments: categories.RECEPTION,
        friendMoments: categories.FRIENDS,
        status: "GENERATED",
        lastGeneratedAt: new Date(),
        items: { create: items },
      },
      include: { items: { include: { /* memory loaded separately */ } } },
    });

    return {
      highlights,
      categories,
      total: items.length,
    };
  }

  #scoreMemories(memories) {
    return memories.map((m) => {
      let score = 0;
      const reasons = [];

      // Quality score (0-40 points)
      if (m.analysis) {
        score += Math.round(m.analysis.qualityScore * 0.4);
        if (m.analysis.qualityGrade === "EXCELLENT") reasons.push("high_quality");
      }

      // Uniqueness — penalize if many similar exist
      score += 15; // base uniqueness

      // Time diversity — spread across the day
      const hour = new Date(m.createdAt).getHours();
      if (hour >= 8 && hour <= 10) { score += 5; reasons.push("morning_moment"); }
      if (hour >= 14 && hour <= 16) { score += 5; reasons.push("ceremony_time"); }
      if (hour >= 17 && hour <= 21) { score += 5; reasons.push("reception_time"); }

      // User preference signals
      if (m.isFavorite) { score += 10; reasons.push("favorited"); }
      if (m.viewCount > 5) { score += 5; reasons.push("popular"); }

      // Has caption — likely more meaningful
      if (m.caption && m.caption.length > 5) { score += 5; reasons.push("captioned"); }

      return { ...m, highlightScore: score, reason: reasons.join(", ") || "selected" };
    });
  }

  #selectDiverse(scored, targetCount) {
    // Sort by score descending
    const sorted = [...scored].sort((a, b) => b.highlightScore - a.highlightScore);

    const selected = [];
    const timeSlots = new Set();

    for (const mem of sorted) {
      if (selected.length >= targetCount) break;

      const hour = new Date(mem.createdAt).getHours();
      const timeSlot = `${Math.floor(hour / 3)}`; // 3-hour windows

      // Prefer diversity — don't take too many from same time slot
      const sameSlotCount = selected.filter((s) => {
        const sh = new Date(s.createdAt).getHours();
        return Math.floor(sh / 3) === parseInt(timeSlot);
      }).length;

      if (sameSlotCount < Math.ceil(targetCount / 8)) {
        selected.push(mem);
        timeSlots.add(timeSlot);
      }
    }

    // Fill remaining with top-scored if we need more
    for (const mem of sorted) {
      if (selected.length >= targetCount) break;
      if (!selected.find((s) => s.id === mem.id)) {
        selected.push(mem);
      }
    }

    return selected.slice(0, targetCount);
  }

  #categorizeMemory(memory) {
    const tags = [
      ...(memory.analysis?.aiTags || []),
      ...(memory.tags || []),
      memory.analysis?.aiCategory || "",
      memory.caption || "",
    ].join(" ").toLowerCase();

    if (/couple|bride.*groom|together|romantic|two/.test(tags)) return "COUPLE";
    if (/family|parent|mother|father|sibling|brother|sister/.test(tags)) return "FAMILY";
    if (/ceremony|vow|altar|church|officiant/.test(tags)) return "CEREMONY";
    if (/reception|dinner|toast|speech|meal/.test(tags)) return "RECEPTION";
    if (/friend|group|friends/.test(tags)) return "FRIENDS";
    return "OTHER";
  }

  async getHighlights(weddingId) {
    const highlights = await prisma.weddingHighlights.findUnique({
      where: { weddingId },
      include: { items: { orderBy: { position: "asc" } } },
    });
    return highlights;
  }

  async removeItem(highlightsId, itemId) {
    await prisma.highlightItem.delete({ where: { id: itemId } });
    const count = await prisma.highlightItem.count({ where: { highlightsId } });
    await prisma.weddingHighlights.update({ where: { id: highlightsId }, data: { totalCount: count } });
  }

  async addItem(highlightsId, memoryId, position, category) {
    const maxPos = await prisma.highlightItem.findFirst({
      where: { highlightsId },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    return prisma.highlightItem.create({
      data: { highlightsId, memoryId, position: position || (maxPos?.position || 0) + 1, category: category || "OTHER", reason: "manually_added", score: 0 },
    });
  }
}

export const highlightService = new HighlightService();
