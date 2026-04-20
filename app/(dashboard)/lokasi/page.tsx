import type { Metadata } from "next";
import { LocationTable } from "@/components/locations/location-table";
import { getLocationList } from "@/lib/locations/get-locations";

export const metadata: Metadata = {
  title: "Lokasi Parkir",
};

export default async function LokasiListPage() {
  const rows = await getLocationList();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-(--color-text)">Lokasi Parkir</h2>
          <p className="mt-1 text-sm text-(--color-text-muted)">
            Kelola titik parkir resmi dan penugasan petugas.
          </p>
        </div>
        <button
          type="button"
          disabled
          title="Menyusul integrasi API"
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-bomba-500 px-4 text-sm font-medium text-white opacity-60 shadow-sm"
        >
          Tambah Lokasi
        </button>
      </header>

      <LocationTable rows={rows} />
    </div>
  );
}
