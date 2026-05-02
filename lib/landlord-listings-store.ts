const KEY = "rentiff:landlord-listings";

export function listLandlordListings(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function addLandlordListing(encoded: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = listLandlordListings();
    if (existing.includes(encoded)) return;
    const next = [encoded, ...existing].slice(0, 30);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export function removeLandlordListing(encoded: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = listLandlordListings();
    const next = existing.filter((s) => s !== encoded);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}
