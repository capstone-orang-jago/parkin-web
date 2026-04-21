import { cookies, headers } from "next/headers";
import { DashboardShell } from "@/components/shell/dashboard-shell";
import { ACCESS_COOKIE } from "@/lib/auth/cookies";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { titleFromPathname } from "@/lib/shell/topbar-title";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const c = await cookies();
  const pathname = h.get("x-pathname") ?? "/dashboard";
  const topbarTitle = titleFromPathname(pathname);
  const access = c.get(ACCESS_COOKIE)?.value;
  let username = "Admin";

  if (access) {
    try {
      const payload = await verifyAccessToken(access);
      username = payload.nama?.trim() || String(payload.sub);
    } catch {
      /* fallback default username */
    }
  }

  return (
    <DashboardShell topbarFallbackTitle={topbarTitle} username={username}>
      {children}
    </DashboardShell>
  );
}
