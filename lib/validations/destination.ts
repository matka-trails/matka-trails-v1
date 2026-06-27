import { z } from "zod";

export const createDestinationSchema = z.object({
  name: z.string().min(1, "Destination name is required").max(200),
  description: z.string().optional().nullable(),
  coverImage: z.string().url("Cover image must be a valid URL").optional().nullable(),
  isFeatured: z.boolean().optional().default(false),
  metaTitle: z.string().max(70, "Meta title should be under 70 characters").optional().nullable(),
  metaDescription: z.string().max(160, "Meta description should be under 160 characters").optional().nullable(),
  sortOrder: z.number().int().min(0).optional().default(0),
});

export const updateDestinationSchema = createDestinationSchema.partial();

export type CreateDestinationInput = z.infer<typeof createDestinationSchema>;
export type UpdateDestinationInput = z.infer<typeof updateDestinationSchema>;
