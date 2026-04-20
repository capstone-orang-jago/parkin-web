import {
  buildMockTransactionList,
  getMockTransactionById,
  listMockLocations,
  listMockOfficers,
} from "./mock";
import type { TransactionDetail, TransactionFilters, TransactionListResult } from "./types";

/**
 * Daftar transaksi dengan filter + pagination.
 * Nanti: GET /admin/transactions + query.
 */
export async function getTransactionList(
  filters: TransactionFilters,
  page: number,
): Promise<TransactionListResult> {
  return buildMockTransactionList(filters, page);
}

export async function getTransactionDetail(
  id: string,
): Promise<TransactionDetail | null> {
  return getMockTransactionById(id);
}

export async function getTransactionFilterOptions() {
  return {
    locations: listMockLocations(),
    officers: listMockOfficers(),
  };
}
