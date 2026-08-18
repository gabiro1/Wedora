import { memoryService } from "../services/memory.service.js";
import { getClientIp } from "../utils/helpers.js";
import { aiProcessor } from "../services/ai/processor.js";

export const uploadMemory = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    const result = await memoryService.upload(req.params.weddingId, req.file, {
      caption: req.body.caption,
      guestName: req.body.guestName,
      guestToken: req.headers["x-guest-token"],
    });
    // Queue AI processing asynchronously (non-blocking)
    aiProcessor.queueMemory(result.id).catch(() => {});
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const listMemories = async (req, res, next) => {
  try {
    const result = await memoryService.list(req.params.weddingId, req.query);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const approveMemory = async (req, res, next) => {
  try {
    const result = await memoryService.approve(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const rejectMemory = async (req, res, next) => {
  try {
    const result = await memoryService.reject(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const removeMemory = async (req, res, next) => {
  try {
    const result = await memoryService.remove(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const reportMemory = async (req, res, next) => {
  try {
    const result = await memoryService.report(req.params.id, req.body.reason, getClientIp(req));
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const getTimeline = async (req, res, next) => {
  try {
    const result = await memoryService.getTimeline(req.params.weddingId);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const getWall = async (req, res, next) => {
  try {
    const result = await memoryService.getApprovedForWall(req.params.weddingId);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const toggleFavorite = async (req, res, next) => {
  try {
    const result = await memoryService.toggleFavorite(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};
