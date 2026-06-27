import PackageForm from "@/components/admin/packages/PackageForm";
import QueryProvider from "@/components/shared/QueryProvider";

export const metadata = {
  title: "Publish New Trail — Matka Trails",
};

export default function NewPackagePage() {
  return (
    <QueryProvider>
      <PackageForm />
    </QueryProvider>
  );
}
