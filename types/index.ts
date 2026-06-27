// ─── Content Block Types (for Blog) ────────────────────

export type ContentBlockType = "paragraph" | "image" | "heading" | "quote";

export interface ParagraphBlock {
  type: "paragraph";
  content: string;
}

export interface ImageBlock {
  type: "image";
  url: string;
  caption?: string;
  alt?: string;
}

export interface HeadingBlock {
  type: "heading";
  content: string;
  level: 2 | 3 | 4;
}

export interface QuoteBlock {
  type: "quote";
  content: string;
  author?: string;
}

export type ContentBlock = ParagraphBlock | ImageBlock | HeadingBlock | QuoteBlock;

// ─── Pagination Types ──────────────────────────────────

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── API Response Types ────────────────────────────────

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

// ─── Cloudinary Types ──────────────────────────────────

export interface CloudinaryUploadParams {
  signature: string;
  timestamp: number;
  folder: string;
  cloud_name: string;
  api_key: string;
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type: string;
  bytes: number;
  width?: number;
  height?: number;
}

// ─── Dashboard Stats ───────────────────────────────────

export interface DashboardStats {
  totalPackages: number;
  totalDestinations: number;
  totalBlogs: number;
  totalLeads: number;
  leadsByStatus: {
    NEW: number;
    CONTACTED: number;
    CONFIRMED: number;
    REJECTED: number;
  };
  recentLeads: Array<{
    id: string;
    name: string;
    phone: string;
    status: string;
    createdAt: Date;
    packageTitle?: string;
  }>;
  leadsOverTime: Array<{
    date: string;
    count: number;
  }>;
}
