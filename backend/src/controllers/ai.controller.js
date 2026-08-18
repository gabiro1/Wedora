import {
  qualityAnalyzer, duplicateDetector, memorySearch,
  highlightService, albumService, storyService,
  insightService, aiProcessor,
} from "../services/ai/index.js";

// ─── QUALITY ASSESSMENT ────────────────────────────────────
export const getQualityStats = async (req, res, next) => {
  try {
    const stats = await qualityAnalyzer.getWeddingQualityStats(req.params.weddingId);
    res.json({ success: true, data: stats });
  } catch (err) { next(err); }
};

// ─── DUPLICATE DETECTION ───────────────────────────────────
export const detectDuplicates = async (req, res, next) => {
  try {
    const result = await duplicateDetector.detectForWedding(req.params.weddingId);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const getDuplicateStats = async (req, res, next) => {
  try {
    const stats = await duplicateDetector.getDuplicateStats(req.params.weddingId);
    res.json({ success: true, data: stats });
  } catch (err) { next(err); }
};

// ─── MEMORY SEARCH ─────────────────────────────────────────
export const searchMemories = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: "Search query required" });
    const result = await memorySearch.search(req.params.weddingId, q, {
      userId: req.user?.userId,
      role: req.user?.role,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 30,
    });
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

// ─── HIGHLIGHTS ────────────────────────────────────────────
export const generateHighlights = async (req, res, next) => {
  try {
    const count = parseInt(req.body.count) || 25;
    const result = await highlightService.generate(req.params.weddingId, count);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const getHighlights = async (req, res, next) => {
  try {
    const highlights = await highlightService.getHighlights(req.params.weddingId);
    res.json({ success: true, data: highlights });
  } catch (err) { next(err); }
};

export const removeHighlightItem = async (req, res, next) => {
  try {
    await highlightService.removeItem(req.params.highlightsId, req.params.itemId);
    res.json({ success: true, message: "Item removed" });
  } catch (err) { next(err); }
};

export const addHighlightItem = async (req, res, next) => {
  try {
    const item = await highlightService.addItem(req.params.highlightsId, req.body.memoryId, req.body.position, req.body.category);
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

// ─── ALBUM ─────────────────────────────────────────────────
export const generateAlbum = async (req, res, next) => {
  try {
    const album = await albumService.generate(req.params.weddingId);
    res.json({ success: true, data: album });
  } catch (err) { next(err); }
};

export const getAlbum = async (req, res, next) => {
  try {
    const album = await albumService.getAlbum(req.params.weddingId);
    res.json({ success: true, data: album });
  } catch (err) { next(err); }
};

// ─── STORY ─────────────────────────────────────────────────
export const generateStory = async (req, res, next) => {
  try {
    const story = await storyService.generate(req.params.weddingId);
    res.json({ success: true, data: story });
  } catch (err) { next(err); }
};

export const getStory = async (req, res, next) => {
  try {
    const story = await storyService.getStory(req.params.weddingId);
    res.json({ success: true, data: story });
  } catch (err) { next(err); }
};

export const updateStory = async (req, res, next) => {
  try {
    const story = await storyService.updateStory(req.params.weddingId, req.body.content, req.body.title);
    res.json({ success: true, data: story });
  } catch (err) { next(err); }
};

// ─── INSIGHTS ──────────────────────────────────────────────
export const getInsights = async (req, res, next) => {
  try {
    const insights = await insightService.getWeddingInsights(req.params.weddingId);
    res.json({ success: true, data: insights });
  } catch (err) { next(err); }
};

// ─── PROCESSING ────────────────────────────────────────────
export const processWedding = async (req, res, next) => {
  try {
    const result = await aiProcessor.processWedding(req.params.weddingId);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const reprocessMemory = async (req, res, next) => {
  try {
    await aiProcessor.reprocessMemory(req.params.memoryId);
    res.json({ success: true, message: "Reprocessing queued" });
  } catch (err) { next(err); }
};

export const getProcessingStatus = async (req, res, next) => {
  try {
    const status = await aiProcessor.getWeddingProcessingStatus(req.params.weddingId);
    res.json({ success: true, data: status });
  } catch (err) { next(err); }
};
