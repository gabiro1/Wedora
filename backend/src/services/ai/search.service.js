import prisma from "../../config/db.js";

/**
 * AI-Powered Memory Search
 * Combines metadata search, tag matching, quality filtering, and time-based queries.
 * Falls back gracefully when AI analysis data is unavailable.
 */

class MemorySearchService {
  async search(weddingId, query, options = {}) {
    const { userId, role, page = 1, limit = 30 } = options;

    // Build accessible moderation filter
    const moderationFilter = this.#getAccessFilter(role);

    const searchTerms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const memories = await prisma.memory.findMany({
      where: {
        weddingId,
        ...moderationFilter,
      },
      include: {
        analysis: { select: { aiTags: true, aiCategory: true, aiDescription: true, qualityGrade: true, qualityScore: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const scored = memories.map((m) => {
      let score = 0;
      const reasons = [];

      // Caption match
      if (m.caption) {
        const capLower = m.caption.toLowerCase();
        for (const term of searchTerms) {
          if (capLower.includes(term)) { score += 30; reasons.push("caption_match"); break; }
        }
      }

      // Guest name match
      if (m.guestName) {
        const nameLower = m.guestName.toLowerCase();
        for (const term of searchTerms) {
          if (nameLower.includes(term)) { score += 25; reasons.push("guest_match"); break; }
        }
      }

      // AI tags match
      if (m.analysis?.aiTags) {
        const tagsLower = m.analysis.aiTags.map((t) => t.toLowerCase());
        for (const term of searchTerms) {
          if (tagsLower.some((t) => t.includes(term))) { score += 20; reasons.push("tag_match"); break; }
        }
      }

      // AI category match
      if (m.analysis?.aiCategory) {
        const catLower = m.analysis.aiCategory.toLowerCase();
        for (const term of searchTerms) {
          if (catLower.includes(term)) { score += 20; reasons.push("category_match"); break; }
        }
      }

      // AI description match
      if (m.analysis?.aiDescription) {
        const descLower = m.analysis.aiDescription.toLowerCase();
        for (const term of searchTerms) {
          if (descLower.includes(term)) { score += 15; reasons.push("description_match"); break; }
        }
      }

      // User tags match
      if (m.tags && m.tags.length > 0) {
        const tagsLower = m.tags.map((t) => t.toLowerCase());
        for (const term of searchTerms) {
          if (tagsLower.some((t) => t.includes(term))) { score += 25; reasons.push("user_tag_match"); break; }
        }
      }

      // Quality boost for high-quality images
      if (m.analysis?.qualityGrade === "EXCELLENT") score += 5;
      if (m.analysis?.qualityGrade === "GOOD") score += 3;

      // Favorites boost
      if (m.isFavorite) score += 5;

      // Semantic keyword mapping
      score += this.#semanticBoost(searchTerms, m);

      return { ...m, searchScore: score, reasons };
    });

    const results = scored
      .filter((m) => m.searchScore > 0)
      .sort((a, b) => b.searchScore - a.searchScore);

    const total = results.length;
    const skip = (page - 1) * limit;
    const paginatedResults = results.slice(skip, skip + limit);

    return {
      query,
      results: paginatedResults.map((r) => ({
        id: r.id,
        storageUrl: r.storageUrl,
        thumbnailUrl: r.thumbnailUrl,
        mediaType: r.mediaType,
        guestName: r.guestName,
        caption: r.caption,
        tags: r.tags,
        createdAt: r.createdAt,
        searchScore: r.searchScore,
        reasons: r.reasons,
        qualityGrade: r.analysis?.qualityGrade,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ─── SEMANTIC KEYWORD MAPPING ─────────────────────────────
  #semanticBoost(terms, memory) {
    let boost = 0;
    const categories = memory.analysis?.aiCategory?.toLowerCase() || "";
    const tags = [...(memory.analysis?.aiTags || []), ...(memory.tags || [])].map((t) => t.toLowerCase());

    const semanticMap = {
      bride: ["bride", "woman", "wife", "female"],
      groom: ["groom", "man", "husband", "male"],
      couple: ["couple", "together", "pair", "romantic"],
      family: ["family", "parents", "mother", "father", "sibling"],
      ceremony: ["ceremony", "vows", "altar", "church", "officiant"],
      reception: ["reception", "dinner", "meal", "toast", "speech"],
      dancing: ["dance", "dancing", "party", "music", "celebration"],
      smiling: ["smile", "happy", "joy", "laugh", "laughing"],
      food: ["food", "cake", "dinner", "meal", "dessert"],
      decoration: ["decoration", "flowers", "bouquet", "centerpiece", "setup"],
      photo: ["photo", "picture", "portrait", "group", "selfie"],
      outdoor: ["outdoor", "garden", "landscape", "nature", "sunset"],
      indoor: ["indoor", "hall", "venue", "room"],
      evening: ["evening", "night", "dark", "lights", "lantern"],
      morning: ["morning", "sunrise", "early", "dawn"],
    };

    for (const term of terms) {
      for (const [category, keywords] of Object.entries(semanticMap)) {
        if (keywords.some((k) => k.includes(term) || term.includes(k))) {
          if (categories.includes(category) || tags.some((t) => t.includes(category))) {
            boost += 10;
          }
          break;
        }
      }
    }

    return boost;
  }

  #getAccessFilter(role) {
    if (["SUPER_ADMIN", "OWNER", "COUPLE", "MODERATOR"].includes(role)) {
      return {};
    }
    return { moderationStatus: "APPROVED" };
  }
}

export const memorySearch = new MemorySearchService();
