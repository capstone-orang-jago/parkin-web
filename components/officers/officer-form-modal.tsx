import { useState } from "react";
import type { OfficerFormValues } from "@/lib/officers/post-officers";

type Props = {
	open: boolean;
	initialValues: OfficerFormValues;
	onClose: () => void;
	onSubmit: (values: OfficerFormValues) => Promise<void>;
};

function FormContent({
	initialValues,
	onClose,
	onSubmit,
}: Omit<Props, "open">) {
	const [values, setValues] = useState<OfficerFormValues>(initialValues);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			await onSubmit(values);
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Gagal menyimpan petugas.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="w-full max-w-lg rounded-xl bg-(--color-surface-card) p-6 shadow-xl">
			<h3 className="text-lg font-bold text-(--color-text)">Tambah Petugas</h3>

			<form className="mt-4 space-y-4" onSubmit={handleSubmit}>
				{error ? (
					<p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
						{error}
					</p>
				) : null}

				<div>
					<label className="block text-sm font-medium text-(--color-text)">Nama lengkap</label>
					<input
						required
						className="mt-1 w-full rounded-md border border-(--color-border) bg-(--color-surface-2) px-3 py-2 text-(--color-text)"
						value={values.name}
						onChange={(e) => setValues({ ...values, name: e.target.value })}
						placeholder="Masukkan nama petugas"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-(--color-text)">Email</label>
					<input
						required
						type="email"
						className="mt-1 w-full rounded-md border border-(--color-border) bg-(--color-surface-2) px-3 py-2 text-(--color-text)"
						value={values.email}
						onChange={(e) => setValues({ ...values, email: e.target.value })}
						placeholder="contoh@email.com"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-(--color-text)">Nomor telepon</label>
					<input
						required
						type="tel"
						className="mt-1 w-full rounded-md border border-(--color-border) bg-(--color-surface-2) px-3 py-2 text-(--color-text)"
						value={values.telephone}
						onChange={(e) => setValues({ ...values, telephone: e.target.value })}
						placeholder="08xxxxxxxxxx"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-(--color-text)">Password</label>
					<input
						required
						type="password"
						minLength={6}
						className="mt-1 w-full rounded-md border border-(--color-border) bg-(--color-surface-2) px-3 py-2 text-(--color-text)"
						value={values.password}
						onChange={(e) => setValues({ ...values, password: e.target.value })}
						placeholder="Minimal 6 karakter"
					/>
				</div>

				<div className="flex justify-end gap-2 pt-2">
					<button
						type="button"
						onClick={onClose}
						className="rounded-md border border-(--color-border) px-4 py-2 text-sm text-(--color-text) hover:bg-(--color-surface-offset)"
					>
						Batal
					</button>
					<button
						type="submit"
						disabled={loading}
						className="rounded-md bg-bomba-500 px-4 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-60"
					>
						{loading ? "Menyimpan..." : "Simpan"}
					</button>
				</div>
			</form>
		</div>
	);
}

export function OfficerFormModal({
	open,
	initialValues,
	onClose,
	onSubmit,
}: Props) {
	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
			<FormContent
				key={initialValues.name}
				initialValues={initialValues}
				onClose={onClose}
				onSubmit={onSubmit}
			/>
		</div>
	);
}
