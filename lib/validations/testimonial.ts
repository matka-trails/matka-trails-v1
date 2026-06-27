import { z } from "zod";

export const createTestimonialSchema = z.object({
  videoUrl: z.string().url("Video URL must be a valid URL"),
  customerName: z.string().min(1, "Customer name is required").max(200),
  thumbnail: z.string().url("Thumbnail must be a valid URL").optional().nullable(),
  sortOrder: z.number().int().min(0).optional().default(0),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;
