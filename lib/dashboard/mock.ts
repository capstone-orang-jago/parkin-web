import type {
  DashboardData,
  DashboardRange,
  LocationPerformanceRow,
  RecentTransactionRow,
  TrendPoint,
} from "./types";

function mul(range: DashboardRange) {
  switch (range) {
    case "week":
      return 5.2;
    case "month":
      return 18;
    default:
      return 1;
  }
}

/** Deterministik sederhana dari string (mock stabil per id). */
function hashSeed(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/** 7 hari ke belakang dari "hari ini" (mock). */
function last7Days(): { iso: string; label: string }[] {
  const out: { iso: string; label: string }[] = [];
  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
    const label = `${days[d.getDay()]} ${pad2(d.getDate())}`;
    out.push({ iso, label });
  }
  return out;
}

export function buildMockDashboard(range: DashboardRange): DashboardData {
  const m = mul(range);
  const periodLabel =
    range === "today"
      ? "Hari ini"
      : range === "week"
        ? "Minggu ini"
        : "Bulan ini";

  const baseTx = Math.round(120 * m);
  const baseRev = Math.round(4_500_000 * m);

  const summary = {
    totalTransactions: baseTx + 14,
    totalRevenueRp: baseRev + 125_000,
    motorCount: Math.round(78 * m),
    mobilCount: Math.round(42 * m),
    activeLocations: range === "month" ? 12 : 8,
    activeOfficersToday: Math.round(15 * (range === "today" ? 1 : 0.9)),
  };

  const days = last7Days();
  const trend: TrendPoint[] = days.map((d, idx) => {
    const seed = hashSeed(`${range}-${d.iso}`);
    const bump = (seed % 17) - 8;
    const tx = Math.max(0, Math.round(40 * m + bump + idx * 2));
    const rev = Math.max(0, Math.round(1_200_000 * m + bump * 15_000 + idx * 25_000));
    return {
      date: d.iso,
      label: d.label,
      transactionCount: tx,
      revenueRp: rev,
    };
  });

  const locNames = [
    "Lapangan Merdeka",
    "Jembatan Kuning",
    "Mantikulore",
    "Tondo",
    "Kawatuna",
  ];

  const locationPerformance: LocationPerformanceRow[] = locNames.map((name, i) => ({
    locationName: name,
    transactionsToday: Math.round((18 - i * 2) * m) + i,
    revenueTodayRp: Math.round((420_000 - i * 35_000) * m),
    officersOnDuty: i % 2 === 0 ? "2 petugas" : "1 petugas",
  }));

  const statuses: RecentTransactionRow["status"][] = [
    "Sukses",
    "Sukses",
    "Pending",
    "Sukses",
    "Gagal",
    "Sukses",
    "Sukses",
    "Sukses",
    "Pending",
    "Sukses",
  ];

  const recentTransactions: RecentTransactionRow[] = statuses.map((status, i) => {
    const t = new Date();
    t.setMinutes(t.getMinutes() - i * 13 - (hashSeed(`${range}-tx-${i}`) % 40));
    return {
      id: `TRX-${range.toUpperCase()}-${1000 + i}`,
      time: t.toISOString(),
      locationName: locNames[i % locNames.length],
      vehicleType: i % 3 === 0 ? "Mobil" : "Motor",
      amountRp: 3000 + (i % 5) * 1000,
      status,
    };
  });

  return {
    range,
    periodLabel,
    summary,
    trend,
    recentTransactions,
    locationPerformance,
  };
}
