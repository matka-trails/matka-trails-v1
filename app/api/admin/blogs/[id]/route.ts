import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, errorResponse } from "@/lib/apiResponse";
import { updateBlogSchema } from "@/lib/validations/blog";
import { generateUniqueSlug } from "@/lib/slugify";

/**
 * GET /api/admin/blogs/[id]
 * Get a single blog with all content blocks and FAQs
 */
export const GET = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const blog = await prisma.blog.findUnique({
      where: { id, deletedAt: null },
      include: {
        author: { select: { id: true, name: true, email: true } },
        faqs: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!blog) {
      return errorResponse("Blog not found", "NOT_FOUND", 404);
    }

    return successResponse(blog);
  }
);

/**
 * PATCH /api/admin/blogs/[id]
 * Update a blog post
 */
export const PATCH = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const body = await request.json();
    const validated = updateBlogSchema.parse(body);

    const existing = await prisma.blog.findUnique({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      return errorResponse("Blog not found", "NOT_FOUND", 404);
    }

    // Regenerate slug if title changed
    const data: Record<string, unknown> = { ...validated };
    if (validated.title && validated.title !== existing.title) {
      data.slug = await generateUniqueSlug(validated.title, async (s) => {
        const found = await prisma.blog.findUnique({ where: { slug: s } });
        return found !== null && found.id !== id;
      });
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: data as Parameters<typeof prisma.blog.update>[0]["data"],
      include: {
        author: { select: { id: true, name: true } },
      },
    });

    return successResponse(blog);
  }
);

/**
 * DELETE /api/admin/blogs/[id]
 * Soft delete a blog post
 */
export const DELETE = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const existing = await prisma.blog.findUnique({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      return errorResponse("Blog not found", "NOT_FOUND", 404);
    }

    await prisma.blog.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return successResponse({ message: "Blog deleted successfully" });
  }
);
