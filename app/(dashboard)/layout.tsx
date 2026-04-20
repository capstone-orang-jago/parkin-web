import { headers } from "next/headers";
import { DashboardShell } from "@/components/shell/dashboard-shell";
import { titleFromPathname } from "@/lib/shell/topbar-title";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "/dashboard";
  const topbarTitle = titleFromPathname(pathname);

  return (
    <DashboardShell topbarFallbackTitle={topbarTitle}>{children}</DashboardShell>
  );
}
