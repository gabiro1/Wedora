import { z } from "zod";

export const createContributionSchema = z.object({
  guestName: z.string().min(1, "Guest name is required").max(100),
  guestPhone: z.string().max(20).optional(),
  type: z.enum(["PHYSICAL_GIFT", "MONETARY", "OTHER", "MESSAGE"]),
  description: z.string().max(2000).optional(),
  monetaryAmount: z.number().min(0).optional(),
  currency: z.string().default("RWF"),
  notes: z.string().max(1000).optional(),
});

export const updateContributionSchema = z.object({
  status: z.enum(["PENDING", "ACKNOWLEDGED", "VERIFIED", "ARCHIVED"]).optional(),
  notes: z.string().max(1000).optional(),
});

export const contributionQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  type: z.enum(["PHYSICAL_GIFT", "MONETARY", "OTHER", "MESSAGE"]).optional(),
  status: z.enum(["PENDING", "ACKNOWLEDGED", "VERIFIED", "ARCHIVED"]).optional(),
  search: z.string().optional(),
  sort: z.enum(["newest", "oldest", "name"]).default("newest"),
});
