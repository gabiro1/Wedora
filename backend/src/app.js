import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { configureCloudinary } from "./config/cloudinary.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";
import weddingRoutes from "./routes/wedding.routes.js";
import contributionRoutes from "./routes/contribution.routes.js";
import memoryRoutes from "./routes/memory.routes.js";
import aiRoutes from "./routes/ai.routes.js";

const app = express();

configureCloudinary();

app.use(helmet());
const allowedOrigins = env.CORS_ORIGIN.split(",").map((o) => o.trim());
app.use(cors({ origin: (origin, callback) => { if (!origin || allowedOrigins.includes(origin)) { callback(null, true); } else { callback(new Error("Not allowed by CORS")); } }, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", apiLimiter);

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Wedora API is running", timestamp: new Date().toISOString() });
});

import prisma from "./config/db.js";
import { createContribution } from "./controllers/contribution.controller.js";
import { validate } from "./middleware/validate.js";
import { createContributionSchema } from "./validators/contribution.validators.js";
import multer from "multer";

app.use("/api/auth", authRoutes);
app.use("/api/weddings", weddingRoutes);
app.use("/api/weddings/:weddingId/contributions", contributionRoutes);
app.use("/api/weddings/:weddingId/memories", memoryRoutes);
app.use("/api/weddings/:weddingId/ai", aiRoutes);

// Guest routes (no auth required)
app.post("/api/guest/:eventToken/contribute", validate(createContributionSchema), async (req, res, next) => {
  try {
    const wedding = await prisma.wedding.findUnique({ where: { eventToken: req.params.eventToken } });
    if (!wedding) return res.status(404).json({ success: false, message: "Wedding not found" });
    req.params.weddingId = wedding.id;
    return createContribution(req, res, next);
  } catch (err) { next(err); }
});

app.post("/api/guest/:eventToken/capture", multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } }).single("file"), async (req, res, next) => {
  try {
    const wedding = await prisma.wedding.findUnique({ where: { eventToken: req.params.eventToken } });
    if (!wedding) return res.status(404).json({ success: false, message: "Wedding not found" });
    req.params.weddingId = wedding.id;
    const { memoryService } = await import("./services/memory.service.js");
    const { aiProcessor } = await import("./services/ai/processor.js");
    const result = await memoryService.upload(wedding.id, req.file, {
      caption: req.body.caption,
      guestName: req.body.guestName,
      guestToken: req.headers["x-guest-token"],
    });
    // Queue AI processing asynchronously (non-blocking)
    aiProcessor.queueMemory(result.id).catch(() => {});
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
