import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getOptimizedImageUrl, formatDate } from "@/lib/utils";
import { Compass, Calendar, BookOpen, MoveRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Matka Trails Travel Blog — Stories & Guides",
  description: "Read trekking guides, altitude tips, river rafting safety checklists, and stories from solo travelers on our weekend trails.",
};

async function getBlogs(tag?: string) {
  return await prisma.blog.findMany({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
      ...(tag ? { tags: { has: tag } } : {}),
    },
    include: {
      author: {
        select: { name: true, avatar: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams;
  const blogs = await getBlogs(tag);

  const featuredPost = blogs[0];
  const regularPosts = blogs.slice(1);

  // Extract all unique tags from published blogs
  const allBlogsForTags = await prisma.blog.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    select: { tags: true },
  });
  const uniqueTags = Array.from(new Set(allBlogsForTags.flatMap((b) => b.tags || [])));

  return (
    <div className="w-full bg-gray-bg min-h-screen pb-24">
      {/* Banner */}
      <div className="relative w-full h-[240px] bg-black overflow-hidden flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=1200"
            alt="Camping in Kasol"
            fill
            className="object-cover opacity-45"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="space-y-2 text-white">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>THE TRAIL LOGS</span>
            </span>
            <h1 className="font-sans font-black italic text-4xl lg:text-5xl uppercase leading-none tracking-tight">
              Travel <span className="text-primary italic">Stories.</span>
            </h1>
            <p className="text-xs lg:text-sm text-white/60 leading-relaxed font-semibold max-w-md">
              Guides, gear lists, fitness maps, and reflections written by our group captains and solo travelers.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-12 grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Left Column: Blog list */}
        <div className="lg:col-span-3 space-y-12">
          
          {/* Featured Post Card (only when no tag filter is active) */}
          {!tag && featuredPost && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-dark uppercase tracking-widest leading-none">
                Featured Story
              </h3>
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group flex flex-col md:flex-row bg-white border border-gray-border rounded-2xl overflow-hidden shadow-card hover:border-primary/20 transition-all duration-300 h-auto md:h-[320px]"
              >
                {/* Image */}
                <div className="relative w-full md:w-1/2 h-[200px] md:h-full bg-gray-bg overflow-hidden shrink-0">
                  {featuredPost.coverImage && (
                    <Image
                      src={getOptimizedImageUrl(featuredPost.coverImage, 800)}
                      alt={featuredPost.title}
                      fill
                      className="object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                  )}
                </div>
                {/* Body */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="bg-primary-light text-primary text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded">
                      {featuredPost.tags[0] || "Featured"}
                    </span>
                    <h2 className="font-sans font-extrabold text-xl lg:text-2xl text-black group-hover:text-primary transition-colors leading-tight">
                      {featuredPost.title}
                    </h2>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-border text-[10px] text-gray-light font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>{formatDate(featuredPost.createdAt)}</span>
                    </div>
                    <span className="text-primary flex items-center gap-1">
                      <span>Read Story</span>
                      <MoveRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Regular Posts Grid */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-gray-dark uppercase tracking-widest leading-none">
              {tag ? `Stories tagged with #${tag}` : "All Articles"}
            </h3>

            {blogs.length === 0 ? (
              <div className="text-center py-16 bg-white border border-gray-border rounded-2xl">
                <p className="text-xs text-gray-light font-semibold italic">No articles found matching filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {(tag ? blogs : regularPosts).map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.slug}`}
                    className="group flex flex-col bg-white border border-gray-border hover:border-primary/20 hover:shadow-card hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden h-[360px]"
                  >
                    {/* Image */}
                    <div className="h-[180px] relative overflow-hidden bg-gray-bg shrink-0">
                      {blog.coverImage && (
                        <Image
                          src={getOptimizedImageUrl(blog.coverImage, 600)}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-[#111111]/80 backdrop-blur-sm text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded">
                          {blog.tags[0]}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4 text-[10px] text-gray-light font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            <span>{formatDate(blog.createdAt)}</span>
                          </span>
                        </div>
                        <h3 className="font-sans font-extrabold text-sm lg:text-base text-black group-hover:text-primary transition-colors leading-snug line-clamp-3">
                          {blog.title}
                        </h3>
                      </div>

                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                        <span>Read Story</span>
                        <MoveRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Tags Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-card space-y-4">
            <h4 className="font-sans font-bold text-sm text-black flex items-center gap-2">
              <Compass className="w-4.5 h-4.5 text-primary" />
              <span>Filter by Tags</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/blog"
                className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md border transition-all ${
                  !tag
                    ? "bg-primary border-primary text-white"
                    : "bg-gray-bg border-gray-border text-gray-dark hover:bg-gray-border"
                }`}
              >
                All Stories
              </Link>
              {uniqueTags.map((t) => (
                <Link
                  key={t}
                  href={`/blog?tag=${t}`}
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md border transition-all ${
                    tag === t
                      ? "bg-primary border-primary text-white"
                      : "bg-gray-bg border-gray-border text-gray-dark hover:bg-gray-border"
                  }`}
                >
                  #{t}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
