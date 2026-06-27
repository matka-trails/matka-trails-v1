import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, errorResponse } from "@/lib/apiResponse";
import { updateReviewSchema } from "@/lib/validations/review";

/**
 * PATCH /api/admin/packages/[id]/reviews/[reviewId]
 * Update a review (approve/disapprove, edit text, etc.)
 */
export const PATCH = withApiHandler(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string; reviewId: string }> }
  ) => {
    const { id, reviewId } = await params;
    const body = await request.json();
    const validated = updateReviewSchema.parse(body);

    const review = await prisma.packageReview.findFirst({
      where: { id: reviewId, packageId: id },
    });
    if (!review) return errorResponse("Review not found", "NOT_FOUND", 404);

    const updated = await prisma.packageReview.update({
      where: { id: reviewId },
      data: validated,
    });

    return successResponse(updated);
  }
);

/**
 * DELETE /api/admin/packages/[id]/reviews/[reviewId]
 * Delete a review
 */
export const DELETE = withApiHandler(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string; reviewId: string }> }
  ) => {
    const { id, reviewId } = await params;

    const review = await prisma.packageReview.findFirst({
      where: { id: reviewId, packageId: id },
    });
    if (!review) return errorResponse("Review not found", "NOT_FOUND", 404);

    await prisma.packageReview.delete({ where: { id: reviewId } });

    return successResponse({ message: "Review deleted successfully" });
  }
);
