"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { titleFromPathname } from "@/lib/shell/topbar-title";

export function AppTopbar({ fallbackTitle }: { fallbackTitle: string }) {
  const pathname = usePathname();
  const router = useRouter();
  /** Pakai fallback dari server bila pathname belum tersedia di SSR client boundary (hindari hydration mismatch). */
  const title =
    pathname && pathname.length > 0
      ? titleFromPathname(pathname)
      : fallbackTitle;
  const [isPending, startTransition] = useTransition();
  const [logoutError, setLogoutError] = useState<string | null>(null);

  function logout() {
    setLogoutError(null);
    startTransition(async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        setLogoutError("Gagal keluar. Coba lagi.");
        return;
      }
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-(--color-border) bg-(--color-surface) px-6">
        <h1
          className="truncate text-lg font-bold text-(--color-text)"
          suppressHydrationWarning
        >
          {title}
        </h1>
        <div className="flex shrink-0 items-center gap-2">
          {/* <button
            type="button"
            disabled
            className="h-9 rounded-md border border-(--color-border) bg-transparent px-4 text-sm font-medium text-(--color-text-muted) opacity-60"
            title="Filter tanggal — Fase berikutnya"
          >
            Filter tanggal
          </button> */}
          <button
            type="button"
            disabled={isPending}
            onClick={() => logout()}
            className="h-9 rounded-md border border-teluk-500 bg-(--color-surface-card) px-4 text-sm font-medium text-teluk-700 transition-colors hover:bg-teluk-50 disabled:opacity-40"
            title="Keluar"
          >
            {isPending ? "…" : "Keluar"}
          </button>
        </div>
      </header>
      {logoutError ? (
        <div className="border-b border-merahbomba-100 bg-merahbomba-100 px-6 py-1.5">
          <p className="text-xs font-medium text-merahbomba-600">{logoutError}</p>
        </div>
      ) : null}
    </>
  );
}
