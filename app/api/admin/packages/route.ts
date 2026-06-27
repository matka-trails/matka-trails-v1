import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, parsePagination, paginatedResponse } from "@/lib/apiResponse";
import { createPackageSchema } from "@/lib/validations/package";
import { generateUniqueSlug } from "@/lib/slugify";

/**
 * GET /api/admin/packages
 * List all packages with pagination, search, and filters
 */
export const GET = withApiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const pagination = parsePagination(searchParams);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status"); // "DRAFT" | "PUBLISHED"
  const destinationId = searchParams.get("destinationId");
  const groupType = searchParams.get("groupType");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { deletedAt: null };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { summary: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status) where.status = status;
  if (destinationId) where.destinationId = destinationId;
  if (groupType) where.groupType = groupType;

  const [packages, total] = await Promise.all([
    prisma.package.findMany({
      where,
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { createdAt: "desc" },
      include: {
        destination: { select: { id: true, name: true, slug: true } },
        _count: {
          select: { itinerary: true, reviews: true, testimonials: true, leads: true, faqs: true },
        },
      },
    }),
    prisma.package.count({ where }),
  ]);

  return paginatedResponse(packages, total, pagination);
});

/**
 * POST /api/admin/packages
 * Create a new package
 */
export const POST = withApiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const validated = createPackageSchema.parse(body);

  // Verify destination exists
  const destination = await prisma.destination.findUnique({
    where: { id: validated.destinationId, deletedAt: null },
  });
  if (!destination) {
    return successResponse(
      { message: "Destination not found" },
      404
    );
  }

  // Generate unique slug
  const slug = await generateUniqueSlug(validated.title, async (s) => {
    const existing = await prisma.package.findUnique({ where: { slug: s } });
    return existing !== null;
  });

  // Handle date conversion
  const data: Record<string, unknown> = { ...validated, slug };
  if (validated.startDate) data.startDate = new Date(validated.startDate);
  if (validated.endDate) data.endDate = new Date(validated.endDate);

  const pkg = await prisma.package.create({
    data: data as Parameters<typeof prisma.package.create>[0]["data"],
    include: {
      destination: { select: { id: true, name: true, slug: true } },
    },
  });

  return successResponse(pkg, 201);
});
