import FaqConsole from "@/components/admin/faqs/FaqConsole";
import QueryProvider from "@/components/shared/QueryProvider";

export const metadata = {
  title: "Global FAQs | Admin — Matka Trails",
  description: "Manage global questions and answers displayed on the destinations page.",
};

export default function AdminFaqsPage() {
  return (
    <QueryProvider>
      <FaqConsole />
    </QueryProvider>
  );
}
