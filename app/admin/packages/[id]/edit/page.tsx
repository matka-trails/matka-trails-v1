import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PackageForm from "@/components/admin/packages/PackageForm";
import QueryProvider from "@/components/shared/QueryProvider";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit Trail Route — Matka Trails",
};

async function getPackageData(id: string) {
  const pkg = await prisma.package.findUnique({
    where: { id, deletedAt: null },
    include: {
      itinerary: {
        orderBy: { dayNumber: "asc" },
      },
    },
  });

  return pkg;
}

export default async function EditPackagePage({ params }: PageProps) {
  const { id } = await params;
  const pkg = await getPackageData(id);

  if (!pkg) {
    notFound();
  }

  return (
    <QueryProvider>
      <PackageForm initialData={pkg} />
    </QueryProvider>
  );
}
