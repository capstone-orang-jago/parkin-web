import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OfficerDetailView } from "@/components/officers/officer-detail-view";
import { PageBreadcrumb } from "@/components/shell/page-breadcrumb";
import { getOfficerById } from "@/lib/officers/get-officers";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const officer = await getOfficerById(id);
  return {
    title: officer ? officer.fullName : "Petugas",
  };
}

export default async function PetugasDetailPage({ params }: Props) {
  const { id } = await params;
  const officer = await getOfficerById(id);
  if (!officer) {
    notFound();
  }

  return (
    <section>
      <PageBreadcrumb
        items={[{ label: "Petugas", href: "/petugas" }, { label: officer.fullName }]}
      />
      <OfficerDetailView officer={officer} />
    </section>
  );
}
