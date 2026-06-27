import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, errorResponse } from "@/lib/apiResponse";
import { updateTestimonialSchema } from "@/lib/validations/testimonial";

/**
 * PATCH /api/admin/packages/[id]/testimonials/[testimonialId]
 * Update a video testimonial
 */
export const PATCH = withApiHandler(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string; testimonialId: string }> }
  ) => {
    const { id, testimonialId } = await params;
    const body = await request.json();
    const validated = updateTestimonialSchema.parse(body);

    const testimonial = await prisma.packageVideoTestimonial.findFirst({
      where: { id: testimonialId, packageId: id },
    });
    if (!testimonial) return errorResponse("Testimonial not found", "NOT_FOUND", 404);

    const updated = await prisma.packageVideoTestimonial.update({
      where: { id: testimonialId },
      data: validated,
    });

    return successResponse(updated);
  }
);

/**
 * DELETE /api/admin/packages/[id]/testimonials/[testimonialId]
 * Delete a video testimonial
 */
export const DELETE = withApiHandler(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string; testimonialId: string }> }
  ) => {
    const { id, testimonialId } = await params;

    const testimonial = await prisma.packageVideoTestimonial.findFirst({
      where: { id: testimonialId, packageId: id },
    });
    if (!testimonial) return errorResponse("Testimonial not found", "NOT_FOUND", 404);

    await prisma.packageVideoTestimonial.delete({ where: { id: testimonialId } });

    return successResponse({ message: "Testimonial deleted successfully" });
  }
);
