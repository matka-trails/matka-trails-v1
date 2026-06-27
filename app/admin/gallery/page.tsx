import GalleryConsole from "@/components/admin/gallery/GalleryConsole";
import QueryProvider from "@/components/shared/QueryProvider";

export const metadata = {
  title: "Admin Gallery & Testimonials — Matka Trails",
};

export default function AdminGalleryPage() {
  return (
    <QueryProvider>
      <GalleryConsole />
    </QueryProvider>
  );
}
