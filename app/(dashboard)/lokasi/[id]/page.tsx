import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocationDetailView } from "@/components/locations/location-detail-view";
import { PageBreadcrumb } from "@/components/shell/page-breadcrumb";
import { getLocationById } from "@/lib/locations/get-locations";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const loc = await getLocationById(id);
  return {
    title: loc ? loc.name : "Lokasi Parkir",
  };
}

export default async function LokasiDetailPage({ params }: Props) {
  const { id } = await params;
  const location = await getLocationById(id);
  if (!location) {
    notFound();
  }

  return (
    <section>
      <PageBreadcrumb
        items={[
          { label: "Lokasi Parkir", href: "/lokasi" },
          { label: location.name },
        ]}
      />
      <LocationDetailView location={location} />
    </section>
  );
}
