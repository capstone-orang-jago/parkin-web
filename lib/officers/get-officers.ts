import { cookies } from "next/headers";
import { ACCESS_COOKIE } from "../auth/cookies";
import { getMockOfficerDetail } from "./mock";
import type { OfficerDetail, OfficerListItem } from "./types";

type ApiOfficer = {
	email: string;
	id: string;
	is_verified: boolean;
	lokasi: {
		alamat: string;
		id: string;
		is_active: boolean;
		nama_lokasi: string;
		petugas: string;
	} | null;
	name: string;
	password: string;
	role: string;
	saldo: number;
	telephone: string;
};

type ApiOfficerListResponse = {
	code: number;
	data: ApiOfficer[];
	message: string;
};

function mapApiOfficerToListItem(item: ApiOfficer): OfficerListItem {
	return {
		id: item.id,
		fullName: item.name,
		phone: item.telephone,
		assignedLocationName: item.lokasi?.nama_lokasi ?? "—",
		status: item.is_verified ? "active" : "inactive",
		transactionsToday: 0,
	};
}

export async function getOfficerList(): Promise<OfficerListItem[]> {
	const baseUrl = process.env.API_BASE_URL?.replace(/\/$/, "");
	if (!baseUrl) {
		throw new Error("API_BASE_URL belum disetel.");
	}

	const accessToken = (await cookies()).get(ACCESS_COOKIE)?.value;

	const res = await fetch(`${baseUrl}/admin/officers`, {
		cache: "no-store",
		headers: accessToken
			? {
					Authorization: `Bearer ${accessToken}`,
				}
			: undefined,
	});

	if (!res.ok) {
		throw new Error(`Gagal mengambil petugas: ${res.status} ${res.statusText}`);
	}

	const payload = (await res.json()) as ApiOfficerListResponse | ApiOfficer[];
	const data = Array.isArray(payload)
		? payload
		: Array.isArray(payload.data)
			? payload.data
			: [];

	return data.map(mapApiOfficerToListItem);
}

export async function getOfficerById(
	id: string,
): Promise<OfficerDetail | null> {
	return getMockOfficerDetail(id);
}
