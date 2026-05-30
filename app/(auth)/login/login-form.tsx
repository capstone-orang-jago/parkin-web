"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const reason = searchParams.get("reason");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	const sessionHint =
		reason === "session_expired"
			? "Sesi Anda berakhir. Silakan masuk lagi."
			: null;

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		startTransition(async () => {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ email, password }),
			});
			const data = (await res.json().catch(() => ({}))) as { error?: string };
			if (!res.ok) {
				setError(data.error ?? "Gagal masuk.");
				return;
			}
			router.push("/dashboard");
			router.refresh();
		});
	}

	return (
		<div className="w-full max-w-md rounded-lg border border-megalit-200 bg-(--color-surface-card) p-8 shadow-sm">
			<div className="mb-6 flex flex-col items-center gap-4 text-center">
				<Image
					src="/logo.svg"
					alt="Logo ParkIn Palu"
					width={88}
					height={88}
					priority
					className="h-20 w-20"
				/>
				<div>
					<h1 className="text-xl font-semibold text-megalit-900">Masuk admin</h1>
					<p className="mt-2 text-sm text-megalit-600">
						Gunakan email dan password akun admin ParkIn Palu.
					</p>
				</div>
			</div>
			{/* <div className="mb-4 flex items-center justify-center gap-4">
				<Image
					src="/dishub.svg"
					alt="Logo Dinas Perhubungan"
					width={70}
					height={70}
					loading="eager"
					className="h-17.5 w-auto"
				/>
				<Image
					src="/kota-palu.png"
					alt="Logo Kota Palu"
					width={70}
					height={70}
					loading="eager"
					className="h-17.5 w-auto"
				/>
			</div> */}
			{sessionHint ? (
				<p className="mt-3 rounded-md border border-megalit-300 bg-megalit-100 px-3 py-2 text-sm text-megalit-800">
					{sessionHint}
				</p>
			) : null}
			<form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-megalit-800"
					>
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						autoComplete="username"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="mt-1 w-full rounded-md border border-megalit-300 px-3 py-2 text-megalit-900 shadow-sm focus:border-bomba-500 focus:outline-none focus:ring-1 focus:ring-bomba-500"
					/>
				</div>
				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium text-megalit-800"
					>
						Password
					</label>
					<input
						id="password"
						name="password"
						type="password"
						autoComplete="current-password"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="mt-1 w-full rounded-md border border-megalit-300 px-3 py-2 text-megalit-900 shadow-sm focus:border-bomba-500 focus:outline-none focus:ring-1 focus:ring-bomba-500"
					/>
				</div>
				{error ? (
					<p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
						{error}
					</p>
				) : null}
				<button
					type="submit"
					disabled={isPending}
					className="rounded-md bg-bomba-500 px-4 py-2 text-sm font-semibold text-white hover:bg-bomba-600 disabled:opacity-60"
				>
					{isPending ? "Memproses…" : "Masuk"}
				</button>
			</form>
		</div>
	);
}
