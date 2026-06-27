import { Package, Destination, Blog, Lead } from "@/app/generated/prisma/client";

// Define custom types extending Prisma types where relationships are populated.
export interface PublicDestination extends Destination {
  _count?: {
    packages: number;
  };
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
  packageId?: string;
  groupSize?: number;
  preferredDate?: string;
  message?: string;
  source?: "WEBSITE_FORM" | "PACKAGE_BOOKING";
}

export interface PackagesFilterParams {
  destinationId?: string;
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

/**
 * Public facing API requests.
 */
export const publicApi = {
  async getDestinations(): Promise<PublicDestination[]> {
    const res = await fetch("/api/public/destinations");
    if (!res.ok) throw new Error("Failed to fetch destinations");
    const json = await res.json();
    return json.data || [];
  },

  async getDestinationBySlug(slug: string): Promise<Destination & { gallery: any[] }> {
    const res = await fetch(`/api/public/destinations/${slug}`);
    if (!res.ok) throw new Error("Failed to fetch destination details");
    const json = await res.json();
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
    const res = await fetch(`/api/public/packages?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch packages");
    const json = await res.json();
    return {
      packages: json.data?.items || [],
      total: json.data?.total || 0,
    };
  },

  async getPackageBySlug(slug: string): Promise<PublicPackage> {
    const res = await fetch(`/api/public/packages/${slug}`);
    if (!res.ok) throw new Error("Failed to fetch package details");
    const json = await res.json();
    return json.data;
  },

  async getBlogs(params?: { tag?: string; limit?: number }): Promise<PublicBlog[]> {
    const query = new URLSearchParams();
    if (params?.tag) query.append("tag", params.tag);
    if (params?.limit) query.append("limit", String(params.limit));
    const res = await fetch(`/api/public/blogs?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch blogs");
    const json = await res.json();
    return json.data || [];
  },

  async getBlogBySlug(slug: string): Promise<PublicBlog> {
    const res = await fetch(`/api/public/blogs/${slug}`);
    if (!res.ok) throw new Error("Failed to fetch blog post");
    const json = await res.json();
    return json.data;
  },

  async submitLead(data: LeadSubmission): Promise<{ success: boolean; message: string }> {
    const res = await fetch("/api/public/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || "Failed to submit request");
    return { success: true, message: json.message };
  },

  async getGalleryItems(): Promise<GalleryItem[]> {
    const res = await fetch("/api/public/gallery");
    if (!res.ok) throw new Error("Failed to fetch gallery items");
    const json = await res.json();
    return json.data || [];
  },

  async getVideoTestimonials(): Promise<VideoTestimonial[]> {
    const res = await fetch("/api/public/testimonials");
    if (!res.ok) throw new Error("Failed to fetch testimonials");
    const json = await res.json();
    return json.data || [];
  },
};

/**
 * Admin Panel API requests.
 */
export const adminApi = {
  async getDashboardStats() {
    const res = await fetch("/api/admin/dashboard");
    if (!res.ok) throw new Error("Failed to fetch dashboard statistics");
    return (await res.json()).data;
  },

  async getLeads(params?: { status?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.search) query.append("search", params.search);
    const res = await fetch(`/api/admin/leads?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch leads");
    const json = await res.json();
    return json.data?.items || [];
  },

  async updateLead(id: string, data: { status: string; adminNotes?: string }) {
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update lead");
    return (await res.json()).data;
  },

  async getPackages() {
    const res = await fetch("/api/admin/packages");
    if (!res.ok) throw new Error("Failed to fetch admin packages");
    const json = await res.json();
    return json.data?.items || [];
  },

  async deletePackage(id: string) {
    const res = await fetch(`/api/admin/packages/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete package");
    return await res.json();
  },

  async getDestinations() {
    const res = await fetch("/api/admin/destinations");
    if (!res.ok) throw new Error("Failed to fetch destinations");
    const json = await res.json();
    return json.data?.items || [];
  },

  async createDestination(data: any) {
    const res = await fetch("/api/admin/destinations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || "Failed to create destination");
    return json.data;
  },

  async updateDestination(id: string, data: any) {
    const res = await fetch(`/api/admin/destinations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || "Failed to update destination");
    return json.data;
  },

  async deleteDestination(id: string) {
    const res = await fetch(`/api/admin/destinations/${id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || "Failed to delete destination");
    return json;
  },

  async createBlog(data: any) {
    const res = await fetch("/api/admin/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || "Failed to create blog");
    return json.data;
  },

  async updateBlog(id: string, data: any) {
    const res = await fetch(`/api/admin/blogs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || "Failed to update blog");
    return json.data;
  },

  async deleteBlog(id: string) {
    const res = await fetch(`/api/admin/blogs/${id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || "Failed to delete blog");
    return json;
  },

  async getGalleryItems() {
    const res = await fetch("/api/admin/gallery");
    if (!res.ok) throw new Error("Failed to fetch admin gallery items");
    const json = await res.json();
    return json.data?.items || [];
  },

  async createGalleryItem(data: any) {
    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || "Failed to create gallery item");
    return json.data;
  },

  async deleteGalleryItem(id: string) {
    const res = await fetch(`/api/admin/gallery/${id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || "Failed to delete gallery item");
    return json;
  },

  async getVideoTestimonials() {
    const res = await fetch("/api/admin/testimonials");
    if (!res.ok) throw new Error("Failed to fetch video testimonials");
    const json = await res.json();
    return json.data?.items || [];
  },

  async createVideoTestimonial(data: any) {
    const res = await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || "Failed to create testimonial");
    return json.data;
  },

  async deleteVideoTestimonial(id: string) {
    const res = await fetch(`/api/admin/testimonials/${id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || "Failed to delete testimonial");
    return json;
  },

  async getUploadSignature(folder: string) {
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder }),
    });
    if (!res.ok) throw new Error("Failed to get upload signature");
    return (await res.json()).data;
  },
};
