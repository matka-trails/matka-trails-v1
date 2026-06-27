import { z } from "zod";

export const createGalleryImageSchema = z.object({
  imageUrl: z.string().url("Image URL must be a valid URL"),
  caption: z.string().max(500).optional().nullable(),
  sortOrder: z.number().int().min(0).optional().default(0),
});

export const updateGalleryImageSchema = createGalleryImageSchema.partial();

export type CreateGalleryImageInput = z.infer<typeof createGalleryImageSchema>;
export type UpdateGalleryImageInput = z.infer<typeof updateGalleryImageSchema>;
