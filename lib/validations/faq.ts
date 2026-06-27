import { z } from "zod";

export const createFaqSchema = z.object({
  question: z.string().min(1, "Question is required").max(500),
  answer: z.string().min(1, "Answer is required"),
  sortOrder: z.number().int().min(0).optional().default(0),
  // One of these must be provided (enforced at API level based on the route)
  blogId: z.string().optional().nullable(),
  packageId: z.string().optional().nullable(),
});

export const updateFaqSchema = z.object({
  question: z.string().min(1).max(500).optional(),
  answer: z.string().min(1).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export type CreateFaqInput = z.infer<typeof createFaqSchema>;
export type UpdateFaqInput = z.infer<typeof updateFaqSchema>;
