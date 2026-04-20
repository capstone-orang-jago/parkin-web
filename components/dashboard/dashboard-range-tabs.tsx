import Link from "next/link";
import type { DashboardRange } from "@/lib/dashboard/types";

const TABS: { range: DashboardRange; label: string }[] = [
  { range: "today", label: "Hari Ini" },
  { range: "week", label: "Minggu Ini" },
  { range: "month", label: "Bulan Ini" },
];

export function DashboardRangeTabs({ current }: { current: DashboardRange }) {
  return (
    <nav
      className="inline-flex rounded-lg border border-megalit-200 bg-(--color-surface-card) p-1 shadow-sm"
      aria-label="Rentang waktu dashboard"
    >
      {TABS.map(({ range, label }) => {
        const active = current === range;
        return (
          <Link
            key={range}
            href={range === "today" ? "/dashboard" : `/dashboard?range=${range}`}
            className={[
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-bomba-500 text-white"
                : "text-megalit-700 hover:bg-megalit-100",
            ].join(" ")}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
