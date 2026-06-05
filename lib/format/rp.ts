export function formatRp(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Short currency label for chart axes (e.g. "1.5 jt", "500 rb"). */
export function formatRpAxis(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)} jt`;
  if (v >= 1000) return `${Math.round(v / 1000)} rb`;
  return String(v);
}
