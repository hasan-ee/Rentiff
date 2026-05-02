export type Review = {
  tenantFirstName: string;
  tenantLastInitial: string;
  rating: number;
  text: string;
  propertyAddress: string;
  stayedFrom?: string;
  stayedTo?: string;
  verifiedStay: boolean;
  createdAt: string;
};

const KEY_PREFIX = "rentiff:reviews:";

export function listReviewsForLandlord(landlordId: string): Review[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY_PREFIX + landlordId);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (r): r is Review =>
        r &&
        typeof r === "object" &&
        typeof r.tenantFirstName === "string" &&
        typeof r.rating === "number" &&
        typeof r.text === "string"
    );
  } catch {
    return [];
  }
}

export function addReviewForLandlord(landlordId: string, review: Review): void {
  if (typeof window === "undefined") return;
  try {
    const existing = listReviewsForLandlord(landlordId);
    const next = [review, ...existing].slice(0, 100);
    window.localStorage.setItem(
      KEY_PREFIX + landlordId,
      JSON.stringify(next)
    );
  } catch {
    // localStorage might be full or disabled
  }
}

export function averageRating(reviews: Review[]): number | null {
  if (reviews.length === 0) return null;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
