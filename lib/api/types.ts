/** Raw API user object embedded in transaction responses. */
export type ApiUser = {
  id: string;
  name: string;
  email: string;
};

/** Raw API location object embedded in transaction responses. */
export type ApiLocationRef = {
  id: string;
  nama_lokasi: string;
  alamat: string;
  is_active: boolean;
};

/** Raw API transaction item — shared across locations, officers, reports, transactions. */
export type ApiTransactionItem = {
  id: string;
  kode_transaksi: string;
  pengguna: ApiUser | null;
  petugas: ApiUser | null;
  lokasi: ApiLocationRef;
  jenis_kendaraan: string;
  tarif: number;
  saldo_sebelum: number;
  saldo_sesudah: number;
  status: string;
  created_at: string;
};

/** Paginated transaction list envelope from the API. */
export type ApiTransactionListEnvelope = {
  code?: number;
  data?: {
    items: ApiTransactionItem[] | null;
    total: number;
    page: number;
    limit: number;
  };
  message?: string;
};
