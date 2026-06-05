"use server";

import { callBackend } from "@/lib/api/call-backend";
import type { LocationFormValues } from "@/components/locations/location-form-modal";

export async function createLocation(values: LocationFormValues) {
	await callBackend("/admin/lokasi-parkir", "POST", {
		...values,
		is_active: true,
	}, "Gagal memproses lokasi.");
}

export async function updateLocation(id: string, values: LocationFormValues) {
	await callBackend(`/admin/lokasi-parkir/${id}`, "PUT", {
		...values,
		is_active: values.is_active,
	}, "Gagal memproses lokasi.");
}

export async function deleteLocation(id: string) {
	await callBackend(`/admin/lokasi-parkir/${id}`, "DELETE", undefined, "Gagal memproses lokasi.");
}
