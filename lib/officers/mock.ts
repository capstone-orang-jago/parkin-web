import type { TransactionListItem } from "@/lib/transactions/types";
import {
  aggregateMockStatsForOfficer,
  countMockTransactionsTodayForOfficer,
  getMockTransactionsForOfficer,
} from "@/lib/transactions/mock";
import type {
  OfficerAccountStatus,
  OfficerAssignmentHistoryItem,
  OfficerDetail,
  OfficerListItem,
  OfficerRecentTransaction,
} from "./types";

/** ID & nama selaras `lib/transactions/mock.ts` (OFFICERS). */
const OFFICER_SEEDS: {
  id: string;
  fullName: string;
  phone: string;
  status: OfficerAccountStatus;
  assignedLocationId: string | null;
  assignedLocationName: string | null;
}[] = [
  {
    id: "off-1",
    fullName: "Ahmad Faisal",
    phone: "0852-1122-3344",
    status: "active",
    assignedLocationId: "loc-1",
    assignedLocationName: "Lapangan Merdeka",
  },
  {
    id: "off-2",
    fullName: "Budi Santoso",
    phone: "0853-2233-4455",
    status: "active",
    assignedLocationId: "loc-2",
    assignedLocationName: "Jembatan Kuning",
  },
  {
    id: "off-3",
    fullName: "Citra Lestari",
    phone: "0854-3344-5566",
    status: "inactive",
    assignedLocationId: null,
    assignedLocationName: null,
  },
  {
    id: "off-4",
    fullName: "Dewi Anggraini",
    phone: "0855-4455-6677",
    status: "active",
    assignedLocationId: "loc-5",
    assignedLocationName: "Kawatuna",
  },
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

function officerCode(id: string): string {
  const n = 100 + (hash(`code-${id}`) % 900);
  return `PET-${n}`;
}

function toRecent(row: TransactionListItem): OfficerRecentTransaction {
  return {
    id: row.id,
    time: row.time,
    locationName: row.locationName,
    vehicleType: row.vehicleType,
    amountRp: row.amountRp,
    status: row.status,
  };
}

function buildHistory(seed: (typeof OFFICER_SEEDS)[number]): OfficerAssignmentHistoryItem[] {
  if (seed.status === "inactive" && !seed.assignedLocationId) {
    return [
      {
        locationName: "Mantikulore",
        startDate: "2024-06-01T00:00:00.000Z",
        endDate: "2025-11-30T00:00:00.000Z",
      },
    ];
  }
  const currentName = seed.assignedLocationName ?? "—";
  const prev =
    seed.assignedLocationId === "loc-1"
      ? "Tondo"
      : seed.assignedLocationId === "loc-2"
        ? "Lapangan Merdeka"
        : "Jembatan Kuning";
  return [
    {
      locationName: prev,
      startDate: "2024-03-01T00:00:00.000Z",
      endDate: "2025-08-15T00:00:00.000Z",
    },
    {
      locationName: currentName,
      startDate: "2025-08-16T00:00:00.000Z",
      endDate: seed.status === "active" ? null : "2026-01-10T00:00:00.000Z",
    },
  ];
}

export function buildOfficerList(): OfficerListItem[] {
  return OFFICER_SEEDS.map((seed) => ({
    id: seed.id,
    fullName: seed.fullName,
    phone: seed.phone,
    assignedLocationName: seed.assignedLocationName ?? "—",
    status: seed.status,
    transactionsToday: countMockTransactionsTodayForOfficer(seed.id),
  }));
}

export function getMockOfficerDetail(id: string): OfficerDetail | null {
  const seed = OFFICER_SEEDS.find((s) => s.id === id);
  if (!seed) return null;

  const { totalTransactions, totalRevenueRp } = aggregateMockStatsForOfficer(id);
  const recent = getMockTransactionsForOfficer(id, 8).map(toRecent);

  return {
    id: seed.id,
    fullName: seed.fullName,
    phone: seed.phone,
    officerCode: officerCode(id),
    status: seed.status,
    assignedLocationId: seed.assignedLocationId,
    assignedLocationName: seed.assignedLocationName,
    totalTransactions,
    totalRevenueRp,
    assignmentHistory: buildHistory(seed),
    recentTransactions: recent,
  };
}
