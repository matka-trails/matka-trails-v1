import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, errorResponse } from "@/lib/apiResponse";

/**
 * GET /api/admin/dashboard
 * Returns dashboard statistics for the admin panel
 */
export const GET = withApiHandler(async (request: NextRequest) => {
  // Run all count queries in parallel for performance
  const [
    totalPackages,
    totalDestinations,
    totalBlogs,
    totalLeads,
    newLeads,
    contactedLeads,
    confirmedLeads,
    rejectedLeads,
    recentLeads,
    publishedPackages,
    draftPackages,
  ] = await Promise.all([
    prisma.package.count({ where: { deletedAt: null } }),
    prisma.destination.count({ where: { deletedAt: null } }),
    prisma.blog.count({ where: { deletedAt: null } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.count({ where: { status: "CONTACTED" } }),
    prisma.lead.count({ where: { status: "CONFIRMED" } }),
    prisma.lead.count({ where: { status: "REJECTED" } }),
    prisma.lead.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        package: { select: { title: true } },
      },
    }),
    prisma.package.count({ where: { status: "PUBLISHED", deletedAt: null } }),
    prisma.package.count({ where: { status: "DRAFT", deletedAt: null } }),
  ]);

  // Leads over the last 30 days (grouped by date)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const leadsRaw = await prisma.lead.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  // Group leads by date for chart data
  const leadsOverTime: Record<string, number> = {};
  for (let d = new Date(thirtyDaysAgo); d <= new Date(); d.setDate(d.getDate() + 1)) {
    leadsOverTime[d.toISOString().split("T")[0]] = 0;
  }
  for (const lead of leadsRaw) {
    const dateKey = lead.createdAt.toISOString().split("T")[0];
    if (leadsOverTime[dateKey] !== undefined) {
      leadsOverTime[dateKey]++;
    }
  }

  const leadsOverTimeArray = Object.entries(leadsOverTime).map(([date, count]) => ({
    date,
    count,
  }));

  return successResponse({
    totalPackages,
    publishedPackages,
    draftPackages,
    totalDestinations,
    totalBlogs,
    totalLeads,
    leadsByStatus: {
      NEW: newLeads,
      CONTACTED: contactedLeads,
      CONFIRMED: confirmedLeads,
      REJECTED: rejectedLeads,
    },
    recentLeads: recentLeads.map((lead: typeof recentLeads[number]) => ({
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      status: lead.status,
      source: lead.source,
      createdAt: lead.createdAt,
      packageTitle: lead.package?.title || null,
    })),
    leadsOverTime: leadsOverTimeArray,
  });
});
