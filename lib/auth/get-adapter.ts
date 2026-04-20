import { createHttpAdapter } from "./adapters/http";
import { createMockAdapter } from "./adapters/mock";
import type { AuthAdapter } from "./adapters/types";

/**
 * `AUTH_MODE=http` + `API_BASE_URL` → adapter HTTP (backend nyata).
 * Selain itu → adapter mock (dummy env).
 */
export function getAuthAdapter(): AuthAdapter {
  const mode = process.env.AUTH_MODE?.trim().toLowerCase() ?? "";
  const base = process.env.API_BASE_URL?.trim().replace(/\/$/, "") ?? "";

  if (mode === "http") {
    if (!base) {
      throw new Error("AUTH_MODE=http membutuhkan API_BASE_URL.");
    }
    return createHttpAdapter(base);
  }

  return createMockAdapter();
}
