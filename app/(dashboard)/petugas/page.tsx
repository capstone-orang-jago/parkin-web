import type { Metadata } from "next";
import { OfficerTable } from "@/components/officers/officer-table";
import { getOfficerList } from "@/lib/officers/get-officers";

export const metadata: Metadata = {
  title: "Petugas",
};

export default async function PetugasListPage() {
  const rows = await getOfficerList();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-(--color-text)">Petugas</h2>
          <p className="mt-1 text-sm text-(--color-text-muted)">
            Kelola akun petugas lapangan dan penugasan lokasi.
          </p>
        </div>
        <button
          type="button"
          disabled
          title="Menyusul integrasi API"
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-bomba-500 px-4 text-sm font-medium text-white opacity-60 shadow-sm"
        >
          Tambah Petugas
        </button>
      </header>

      <OfficerTable rows={rows} />
    </div>
  );
}
