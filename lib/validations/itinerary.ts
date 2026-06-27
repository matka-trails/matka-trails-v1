import { z } from "zod";

export const createItineraryDaySchema = z.object({
  dayNumber: z.number().int().min(0, "Day number cannot be negative"),
  title: z.string().min(1, "Day title is required").max(300),
  description: z.string().optional().nullable(),
  images: z.array(z.string().url("Each image must be a valid URL")).optional().default([]),
  sortOrder: z.number().int().min(0).optional().default(0),
});

export const updateItineraryDaySchema = createItineraryDaySchema.partial();

export type CreateItineraryDayInput = z.infer<typeof createItineraryDaySchema>;
export type UpdateItineraryDayInput = z.infer<typeof updateItineraryDaySchema>;
