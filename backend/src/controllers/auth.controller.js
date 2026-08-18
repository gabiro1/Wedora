import { authService } from "../services/auth.service.js";

export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const refresh = async (req, res, next) => {
  try {
    const result = await authService.refresh(req.body.refreshToken);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const logout = async (req, res, next) => {
  try {
    await authService.logout(req.body.refreshToken);
    res.json({ success: true, message: "Logged out" });
  } catch (error) { next(error); }
};

export const profile = async (req, res, next) => {
  try {
    const result = await authService.getProfile(req.user.userId);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};
