import { z } from "zod";

export const createPackageSchema = z.object({
  title: z.string().min(1, "Package title is required").max(300),
  destinationId: z.string().min(1, "Destination is required"),
  summary: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  durationDays: z.number().int().min(1, "Duration must be at least 1 day"),
  durationNights: z.number().int().min(0, "Nights cannot be negative"),
  priceOriginal: z.number().positive("Price must be greater than 0"),
  priceDiscounted: z.number().positive("Discounted price must be greater than 0").optional().nullable(),
  pdfUrl: z.string().url("PDF URL must be a valid URL").optional().nullable(),
  coverImage: z.string().url("Cover image must be a valid URL").optional().nullable(),
  galleryImages: z.array(z.string().url("Each gallery image must be a valid URL")).optional().default([]),
  inclusions: z.array(z.string().min(1)).optional().default([]),
  exclusions: z.array(z.string().min(1)).optional().default([]),
  notes: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional().default("DRAFT"),
  groupType: z.enum(["CORPORATE", "SOLO_GROUP", "CUSTOM"]).optional().default("SOLO_GROUP"),
  isFeatured: z.boolean().optional().default(false),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  maxGroupSize: z.number().int().positive("Group size must be positive").optional().nullable(),
  metaTitle: z.string().max(70, "Meta title should be under 70 characters").optional().nullable(),
  metaDescription: z.string().max(160, "Meta description should be under 160 characters").optional().nullable(),
}).refine(
  (data) => {
    if (data.priceDiscounted && data.priceOriginal) {
      return data.priceDiscounted < data.priceOriginal;
    }
    return true;
  },
  { message: "Discounted price must be less than the original price", path: ["priceDiscounted"] }
).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.endDate) > new Date(data.startDate);
    }
    return true;
  },
  { message: "End date must be after start date", path: ["endDate"] }
);

export const updatePackageSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  destinationId: z.string().min(1).optional(),
  summary: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  durationDays: z.number().int().min(1).optional(),
  durationNights: z.number().int().min(0).optional(),
  priceOriginal: z.number().positive().optional(),
  priceDiscounted: z.number().positive().optional().nullable(),
  pdfUrl: z.string().url().optional().nullable(),
  coverImage: z.string().url().optional().nullable(),
  galleryImages: z.array(z.string().url()).optional(),
  inclusions: z.array(z.string().min(1)).optional(),
  exclusions: z.array(z.string().min(1)).optional(),
  notes: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  groupType: z.enum(["CORPORATE", "SOLO_GROUP", "CUSTOM"]).optional(),
  isFeatured: z.boolean().optional(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  maxGroupSize: z.number().int().positive().optional().nullable(),
  currentBookings: z.number().int().min(0).optional(),
  metaTitle: z.string().max(70).optional().nullable(),
  metaDescription: z.string().max(160).optional().nullable(),
});

export type CreatePackageInput = z.infer<typeof createPackageSchema>;
export type UpdatePackageInput = z.infer<typeof updatePackageSchema>;
