import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, errorResponse } from "@/lib/apiResponse";
import { createTestimonialSchema } from "@/lib/validations/testimonial";

/**
 * GET /api/admin/packages/[id]/testimonials
 * List all video testimonials for a package
 */
export const GET = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const pkg = await prisma.package.findUnique({ where: { id, deletedAt: null } });
    if (!pkg) return errorResponse("Package not found", "NOT_FOUND", 404);

    const testimonials = await prisma.packageVideoTestimonial.findMany({
      where: { packageId: id },
      orderBy: { sortOrder: "asc" },
    });

    return successResponse(testimonials);
  }
);

/**
 * POST /api/admin/packages/[id]/testimonials
 * Add a video testimonial to a package
 */
export const POST = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const body = await request.json();
    const validated = createTestimonialSchema.parse(body);

    const pkg = await prisma.package.findUnique({ where: { id, deletedAt: null } });
    if (!pkg) return errorResponse("Package not found", "NOT_FOUND", 404);

    const testimonial = await prisma.packageVideoTestimonial.create({
      data: { ...validated, packageId: id },
    });

    return successResponse(testimonial, 201);
  }
);
