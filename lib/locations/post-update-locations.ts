"use server";

import { cookies } from "next/headers";
import { ACCESS_COOKIE } from "@/lib/auth/cookies";
import type { LocationFormValues } from "@/components/locations/location-form-modal";

async function callBackend(
	path: string,
	method: "POST" | "PUT" | "DELETE",
	body?: unknown,
) {
	const baseUrl = process.env.API_BASE_URL?.replace(/\/$/, "");
	if (!baseUrl) throw new Error("API_BASE_URL belum disetel.");

	const token = (await cookies()).get(ACCESS_COOKIE)?.value;
	if (!token) throw new Error("Sesi login tidak ditemukan.");

	const res = await fetch(baseUrl + path, {
		method,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: body !== undefined ? JSON.stringify(body) : undefined,
		cache: "no-store",
	});

	if (!res.ok) {
		const payload = await res.json().catch(() => null);
		const msg =
			payload && typeof payload === "object" && "message" in payload
				? String((payload as { message?: unknown }).message ?? "")
				: "";
		throw new Error(msg || "Gagal memproses lokasi.");
	}
}

export async function createLocation(values: LocationFormValues) {
	await callBackend("/admin/lokasi-parkir", "POST", values);
}

export async function updateLocation(id: string, values: LocationFormValues) {
	await callBackend(`/admin/lokasi-parkir/${id}`, "PUT", values);
}

export async function deleteLocation(id: string) {
	await callBackend(`/admin/lokasi-parkir/${id}`, "DELETE");
}
