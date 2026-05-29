import type { TransactionStatus, VehicleType } from "@/lib/dashboard/types";

export type TransactionVehicleFilter = "Semua" | VehicleType;

export type TransactionStatusFilter = "Semua" | TransactionStatus;

/** Filter daftar transaksi (mock & nanti API). */
export type TransactionFilters = {
	dateFrom: string;
	dateTo: string;
	locationId: string | null;
	officerId: string | null;
	vehicle: TransactionVehicleFilter;
	status: TransactionStatusFilter;
};

export type TransactionListItem = {
	id: string;
	/** Kode tampilan, monospace di UI */
	code: string;
	time: string;
	locationId: string;
	locationName: string;
	officerId: string;
	officerName: string;
	vehicleType: VehicleType;
	amountRp: number;
	status: TransactionStatus;
};

export type TransactionDetail = TransactionListItem & {
	tariffRp: number;
	userIdMasked: string;
	balanceBeforeRp: number;
	balanceAfterRp: number;
};

export type TransactionListResult = {
	items: TransactionListItem[];
	total: number;
	page: number;
	pageSize: number;
};

export type FilterOption = { id: string; label: string };

export type TransactionFilterOptions = {
	locations: FilterOption[];
	officers: FilterOption[];
	statuses: TransactionStatusFilter[];
	vehicles: TransactionVehicleFilter[];
};
