import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "15m" });
};

export const generateRefreshToken = () => uuidv4();

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const getRefreshTokenExpiry = () => {
  const days = parseInt(process.env.JWT_REFRESH_EXPIRES_IN) || 7;
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

export const generateEventToken = () => {
  return uuidv4().replace(/-/g, "").substring(0, 24);
};

export const generateGuestToken = () => {
  return `guest_${uuidv4().replace(/-/g, "").substring(0, 20)}`;
};
