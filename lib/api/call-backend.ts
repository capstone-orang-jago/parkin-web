"use server";

import { getAccessToken } from "@/lib/auth/server-api";

/**
 * Authenticated fetch wrapper for POST/PUT/DELETE to the backend.
 * Handles token injection, JSON body serialization, and error extraction.
 */
export async function callBackend(
  path: string,
  method: "POST" | "PUT" | "DELETE",
  body?: unknown,
  fallbackErrorMessage = "Gagal memproses permintaan.",
) {
  const baseUrl = process.env.API_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) throw new Error("API_BASE_URL belum disetel.");

  const token = await getAccessToken();
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
    throw new Error(msg || fallbackErrorMessage);
  }
}
