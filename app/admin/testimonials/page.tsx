import TestimonialConsole from "@/components/admin/testimonials/TestimonialConsole";
import QueryProvider from "@/components/shared/QueryProvider";

export const metadata = {
  title: "Traveler Reviews | Admin — Matka Trails",
  description: "Manage client testimonials and reviews shown on the home page.",
};

export default function AdminTestimonialsPage() {
  return (
    <QueryProvider>
      <TestimonialConsole />
    </QueryProvider>
  );
}
