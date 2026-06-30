"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { adminApi } from "@/lib/api";
import PackageForm from "@/components/admin/packages/PackageForm";
import QueryProvider from "@/components/shared/QueryProvider";

function EditPackageContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: pkg, isLoading, error } = useQuery({
    queryKey: ["admin-package", id],
    queryFn: () => adminApi.getPackageById(id),
    enabled: !!id,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-sm font-semibold text-gray-dark">Package not found.</p>
        <button
          onClick={() => router.push("/admin/packages")}
          className="text-xs font-bold text-primary uppercase tracking-widest underline"
        >
          ← Back to Packages
        </button>
      </div>
    );
  }

  return <PackageForm initialData={pkg} />;
}

export default function EditPackagePage() {
  return (
    <QueryProvider>
      <EditPackageContent />
    </QueryProvider>
  );
}
