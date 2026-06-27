import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, errorResponse } from "@/lib/apiResponse";
import { updatePackageSchema } from "@/lib/validations/package";
import { generateUniqueSlug } from "@/lib/slugify";

/**
 * GET /api/admin/packages/[id]
 * Get a single package with all nested relations
 */
export const GET = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const pkg = await prisma.package.findUnique({
      where: { id, deletedAt: null },
      include: {
        destination: { select: { id: true, name: true, slug: true } },
        itinerary: { orderBy: { sortOrder: "asc" } },
        reviews: { orderBy: { createdAt: "desc" } },
        testimonials: { orderBy: { sortOrder: "asc" } },
        faqs: { orderBy: { sortOrder: "asc" } },
        _count: { select: { leads: true } },
      },
    });

    if (!pkg) {
      return errorResponse("Package not found", "NOT_FOUND", 404);
    }

    return successResponse(pkg);
  }
);

/**
 * PATCH /api/admin/packages/[id]
 * Update a package
 */
export const PATCH = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const body = await request.json();
    const validated = updatePackageSchema.parse(body);

    const existing = await prisma.package.findUnique({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      return errorResponse("Package not found", "NOT_FOUND", 404);
    }

    // If title is changing, regenerate slug
    const data: Record<string, unknown> = { ...validated };
    if (validated.title && validated.title !== existing.title) {
      data.slug = await generateUniqueSlug(validated.title, async (s) => {
        const found = await prisma.package.findUnique({ where: { slug: s } });
        return found !== null && found.id !== id;
      });
    }

    // Handle date conversion
    if (validated.startDate !== undefined) {
      data.startDate = validated.startDate ? new Date(validated.startDate) : null;
    }
    if (validated.endDate !== undefined) {
      data.endDate = validated.endDate ? new Date(validated.endDate) : null;
    }

    const pkg = await prisma.package.update({
      where: { id },
      data: data as Parameters<typeof prisma.package.update>[0]["data"],
      include: {
        destination: { select: { id: true, name: true, slug: true } },
      },
    });

    return successResponse(pkg);
  }
);

/**
 * DELETE /api/admin/packages/[id]
 * Soft delete a package
 */
export const DELETE = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const existing = await prisma.package.findUnique({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      return errorResponse("Package not found", "NOT_FOUND", 404);
    }

    await prisma.package.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return successResponse({ message: "Package deleted successfully" });
  }
);
