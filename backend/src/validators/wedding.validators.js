import { z } from "zod";

export const createWeddingSchema = z.object({
  coupleName: z.string().min(1, "Couple name is required").max(100),
  partnerName: z.string().min(1, "Partner name is required").max(100),
  weddingDate: z.string().or(z.date()).transform((v) => new Date(v)),
  location: z.string().max(300).optional(),
  description: z.string().max(2000).optional(),
  coverImage: z.string().url().optional(),
  primaryLanguage: z.enum(["en", "rw", "fr"]).default("en"),
  isPrivate: z.boolean().default(true),
  timezone: z.string().default("Africa/Kigali"),
});

export const updateWeddingSchema = createWeddingSchema.partial();

export const weddingQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(["DRAFT", "ACTIVE", "CELEBRATION", "COMPLETED", "ARCHIVED"]).optional(),
});
