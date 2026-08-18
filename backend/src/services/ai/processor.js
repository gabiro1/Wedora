import prisma from "../../config/db.js";

/**
 * AI Background Processing Queue
 * Non-blocking pipeline for AI analysis after upload.
 * Ensures uploads never wait for AI processing.
 */

class AIProcessor {
  constructor() {
    this.queues = new Map(); // weddingId -> processing state
    this.maxConcurrent = 2;
    this.running = 0;
  }

  // ─── QUEUE MEMORY FOR PROCESSING ──────────────────────────
  async queueMemory(memoryId) {
    const memory = await prisma.memory.findUnique({ where: { id: memoryId } });
    if (!memory || memory.mediaType !== "PHOTO") return;

    // Check if already processed
    const existing = await prisma.memoryAnalysis.findUnique({ where: { memoryId } });
    if (existing?.processingStatus === "COMPLETED") return;

    // Create pending analysis record
    await prisma.memoryAnalysis.upsert({
      where: { memoryId },
      create: { memoryId, processingStatus: "QUEUED" },
      update: { processingStatus: "QUEUED", processingError: null },
    });

    // Process asynchronously (don't await — fire and forget)
    this.#processMemory(memoryId, memory.weddingId).catch((err) => {
      console.error(`[AIProcessor] Failed to process ${memoryId}:`, err.message);
    });
  }

  // ─── PROCESS SINGLE MEMORY ────────────────────────────────
  async #processMemory(memoryId, weddingId) {
    try {
      // Update status
      await prisma.memoryAnalysis.update({
        where: { memoryId },
        data: { processingStatus: "ANALYZING" },
      });

      // Step 1: Quality analysis
      const { qualityAnalyzer } = await import("./quality.service.js");
      await qualityAnalyzer.analyzeFromUrl(memoryId, (await prisma.memory.findUnique({ where: { id: memoryId } })).storageUrl);

      // Step 2: Perceptual hash for duplicate detection
      const { duplicateDetector } = await import("./duplicate.service.js");
      const analysis = await prisma.memoryAnalysis.findUnique({ where: { memoryId } });
      if (!analysis?.perceptualHash) {
        const memory = await prisma.memory.findUnique({ where: { id: memoryId } });
        const hash = await duplicateDetector.computePerceptualHash(memory.storageUrl);
        if (hash) {
          await prisma.memoryAnalysis.update({ where: { memoryId }, data: { perceptualHash: hash } });
        }
      }

      console.log(`[AIProcessor] Completed analysis for memory ${memoryId}`);
    } catch (error) {
      console.error(`[AIProcessor] Analysis failed for ${memoryId}:`, error.message);
      await prisma.memoryAnalysis.update({
        where: { memoryId },
        data: { processingStatus: "FAILED", processingError: error.message },
      });
    }
  }

  // ─── BATCH PROCESS ALL PENDING FOR WEDDING ────────────────
  async processWedding(weddingId) {
    const pending = await prisma.memory.findMany({
      where: { weddingId, mediaType: "PHOTO", moderationStatus: { not: "REMOVED" } },
      select: { id: true },
    });

    // Filter to those without completed analysis
    const toProcess = [];
    for (const m of pending) {
      const analysis = await prisma.memoryAnalysis.findUnique({ where: { memoryId: m.id } });
      if (!analysis || analysis.processingStatus !== "COMPLETED") {
        toProcess.push(m.id);
      }
    }

    if (toProcess.length === 0) return { queued: 0 };

    // Log processing job
    const log = await prisma.aIProcessingLog.create({
      data: {
        weddingId,
        type: "BATCH_QUALITY",
        status: "RUNNING",
        totalItems: toProcess.length,
        startedAt: new Date(),
      },
    });

    let processed = 0;
    let failed = 0;

    for (const memId of toProcess) {
      try {
        await this.#processMemory(memId, weddingId);
        processed++;
      } catch {
        failed++;
      }
    }

    await prisma.aIProcessingLog.update({
      where: { id: log.id },
      data: {
        status: "COMPLETED",
        processed,
        failed,
        completedAt: new Date(),
      },
    });

    return { queued: toProcess.length, processed, failed };
  }

  // ─── REPROCESS SINGLE MEMORY ──────────────────────────────
  async reprocessMemory(memoryId) {
    const memory = await prisma.memory.findUnique({ where: { id: memoryId } });
    if (!memory) throw new Error("Memory not found");
    await prisma.memoryAnalysis.delete({ where: { memoryId } }).catch(() => {});
    await this.queueMemory(memoryId);
  }

  // ─── GET PROCESSING STATUS ────────────────────────────────
  async getWeddingProcessingStatus(weddingId) {
    const [total, completed, failed, pending] = await Promise.all([
      prisma.memoryAnalysis.count({ where: { memory: { weddingId } } }),
      prisma.memoryAnalysis.count({ where: { memory: { weddingId }, processingStatus: "COMPLETED" } }),
      prisma.memoryAnalysis.count({ where: { memory: { weddingId }, processingStatus: "FAILED" } }),
      prisma.memoryAnalysis.count({ where: { memory: { weddingId }, processingStatus: { in: ["QUEUED", "ANALYZING"] } } }),
    ]);

    const logs = await prisma.aIProcessingLog.findMany({
      where: { weddingId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return { total, completed, failed, pending, logs };
  }
}

export const aiProcessor = new AIProcessor();
