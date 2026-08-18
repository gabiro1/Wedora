import sharp from "sharp";
import prisma from "../../config/db.js";

/**
 * AI Duplicate & Near-Duplicate Detection
 * Uses perceptual hashing (dHash) for similarity comparison.
 * No external API costs — entirely local computation.
 */

class DuplicateDetector {
  // ─── PERCEPTUAL HASH (Difference Hash) ────────────────────
  async computePerceptualHash(imageUrl) {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
      const buffer = Buffer.from(await response.arrayBuffer());

      const resized = await sharp(buffer)
        .resize(9, 8, { fit: "fill" })
        .greyscale()
        .raw()
        .toBuffer();

      let hash = "";
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          const idx = y * 9 + x;
          hash += resized[idx] < resized[idx + 1] ? "1" : "0";
        }
      }
      return hash;
    } catch (error) {
      console.error("[DuplicateDetector] Hash computation failed:", error.message);
      return null;
    }
  }

  // ─── HAMMING DISTANCE ─────────────────────────────────────
  hammingDistance(hash1, hash2) {
    if (!hash1 || !hash2 || hash1.length !== hash2.length) return Infinity;
    let distance = 0;
    for (let i = 0; i < hash1.length; i++) {
      if (hash1[i] !== hash2[i]) distance++;
    }
    return distance;
  }

  similarityScore(hash1, hash2) {
    const dist = this.hammingDistance(hash1, hash2);
    return Math.round((1 - dist / 64) * 100);
  }

  // ─── DETECT DUPLICATES FOR A WEDDING ──────────────────────
  async detectForWedding(weddingId) {
    const memories = await prisma.memory.findMany({
      where: { weddingId, mediaType: "PHOTO", moderationStatus: { not: "REMOVED" } },
      select: { id: true, storageUrl: true, fileSize: true },
    });

    const hashes = [];
    for (const mem of memories) {
      const analysis = await prisma.memoryAnalysis.findUnique({ where: { memoryId: mem.id } });
      let hash = analysis?.perceptualHash;

      if (!hash) {
        hash = await this.computePerceptualHash(mem.storageUrl);
        if (hash) {
          await prisma.memoryAnalysis.upsert({
            where: { memoryId: mem.id },
            create: { memoryId: mem.id, perceptualHash: hash, processingStatus: "COMPLETED", processedAt: new Date() },
            update: { perceptualHash: hash },
          });
        }
      }
      hashes.push({ id: mem.id, hash, fileSize: mem.fileSize });
    }

    const groups = this.#findDuplicateGroups(hashes);

    // Clear existing groups for this wedding
    const existingGroups = await prisma.duplicateGroup.findMany({
      where: { weddingId },
      select: { id: true },
    });
    for (const g of existingGroups) {
      await prisma.duplicateGroupMember.deleteMany({ where: { groupId: g.id } });
    }
    await prisma.duplicateGroup.deleteMany({ where: { weddingId } });

    // Create new groups
    const createdGroups = [];
    for (const group of groups) {
      const created = await prisma.duplicateGroup.create({
        data: {
          weddingId,
          groupSize: group.members.length,
          similarityScore: group.similarity,
          status: "PENDING",
          members: {
            create: group.members.map((m) => ({
              memoryId: m.id,
              similarityScore: m.similarity,
              isRecommended: m.id === group.recommendedId,
            })),
          },
        },
        include: { members: true },
      });
      createdGroups.push(created);
    }

    return { totalGroups: createdGroups.length, groups: createdGroups };
  }

  // ─── FIND GROUPS ──────────────────────────────────────────
  #findDuplicateGroups(hashes) {
    const SIMILARITY_THRESHOLD = 85;
    const visited = new Set();
    const groups = [];

    for (let i = 0; i < hashes.length; i++) {
      if (visited.has(hashes[i].id) || !hashes[i].hash) continue;

      const group = { members: [], similarity: 0, recommendedId: null };

      for (let j = i + 1; j < hashes.length; j++) {
        if (visited.has(hashes[j].id) || !hashes[j].hash) continue;

        const sim = this.similarityScore(hashes[i].hash, hashes[j].hash);
        if (sim >= SIMILARITY_THRESHOLD) {
          group.members.push({ id: hashes[j].id, similarity: sim });
          visited.add(hashes[j].id);
        }
      }

      if (group.members.length > 0) {
        group.members.push({ id: hashes[i].id, similarity: 100 });
        group.similarity = Math.round(group.members.reduce((s, m) => s + m.similarity, 0) / group.members.length);
        // Recommend largest file as "best" version
        const sorted = group.members.sort((a, b) => {
          const aSize = hashes.find((h) => h.id === a.id)?.fileSize || 0;
          const bSize = hashes.find((h) => h.id === b.id)?.fileSize || 0;
          return bSize - aSize;
        });
        group.recommendedId = sorted[0].id;
        visited.add(hashes[i].id);
        groups.push(group);
      }
    }

    return groups;
  }

  async getDuplicateStats(weddingId) {
    const groups = await prisma.duplicateGroup.findMany({
      where: { weddingId },
      include: { members: true },
    });
    const totalDuplicates = groups.reduce((sum, g) => sum + g.members.length, 0);
    return {
      totalGroups: groups.length,
      totalDuplicates,
      pendingGroups: groups.filter((g) => g.status === "PENDING").length,
    };
  }
}

export const duplicateDetector = new DuplicateDetector();
