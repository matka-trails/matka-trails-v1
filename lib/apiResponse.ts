import { NextRequest, NextResponse } from "next/server";

// ─── Response Types ────────────────────────────────────

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─── Response Helpers ──────────────────────────────────

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    { success: true, data } as ApiSuccessResponse<T>,
    { status }
  );
}

export function errorResponse(
  message: string,
  code: string = "SERVER_ERROR",
  status: number = 500
) {
  return NextResponse.json(
    { success: false, error: { message, code } } as ApiErrorResponse,
    { status }
  );
}

// ─── Error Detection Helpers ───────────────────────────

// Version-agnostic Zod error detection (works with Zod 3 and 4)
function isZodError(
  error: unknown
): error is { issues: Array<{ message: string; path: (string | number)[] }> } {
  return (
    error !== null &&
    typeof error === "object" &&
    "issues" in error &&
    Array.isArray((error as Record<string, unknown>).issues)
  );
}

// Version-agnostic Prisma error detection
function isPrismaKnownError(
  error: unknown
): error is { code: string; meta?: Record<string, unknown> } {
  return (
    error !== null &&
    typeof error === "object" &&
    "code" in error &&
    typeof (error as Record<string, unknown>).code === "string" &&
    ((error as Record<string, unknown>).code as string).startsWith("P")
  );
}

// ─── API Handler Wrapper ──────────────────────────────

/**
 * Wraps an API route handler with unified error handling.
 * Catches Zod validation errors, Prisma errors, and generic errors,
 * mapping them to the standardized response shape.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RouteHandler = (request: NextRequest, context?: any) => Promise<NextResponse>;

export function withApiHandler(handler: RouteHandler): RouteHandler {
  return async (request: NextRequest, context?) => {
    try {
      return await handler(request, context);
    } catch (error: unknown) {
      console.error("[API Error]", error);

      // ── Zod validation errors ─────────────────────
      if (isZodError(error)) {
        const messages = error.issues
          .map((issue) => {
            const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
            return `${path}${issue.message}`;
          })
          .join("; ");
        return errorResponse(messages, "VALIDATION_ERROR", 400);
      }

      // ── Prisma known request errors ───────────────
      if (isPrismaKnownError(error)) {
        switch (error.code) {
          case "P2002": {
            const target = error.meta?.target;
            const field = Array.isArray(target) ? target.join(", ") : "field";
            return errorResponse(
              `A record with this ${field} already exists`,
              "DUPLICATE_ERROR",
              409
            );
          }
          case "P2025":
            return errorResponse(
              "Record not found",
              "NOT_FOUND",
              404
            );
          case "P2003":
            return errorResponse(
              "Related record not found. Please check referenced IDs.",
              "FOREIGN_KEY_ERROR",
              400
            );
          default:
            return errorResponse(
              "A database error occurred",
              "DATABASE_ERROR",
              500
            );
        }
      }

      // ── Generic errors ────────────────────────────
      if (error instanceof Error) {
        // Don't expose internal error messages in production
        const message =
          process.env.NODE_ENV === "development"
            ? error.message
            : "An internal server error occurred";
        return errorResponse(message, "SERVER_ERROR", 500);
      }

      return errorResponse("An unexpected error occurred", "SERVER_ERROR", 500);
    }
  };
}

// ─── Pagination Helper ─────────────────────────────────

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export function parsePagination(searchParams: URLSearchParams): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function paginatedResponse<T>(
  items: T[],
  total: number,
  pagination: PaginationParams
) {
  return successResponse({
    items,
    total,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: Math.ceil(total / pagination.limit),
  });
}
