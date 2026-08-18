import prisma from "../../config/db.js";

/**
 * AI Memory Story Generation
 * Creates a narrative from approved memories and wedding information.
 * Uses template-based generation with data-driven content.
 */

class StoryService {
  async generate(weddingId) {
    const wedding = await prisma.wedding.findUnique({ where: { id: weddingId } });
    if (!wedding) throw new Error("Wedding not found");

    const [memories, contributions, guestCount] = await Promise.all([
      prisma.memory.findMany({
        where: { weddingId, moderationStatus: "APPROVED" },
        include: { analysis: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.contribution.findMany({ where: { weddingId, status: { not: "ARCHIVED" } } }),
      prisma.guest.count({ where: { weddingId } }),
    ]);

    const photoCount = memories.filter((m) => m.mediaType === "PHOTO").length;
    const videoCount = memories.filter((m) => m.mediaType === "VIDEO").length;
    const contributors = new Set(memories.filter((m) => m.guestName).map((m) => m.guestName)).size;

    const story = this.#buildStory(wedding, memories, { photoCount, videoCount, contributors, guestCount, contributions });

    // Save
    const existing = await prisma.weddingStory.findUnique({ where: { weddingId } });
    if (existing) {
      await prisma.weddingStory.delete({ where: { weddingId } });
    }

    return prisma.weddingStory.create({
      data: {
        weddingId,
        title: "A Day to Remember",
        content: story,
        status: "GENERATED",
      },
    });
  }

  #buildStory(wedding, memories, stats) {
    const date = new Date(wedding.weddingDate);
    const dateStr = date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const name1 = wedding.coupleName;
    const name2 = wedding.partnerName;
    const location = wedding.location || "a beautiful venue";

    const timeGroups = this.#groupByTime(memories);

    let story = "";

    // Opening
    story += `${name1} and ${name2}\n\n`;
    story += `# A Day to Remember\n\n`;
    story += `${dateStr} — ${location}\n\n`;
    story += `${name1} and ${name2} celebrated their wedding surrounded by ${stats.guestCount || "their"} family and friends. `;
    story += `The day was captured through ${stats.photoCount} photos and ${stats.videoCount} videos `;
    story += `contributed by ${stats.contributors} guests who shared in their joy.\n\n`;

    // Morning
    if (timeGroups.morning.length > 0) {
      story += `## The Morning\n\n`;
      story += `The day began with anticipation. `;
      story += `${timeGroups.morning.length} moments were captured as the celebration took shape.\n\n`;
    }

    // Ceremony
    if (timeGroups.ceremony.length > 0) {
      story += `## The Ceremony\n\n`;
      story += `The ceremony was the heart of the day. `;
      story += `${timeGroups.ceremony.length} memories preserve the vows, the emotions, and the commitment `;
      story += `shared between ${name1} and ${name2}.\n\n`;
    }

    // Reception
    if (timeGroups.reception.length > 0) {
      story += `## The Celebration\n\n`;
      story += `The reception brought everyone together. `;
      story += `${timeGroups.reception.length} moments of joy, laughter, and celebration were captured `;
      story += `by the people who mattered most.\n\n`;
    }

    // Evening
    if (timeGroups.evening.length > 0) {
      story += `## The Evening\n\n`;
      story += `As the day drew to a close, ${timeGroups.evening.length} final moments were preserved — `;
      story += `the last dances, the quiet conversations, and the memories that will last forever.\n\n`;
    }

    // Closing
    story += `---\n\n`;
    story += `*This story was generated from ${stats.photoCount + stats.videoCount} memories `;
    story += `contributed by ${stats.contributors} guests. `;
    story += `${name1} and ${name2} retain full editorial control over this narrative.*\n`;

    return story;
  }

  #groupByTime(memories) {
    const groups = { morning: [], afternoon: [], ceremony: [], reception: [], evening: [] };
    for (const m of memories) {
      const hour = new Date(m.createdAt).getHours();
      const tags = [...(m.analysis?.aiTags || []), ...(m.tags || [])].join(" ").toLowerCase();

      if (/ceremony|vow|altar/.test(tags)) groups.ceremony.push(m);
      else if (/reception|dinner|toast/.test(tags)) groups.reception.push(m);
      else if (hour < 12) groups.morning.push(m);
      else if (hour < 17) groups.afternoon.push(m);
      else groups.evening.push(m);
    }
    return groups;
  }

  async getStory(weddingId) {
    return prisma.weddingStory.findUnique({ where: { weddingId } });
  }

  async updateStory(weddingId, content, title) {
    const data = { content };
    if (title) data.title = title;
    return prisma.weddingStory.update({ where: { weddingId }, data });
  }
}

export const storyService = new StoryService();
