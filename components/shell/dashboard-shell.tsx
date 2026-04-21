"use client";

import { AppSidebar } from "./app-sidebar";
import { AppTopbar } from "./app-topbar";

export function DashboardShell({
  children,
  topbarFallbackTitle,
  username,
}: {
  children: React.ReactNode;
  /** Judul dari server (header x-pathname) agar hydration selaras dengan SSR. */
  topbarFallbackTitle: string;
  username: string;
}) {
  return (
    <div className="flex h-dvh max-h-dvh overflow-hidden bg-(--color-bg)">
      <AppSidebar username={username} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AppTopbar fallbackTitle={topbarFallbackTitle} />
        <main className="min-h-0 flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
