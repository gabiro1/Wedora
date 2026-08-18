import { AppError } from "../utils/errors.js";

export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error("[ERROR]", err.message, err.stack);

  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "production"
      ? "An unexpected error occurred. Please try again."
      : err.message,
  });
};

export const notFoundHandler = (_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
};
