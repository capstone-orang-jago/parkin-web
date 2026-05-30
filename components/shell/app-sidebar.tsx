"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  LayoutDashboard,
  MapPin,
  Receipt,
  Users,
} from "lucide-react";
import { fontDisplay } from "@/lib/fonts";

const NAV = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/transaksi", label: "Transaksi", Icon: Receipt },
  { href: "/lokasi", label: "Lokasi Parkir", Icon: MapPin },
  { href: "/petugas", label: "Petugas", Icon: Users },
  { href: "/laporan", label: "Laporan", Icon: BarChart2 },
] as const;

function navItemActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar({ username }: { username: string }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-dvh w-16 shrink-0 flex-col border-r border-(--color-border) bg-(--color-surface) lg:w-60">
      <div className="flex h-14 items-center justify-center border-b border-(--color-border) px-2 lg:justify-start lg:px-4">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="Logo ParkIn Palu"
            width={36}
            height={36}
            priority
            className="h-9 w-9 shrink-0"
          />
          <span
            className={`hidden truncate text-base font-normal text-(--color-text) lg:inline lg:text-[1.125rem] ${fontDisplay.className}`}
          >
            <span className="tracking-tight text-3xl">ParkIn Palu</span>
          </span>
        </div>
      </div>
      <nav
        className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-2"
        aria-label="Modul utama"
      >
        {NAV.map(({ href, label, Icon }) => {
          const active = navItemActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={[
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bomba-500",
                active
                  ? "border-l-2 border-bomba-500 bg-bomba-100 pl-2.5 text-bomba-700"
                  : "border-l-2 border-transparent text-(--color-text-muted) hover:bg-(--color-surface-offset) hover:text-(--color-text)",
              ].join(" ")}
            >
              <Icon
                className="size-5 shrink-0"
                strokeWidth={1.75}
                aria-hidden
              />
              <span className="hidden lg:inline">{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-(--color-border) px-4 py-4 text-xs text-(--color-text-muted)">
        <div className="hidden items-center gap-2 lg:flex">
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-bomba-100 text-[15px] font-semibold text-bomba-700"
            aria-hidden
          >
            {username.trim().charAt(0).toUpperCase() || "A"}
          </span>
          <p className="truncate">{username}</p>
        </div>
        <p className="text-center lg:hidden" aria-hidden>
        <span
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-bomba-100 text-[12px] font-semibold text-bomba-700"
            aria-hidden
          >
            {username.trim().charAt(0).toUpperCase() || "A"}
          </span>
        </p>
      </div>
    </aside>
  );
}
