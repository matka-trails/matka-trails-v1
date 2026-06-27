import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, errorResponse } from "@/lib/apiResponse";
import { updateFaqSchema } from "@/lib/validations/faq";

/**
 * PATCH /api/admin/blogs/[id]/faqs/[faqId]
 * Update a blog FAQ
 */
export const PATCH = withApiHandler(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string; faqId: string }> }
  ) => {
    const { id, faqId } = await params;
    const body = await request.json();
    const validated = updateFaqSchema.parse(body);

    const faq = await prisma.fAQ.findFirst({
      where: { id: faqId, blogId: id },
    });
    if (!faq) return errorResponse("FAQ not found", "NOT_FOUND", 404);

    const updated = await prisma.fAQ.update({
      where: { id: faqId },
      data: validated,
    });

    return successResponse(updated);
  }
);

/**
 * DELETE /api/admin/blogs/[id]/faqs/[faqId]
 * Delete a blog FAQ
 */
export const DELETE = withApiHandler(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string; faqId: string }> }
  ) => {
    const { id, faqId } = await params;

    const faq = await prisma.fAQ.findFirst({
      where: { id: faqId, blogId: id },
    });
    if (!faq) return errorResponse("FAQ not found", "NOT_FOUND", 404);

    await prisma.fAQ.delete({ where: { id: faqId } });

    return successResponse({ message: "FAQ deleted successfully" });
  }
);
