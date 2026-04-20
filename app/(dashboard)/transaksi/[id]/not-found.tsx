import Link from "next/link";

export default function TransaksiNotFound() {
  return (
    <div className="rounded-lg border border-megalit-200 bg-(--color-surface-card) p-8 text-center">
      <h2 className="text-lg font-semibold text-megalit-900">Transaksi tidak ditemukan</h2>
      <p className="mt-2 text-sm text-megalit-600">
        Periksa kode transaksi atau kembali ke daftar.
      </p>
      <Link
        href="/transaksi"
        className="mt-6 inline-flex rounded-md bg-bomba-500 px-4 py-2 text-sm font-medium text-white hover:bg-bomba-600"
      >
        Ke daftar transaksi
      </Link>
    </div>
  );
}
