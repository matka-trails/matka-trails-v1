import { getSession } from "next-auth/react";

// ─── TypeScript Interfaces (Decoupled from Prisma) ──────────────────────────

export interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  isFeatured: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  sortOrder: number;
  guidelines: string[];
  notes: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Package {
  id: string;
  title: string;
  slug: string;
  destinationId: string;
  summary: string | null;
  description: string | null;
  durationDays: number;
  durationNights: number;
  priceOriginal: number;
  priceDiscounted: number | null;
  pdfUrl: string | null;
  coverImage: string | null;
  galleryImages: string[];
  inclusions: string[];
  exclusions: string[];
  notes: string | null;
  status: "DRAFT" | "PUBLISHED";
  groupType: "CORPORATE" | "SOLO_GROUP" | "CUSTOM";
  isFeatured: boolean;
  startDate: string | Date | null;
  endDate: string | Date | null;
  maxGroupSize: number | null;
  currentBookings: number;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  contentBlocks: any;
  tags: string[];
  status: "DRAFT" | "PUBLISHED";
  authorId: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  alternatePhone: string | null;
  city: string | null;
  company: string | null;
  packageId: string | null;
  groupSize: number | null;
  preferredDate: string | null;
  message: string | null;
  status: "NEW" | "CONTACTED" | "CONFIRMED" | "REJECTED";
  source: "WEBSITE_FORM" | "PACKAGE_BOOKING";
  adminNotes: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface PublicDestination extends Destination {
  _count?: {
    packages: number;
  };
  packageCount?: number;
}

export interface PublicPackage extends Package {
  destination: Destination;
  itinerary: Array<{
    id: string;
    dayNumber: number;
    title: string;
    description: string | null;
    images: string[];
  }>;
  reviews: Array<{
    id: string;
    customerName: string;
    rating: number;
    reviewText: string | null;
    reviewImages: string[];
    createdAt: string | Date;
  }>;
  testimonials: Array<{
    id: string;
    videoUrl: string;
    customerName: string;
    thumbnail: string | null;
  }>;
  faqs: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
}

export interface PublicBlog extends Blog {
  author?: {
    name: string;
    avatar: string | null;
  } | null;
  faqs?: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  placeName: string;
  caption?: string | null;
  sortOrder: number;
}

export interface VideoTestimonial {
  id: string;
  videoUrl: string;
  title: string;
  thumbnail?: string | null;
  sortOrder: number;
}

export interface LeadSubmission {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  packageId?: string;
  groupSize?: number;
  preferredDate?: string;
  message?: string;
  source?: "WEBSITE_FORM" | "PACKAGE_BOOKING";
  age?: number;
  gender?: string;
}

export interface PackagesFilterParams {
  destinationId?: string;
  destination?: string; // slug
  durationDays?: string;
  minPrice?: number;
  maxPrice?: number;
  groupType?: string;
  status?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

// ─── API Setup ────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// Helper to get headers with JWT token from the NextAuth session
async function getAuthHeaders() {
  const session = await getSession();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (session && (session as any).accessToken) {
    headers["Authorization"] = `Bearer ${(session as any).accessToken}`;
  }
  return headers;
}

// Helper to handle response and throw descriptive error messages
async function handleResponse(res: Response) {
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error?.message || "An error occurred on the server");
  }
  return json;
}

export interface HeroCarouselSlide {
  _id: string;
  imageUrl: string;
  destinationId: string | null;
  destination?: { id: string; name: string; slug: string } | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string | Date;
}

export interface HeroDesktopCard {
  _id: string;
  imageUrl: string;
  destinationName: string | null;
  sortOrder: number;
}

export interface HeroConfig {
  _id: string;
  desktopBgImage: string | null;
  desktopDynamicWords: string[];
  desktopCards: HeroDesktopCard[];
  mobileCarouselSlides: HeroCarouselSlide[];
  updatedAt: string | Date;
}

