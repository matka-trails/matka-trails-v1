import DashboardConsole from "@/components/admin/dashboard/DashboardConsole";
import QueryProvider from "@/components/shared/QueryProvider";

export const metadata = {
  title: "Admin Dashboard Console — Matka Trails",
};

export default function AdminDashboardPage() {
  return (
    <QueryProvider>
      <DashboardConsole />
    </QueryProvider>
  );
}
