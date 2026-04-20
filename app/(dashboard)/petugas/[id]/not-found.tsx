import Link from "next/link";

export default function PetugasNotFound() {
  return (
    <div className="rounded-lg border border-(--color-border) bg-(--color-surface-card) p-8 text-center">
      <h2 className="text-lg font-semibold text-(--color-text)">Petugas tidak ditemukan</h2>
      <p className="mt-2 text-sm text-(--color-text-muted)">
        Periksa tautan atau kembali ke daftar petugas.
      </p>
      <Link
        href="/petugas"
        className="mt-6 inline-flex rounded-md bg-bomba-500 px-4 py-2 text-sm font-medium text-white hover:bg-bomba-600"
      >
        Ke daftar petugas
      </Link>
    </div>
  );
}
