"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatRp, formatRpAxis } from "@/lib/format/rp";
import { CHART_TOOLTIP_STYLE, CHART_TICK_STYLE } from "@/components/shared/chart-components";
import type { ReportLocationBar, ReportTrendPoint } from "@/lib/reports/types";

export function ReportCharts({
  trend,
  locationBars,
}: {
  trend: ReportTrendPoint[];
  locationBars: ReportLocationBar[];
}) {
  const trendEmpty = trend.length === 0 || trend.every((d) => d.revenueRp === 0);
  const locEmpty = locationBars.length === 0 || locationBars.every((l) => l.revenueRp === 0);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-(--color-text)">Pendapatan per hari</h3>
        <p className="text-xs text-(--color-text-muted)">
          Tren pendapatan harian dari data dashboard.
        </p>
        {trendEmpty ? (
          <div className="flex h-70 items-center justify-center rounded-lg border border-dashed border-(--color-border) bg-(--color-surface-2) text-sm text-(--color-text-muted)">
            Tidak ada data tren untuk periode ini.
          </div>
        ) : (
          <div className="h-70 w-full min-w-0 rounded-lg border border-(--color-border) bg-(--color-surface-card) p-3 shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e1d9ce" />
                <XAxis
                  dataKey="label"
                  tick={{ ...CHART_TICK_STYLE, fontSize: 10 }}
                  interval="preserveStartEnd"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={CHART_TICK_STYLE}
                  tickFormatter={formatRpAxis}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(v: number | string) => [
                    formatRp(typeof v === "number" ? v : Number(v)),
                    "Pendapatan",
                  ]}
                  contentStyle={CHART_TOOLTIP_STYLE}
                />
                <Bar dataKey="revenueRp" name="Pendapatan" fill="#0d7e96" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-(--color-text)">Pendapatan per lokasi</h3>
        <p className="text-xs text-(--color-text-muted)">
          Perbandingan pendapatan sukses antar lokasi dalam filter.
        </p>
        {locEmpty ? (
          <div className="flex h-70 items-center justify-center rounded-lg border border-dashed border-(--color-border) bg-(--color-surface-2) text-sm text-(--color-text-muted)">
            Tidak ada data per lokasi untuk periode ini.
          </div>
        ) : (
          <div className="h-70 w-full min-w-0 rounded-lg border border-(--color-border) bg-(--color-surface-card) p-3 pl-1 shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={locationBars}
                margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e1d9ce" />
                <XAxis
                  type="number"
                  tick={CHART_TICK_STYLE}
                  tickFormatter={formatRpAxis}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="locationName"
                  width={112}
                  tick={CHART_TICK_STYLE}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(v: number | string) => [
                    formatRp(typeof v === "number" ? v : Number(v)),
                    "Pendapatan",
                  ]}
                  contentStyle={CHART_TOOLTIP_STYLE}
                />
                <Bar dataKey="revenueRp" name="Pendapatan" fill="#d4860a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </div>
  );
}
