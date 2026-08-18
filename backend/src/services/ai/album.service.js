import prisma from "../../config/db.js";

/**
 * AI Smart Digital Album
 * Organizes approved memories into a structured album with sections.
 */

class AlbumService {
  async generate(weddingId) {
    const memories = await prisma.memory.findMany({
      where: { weddingId, mediaType: "PHOTO", moderationStatus: "APPROVED" },
      include: { analysis: true },
      orderBy: { createdAt: "asc" },
    });

    const wedding = await prisma.wedding.findUnique({ where: { id: weddingId } });

    // Define album sections based on wedding timeline
    const sections = this.#buildSections(memories, wedding);

    // Clear existing album
    const existing = await prisma.weddingAlbum.findUnique({ where: { weddingId } });
    if (existing) {
      for (const sec of existing.sections) {
        await prisma.albumSectionItem.deleteMany({ where: { sectionId: sec.id } });
      }
      await prisma.albumSection.deleteMany({ where: { albumId: existing.id } });
      await prisma.weddingAlbum.delete({ where: { weddingId } });
    }

    const album = await prisma.weddingAlbum.create({
      data: {
        weddingId,
        title: `${wedding?.coupleName || "Our"} Wedding Day`,
        status: "GENERATED",
        sections: {
          create: sections.map((sec, i) => ({
            title: sec.title,
            position: i + 1,
            coverUrl: sec.coverUrl,
            items: {
              create: sec.memoryIds.map((memId, j) => ({
                memoryId: memId,
                position: j + 1,
              })),
            },
          })),
        },
      },
      include: { sections: { include: { items: true }, orderBy: { position: "asc" } } },
    });

    return album;
  }

  #buildSections(memories, wedding) {
    const date = wedding ? new Date(wedding.weddingDate) : new Date();
    const sections = [
      { title: "Arrival", memoryIds: [], timeRange: [7, 10] },
      { title: "Preparation", memoryIds: [], timeRange: [10, 12] },
      { title: "Ceremony", memoryIds: [], timeRange: [12, 14] },
      { title: "Couple", memoryIds: [], timeRange: [14, 16] },
      { title: "Family", memoryIds: [], timeRange: [0, 24] },
      { title: "Friends", memoryIds: [], timeRange: [0, 24] },
      { title: "Reception", memoryIds: [], timeRange: [16, 19] },
      { title: "Celebration", memoryIds: [], timeRange: [19, 22] },
      { title: "Final Moments", memoryIds: [], timeRange: [22, 24] },
    ];

    for (const mem of memories) {
      const hour = new Date(mem.createdAt).getHours();
      const tags = [
        ...(mem.analysis?.aiTags || []),
        ...(mem.tags || []),
        mem.analysis?.aiCategory || "",
      ].join(" ").toLowerCase();

      // Categorize into sections
      if (/family|parent|mother|father/.test(tags)) {
        sections[4].memoryIds.push(mem.id);
      } else if (/friend|group|friends/.test(tags)) {
        sections[5].memoryIds.push(mem.id);
      } else if (/couple|bride.*groom|romantic/.test(tags)) {
        sections[3].memoryIds.push(mem.id);
      } else if (/ceremony|vow|altar/.test(tags)) {
        sections[2].memoryIds.push(mem.id);
      } else if (/reception|dinner|toast/.test(tags)) {
        sections[6].memoryIds.push(mem.id);
      } else if (/celebration|dance|party/.test(tags)) {
        sections[7].memoryIds.push(mem.id);
      } else {
        // Time-based fallback
        for (const sec of sections) {
          if (sec.memoryIds.length < 15 && hour >= sec.timeRange[0] && hour < sec.timeRange[1]) {
            sec.memoryIds.push(mem.id);
            break;
          }
        }
      }
    }

    // Set cover images (first good-quality photo in each section)
    for (const sec of sections) {
      const firstMem = memories.find((m) => sec.memoryIds.includes(m.id));
      sec.coverUrl = firstMem?.thumbnailUrl || firstMem?.storageUrl || null;
    }

    // Filter out empty sections
    return sections.filter((s) => s.memoryIds.length > 0);
  }

  async getAlbum(weddingId) {
    return prisma.weddingAlbum.findUnique({
      where: { weddingId },
      include: { sections: { include: { items: true }, orderBy: { position: "asc" } } },
    });
  }

  async reorderSection(sectionId, newPosition) {
    return prisma.albumSection.update({ where: { id: sectionId }, data: { position: newPosition } });
  }

  async removeSectionItem(itemId) {
    return prisma.albumSectionItem.delete({ where: { id: itemId } });
  }
}

export const albumService = new AlbumService();
