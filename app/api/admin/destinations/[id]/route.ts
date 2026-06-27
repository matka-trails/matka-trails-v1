import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, errorResponse } from "@/lib/apiResponse";
import { updateDestinationSchema } from "@/lib/validations/destination";
import { generateUniqueSlug } from "@/lib/slugify";

/**
 * GET /api/admin/destinations/[id]
 * Get a single destination with all relations
 */
export const GET = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const destination = await prisma.destination.findUnique({
      where: { id, deletedAt: null },
      include: {
        packages: {
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
          select: { id: true, title: true, slug: true, status: true, priceOriginal: true, priceDiscounted: true },
        },
        gallery: { orderBy: { sortOrder: "asc" } },
        _count: { select: { packages: true, gallery: true } },
      },
    });

    if (!destination) {
      return errorResponse("Destination not found", "NOT_FOUND", 404);
    }

    return successResponse(destination);
  }
);

/**
 * PATCH /api/admin/destinations/[id]
 * Update a destination
 */
export const PATCH = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const body = await request.json();
    const validated = updateDestinationSchema.parse(body);

    // Check destination exists
    const existing = await prisma.destination.findUnique({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      return errorResponse("Destination not found", "NOT_FOUND", 404);
    }

    // If name is changing, regenerate slug
    let slug = existing.slug;
    if (validated.name && validated.name !== existing.name) {
      slug = await generateUniqueSlug(validated.name, async (s) => {
        const found = await prisma.destination.findUnique({ where: { slug: s } });
        return found !== null && found.id !== id;
      });
    }

    const destination = await prisma.destination.update({
      where: { id },
      data: { ...validated, slug },
    });

    return successResponse(destination);
  }
);

/**
 * DELETE /api/admin/destinations/[id]
 * Soft delete a destination
 */
export const DELETE = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const existing = await prisma.destination.findUnique({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      return errorResponse("Destination not found", "NOT_FOUND", 404);
    }

    // Check if destination has active packages
    const activePackages = await prisma.package.count({
      where: { destinationId: id, deletedAt: null },
    });
    if (activePackages > 0) {
      return errorResponse(
        `Cannot delete destination with ${activePackages} active package(s). Remove or reassign packages first.`,
        "DEPENDENCY_ERROR",
        400
      );
    }

    await prisma.destination.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return successResponse({ message: "Destination deleted successfully" });
  }
);
