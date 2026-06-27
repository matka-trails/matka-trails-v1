import LeadsConsole from "@/components/admin/leads/LeadsConsole";
import QueryProvider from "@/components/shared/QueryProvider";

export const metadata = {
  title: "Admin Leads Pipeline — Matka Trails",
};

export default function AdminLeadsPage() {
  return (
    <QueryProvider>
      <LeadsConsole />
    </QueryProvider>
  );
}