export interface TextTestimonial {
  id: string;
  _id?: string;
  name: string;
  stars: number;
  message: string;
  sortOrder: number;
  createdAt: string;
}

/**
 * Public facing API requests.
 */
export const publicApi = {
  async getHeroConfig(): Promise<HeroConfig> {
    const res = await fetch(`${BASE_URL}/api/public/hero`);
    const json = await handleResponse(res);
    return json.data;
  },

  async getTextTestimonials(): Promise<TextTestimonial[]> {
    const res = await fetch(`${BASE_URL}/api/public/text-testimonials`);
    const json = await handleResponse(res);
    return json.data || [];
  },

  async getDestinations(): Promise<PublicDestination[]> {
    const res = await fetch(`${BASE_URL}/api/public/destinations`);
    const json = await handleResponse(res);
    return json.data || [];
  },

  async getDestinationBySlug(slug: string): Promise<Destination & {
    gallery: any[];
    packages: any[];
    faqs: any[];
    testimonials: any[];
    guidelines: string[];
    notes: string | null;
  }> {
    const res = await fetch(`${BASE_URL}/api/public/destinations/${slug}`);
    const json = await handleResponse(res);
    return json.data;
  },

  async getPackages(params?: PackagesFilterParams): Promise<{ packages: PublicPackage[]; total: number }> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
          query.append(key, String(val));
        }
      });
    }
    const res = await fetch(`${BASE_URL}/api/public/packages?${query.toString()}`);
    const json = await handleResponse(res);
    return {
      packages: json.data?.items || [],
      total: json.data?.total || 0,
    };
  },

  async getPackageBySlug(slug: string): Promise<PublicPackage> {
    const res = await fetch(`${BASE_URL}/api/public/packages/${slug}`);
    const json = await handleResponse(res);
    return json.data;
  },

  async getBlogs(params?: { tag?: string; limit?: number }): Promise<PublicBlog[]> {
    const query = new URLSearchParams();
    if (params?.tag) query.append("tag", params.tag);
    if (params?.limit) query.append("limit", String(params.limit));
    const res = await fetch(`${BASE_URL}/api/public/blogs?${query.toString()}`);
    const json = await handleResponse(res);
    return json.data?.items || [];
  },

  async getBlogBySlug(slug: string): Promise<PublicBlog> {
    const res = await fetch(`${BASE_URL}/api/public/blogs/${slug}`);
    const json = await handleResponse(res);
    return json.data;
  },

  async submitLead(data: LeadSubmission): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/api/public/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await handleResponse(res);
    return { success: true, message: json.data.message };
  },

  async getGalleryItems(): Promise<GalleryItem[]> {
    const res = await fetch(`${BASE_URL}/api/public/gallery`);
    const json = await handleResponse(res);
    return json.data || [];
  },

  async getVideoTestimonials(): Promise<VideoTestimonial[]> {
    const res = await fetch(`${BASE_URL}/api/public/testimonials`);
    const json = await handleResponse(res);
    return json.data || [];
  },

  async getFaqs(params?: { isGlobal?: boolean; packageId?: string; blogId?: string }): Promise<any[]> {
    const query = new URLSearchParams();
    if (params?.isGlobal !== undefined) query.append("isGlobal", String(params.isGlobal));
    if (params?.packageId) query.append("packageId", params.packageId);
    if (params?.blogId) query.append("blogId", params.blogId);
    const res = await fetch(`${BASE_URL}/api/public/faqs?${query.toString()}`);
    const json = await handleResponse(res);
    return json.data || [];
  },
};

/**
 * Admin Panel API requests.
 */
