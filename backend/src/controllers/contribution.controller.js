import { contributionService } from "../services/contribution.service.js";

export const createContribution = async (req, res, next) => {
  try {
    const weddingId = req.params.weddingId;
    const guestToken = req.headers["x-guest-token"];
    const result = await contributionService.create(weddingId, req.body, guestToken);
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const getQueue = async (req, res, next) => {
  try {
    const result = await contributionService.getQueue(req.params.weddingId);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const acknowledgeNext = async (req, res, next) => {
  try {
    const result = await contributionService.acknowledgeNext(req.params.weddingId);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const undoAcknowledge = async (req, res, next) => {
  try {
    const result = await contributionService.undoAcknowledge(req.params.weddingId, req.params.entryId);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const listContributions = async (req, res, next) => {
  try {
    const result = await contributionService.list(req.params.weddingId, req.query);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const updateContribution = async (req, res, next) => {
  try {
    const result = await contributionService.update(req.params.id, req.body);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};
