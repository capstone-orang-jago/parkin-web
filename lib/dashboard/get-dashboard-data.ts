import { buildMockDashboard } from "./mock";
import type { DashboardData, DashboardRange } from "./types";

/**
 * Data dashboard. Saat ini: mock. Nanti: ganti dengan fetch ke
 * `/admin/dashboard/summary`, `/admin/dashboard/trend`, dll. + Bearer.
 */
export async function getDashboardData(
  range: DashboardRange,
): Promise<DashboardData> {
  return buildMockDashboard(range);
}

export function parseDashboardRange(
  value: string | string[] | undefined,
): DashboardRange {
  const v = Array.isArray(value) ? value[0] : value;
  if (v === "week" || v === "month") return v;
  return "today";
}
