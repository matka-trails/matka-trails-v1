import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, errorResponse } from "@/lib/apiResponse";
import { createItineraryDaySchema } from "@/lib/validations/itinerary";

/**
 * GET /api/admin/packages/[id]/itinerary
 * List all itinerary days for a package, ordered by sortOrder
 */
export const GET = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const pkg = await prisma.package.findUnique({ where: { id, deletedAt: null } });
    if (!pkg) return errorResponse("Package not found", "NOT_FOUND", 404);

    const days = await prisma.itineraryDay.findMany({
      where: { packageId: id },
      orderBy: [{ sortOrder: "asc" }, { dayNumber: "asc" }],
    });

    return successResponse(days);
  }
);

/**
 * POST /api/admin/packages/[id]/itinerary
 * Add an itinerary day to a package
 */
export const POST = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const body = await request.json();
    const validated = createItineraryDaySchema.parse(body);

    const pkg = await prisma.package.findUnique({ where: { id, deletedAt: null } });
    if (!pkg) return errorResponse("Package not found", "NOT_FOUND", 404);

    // Check if day number already exists for this package
    const existingDay = await prisma.itineraryDay.findFirst({
      where: { packageId: id, dayNumber: validated.dayNumber },
    });
    if (existingDay) {
      return errorResponse(
        `Day ${validated.dayNumber} already exists for this package`,
        "DUPLICATE_ERROR",
        409
      );
    }

    const day = await prisma.itineraryDay.create({
      data: { ...validated, packageId: id },
    });

    return successResponse(day, 201);
  }
);
