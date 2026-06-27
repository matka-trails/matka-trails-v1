import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse } from "@/lib/apiResponse";

/**
 * GET /api/public/testimonials
 * Get all video testimonials for public website
 */
export const GET = withApiHandler(async (request: NextRequest) => {
  const items = await prisma.videoTestimonial.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return successResponse(items);
});
