import { buildOfficerList, getMockOfficerDetail } from "./mock";
import type { OfficerDetail, OfficerListItem } from "./types";

/** Nanti: GET /admin/officers */
export async function getOfficerList(): Promise<OfficerListItem[]> {
  return buildOfficerList();
}

export async function getOfficerById(id: string): Promise<OfficerDetail | null> {
  return getMockOfficerDetail(id);
}
