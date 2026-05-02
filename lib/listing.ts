export type CriterionPreference = "required" | "preferred" | "optional";

export type Listing = {
  title: string;
  rent: number;
  bedrooms: number;
  address: string;
  description?: string;
  preferences: Record<string, CriterionPreference>;
  bioPrompt?: string;
  motivationPrompt?: string;
  landlordProfileRef?: string;
  photos?: string[];
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

export function encodeListing(listing: Listing): string {
  const json = JSON.stringify(listing);
  return toBase64Url(new TextEncoder().encode(json));
}

export function decodeListing(encoded: string): Listing | null {
  try {
    const json = new TextDecoder().decode(fromBase64Url(encoded));
    const parsed = JSON.parse(json) as Listing;
    if (
      typeof parsed?.title !== "string" ||
      typeof parsed?.rent !== "number" ||
      typeof parsed?.preferences !== "object"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export const PREFERENCE_LABELS: Record<CriterionPreference, string> = {
  required: "Required",
  preferred: "Preferred",
  optional: "Optional",
};

export function preferenceColor(p: CriterionPreference): {
  bg: string;
  ring: string;
  text: string;
  dot: string;
} {
  switch (p) {
    case "required":
      return {
        bg: "bg-rose-500/15",
        ring: "ring-rose-500/30",
        text: "text-rose-300",
        dot: "bg-rose-400",
      };
    case "preferred":
      return {
        bg: "bg-emerald-500/15",
        ring: "ring-emerald-500/30",
        text: "text-emerald-300",
        dot: "bg-emerald-400",
      };
    case "optional":
      return {
        bg: "bg-slate-500/15",
        ring: "ring-slate-500/30",
        text: "text-slate-300",
        dot: "bg-slate-400",
      };
  }
}
