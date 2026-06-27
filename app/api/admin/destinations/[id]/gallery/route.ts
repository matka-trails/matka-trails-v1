import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, errorResponse } from "@/lib/apiResponse";
import { createGalleryImageSchema } from "@/lib/validations/gallery";

/**
 * GET /api/admin/destinations/[id]/gallery
 * List all gallery images for a destination
 */
export const GET = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    // Verify destination exists
    const destination = await prisma.destination.findUnique({
      where: { id, deletedAt: null },
    });
    if (!destination) {
      return errorResponse("Destination not found", "NOT_FOUND", 404);
    }

    const gallery = await prisma.destinationGallery.findMany({
      where: { destinationId: id },
      orderBy: { sortOrder: "asc" },
    });

    return successResponse(gallery);
  }
);

/**
 * POST /api/admin/destinations/[id]/gallery
 * Add a gallery image to a destination
 */
export const POST = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const body = await request.json();
    const validated = createGalleryImageSchema.parse(body);

    // Verify destination exists
    const destination = await prisma.destination.findUnique({
      where: { id, deletedAt: null },
    });
    if (!destination) {
      return errorResponse("Destination not found", "NOT_FOUND", 404);
    }

    const image = await prisma.destinationGallery.create({
      data: {
        ...validated,
        destinationId: id,
      },
    });

    return successResponse(image, 201);
  }
);
