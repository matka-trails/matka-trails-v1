import PackagesConsole from "@/components/admin/packages/PackagesConsole";
import QueryProvider from "@/components/shared/QueryProvider";

export const metadata = {
  title: "Admin Packages Console — Matka Trails",
};

export default function AdminPackagesPage() {
  return (
    <QueryProvider>
      <PackagesConsole />
    </QueryProvider>
  );
}
