import { Router } from "express";
import {
  createContribution, getQueue, acknowledgeNext,
  undoAcknowledge, listContributions, updateContribution,
} from "../controllers/contribution.controller.js";
import { authenticate, authorizeWedding } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createContributionSchema, updateContributionSchema } from "../validators/contribution.validators.js";
import prisma from "../config/db.js";

const router = Router({ mergeParams: true });

// Guest contribution (by event token - no auth required)
router.post("/guest/:eventToken", async (req, res, next) => {
  try {
    const wedding = await prisma.wedding.findUnique({ where: { eventToken: req.params.eventToken } });
    if (!wedding) return res.status(404).json({ success: false, message: "Wedding not found" });
    req.params.weddingId = wedding.id;
    return createContribution({ ...req, params: { ...req.params, weddingId: wedding.id } }, res, next);
  } catch (err) { next(err); }
});

// Authenticated routes
router.post("/", validate(createContributionSchema), createContribution);
router.get("/queue", getQueue);
router.post("/queue/acknowledge", authenticate, authorizeWedding("MC"), acknowledgeNext);
router.post("/queue/:entryId/undo", authenticate, authorizeWedding("MC"), undoAcknowledge);
router.get("/", authenticate, authorizeWedding("OWNER", "COUPLE", "GIFT_STAFF"), listContributions);
router.patch("/:id", authenticate, authorizeWedding("OWNER", "COUPLE", "GIFT_STAFF"), validate(updateContributionSchema), updateContribution);

export default router;
