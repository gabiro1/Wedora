import bcryptjs from "bcryptjs";
import crypto from "crypto";

export const hashPassword = (password) => bcryptjs.hash(password, 12);

export const comparePassword = (password, hash) => bcryptjs.compare(password, hash);

export const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.socket.remoteAddress || "unknown";
};

export const generateRandomString = (length) => crypto.randomBytes(length).toString("hex");

export const paginate = (page, limit) => {
  const p = Math.max(1, page);
  const l = Math.min(100, Math.max(1, limit));
  return { skip: (p - 1) * l, take: l, page: p, limit: l };
};

export const generateThumbnailUrl = (url) => {
  if (!url) return url;
  return url.replace("/upload/", "/upload/w_300,h_300,c_fill,g_auto/");
};
