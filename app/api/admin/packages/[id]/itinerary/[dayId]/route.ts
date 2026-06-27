import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, errorResponse } from "@/lib/apiResponse";
import { updateItineraryDaySchema } from "@/lib/validations/itinerary";

/**
 * PATCH /api/admin/packages/[id]/itinerary/[dayId]
 * Update an itinerary day
 */
export const PATCH = withApiHandler(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string; dayId: string }> }
  ) => {
    const { id, dayId } = await params;
    const body = await request.json();
    const validated = updateItineraryDaySchema.parse(body);

    const day = await prisma.itineraryDay.findFirst({
      where: { id: dayId, packageId: id },
    });
    if (!day) return errorResponse("Itinerary day not found", "NOT_FOUND", 404);

    // If day number is changing, check for duplicates
    if (validated.dayNumber !== undefined && validated.dayNumber !== day.dayNumber) {
      const duplicate = await prisma.itineraryDay.findFirst({
        where: { packageId: id, dayNumber: validated.dayNumber, id: { not: dayId } },
      });
      if (duplicate) {
        return errorResponse(
          `Day ${validated.dayNumber} already exists for this package`,
          "DUPLICATE_ERROR",
          409
        );
      }
    }

    const updated = await prisma.itineraryDay.update({
      where: { id: dayId },
      data: validated,
    });

    return successResponse(updated);
  }
);

/**
 * DELETE /api/admin/packages/[id]/itinerary/[dayId]
 * Remove an itinerary day
 */
export const DELETE = withApiHandler(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string; dayId: string }> }
  ) => {
    const { id, dayId } = await params;

    const day = await prisma.itineraryDay.findFirst({
      where: { id: dayId, packageId: id },
    });
    if (!day) return errorResponse("Itinerary day not found", "NOT_FOUND", 404);

    await prisma.itineraryDay.delete({ where: { id: dayId } });

    return successResponse({ message: "Itinerary day deleted successfully" });
  }
);
