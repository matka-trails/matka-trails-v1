import { z } from "zod";

export const createReviewSchema = z.object({
  customerName: z.string().min(1, "Customer name is required").max(200),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  reviewText: z.string().optional().nullable(),
  reviewImages: z.array(z.string().url("Each image must be a valid URL")).optional().default([]),
  isApproved: z.boolean().optional().default(true),
});

export const updateReviewSchema = createReviewSchema.partial();

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
