/**
 * Format UUID into short display ID, matching mobile format.
 * Example: "550e8400-e29b-41d4-a716-446655440000" → "PK-550E8400"
 */
export function formatShortId(id: string | null | undefined): string {
  if (!id) return "-";
  const cleanId = id.replace(/-/g, "");
  if (cleanId.length < 8) return cleanId.toUpperCase();
  return `PK-${cleanId.slice(0, 8).toUpperCase()}`;
}
