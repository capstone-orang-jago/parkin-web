import type { TransactionStatus, VehicleType } from "@/lib/dashboard/types";

/**
 * Normalize a raw vehicle-type string to a canonical VehicleType.
 * @param fallback — value returned when no match (default "Motor").
 *   Pass "Semua" from filter contexts; callers cast the result as needed.
 */
export function normalizeVehicleType<T extends string = VehicleType>(
  value: string,
  fallback: T = "Motor" as T,
): VehicleType | T {
  const v = value.trim().toLowerCase();
  if (v === "mobil") return "Mobil";
  if (v === "motor") return "Motor";
  return fallback;
}

/**
 * Normalize a raw status string to a canonical TransactionStatus.
 * @param fallback — value returned when no match (default "Sukses").
 *   Pass "Semua" from filter contexts; callers cast the result as needed.
 */
export function normalizeStatus<T extends string = TransactionStatus>(
  value: string,
  fallback: T = "Sukses" as T,
): TransactionStatus | T {
  const v = value.trim().toLowerCase();
  if (v === "gagal") return "Gagal";
  if (v === "pending") return "Pending";
  if (v === "sukses") return "Sukses";
  return fallback;
}
