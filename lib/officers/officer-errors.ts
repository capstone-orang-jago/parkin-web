/**
 * Memetakan error mentah dari backend/database saat membuat petugas menjadi
 * pesan ramah berbahasa Indonesia untuk ditampilkan di form.
 *
 * Pure function tanpa import server, supaya bisa diuji langsung.
 * Dipakai oleh createOfficer: error dari server action TIDAK boleh di-throw
 * (Next.js menyensor pesan error server action di production, sehingga modal
 * hanya menampilkan pesan generik "An error occurred in the Server
 * Components render").
 */
export function mapCreateOfficerError(err: unknown): string {
	const raw = err instanceof Error ? err.message : "";
	if (raw.includes("users_telephone_key")) {
		return "Nomor telepon sudah dipakai, gunakan nomor lain.";
	}
	if (raw.toLowerCase().includes("duplicate key")) {
		return "Email atau nomor telepon sudah terdaftar.";
	}
	return "Gagal memproses petugas.";
}
