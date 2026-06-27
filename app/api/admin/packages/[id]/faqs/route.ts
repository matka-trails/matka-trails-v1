import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, errorResponse } from "@/lib/apiResponse";
import { createFaqSchema } from "@/lib/validations/faq";

/**
 * GET /api/admin/packages/[id]/faqs
 * List all FAQs for a package
 */
export const GET = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const pkg = await prisma.package.findUnique({ where: { id, deletedAt: null } });
    if (!pkg) return errorResponse("Package not found", "NOT_FOUND", 404);

    const faqs = await prisma.fAQ.findMany({
      where: { packageId: id },
      orderBy: { sortOrder: "asc" },
    });

    return successResponse(faqs);
  }
);

/**
 * POST /api/admin/packages/[id]/faqs
 * Add an FAQ to a package
 */
export const POST = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const body = await request.json();
    const validated = createFaqSchema.parse(body);

    const pkg = await prisma.package.findUnique({ where: { id, deletedAt: null } });
    if (!pkg) return errorResponse("Package not found", "NOT_FOUND", 404);

    const faq = await prisma.fAQ.create({
      data: {
        question: validated.question,
        answer: validated.answer,
        sortOrder: validated.sortOrder ?? 0,
        packageId: id,
      },
    });

    return successResponse(faq, 201);
  }
);
