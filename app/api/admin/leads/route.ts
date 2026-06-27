import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, parsePagination, paginatedResponse } from "@/lib/apiResponse";

/**
 * GET /api/admin/leads
 * List all leads with pagination, search, and status/date filters
 */
export const GET = withApiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const pagination = parsePagination(searchParams);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status");
  const source = searchParams.get("source");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
      { email: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status) where.status = status;
  if (source) where.source = source;

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = new Date(dateFrom);
    if (dateTo) where.createdAt.lte = new Date(dateTo);
  }

  // Build sort — only allow safe columns
  const allowedSortColumns = ["createdAt", "name", "status"];
  const safeSort = allowedSortColumns.includes(sortBy) ? sortBy : "createdAt";
  const safeSortOrder = sortOrder === "asc" ? "asc" : "desc";

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { [safeSort]: safeSortOrder },
      include: {
        package: { select: { id: true, title: true, slug: true } },
      },
    }),
    prisma.lead.count({ where }),
  ]);

  return paginatedResponse(leads, total, pagination);
});
