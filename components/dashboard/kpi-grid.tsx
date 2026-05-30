import type { LucideIcon } from "lucide-react";
import {
  Bike,
  Car,
  MapPin,
  Receipt,
  Users,
  Wallet,
} from "lucide-react";
import type { DashboardSummary } from "@/lib/dashboard/types";
import { formatRp } from "@/lib/format/rp";

type Props = {
  summary: DashboardSummary;
  periodLabel: string;
};

export function KpiGrid({ summary, periodLabel }: Props) {
  const items: {
    label: string;
    value: string;
    hint?: string;
    Icon: LucideIcon;
  }[] = [
    {
      label: "Total transaksi",
      value: String(summary.totalTransactions),
      hint: periodLabel,
      Icon: Receipt,
    },
    {
      label: "Total pendapatan",
      value: formatRp(summary.totalRevenueRp),
      hint: periodLabel,
      Icon: Wallet,
    },
    { label: "Jumlah motor", value: String(summary.motorCount), Icon: Bike },
    { label: "Jumlah mobil", value: String(summary.mobilCount), Icon: Car },
    {
      label: "Lokasi parkir aktif",
      value: String(summary.activeLocations),
      Icon: MapPin,
    },
    {
      label: "Petugas aktif",
      value: String(summary.activeOfficers),
      Icon: Users,
    },
  ];

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {items.map(({ Icon, ...item }) => (
        <li
          key={item.label}
          className="rounded-lg border border-megalit-200 bg-(--color-surface-card) px-4 py-3 shadow-sm"
        >
          <div className="flex gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bomba-50 text-bomba-600"
              aria-hidden
            >
              <Icon className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-megalit-500">
                {item.label}
              </p>
              {item.hint ? (
                <p className="mt-0.5 text-[11px] text-megalit-500">
                  {item.hint}
                </p>
              ) : null}
              <p className="mt-2 text-xl font-semibold tabular-nums text-megalit-900">
                {item.value}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
