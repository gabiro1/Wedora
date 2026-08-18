import prisma from "../../config/db.js";

/**
 * AI Memory Insights
 * Provides meaningful post-event analytics.
 */

class InsightService {
  async getWeddingInsights(weddingId) {
    const [memories, analyses, duplicates, contributions, guests] = await Promise.all([
      prisma.memory.findMany({
        where: { weddingId, moderationStatus: { not: "REMOVED" } },
        include: { analysis: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.memoryAnalysis.findMany({
        where: { memory: { weddingId }, processingStatus: "COMPLETED" },
      }),
      prisma.duplicateGroup.findMany({ where: { weddingId } }),
      prisma.contribution.findMany({ where: { weddingId } }),
      prisma.guest.findMany({ where: { weddingId } }),
    ]);

    const approvedMemories = memories.filter((m) => m.moderationStatus === "APPROVED");
    const photos = approvedMemories.filter((m) => m.mediaType === "PHOTO");
    const videos = approvedMemories.filter((m) => m.mediaType === "VIDEO");

    // Contributors
    const contributorSet = new Set();
    for (const m of approvedMemories) {
      if (m.guestName) contributorSet.add(m.guestName);
    }

    // Time distribution
    const hourDistribution = new Array(24).fill(0);
    for (const m of approvedMemories) {
      const hour = new Date(m.createdAt).getHours();
      hourDistribution[hour]++;
    }
    const peakHour = hourDistribution.indexOf(Math.max(...hourDistribution));

    // Quality distribution
    const qualityGrades = { EXCELLENT: 0, GOOD: 0, ACCEPTABLE: 0, POOR: 0 };
    for (const a of analyses) {
      qualityGrades[a.qualityGrade] = (qualityGrades[a.qualityGrade] || 0) + 1;
    }

    // Top contributors
    const contributorCounts = {};
    for (const m of approvedMemories) {
      if (m.guestName) contributorCounts[m.guestName] = (contributorCounts[m.guestName] || 0) + 1;
    }
    const topContributors = Object.entries(contributorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    // Duration analysis
    const firstMemory = approvedMemories[0];
    const lastMemory = approvedMemories[approvedMemories.length - 1];
    const durationHours = firstMemory && lastMemory
      ? Math.round((new Date(lastMemory.createdAt) - new Date(firstMemory.createdAt)) / (1000 * 60 * 60))
      : 0;

    // Category distribution
    const categories = { COUPLE: 0, FAMILY: 0, CEREMONY: 0, RECEPTION: 0, FRIENDS: 0, OTHER: 0 };
    for (const a of analyses) {
      if (a.aiCategory) {
        categories[a.aiCategory] = (categories[a.aiCategory] || 0) + 1;
      }
    }

    // Highlights
    const highlightCount = await prisma.highlightItem.count({
      where: { highlights: { weddingId } },
    });

    // Duplicate stats
    const duplicateCount = duplicates.reduce((sum, g) => sum + g.groupSize, 0);

    // Contribution stats
    const contributionStats = {
      total: contributions.length,
      monetary: contributions.filter((c) => c.type === "MONETARY").length,
      physical: contributions.filter((c) => c.type === "PHYSICAL_GIFT").length,
      messages: contributions.filter((c) => c.type === "MESSAGE").length,
      other: contributions.filter((c) => c.type === "OTHER").length,
    };

    return {
      summary: {
        totalMemories: approvedMemories.length,
        totalPhotos: photos.length,
        totalVideos: videos.length,
        totalGuests: guests.length,
        activeContributors: contributorSet.size,
        aiSelectedHighlights: highlightCount,
        duplicatesFound: duplicateCount,
      },
      quality: {
        grades: qualityGrades,
        averageScore: analyses.length > 0 ? Math.round(analyses.reduce((s, a) => s + a.qualityScore, 0) / analyses.length) : 0,
        totalProcessed: analyses.length,
      },
      activity: {
        peakHour: `${peakHour}:00`,
        durationHours,
        hourDistribution: hourDistribution.map((count, hour) => ({ hour, count })),
      },
      topContributors,
      categories,
      contributionStats,
      duplicateStats: {
        totalGroups: duplicates.length,
        totalDuplicates: duplicateCount,
      },
    };
  }
}

export const insightService = new InsightService();
