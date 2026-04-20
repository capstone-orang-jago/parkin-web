/** Judul topbar dari path — dipakai server (layout) dan client (AppTopbar). */
export function titleFromPathname(pathname: string): string {
  if (pathname === "/dashboard") return "Dashboard";
  if (pathname.startsWith("/transaksi")) return "Transaksi";
  if (pathname.startsWith("/lokasi")) return "Lokasi Parkir";
  if (pathname.startsWith("/petugas")) return "Petugas";
  if (pathname.startsWith("/laporan")) return "Laporan";
  return "ParkIn Palu";
}
