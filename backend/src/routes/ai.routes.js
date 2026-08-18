import { Router } from "express";
import { authenticate, authorizeWedding } from "../middleware/auth.js";
import {
  getQualityStats, detectDuplicates, getDuplicateStats,
  searchMemories, generateHighlights, getHighlights,
  removeHighlightItem, addHighlightItem,
  generateAlbum, getAlbum, generateStory, getStory, updateStory,
  getInsights, processWedding, reprocessMemory, getProcessingStatus,
} from "../controllers/ai.controller.js";

const router = Router({ mergeParams: true });

// All AI routes require authenticated wedding access
router.use(authenticate, authorizeWedding("OWNER", "COUPLE", "MODERATOR"));

// Quality
router.get("/quality", getQualityStats);

// Duplicates
router.post("/duplicates/detect", detectDuplicates);
router.get("/duplicates", getDuplicateStats);

// Search
router.get("/search", searchMemories);

// Highlights
router.post("/highlights/generate", generateHighlights);
router.get("/highlights", getHighlights);
router.delete("/highlights/:highlightsId/items/:itemId", removeHighlightItem);
router.post("/highlights/:highlightsId/items", addHighlightItem);

// Album
router.post("/album/generate", generateAlbum);
router.get("/album", getAlbum);

// Story
router.post("/story/generate", generateStory);
router.get("/story", getStory);
router.patch("/story", updateStory);

// Insights
router.get("/insights", getInsights);

// Processing
router.post("/process", processWedding);
router.post("/process/:memoryId/reprocess", reprocessMemory);
router.get("/process/status", getProcessingStatus);

export default router;
