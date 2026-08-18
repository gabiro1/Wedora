import { Router } from "express";
import {
  uploadMemory, listMemories, approveMemory, rejectMemory,
  removeMemory, reportMemory, getTimeline, getWall, toggleFavorite,
} from "../controllers/memory.controller.js";
import { authenticate, authorizeWedding, optionalAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { updateMemorySchema, reportMemorySchema } from "../validators/memory.validators.js";
import { uploadLimiter } from "../middleware/rateLimiter.js";
import multer from "multer";

const router = Router({ mergeParams: true });

router.post("/", uploadLimiter, multer({ storage: multer.memoryStorage() }).single("file"), uploadMemory);
router.get("/", authenticate, authorizeWedding("OWNER", "COUPLE", "MODERATOR"), listMemories);
router.get("/timeline", getTimeline);
router.get("/wall", getWall);
router.post("/:id/approve", authenticate, authorizeWedding("OWNER", "COUPLE", "MODERATOR"), approveMemory);
router.post("/:id/reject", authenticate, authorizeWedding("OWNER", "COUPLE", "MODERATOR"), rejectMemory);
router.post("/:id/remove", authenticate, authorizeWedding("OWNER", "COUPLE"), removeMemory);
router.post("/:id/report", optionalAuth, validate(reportMemorySchema), reportMemory);
router.post("/:id/favorite", authenticate, toggleFavorite);

export default router;
