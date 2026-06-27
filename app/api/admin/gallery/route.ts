import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, parsePagination, paginatedResponse } from "@/lib/apiResponse";

/**
 * GET /api/admin/gallery
 * List all gallery items
 */
export const GET = withApiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const pagination = parsePagination(searchParams);

  const [items, total] = await Promise.all([
    prisma.galleryItem.findMany({
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.galleryItem.count(),
  ]);

  return paginatedResponse(items, total, pagination);
});

/**
 * POST /api/admin/gallery
 * Add a new gallery item
 */
export const POST = withApiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const { imageUrl, placeName, caption, sortOrder } = body;

  if (!imageUrl || !placeName) {
    return successResponse({ error: "imageUrl and placeName are required" }, 400);
  }

  const item = await prisma.galleryItem.create({
    data: {
      imageUrl,
      placeName,
      caption: caption || null,
      sortOrder: sortOrder ? Number(sortOrder) : 0,
    },
  });

  return successResponse(item, 201);
});
