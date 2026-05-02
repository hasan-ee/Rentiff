export type FieldStatus = "verified" | "declared";

export type FieldValue = {
  status: FieldStatus;
  value: string | number | boolean | null;
};

export type ApplicationData = {
  firstName: string;
  lastInitial: string;
  fields: Record<string, FieldValue>;
  createdAt: string;
  autoApproveDocs?: boolean;
  bio?: string;
  motivation?: string;
  listingRef?: string;
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

export function encodeApplication(data: ApplicationData): string {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  return toBase64Url(bytes);
}

export function decodeApplication(encoded: string): ApplicationData | null {
  try {
    const bytes = fromBase64Url(encoded);
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as ApplicationData;
    if (
      typeof parsed?.firstName !== "string" ||
      typeof parsed?.lastInitial !== "string" ||
      typeof parsed?.fields !== "object" ||
      typeof parsed?.createdAt !== "string"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function expiryDate(createdAt: string, days = 30): Date {
  const d = new Date(createdAt);
  d.setDate(d.getDate() + days);
  return d;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
