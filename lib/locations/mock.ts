import type { TransactionListItem } from "@/lib/transactions/types";
import {
  aggregateMockStatsForLocation,
  countMockTransactionsTodayForLocation,
  getMockTransactionsForLocation,
} from "@/lib/transactions/mock";
import type {
  LocationDetail,
  LocationListItem,
  LocationOperationalStatus,
  LocationRecentTransaction,
} from "./types";

/**
 * Dataset lokasi — ID & nama selaras `lib/transactions/mock.ts` (filter transaksi).
 */
const LOCATION_SEEDS: {
  id: string;
  name: string;
  address: string;
  status: LocationOperationalStatus;
  /** indeks petugas utama dari pool nama mock */
  officerIndex: number | null;
}[] = [
  {
    id: "loc-1",
    name: "Lapangan Merdeka",
    address: "Jl. Ahmad Yani No. 12, Mantikulore",
    status: "active",
    officerIndex: 0,
  },
  {
    id: "loc-2",
    name: "Jembatan Kuning",
    address: "Jl. Jend. Sudirman, Palu Timur",
    status: "active",
    officerIndex: 1,
  },
  {
    id: "loc-3",
    name: "Mantikulore",
    address: "Jl. Emy Saelan, Palu Selatan",
    status: "inactive",
    officerIndex: null,
  },
  {
    id: "loc-4",
    name: "Tondo",
    address: "Jl. Tanjung Pantai, Tondo",
    status: "active",
    officerIndex: 2,
  },
  {
    id: "loc-5",
    name: "Kawatuna",
    address: "Jl. Wolter Monginsidi, Kawatuna",
    status: "active",
    officerIndex: 3,
  },
];

const OFFICER_NAMES = [
  "Ahmad Faisal",
  "Budi Santoso",
  "Citra Lestari",
  "Dewi Anggraini",
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

function createdAtForLocation(id: string): string {
  const day = 1 + (hash(`created-${id}`) % 28);
  const month = 1 + (hash(`m-${id}`) % 12);
  const year = 2023 + (hash(`y-${id}`) % 3);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T08:00:00.000Z`;
}

function assignedNamesFor(seed: (typeof LOCATION_SEEDS)[number]): string[] {
  if (seed.status === "inactive" || seed.officerIndex === null) return [];
  const primary = OFFICER_NAMES[seed.officerIndex % OFFICER_NAMES.length];
  const secondary =
    OFFICER_NAMES[(seed.officerIndex + 1) % OFFICER_NAMES.length];
  if (hash(seed.id) % 2 === 0) return [primary];
  return [primary, secondary];
}

function toRecentRow(row: TransactionListItem): LocationRecentTransaction {
  return {
    id: row.id,
    time: row.time,
    vehicleType: row.vehicleType,
    officerName: row.officerName,
    amountRp: row.amountRp,
    status: row.status,
  };
}

export function buildLocationList(): LocationListItem[] {
  return LOCATION_SEEDS.map((seed) => {
    const names = assignedNamesFor(seed);
    const activeOfficerLabel =
      seed.status === "active" && names.length > 0 ? names.join(", ") : "—";
    return {
      id: seed.id,
      name: seed.name,
      address: seed.address,
      activeOfficerLabel,
      status: seed.status,
      transactionsToday: countMockTransactionsTodayForLocation(seed.id),
    };
  });
}

export function getMockLocationDetail(id: string): LocationDetail | null {
  const seed = LOCATION_SEEDS.find((s) => s.id === id);
  if (!seed) return null;

  const { totalTransactions, totalRevenueRp } =
    aggregateMockStatsForLocation(id);
  const days = Math.max(1, 30);
  const avgDailyRp = Math.round(totalRevenueRp / days);

  const recent = getMockTransactionsForLocation(id, 8).map(toRecentRow);

  return {
    id: seed.id,
    name: seed.name,
    address: seed.address,
    status: seed.status,
    createdAt: createdAtForLocation(id),
    assignedOfficerNames: assignedNamesFor(seed),
    totalTransactions,
    totalRevenueRp,
    avgDailyRp,
    recentTransactions: recent,
  };
}
