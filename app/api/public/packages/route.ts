import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, parsePagination, paginatedResponse } from "@/lib/apiResponse";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

/**
 * GET /api/public/packages
 * Public listing of published packages with filters
 *
 * Query params:
 *   - destination: destination slug
 *   - groupType: CORPORATE | SOLO_GROUP | CUSTOM
 *   - minPrice, maxPrice: price range filter
 *   - minDuration, maxDuration: day-count filter
 *   - featured: "true" to only show featured
 *   - sort: "price_asc" | "price_desc" | "duration_asc" | "duration_desc" | "latest"
 *   - page, limit: pagination
 */
export const GET = withApiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const pagination = parsePagination(searchParams);

  const destinationSlug = searchParams.get("destination");
  const groupType = searchParams.get("groupType");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const minDuration = searchParams.get("minDuration");
  const maxDuration = searchParams.get("maxDuration");
  const featured = searchParams.get("featured");
  const sort = searchParams.get("sort") || "latest";
  const search = searchParams.get("search") || "";

  // Only show published, non-deleted packages
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    status: "PUBLISHED",
    deletedAt: null,
  };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { summary: { contains: search, mode: "insensitive" } },
      { destination: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (destinationSlug) {
    where.destination = { slug: destinationSlug };
  }

  if (groupType) where.groupType = groupType;
  if (featured === "true") where.isFeatured = true;

  if (minPrice || maxPrice) {
    where.priceOriginal = {};
    if (minPrice) where.priceOriginal.gte = parseFloat(minPrice);
    if (maxPrice) where.priceOriginal.lte = parseFloat(maxPrice);
  }

  if (minDuration || maxDuration) {
    where.durationDays = {};
    if (minDuration) where.durationDays.gte = parseInt(minDuration);
    if (maxDuration) where.durationDays.lte = parseInt(maxDuration);
  }

  // Build sort order
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = { createdAt: "desc" };
  switch (sort) {
    case "price_asc":
      orderBy = { priceOriginal: "asc" };
      break;
    case "price_desc":
      orderBy = { priceOriginal: "desc" };
      break;
    case "duration_asc":
      orderBy = { durationDays: "asc" };
      break;
    case "duration_desc":
      orderBy = { durationDays: "desc" };
      break;
    case "latest":
    default:
      orderBy = { createdAt: "desc" };
  }

  const [packages, total] = await Promise.all([
    prisma.package.findMany({
      where,
      skip: pagination.skip,
      take: pagination.limit,
      orderBy,
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        coverImage: true,
        durationDays: true,
        durationNights: true,
        priceOriginal: true,
        priceDiscounted: true,
        groupType: true,
        isFeatured: true,
        startDate: true,
        maxGroupSize: true,
        currentBookings: true,
        destination: { select: { id: true, name: true, slug: true } },
        _count: { select: { reviews: { where: { isApproved: true } } } },
      },
    }),
    prisma.package.count({ where }),
  ]);

  // Optimize image URLs
  const optimizedPackages = packages.map((pkg: typeof packages[number]) => ({
    ...pkg,
    coverImage: pkg.coverImage ? getOptimizedImageUrl(pkg.coverImage, 600) : null,
  }));

  return paginatedResponse(optimizedPackages, total, pagination);
});
