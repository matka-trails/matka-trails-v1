import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, errorResponse } from "@/lib/apiResponse";
import { updateLeadStatusSchema } from "@/lib/validations/lead";

/**
 * GET /api/admin/leads/[id]
 * Get full details for a single lead
 */
export const GET = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        package: {
          select: {
            id: true,
            title: true,
            slug: true,
            priceOriginal: true,
            priceDiscounted: true,
            durationDays: true,
            durationNights: true,
            destination: { select: { name: true } },
          },
        },
      },
    });

    if (!lead) {
      return errorResponse("Lead not found", "NOT_FOUND", 404);
    }

    return successResponse(lead);
  }
);

/**
 * PATCH /api/admin/leads/[id]
 * Update lead status and/or admin notes
 */
export const PATCH = withApiHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const body = await request.json();
    const validated = updateLeadStatusSchema.parse(body);

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("Lead not found", "NOT_FOUND", 404);
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: validated,
      include: {
        package: { select: { id: true, title: true } },
      },
    });

    return successResponse(lead);
  }
);
