import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, parsePagination, paginatedResponse } from "@/lib/apiResponse";
import { createDestinationSchema } from "@/lib/validations/destination";
import { generateUniqueSlug } from "@/lib/slugify";

/**
 * GET /api/admin/destinations
 * List all destinations with pagination and search
 */
export const GET = withApiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const pagination = parsePagination(searchParams);
  const search = searchParams.get("search") || "";

  const where = {
    deletedAt: null,
    ...(search && {
      name: { contains: search, mode: "insensitive" as const },
    }),
  };

  const [destinations, total] = await Promise.all([
    prisma.destination.findMany({
      where,
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        _count: { select: { packages: true, gallery: true } },
      },
    }),
    prisma.destination.count({ where }),
  ]);

  return paginatedResponse(destinations, total, pagination);
});

/**
 * POST /api/admin/destinations
 * Create a new destination
 */
export const POST = withApiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const validated = createDestinationSchema.parse(body);

  // Generate unique slug from destination name
  const slug = await generateUniqueSlug(validated.name, async (s) => {
    const existing = await prisma.destination.findUnique({ where: { slug: s } });
    return existing !== null;
  });

  const destination = await prisma.destination.create({
    data: {
      ...validated,
      slug,
    },
  });

  return successResponse(destination, 201);
});
