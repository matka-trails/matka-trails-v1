import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Next.js 16 proxy (formerly middleware).
 * Protects admin routes and admin API routes.
 *
 * - /admin/* (except /admin/login) → redirects to login if no valid session
 * - /api/admin/* → returns 401 JSON if no valid session
 * - Everything else passes through
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // On Vercel (HTTPS), NextAuth uses __Secure- prefixed cookie names
  const secureCookie = process.env.NODE_ENV === "production" || !!process.env.VERCEL_URL;

  // ── Protect admin pages (redirect to login) ────────
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie,
    });

    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Protect admin API routes (return 401) ──────────
  if (pathname.startsWith("/api/admin")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie,
    });

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Authentication required",
            code: "UNAUTHORIZED",
          },
        },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

// Only run on admin routes (not on public pages or public API)
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
