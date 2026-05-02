export type Property = {
  address: string;
  photoUrl?: string;
  description?: string;
  ownershipVerified?: boolean;
};

export type LandlordProfile = {
  name: string;
  yearStarted: number;
  propertyCount: number;
  bio?: string;
  city?: string;
  profilePhotoUrl?: string;
  identityVerified?: boolean;
  properties: Property[];
  createdAt: string;
};

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const b64 =
    typeof btoa !== "undefined"
      ? btoa(binary)
      : Buffer.from(bytes).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/");
  const fill = "=".repeat((4 - (padded.length % 4)) % 4);
  if (typeof atob !== "undefined") {
    const binary = atob(padded + fill);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }
  return new Uint8Array(Buffer.from(padded + fill, "base64"));
}

export function encodeProfile(profile: LandlordProfile): string {
  return toBase64Url(new TextEncoder().encode(JSON.stringify(profile)));
}

export function decodeProfile(encoded: string): LandlordProfile | null {
  try {
    const json = new TextDecoder().decode(fromBase64Url(encoded));
    const parsed = JSON.parse(json) as LandlordProfile;
    if (
      typeof parsed?.name !== "string" ||
      typeof parsed?.yearStarted !== "number" ||
      !Array.isArray(parsed.properties)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function profileIdFromEncoded(encoded: string): string {
  return encoded.slice(0, 24);
}

export function yearsInBusiness(profile: LandlordProfile, asOf?: Date): number {
  const now = asOf ?? new Date();
  return Math.max(0, now.getFullYear() - profile.yearStarted);
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

export function normalizeAddress(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export function findMatchingProperty(
  profile: LandlordProfile,
  address: string
): Property | undefined {
  const target = normalizeAddress(address);
  if (!target) return undefined;
  return profile.properties.find(
    (p) =>
      normalizeAddress(p.address) === target ||
      normalizeAddress(p.address).includes(target) ||
      target.includes(normalizeAddress(p.address))
  );
}

export const LANDLORD_PROFILE_LOCAL_KEY = "rentiff:landlord-profile";
