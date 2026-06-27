import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiHandler, successResponse, errorResponse } from "@/lib/apiResponse";
import { createLeadSchema } from "@/lib/validations/lead";

// ─── Simple Rate Limiting ─────────────────────────────
// In-memory rate limiter to prevent spam on the public lead form.
// In production, you'd use Redis or similar.

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // Max 5 submissions per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true; // Allowed
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false; // Rate limited
  }

  entry.count++;
  return true; // Allowed
}

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

/**
 * POST /api/public/leads
 * Public lead submission from website booking/contact forms
 */
export const POST = withApiHandler(async (request: NextRequest) => {
  // Rate limit check
  const ip = request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return errorResponse(
      "Too many submissions. Please try again in a minute.",
      "RATE_LIMITED",
      429
    );
  }

  const body = await request.json();
  const validated = createLeadSchema.parse(body);

  // If packageId is provided, verify the package exists
  if (validated.packageId) {
    const pkg = await prisma.package.findUnique({
      where: { id: validated.packageId, deletedAt: null },
    });
    if (!pkg) {
      return errorResponse("Selected package not found", "NOT_FOUND", 404);
    }
  }

  const lead = await prisma.lead.create({
    data: validated,
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });

  return successResponse(
    {
      ...lead,
      message: "Thank you! Our team will contact you shortly.",
    },
    201
  );
});
