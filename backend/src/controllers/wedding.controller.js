import { weddingService } from "../services/wedding.service.js";

export const createWedding = async (req, res, next) => {
  try {
    const result = await weddingService.create(req.user.userId, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const getWedding = async (req, res, next) => {
  try {
    const result = await weddingService.getById(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const getWeddingByToken = async (req, res, next) => {
  try {
    const result = await weddingService.getByEventToken(req.params.token);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const updateWedding = async (req, res, next) => {
  try {
    const result = await weddingService.update(req.params.id, req.user.userId, req.body);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const listWeddings = async (req, res, next) => {
  try {
    const result = await weddingService.list(req.user.userId, req.query.page, req.query.limit);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const generateQR = async (req, res, next) => {
  try {
    const result = await weddingService.generateQR(req.params.id, req.query.type || "main");
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const createGuest = async (req, res, next) => {
  try {
    const result = await weddingService.createGuest(req.params.id, req.body.name);
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const getWeddingStats = async (req, res, next) => {
  try {
    const result = await weddingService.getStats(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};
