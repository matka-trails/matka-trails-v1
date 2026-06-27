import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, errorResponse } from "@/lib/apiResponse";

/**
 * DELETE /api/admin/gallery/[id]
 * Delete a gallery item
 */
export const DELETE = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const existing = await prisma.galleryItem.findUnique({
      where: { id },
    });
    if (!existing) {
      return errorResponse("Gallery item not found", "NOT_FOUND", 404);
    }

    await prisma.galleryItem.delete({
      where: { id },
    });

    return successResponse({ message: "Gallery item deleted successfully" });
  }
);
