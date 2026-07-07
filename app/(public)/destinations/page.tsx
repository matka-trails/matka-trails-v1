import { Metadata } from "next";
import { publicApi } from "@/lib/api";
import DestinationsClientPage from "@/components/public/destinations/DestinationsClientPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Explore Treks by Territories — Matka Trails",
  description: "Browse destinations including Kedarnath, Rishikesh, and Manali. Select your territory to find structured weekend packages.",
};

async function getDestinations() {
  try {
    return await publicApi.getDestinations();
  } catch (error) {
    console.error("Failed to fetch destinations:", error);
    return [];
  }
}

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return <DestinationsClientPage destinations={destinations} />;
}
