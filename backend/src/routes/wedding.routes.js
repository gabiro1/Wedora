import { Router } from "express";
import {
  createWedding, getWedding, getWeddingByToken, updateWedding,
  listWeddings, generateQR, createGuest, getWeddingStats,
} from "../controllers/wedding.controller.js";
import { authenticate, authorizeWedding } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createWeddingSchema, updateWeddingSchema } from "../validators/wedding.validators.js";

const router = Router();

router.get("/", authenticate, listWeddings);
router.post("/", authenticate, validate(createWeddingSchema), createWedding);
router.get("/public/:token", getWeddingByToken);
router.get("/:id", authenticate, getWedding);
router.patch("/:id", authenticate, authorizeWedding("OWNER", "COUPLE"), validate(updateWeddingSchema), updateWedding);
router.get("/:id/qr", authenticate, generateQR);
router.get("/:id/stats", authenticate, getWeddingStats);
router.post("/:id/guests", authenticate, authorizeWedding("OWNER", "COUPLE", "GIFT_STAFF"), createGuest);

export default router;
