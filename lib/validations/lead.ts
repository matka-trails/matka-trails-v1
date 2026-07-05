import { z } from "zod";

// ─── Public Lead Submission (from website forms) ───────
export const createLeadSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(200)
    .regex(/^[^0-9]+$/, "Name cannot contain digits"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
  email: z.string().email("Please enter a valid email").optional().nullable().or(z.literal("")),
  age: z.string()
    .min(1, "Age is required")
    .regex(/^[0-9]+$/, "Age must contain only digits")
    .transform(Number),
  gender: z.string().min(1, "Gender is required"),
  occupation: z.string().min(1, "Occupation is required").max(200),
  alternatePhone: z.string()
    .regex(/^[0-9]*$/, "Please enter a valid phone number")
    .optional()
    .nullable(),
  city: z.string().max(100).optional().nullable(),
  company: z.string().max(200).optional().nullable(),
  packageId: z.string().optional().nullable(),
  groupSize: z.number().int().positive("Group size must be at least 1").optional().nullable(),
  preferredDate: z.string().max(200).optional().nullable(),
  message: z.string().max(2000, "Message is too long").optional().nullable(),
  source: z.enum(["WEBSITE_FORM", "PACKAGE_BOOKING"]).optional().default("WEBSITE_FORM"),
});

// ─── Admin Lead Status Update ──────────────────────────
export const updateLeadStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CONFIRMED", "REJECTED"]),
  adminNotes: z.string().max(5000).optional().nullable(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;
