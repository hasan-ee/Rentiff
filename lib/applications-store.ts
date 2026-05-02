const KEY_PREFIX = "rentiff:applications:";

export function listApplicationsForListing(listingId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY_PREFIX + listingId);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function addApplicationToListing(
  listingId: string,
  encodedApplication: string
): void {
  if (typeof window === "undefined") return;
  try {
    const existing = listApplicationsForListing(listingId);
    if (existing.includes(encodedApplication)) return;
    const next = [encodedApplication, ...existing].slice(0, 50);
    window.localStorage.setItem(
      KEY_PREFIX + listingId,
      JSON.stringify(next)
    );
  } catch {
    // localStorage might be full or disabled; silently ignore for demo
  }
}

export function listingIdFromEncoded(encoded: string): string {
  // Use a short stable slice as a friendlier key in storage and URLs
  return encoded.slice(0, 24);
}
