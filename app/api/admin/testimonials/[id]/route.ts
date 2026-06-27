import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, errorResponse } from "@/lib/apiResponse";

/**
 * DELETE /api/admin/testimonials/[id]
 * Delete a video testimonial
 */
export const DELETE = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const existing = await prisma.videoTestimonial.findUnique({
      where: { id },
    });
    if (!existing) {
      return errorResponse("Testimonial not found", "NOT_FOUND", 404);
    }

    await prisma.videoTestimonial.delete({
      where: { id },
    });

    return successResponse({ message: "Testimonial deleted successfully" });
  }
);
