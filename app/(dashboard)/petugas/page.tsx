import type { Metadata } from "next";
import { OfficerSectionClient } from "@/components/officers/officer-section-client";
import { getOfficerList } from "@/lib/officers/get-officers";

export const metadata: Metadata = {
  title: "Petugas",
};

export default async function PetugasListPage() {
  const rows = await getOfficerList();

  return <OfficerSectionClient rows={rows} />;
}
