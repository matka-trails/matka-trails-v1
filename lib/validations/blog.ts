import { z } from "zod";

// ─── Content Block Schema ──────────────────────────────
// Each blog is composed of typed content blocks (paragraph, image, heading, quote)
// This enables the "image after specific paragraph" feature from the raw plan

const paragraphBlockSchema = z.object({
  type: z.literal("paragraph"),
  content: z.string().min(1, "Paragraph content is required"),
});

const imageBlockSchema = z.object({
  type: z.literal("image"),
  url: z.string().url("Image URL must be valid"),
  caption: z.string().optional().nullable(),
  alt: z.string().optional().nullable(),
});

const headingBlockSchema = z.object({
  type: z.literal("heading"),
  content: z.string().min(1, "Heading content is required"),
  level: z.number().int().min(2).max(4),
});

const quoteBlockSchema = z.object({
  type: z.literal("quote"),
  content: z.string().min(1, "Quote content is required"),
  author: z.string().optional().nullable(),
});

const contentBlockSchema = z.union([
  paragraphBlockSchema,
  imageBlockSchema,
  headingBlockSchema,
  quoteBlockSchema,
]);

// ─── Blog Schemas ──────────────────────────────────────

export const createBlogSchema = z.object({
  title: z.string().min(1, "Blog title is required").max(300),
  coverImage: z.string().url("Cover image must be a valid URL").optional().nullable(),
  contentBlocks: z.array(contentBlockSchema).optional().default([]),
  tags: z.array(z.string().min(1).max(50)).optional().default([]),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional().default("DRAFT"),
  authorId: z.string().optional().nullable(),
  metaTitle: z.string().max(70, "Meta title should be under 70 characters").optional().nullable(),
  metaDescription: z.string().max(160, "Meta description should be under 160 characters").optional().nullable(),
});

export const updateBlogSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  coverImage: z.string().url().optional().nullable(),
  contentBlocks: z.array(contentBlockSchema).optional(),
  tags: z.array(z.string().min(1).max(50)).optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  authorId: z.string().optional().nullable(),
  metaTitle: z.string().max(70).optional().nullable(),
  metaDescription: z.string().max(160).optional().nullable(),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
