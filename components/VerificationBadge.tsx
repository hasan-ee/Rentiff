"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Building2, Check, ShieldCheck, Sparkles } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { CRITERIA, criterionByKey, formatCriterionValue } from "@/lib/criteria";
import {
  type ApplicationData,
  expiryDate,
  formatDate,
} from "@/lib/encoding";
import { decodeListing, type Listing } from "@/lib/listing";

type Props = {
  data: ApplicationData;
  shareUrl?: string;
  showQR?: boolean;
  listing?: Listing;
};

type Entry = {
  key: string;
  label: string;
  value: unknown;
  source?: string;
};

function partition(data: ApplicationData): {
  verified: Entry[];
  declared: Entry[];
} {
  const verified: Entry[] = [];
  const declared: Entry[] = [];
  for (const c of CRITERIA) {
    const f = data.fields[c.key];
    if (!f) continue;
    if (c.inputType === "toggle" && f.value === false) continue;
    const entry: Entry = {
      key: c.key,
      label: c.label,
      value: f.value,
      source: c.verifySource,
    };
    if (f.status === "verified") verified.push(entry);
    else declared.push(entry);
  }
  return { verified, declared };
}

export function VerificationBadge({
  data,
  shareUrl,
  showQR = true,
  listing,
}: Props) {
  const { verified, declared } = partition(data);
  const expires = expiryDate(data.createdAt);
  const hasBio = !!data.bio?.trim();
  const hasMotivation = !!data.motivation?.trim();
  const empty =
    verified.length === 0 &&
    declared.length === 0 &&
    !hasBio &&
    !hasMotivation;
  const resolvedListing =
    listing ?? (data.listingRef ? decodeListing(data.listingRef) : null);

  return (
    <div className="relative w-full max-w-[480px] mx-auto">
      <div
        className="relative overflow-hidden rounded-3xl border border-white/10 shadow-[0_20px_70px_-20px_rgb(0_0_0_/_0.6)]"
        style={{
          background:
            "radial-gradient(120% 100% at 0% 0%, #1e293b 0%, #0f172a 50%, #020617 100%)",
        }}
      >
        <div className="holographic-stripe h-2 w-full" />

        {resolvedListing && (
          <div className="px-7 pt-4 pb-3 border-b border-white/5 flex items-start gap-2.5">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
              <Building2 className="size-3" strokeWidth={2.25} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[9px] uppercase tracking-[0.22em] text-emerald-300/80 font-medium">
                Submitted for
              </div>
              <div className="text-sm font-medium text-white truncate">
                {resolvedListing.title}
              </div>
            </div>
          </div>
        )}

        <div className="px-7 pt-6 pb-1 flex items-start justify-between">
          <div>
            <div className="font-display text-[26px] font-medium tracking-tight text-white">
              Rentiff
            </div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500 mt-0.5">
              Verified Application
            </div>
          </div>
          <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
            <ShieldCheck className="size-4" strokeWidth={2.25} />
          </div>
        </div>

        <div className="px-7 pt-6 pb-5">
          <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500 mb-2">
            Tenant
          </div>
          <div className="font-display text-[32px] font-medium tracking-tight text-white leading-none">
            {data.firstName || "—"} {data.lastInitial}
            {data.lastInitial ? "." : ""}
          </div>
        </div>

        {empty && (
          <div className="mx-7 mb-6 rounded-xl border border-dashed border-white/10 px-5 py-8 text-center text-sm text-slate-400">
            No criteria added yet.
            <div className="text-xs mt-1 text-slate-500">
              Toggle items to populate this badge.
            </div>
          </div>
        )}

        {verified.length > 0 && (
          <div className="px-7 pb-5">
            <SectionHeader>Verified information</SectionHeader>
            <ul className="mt-3 space-y-3.5">
              <AnimatePresence initial={false}>
                {verified.map((e) => (
                  <motion.li
                    key={`v-${e.key}`}
                    layout
                    initial={{ opacity: 0, y: 6, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -6, height: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgb(16_185_129_/_0.18),0_0_18px_rgb(16_185_129_/_0.35)]">
                      <Check
                        className="size-3 text-slate-950"
                        strokeWidth={3.5}
                      />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-100">
                        {e.label}
                        {formattedValue(e.key, e.value) && (
                          <span className="text-slate-300 font-normal">
                            {" — "}
                            {formattedValue(e.key, e.value)}
                          </span>
                        )}
                      </div>
                      {e.source && (
                        <div className="text-[9.5px] uppercase tracking-[0.18em] text-slate-500 mt-0.5">
                          via {e.source}
                        </div>
                      )}
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        )}

        {verified.length > 0 && declared.length > 0 && (
          <div className="mx-7 border-t border-dashed border-white/10" />
        )}

        {declared.length > 0 && (
          <div className="px-7 pt-4 pb-5">
            <SectionHeader>Self-declared</SectionHeader>
            <div className="text-[10px] italic text-slate-500 mb-3">
              Tenant&apos;s own statement
            </div>
            <ul className="space-y-3.5">
              <AnimatePresence initial={false}>
                {declared.map((e) => (
                  <motion.li
                    key={`d-${e.key}`}
                    layout
                    initial={{ opacity: 0, y: 6, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -6, height: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-amber-400 shadow-[0_0_0_3px_rgb(245_158_11_/_0.20),0_0_12px_rgb(245_158_11_/_0.40)]" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-100">
                        {e.label}
                        {formattedValue(e.key, e.value) && (
                          <span className="text-slate-300 font-normal">
                            {" — "}
                            {formattedValue(e.key, e.value)}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        )}

        {(hasBio || hasMotivation) &&
          (verified.length > 0 || declared.length > 0) && (
            <div className="mx-7 border-t border-dashed border-white/10" />
          )}

        {hasBio && (
          <div className="px-7 pt-4 pb-3">
            <SectionHeader>About me</SectionHeader>
            <p className="mt-2 text-[12.5px] leading-relaxed text-slate-300 italic">
              &ldquo;{data.bio}&rdquo;
            </p>
          </div>
        )}

        {hasMotivation && (
          <div className="px-7 pb-4">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-slate-500 font-medium">
              <Sparkles className="size-3 text-emerald-300" />
              Why this place
            </div>
            <p className="mt-2 text-[12.5px] leading-relaxed text-slate-300 italic">
              &ldquo;{data.motivation}&rdquo;
            </p>
          </div>
        )}

        <div className="px-7 pt-3 pb-6 mt-1 border-t border-white/5 flex items-end justify-between gap-4">
          {showQR && shareUrl ? (
            <div className="rounded-md bg-white p-1.5 ring-1 ring-white/20">
              <QRCodeSVG
                value={shareUrl}
                size={56}
                level="M"
                bgColor="#ffffff"
                fgColor="#020617"
              />
            </div>
          ) : (
            <div className="size-[68px] rounded-md bg-white/5 ring-1 ring-white/10" />
          )}
          <div className="flex flex-col items-end gap-2">
            <FoilStamp />
            <div className="text-[9.5px] uppercase tracking-[0.18em] text-slate-500">
              Expires {formatDate(expires)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-medium">
      {children}
    </div>
  );
}

function FoilStamp() {
  return (
    <div className="foil-stamp inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 ring-1 ring-white/40 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.6)]">
      <ShieldCheck className="size-3 text-slate-900 relative z-[1]" strokeWidth={2.5} />
      <span className="relative z-[1] text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-900">
        Verified by Rentiff
      </span>
    </div>
  );
}

function formattedValue(key: string, value: unknown): string | null {
  const c = criterionByKey(key);
  if (!c) return null;
  return formatCriterionValue(c, value);
}
