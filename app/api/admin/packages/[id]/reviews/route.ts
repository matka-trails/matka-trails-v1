import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, errorResponse } from "@/lib/apiResponse";
import { createReviewSchema } from "@/lib/validations/review";

/**
 * GET /api/admin/packages/[id]/reviews
 * List all reviews for a package
 */
export const GET = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const pkg = await prisma.package.findUnique({ where: { id, deletedAt: null } });
    if (!pkg) return errorResponse("Package not found", "NOT_FOUND", 404);

    const reviews = await prisma.packageReview.findMany({
      where: { packageId: id },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(reviews);
  }
);

/**
 * POST /api/admin/packages/[id]/reviews
 * Add a review to a package
 */
export const POST = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const body = await request.json();
    const validated = createReviewSchema.parse(body);

    const pkg = await prisma.package.findUnique({ where: { id, deletedAt: null } });
    if (!pkg) return errorResponse("Package not found", "NOT_FOUND", 404);

    const review = await prisma.packageReview.create({
      data: { ...validated, packageId: id },
    });

    return successResponse(review, 201);
  }
);
