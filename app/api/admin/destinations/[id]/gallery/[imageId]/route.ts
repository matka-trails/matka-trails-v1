import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, errorResponse } from "@/lib/apiResponse";
import { updateGalleryImageSchema } from "@/lib/validations/gallery";

/**
 * PATCH /api/admin/destinations/[id]/gallery/[imageId]
 * Update a gallery image's caption or sort order
 */
export const PATCH = withApiHandler(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string; imageId: string }> }
  ) => {
    const { id, imageId } = await params;
    const body = await request.json();
    const validated = updateGalleryImageSchema.parse(body);

    const image = await prisma.destinationGallery.findFirst({
      where: { id: imageId, destinationId: id },
    });
    if (!image) {
      return errorResponse("Gallery image not found", "NOT_FOUND", 404);
    }

    const updated = await prisma.destinationGallery.update({
      where: { id: imageId },
      data: validated,
    });

    return successResponse(updated);
  }
);

/**
 * DELETE /api/admin/destinations/[id]/gallery/[imageId]
 * Remove a gallery image
 */
export const DELETE = withApiHandler(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string; imageId: string }> }
  ) => {
    const { id, imageId } = await params;

    const image = await prisma.destinationGallery.findFirst({
      where: { id: imageId, destinationId: id },
    });
    if (!image) {
      return errorResponse("Gallery image not found", "NOT_FOUND", 404);
    }

    await prisma.destinationGallery.delete({ where: { id: imageId } });

    return successResponse({ message: "Gallery image deleted successfully" });
  }
);