export const adminApi = {
  async getDashboardStats() {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/dashboard`, { headers });
    return (await handleResponse(res)).data;
  },

  async getLeads(params?: { status?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.search) query.append("search", params.search);
    
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/leads?${query.toString()}`, { headers });
    const json = await handleResponse(res);
    return json.data?.items || [];
  },

  async updateLead(id: string, data: { status: string; adminNotes?: string }) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/leads/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });
    return (await handleResponse(res)).data;
  },

  async getPackages() {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/packages`, { headers });
    const json = await handleResponse(res);
    return json.data?.items || [];
  },

  async getPackageById(id: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/packages/${id}`, { headers });
    return (await handleResponse(res)).data;
  },

  async createPackage(data: any) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/packages`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return (await handleResponse(res)).data;
  },

  async updatePackage(id: string, data: any) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/packages/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });
    return (await handleResponse(res)).data;
  },

  async deletePackage(id: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/packages/${id}`, {
      method: "DELETE",
      headers,
    });
    return await handleResponse(res);
  },

  async getDestinations() {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/destinations`, { headers });
    const json = await handleResponse(res);
    return json.data?.items || [];
  },

  async createDestination(data: any) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/destinations`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return (await handleResponse(res)).data;
  },

  async updateDestination(id: string, data: any) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/destinations/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });
    return (await handleResponse(res)).data;
  },

  async deleteDestination(id: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/destinations/${id}`, {
      method: "DELETE",
      headers,
    });
    return await handleResponse(res);
  },

  // ── Destination Gallery ──────────────────────────────────────────────────
  async getDestinationGallery(id: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/destinations/${id}/gallery`, { headers });
    return (await handleResponse(res)).data || [];
  },

  async addDestinationGalleryImage(id: string, data: { imageUrl: string; caption?: string; sortOrder?: number }) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/destinations/${id}/gallery`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return (await handleResponse(res)).data;
  },

  async removeDestinationGalleryImage(id: string, imageId: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/destinations/${id}/gallery/${imageId}`, {
      method: "DELETE",
      headers,
    });
    return await handleResponse(res);
  },

  // ── Destination FAQs ─────────────────────────────────────────────────────
  async getDestinationFaqs(destinationId: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/faqs?destinationId=${destinationId}`, { headers });
    const json = await handleResponse(res);
    // Returns plain array (no pagination when no page/limit params)
    return Array.isArray(json.data) ? json.data : json.data?.items ?? [];
  },

  async createDestinationFaq(data: { destinationId: string; question: string; answer: string; sortOrder?: number }) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/faqs`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return (await handleResponse(res)).data;
  },

  // ── Destination Video Testimonials ───────────────────────────────────────
  async getDestinationVideos(destinationId: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/testimonials?destinationId=${destinationId}`, { headers });
    const json = await handleResponse(res);
    // Admin testimonials endpoint returns paginated { items, total, page, limit }
    return json.data?.items ?? json.data ?? [];
  },

  async createDestinationVideo(data: { destinationId: string; videoUrl: string; title: string; thumbnail?: string; sortOrder?: number }) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/testimonials`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return (await handleResponse(res)).data;
  },

  async getBlogs() {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/blogs`, { headers });
    const json = await handleResponse(res);
    return json.data?.items || [];
  },

  async getBlogById(id: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/blogs/${id}`, { headers });
    return (await handleResponse(res)).data;
  },

  async createBlog(data: any) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/blogs`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return (await handleResponse(res)).data;
  },

  async updateBlog(id: string, data: any) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/blogs/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });
    return (await handleResponse(res)).data;
  },

  async deleteBlog(id: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/blogs/${id}`, {
      method: "DELETE",
      headers,
    });
    return await handleResponse(res);
  },

  async getGalleryItems() {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/gallery`, { headers });
    const json = await handleResponse(res);
    return json.data?.items || [];
  },

  async createGalleryItem(data: any) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/gallery`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return (await handleResponse(res)).data;
  },

  async deleteGalleryItem(id: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/gallery/${id}`, {
      method: "DELETE",
      headers,
    });
    return await handleResponse(res);
  },

  async getVideoTestimonials() {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/testimonials`, { headers });
    const json = await handleResponse(res);
    return json.data?.items || [];
  },

  async createVideoTestimonial(data: any) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/testimonials`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return (await handleResponse(res)).data;
  },

  async deleteVideoTestimonial(id: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/testimonials/${id}`, {
      method: "DELETE",
      headers,
    });
    return await handleResponse(res);
  },

  async getUploadSignature(folder: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/upload`, {
      method: "POST",
      headers,
      body: JSON.stringify({ folder }),
    });
    return (await handleResponse(res)).data;
  },

  async getAdmins() {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/accounts`, { headers });
    const json = await handleResponse(res);
    return json.data || [];
  },

  async createAdmin(data: any) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/accounts`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return (await handleResponse(res)).data;
  },

  async getHeroConfig(): Promise<HeroConfig> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/hero`, { headers });
    return (await handleResponse(res)).data;
  },

  async updateHeroConfig(data: {
    desktopBgImage?: string | null;
    desktopDynamicWords?: string[];
    desktopCards?: Array<{ imageUrl: string; destinationName?: string | null; sortOrder?: number }>;
  }): Promise<HeroConfig> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/hero`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });
    return (await handleResponse(res)).data;
  },

  async addHeroSlide(data: {
    imageUrl: string;
    destinationId?: string | null;
    sortOrder?: number;
    isActive?: boolean;
  }): Promise<HeroConfig> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/hero/slides`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return (await handleResponse(res)).data;
  },

  async updateHeroSlide(slideId: string, data: {
    imageUrl?: string;
    destinationId?: string | null;
    sortOrder?: number;
    isActive?: boolean;
  }): Promise<HeroConfig> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/hero/slides/${slideId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });
    return (await handleResponse(res)).data;
  },

  async deleteHeroSlide(slideId: string): Promise<void> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/hero/slides/${slideId}`, {
      method: "DELETE",
      headers,
    });
    await handleResponse(res);
  },

  async getTextTestimonials(params?: { page?: number; limit?: number }): Promise<{ items: TextTestimonial[]; total: number; page: number; limit: number }> {
    const headers = await getAuthHeaders();
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${BASE_URL}/api/admin/text-testimonials?${query}`, { headers });
    const json = await handleResponse(res);
    return json.data || { items: [], total: 0, page: 1, limit: 10 };
  },

  async createTextTestimonial(data: { name: string; stars: number; message: string; sortOrder?: number }): Promise<TextTestimonial> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/text-testimonials`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    const json = await handleResponse(res);
    return json.data;
  },

  async updateTextTestimonial(id: string, data: Partial<TextTestimonial>): Promise<TextTestimonial> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/text-testimonials/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });
    const json = await handleResponse(res);
    return json.data;
  },

  async deleteTextTestimonial(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/text-testimonials/${id}`, {
      method: "DELETE",
      headers,
    });
    await handleResponse(res);
  },

  async getFaqs(params?: { isGlobal?: boolean; packageId?: string; blogId?: string; page?: number; limit?: number }) {
    const headers = await getAuthHeaders();
    const query = new URLSearchParams();
    if (params?.isGlobal !== undefined) query.append("isGlobal", String(params.isGlobal));
    if (params?.packageId) query.append("packageId", params.packageId);
    if (params?.blogId) query.append("blogId", params.blogId);
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    const res = await fetch(`${BASE_URL}/api/admin/faqs?${query.toString()}`, { headers });
    const json = await handleResponse(res);
    return json.data || { items: [], total: 0, page: 1, limit: 10 };
  },

  async createFaq(data: { question: string; answer: string; isGlobal?: boolean; blogId?: string; packageId?: string; sortOrder?: number }) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/faqs`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return (await handleResponse(res)).data;
  },

  async updateFaq(id: string, data: Partial<{ question: string; answer: string; isGlobal?: boolean; blogId?: string; packageId?: string; sortOrder?: number }>) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/faqs/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    return (await handleResponse(res)).data;
  },

  async deleteFaq(id: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/api/admin/faqs/${id}`, {
      method: "DELETE",
      headers,
    });
    return await handleResponse(res);
  },
};

