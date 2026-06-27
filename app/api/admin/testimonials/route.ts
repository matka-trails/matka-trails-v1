import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, parsePagination, paginatedResponse } from "@/lib/apiResponse";

/**
 * GET /api/admin/testimonials
 * List all video testimonials
 */
export const GET = withApiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const pagination = parsePagination(searchParams);

  const [items, total] = await Promise.all([
    prisma.videoTestimonial.findMany({
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.videoTestimonial.count(),
  ]);

  return paginatedResponse(items, total, pagination);
});

/**
 * POST /api/admin/testimonials
 * Add a new video testimonial
 */
export const POST = withApiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const { videoUrl, title, thumbnail, sortOrder } = body;

  if (!videoUrl || !title) {
    return successResponse({ error: "videoUrl and title are required" }, 400);
  }

  const testimonial = await prisma.videoTestimonial.create({
    data: {
      videoUrl,
      title,
      thumbnail: thumbnail || null,
      sortOrder: sortOrder ? Number(sortOrder) : 0,
    },
  });

  return successResponse(testimonial, 201);
});
