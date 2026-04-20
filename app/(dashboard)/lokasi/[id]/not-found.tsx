import Link from "next/link";

export default function LokasiNotFound() {
  return (
    <div className="rounded-lg border border-(--color-border) bg-(--color-surface-card) p-8 text-center">
      <h2 className="text-lg font-semibold text-(--color-text)">Lokasi tidak ditemukan</h2>
      <p className="mt-2 text-sm text-(--color-text-muted)">
        Periksa tautan atau kembali ke daftar lokasi.
      </p>
      <Link
        href="/lokasi"
        className="mt-6 inline-flex rounded-md bg-bomba-500 px-4 py-2 text-sm font-medium text-white hover:bg-bomba-600"
      >
        Ke daftar lokasi
      </Link>
    </div>
  );
}
