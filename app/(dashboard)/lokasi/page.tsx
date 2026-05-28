import type { Metadata } from "next";
import { getLocationList } from "@/lib/locations/get-locations";
import { LocationSectionClient } from "@/components/locations/location-section-client";

export const metadata: Metadata = {
  title: "Lokasi Parkir",
};

export default async function LokasiListPage() {
  const rows = await getLocationList();

  return <LocationSectionClient rows={rows} />;
}