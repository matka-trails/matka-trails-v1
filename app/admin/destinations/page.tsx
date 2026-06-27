import DestinationsConsole from "@/components/admin/destinations/DestinationsConsole";
import QueryProvider from "@/components/shared/QueryProvider";

export const metadata = {
  title: "Admin Destinations — Matka Trails",
};

export default function AdminDestinationsPage() {
  return (
    <QueryProvider>
      <DestinationsConsole />
    </QueryProvider>
  );
}
