import { buildLocationList, getMockLocationDetail } from "./mock";
import type { LocationDetail, LocationListItem } from "./types";

/**
 * Daftar lokasi parkir (mock).
 * Nanti: GET /admin/locations.
 */
export async function getLocationList(): Promise<LocationListItem[]> {
  return buildLocationList();
}

export async function getLocationById(id: string): Promise<LocationDetail | null> {
  return getMockLocationDetail(id);
}
