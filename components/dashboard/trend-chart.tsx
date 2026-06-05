"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TrendPoint } from "@/lib/dashboard/types";
import { formatRp, formatRpAxis } from "@/lib/format/rp";
import { CHART_TOOLTIP_STYLE, CHART_TICK_STYLE, ChartEmptyState } from "@/components/shared/chart-components";

export function TrendChart({ data }: { data: TrendPoint[] }) {
  const empty =
    data.length === 0 ||
    data.every((d) => d.transactionCount === 0 && d.revenueRp === 0);

  if (empty) {
    return <ChartEmptyState message="Belum ada data tren untuk periode ini." />;
  }

  return (
    <div className="h-70 w-full min-w-0 rounded-lg border border-megalit-200 bg-(--color-surface-card) p-3 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e1d9ce" />
          <XAxis dataKey="label" tick={CHART_TICK_STYLE} axisLine={false} tickLine={false} />
          <YAxis yAxisId="left" tick={CHART_TICK_STYLE} axisLine={false} tickLine={false} allowDecimals={false} />
          <YAxis yAxisId="right" orientation="right" tick={CHART_TICK_STYLE} axisLine={false} tickLine={false} tickFormatter={formatRpAxis} />
          <Tooltip
            formatter={(value: number | string, name: string) => {
              const n = typeof value === "number" ? value : Number(value);
              if (name === "Pendapatan") {
                return [formatRp(n), name];
              }
              return [n, name];
            }}
            labelFormatter={(_, payload) => {
              const p = payload?.[0]?.payload as TrendPoint | undefined;
              return p?.date ?? "";
            }}
            contentStyle={CHART_TOOLTIP_STYLE}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Line yAxisId="left" type="monotone" dataKey="transactionCount" name="Transaksi" stroke="#d4860a" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          <Line yAxisId="right" type="monotone" dataKey="revenueRp" name="Pendapatan" stroke="#0d7e96" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
