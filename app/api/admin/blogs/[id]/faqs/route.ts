import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, errorResponse } from "@/lib/apiResponse";
import { createFaqSchema } from "@/lib/validations/faq";

/**
 * GET /api/admin/blogs/[id]/faqs
 * List all FAQs for a blog
 */
export const GET = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const blog = await prisma.blog.findUnique({ where: { id, deletedAt: null } });
    if (!blog) return errorResponse("Blog not found", "NOT_FOUND", 404);

    const faqs = await prisma.fAQ.findMany({
      where: { blogId: id },
      orderBy: { sortOrder: "asc" },
    });

    return successResponse(faqs);
  }
);

/**
 * POST /api/admin/blogs/[id]/faqs
 * Add an FAQ to a blog
 */
export const POST = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const body = await request.json();
    const validated = createFaqSchema.parse(body);

    const blog = await prisma.blog.findUnique({ where: { id, deletedAt: null } });
    if (!blog) return errorResponse("Blog not found", "NOT_FOUND", 404);

    const faq = await prisma.fAQ.create({
      data: {
        question: validated.question,
        answer: validated.answer,
        sortOrder: validated.sortOrder ?? 0,
        blogId: id,
      },
    });

    return successResponse(faq, 201);
  }
);
