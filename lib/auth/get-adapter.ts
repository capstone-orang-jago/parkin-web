import { createHttpAdapter } from "./adapters/http";
import type { AuthAdapter } from "./adapters/types";

/**
 * Membuat auth adapter yang terhubung ke backend nyata.
 * Wajib API_BASE_URL di environment.
 */
export function getAuthAdapter(): AuthAdapter {
  const base = process.env.API_BASE_URL?.trim().replace(/\/$/, "") ?? "";

  if (!base) {
    throw new Error(
      "API_BASE_URL belum disetel. Dibutuhkan untuk koneksi ke backend.",
    );
  }

  return createHttpAdapter(base);
}
