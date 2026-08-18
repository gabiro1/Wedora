import { z } from "zod";

export const updateMemorySchema = z.object({
  caption: z.string().max(500).optional(),
  tags: z.array(z.string()).optional(),
  moderationStatus: z.enum(["APPROVED", "REJECTED", "REMOVED"]).optional(),
  isFavorite: z.boolean().optional(),
});

export const memoryQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  mediaType: z.enum(["PHOTO", "VIDEO"]).optional(),
  moderationStatus: z.enum(["PENDING", "APPROVED", "REJECTED", "REPORTED", "REMOVED"]).optional(),
  sort: z.enum(["newest", "oldest"]).default("newest"),
});

export const reportMemorySchema = z.object({
  reason: z.string().min(5, "Reason is required").max(500),
});
