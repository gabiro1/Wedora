import sharp from "sharp";
import prisma from "../../config/db.js";

/**
 * AI Photo Quality Assessment
 * Uses Sharp for local image analysis — no external API costs.
 * Analyzes: blur, exposure, brightness, contrast, sharpness, noise, resolution, composition.
 */

class QualityAnalyzer {
  async analyzeFromUrl(memoryId, imageUrl) {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      return await this.analyzeBuffer(memoryId, buffer);
    } catch (error) {
      await this.#markFailed(memoryId, error.message);
      throw error;
    }
  }

  async analyzeBuffer(memoryId, buffer) {
    try {
      const image = sharp(buffer);
      const metadata = await image.metadata();
      const { width, height, channels, format } = metadata;

      const [rawStats, dominant] = await Promise.all([
        image.raw().toBuffer({ resolveWithObject: true }),
        image.stats(),
      ]);

      const { data: pixelData, info } = rawStats;

      const blurScore = this.#calculateBlur(pixelData, info.width, info.height);
      const exposureResult = this.#calculateExposure(pixelData);
      const brightnessResult = this.#calculateBrightness(pixelData);
      const contrastResult = this.#calculateContrast(pixelData);
      const sharpnessResult = this.#calculateSharpness(pixelData, info.width, info.height);
      const noiseResult = this.#calculateNoise(pixelData, info.width, info.height);
      const resolutionResult = this.#calculateResolution(width, height);
      const compositionResult = this.#calculateComposition(pixelData, info.width, info.height);

      const dominantColors = this.#extractDominantColors(dominant);

      const qualityScore = this.#computeOverallScore({
        blurScore, exposureScore: exposureResult.score,
        brightnessScore: brightnessResult.score, contrastScore: contrastResult.score,
        sharpnessScore: sharpnessResult.score, noiseScore: noiseResult.score,
        resolutionScore: resolutionResult.score, compositionScore: compositionResult.score,
      });

      const qualityGrade = this.#gradeScore(qualityScore);

      const analysis = await prisma.memoryAnalysis.upsert({
        where: { memoryId },
        create: {
          memoryId, qualityScore, qualityGrade,
          blurScore, exposureScore: exposureResult.score,
          brightnessScore: brightnessResult.score, contrastScore: contrastResult.score,
          sharpnessScore: sharpnessResult.score, noiseScore: noiseResult.score,
          resolutionScore: resolutionResult.score, compositionScore: compositionResult.score,
          dominantColors, colorHistogram: { channels: channels || 3, format },
          processingStatus: "COMPLETED", processedAt: new Date(),
        },
        update: {
          qualityScore, qualityGrade,
          blurScore, exposureScore: exposureResult.score,
          brightnessScore: brightnessResult.score, contrastScore: contrastResult.score,
          sharpnessScore: sharpnessResult.score, noiseScore: noiseResult.score,
          resolutionScore: resolutionResult.score, compositionScore: compositionResult.score,
          dominantColors, colorHistogram: { channels: channels || 3, format },
          processingStatus: "COMPLETED", processedAt: new Date(), processingError: null,
        },
      });

      return analysis;
    } catch (error) {
      await this.#markFailed(memoryId, error.message);
      throw error;
    }
  }

  // ─── BLUR DETECTION (Laplacian Variance) ──────────────────
  #calculateBlur(data, width, height) {
    const gray = this.#toGrayscale(data, width, height);
    let laplacianSum = 0;
    let count = 0;
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        const laplacian = -4 * gray[idx] + gray[(y - 1) * width + x] + gray[(y + 1) * width + x] + gray[y * width + x - 1] + gray[y * width + x + 1];
        laplacianSum += laplacian * laplacian;
        count++;
      }
    }
    const variance = count > 0 ? laplacianSum / count : 0;
    return Math.min(100, Math.round(Math.min(variance / 500, 1) * 100));
  }

  // ─── EXPOSURE ANALYSIS ────────────────────────────────────
  #calculateExposure(data) {
    const histogram = new Array(256).fill(0);
    const total = data.length;
    for (let i = 0; i < total; i += 3) {
      const brightness = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
      histogram[brightness]++;
    }
    const overexposed = histogram.slice(240).reduce((a, b) => a + b, 0) / (total / 3);
    const underexposed = histogram.slice(0, 15).reduce((a, b) => a + b, 0) / (total / 3);
    const score = Math.max(0, 100 - overexposed * 200 - underexposed * 200);
    return { score: Math.round(score), overexposed, underexposed };
  }

  // ─── BRIGHTNESS ───────────────────────────────────────────
  #calculateBrightness(data) {
    let sum = 0;
    const pixels = data.length / 3;
    for (let i = 0; i < data.length; i += 3) {
      sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    const avg = sum / pixels;
    const score = 100 - Math.abs(avg - 128) * (100 / 128);
    return { score: Math.round(Math.max(0, score)), average: avg };
  }

  // ─── CONTRAST ─────────────────────────────────────────────
  #calculateContrast(data) {
    const histogram = new Array(256).fill(0);
    const pixels = data.length / 3;
    for (let i = 0; i < data.length; i += 3) {
      const b = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
      histogram[b]++;
    }
    let min = 255, max = 0;
    for (let i = 0; i < 256; i++) {
      if (histogram[i] > pixels * 0.001) { min = Math.min(min, i); max = Math.max(max, i); }
    }
    const range = max - min;
    const score = Math.min(100, Math.round((range / 255) * 120));
    return { score, range, min, max };
  }

  // ─── SHARPNESS (Edge Strength) ────────────────────────────
  #calculateSharpness(data, width, height) {
    const gray = this.#toGrayscale(data, width, height);
    let edgeSum = 0;
    let count = 0;
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        const gx = -gray[(y - 1) * width + x - 1] + gray[(y - 1) * width + x + 1]
                   - 2 * gray[y * width + x - 1] + 2 * gray[y * width + x + 1]
                   - gray[(y + 1) * width + x - 1] + gray[(y + 1) * width + x + 1];
        const gy = -gray[(y - 1) * width + x - 1] - 2 * gray[(y - 1) * width + x] - gray[(y - 1) * width + x + 1]
                   + gray[(y + 1) * width + x - 1] + 2 * gray[(y + 1) * width + x] + gray[(y + 1) * width + x + 1];
        edgeSum += Math.sqrt(gx * gx + gy * gy);
        count++;
      }
    }
    const avgEdge = count > 0 ? edgeSum / count : 0;
    return Math.min(100, Math.round(Math.min(avgEdge / 30, 1) * 100));
  }

  // ─── NOISE ESTIMATION ─────────────────────────────────────
  #calculateNoise(data, width, height) {
    const gray = this.#toGrayscale(data, width, height);
    let noiseSum = 0;
    let count = 0;
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        const median = (gray[(y - 1) * width + x] + gray[(y + 1) * width + x] + gray[y * width + x - 1] + gray[y * width + x + 1]) / 4;
        noiseSum += Math.abs(gray[idx] - median);
        count++;
      }
    }
    const avgNoise = count > 0 ? noiseSum / count : 0;
    return Math.min(100, Math.round(Math.max(0, 100 - avgNoise * 5)));
  }

  // ─── RESOLUTION SCORE ─────────────────────────────────────
  #calculateResolution(width, height) {
    const megapixels = (width * height) / 1000000;
    if (megapixels >= 8) return 100;
    if (megapixels >= 4) return 90;
    if (megapixels >= 2) return 75;
    if (megapixels >= 1) return 60;
    if (megapixels >= 0.5) return 45;
    return 30;
  }

  // ─── COMPOSITION (Rule of Thirds) ─────────────────────────
  #calculateComposition(data, width, height) {
    const gray = this.#toGrayscale(data, width, height);
    const thirdW = Math.floor(width / 3);
    const thirdH = Math.floor(height / 3);
    const edgeMap = [];
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        const gx = Math.abs(-gray[(y - 1) * width + x - 1] + gray[(y - 1) * width + x + 1]
                    - 2 * gray[y * width + x - 1] + 2 * gray[y * width + x + 1]
                    - gray[(y + 1) * width + x - 1] + gray[(y + 1) * width + x + 1]);
        edgeMap.push({ x, y, edge: gx });
      }
    }
    const thirds = [[thirdW, thirdH], [2 * thirdW, thirdH], [thirdW, 2 * thirdH], [2 * thirdW, 2 * thirdH]];
    let thirdsEdge = 0;
    let totalEdge = 0;
    for (const pt of edgeMap) {
      totalEdge += pt.edge;
      for (const [tx, ty] of thirds) {
        const dist = Math.sqrt((pt.x - tx) ** 2 + (pt.y - ty) ** 2);
        if (dist < Math.min(thirdW, thirdH) * 0.8) thirdsEdge += pt.edge;
      }
    }
    const score = totalEdge > 0 ? Math.min(100, Math.round((thirdsEdge / totalEdge) * 150)) : 50;
    return Math.min(100, score);
  }

  // ─── DOMINANT COLORS ──────────────────────────────────────
  #extractDominantColors(stats) {
    const channels = stats.channels || [];
    const colors = [];
    for (const ch of channels.slice(0, 3)) {
      colors.push(Math.round(ch.mean));
    }
    if (colors.length >= 3) {
      return [
        `rgb(${colors[0]}, ${colors[1]}, ${colors[2]})`,
      ];
    }
    return [];
  }

  // ─── HELPER: Grayscale ────────────────────────────────────
  #toGrayscale(data, width, height) {
    const gray = new Uint8Array(width * height);
    for (let i = 0, j = 0; i < data.length; i += 3, j++) {
      gray[j] = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    }
    return gray;
  }

  // ─── OVERALL SCORE ────────────────────────────────────────
  #computeOverallScore(scores) {
    const weights = {
      blur: 0.18, exposure: 0.15, brightness: 0.10, contrast: 0.12,
      sharpness: 0.18, noise: 0.10, resolution: 0.10, composition: 0.07,
    };
    const total = Math.round(
      scores.blurScore * weights.blur +
      scores.exposureScore * weights.exposure +
      scores.brightnessScore * weights.brightness +
      scores.contrastScore * weights.contrast +
      scores.sharpnessScore * weights.sharpness +
      scores.noiseScore * weights.noise +
      scores.resolutionScore * weights.resolution +
      scores.compositionScore * weights.composition
    );
    return Math.min(100, Math.max(0, total));
  }

  #gradeScore(score) {
    if (score >= 85) return "EXCELLENT";
    if (score >= 70) return "GOOD";
    if (score >= 50) return "ACCEPTABLE";
    return "POOR";
  }

  async #markFailed(memoryId, error) {
    try {
      await prisma.memoryAnalysis.upsert({
        where: { memoryId },
        create: { memoryId, processingStatus: "FAILED", processingError: error },
        update: { processingStatus: "FAILED", processingError: error },
      });
    } catch { /* continue */ }
  }

  async getWeddingQualityStats(weddingId) {
    const analyses = await prisma.memoryAnalysis.findMany({
      where: { memory: { weddingId, mediaType: "PHOTO" }, processingStatus: "COMPLETED" },
      select: { qualityGrade: true, qualityScore: true },
    });
    const grades = { EXCELLENT: 0, GOOD: 0, ACCEPTABLE: 0, POOR: 0 };
    let totalScore = 0;
    for (const a of analyses) {
      grades[a.qualityGrade] = (grades[a.qualityGrade] || 0) + 1;
      totalScore += a.qualityScore;
    }
    return {
      total: analyses.length,
      grades,
      averageScore: analyses.length > 0 ? Math.round(totalScore / analyses.length) : 0,
    };
  }
}

export const qualityAnalyzer = new QualityAnalyzer();
