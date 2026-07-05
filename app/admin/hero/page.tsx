import HeroConfigEditor from "@/components/admin/HeroConfigEditor";
import QueryProvider from "@/components/shared/QueryProvider";

export const metadata = {
  title: "Hero Settings | Admin — Matka Trails",
  description: "Configure the homepage hero section content, carousel slides, and desktop background.",
};

export default function AdminHeroPage() {
  return (
    <QueryProvider>
      <HeroConfigEditor />
    </QueryProvider>
  );
}
