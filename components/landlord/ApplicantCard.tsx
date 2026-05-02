"use client";

import { motion } from "framer-motion";
import { Check, ShieldCheck, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { VerificationBadge } from "@/components/VerificationBadge";
import {
  CRITERIA,
  criterionByKey,
  formatCriterionValue,
} from "@/lib/criteria";
import type { ApplicationData } from "@/lib/encoding";

export type MatchResult = {
  matches: number;
  total: number;
  missing: string[];
};

export function evaluateMatch(
  applicant: ApplicationData,
  required: Set<string>
): MatchResult {
  const missing: string[] = [];
  let matches = 0;
  Array.from(required).forEach((key) => {
    const f = applicant.fields[key];
    const c = criterionByKey(key);
    if (!f || f.status !== "verified") {
      missing.push(key);
      return;
    }
    if (c?.inputType === "toggle" && f.value !== true) {
      missing.push(key);
      return;
    }
    matches++;
  });
  return { matches, total: required.size, missing };
}

type Entry = { key: string; label: string; value: unknown; source?: string };

function topVerified(applicant: ApplicationData, count: number): Entry[] {
  const out: Entry[] = [];
  for (const c of CRITERIA) {
    const f = applicant.fields[c.key];
    if (!f || f.status !== "verified") continue;
    if (c.inputType === "toggle" && f.value !== true) continue;
    out.push({
      key: c.key,
      label: c.label,
      value: f.value,
      source: c.verifySource,
    });
    if (out.length >= count) break;
  }
  return out;
}

export function ApplicantCard({
  applicant,
  match,
}: {
  applicant: ApplicationData;
  match: MatchResult | null;
}) {
  const verified = topVerified(applicant, 4);
  const verifiedTotal = Object.entries(applicant.fields).filter(
    ([, f]) => f.status === "verified"
  ).length;
  const declaredTotal = Object.entries(applicant.fields).filter(
    ([, f]) => f.status === "declared"
  ).length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_50px_-20px_rgb(0_0_0_/_0.6)]"
        style={{
          background:
            "radial-gradient(120% 100% at 0% 0%, #1e293b 0%, #0f172a 50%, #020617 100%)",
        }}
      >
        <div className="holographic-stripe h-1.5 w-full" />

        <div className="px-5 pt-4 pb-2 flex items-start justify-between">
          <div>
            <div className="font-display text-base font-medium tracking-tight text-white">
              Rentiff
            </div>
            <div className="text-[9px] uppercase tracking-[0.22em] text-slate-500 mt-0.5">
              Verified Application
            </div>
          </div>
          <MatchPill match={match} />
        </div>

        <div className="px-5 pb-3">
          <div className="text-[9px] uppercase tracking-[0.22em] text-slate-500 mb-1">
            Tenant
          </div>
          <div className="font-display text-2xl font-medium tracking-tight text-white leading-none">
            {applicant.firstName} {applicant.lastInitial}.
          </div>
        </div>

        <div className="px-5 pb-3 space-y-2">
          {verified.map((e) => (
            <div key={e.key} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 shadow-[0_0_0_2px_rgb(16_185_129_/_0.18)]">
                <Check className="size-2.5 text-slate-950" strokeWidth={3.5} />
              </span>
              <div className="flex-1 min-w-0 text-[12px] leading-snug">
                <span className="font-medium text-slate-100">{e.label}</span>
                {formatCriterionValue(criterionByKey(e.key)!, e.value) && (
                  <span className="text-slate-300 font-normal">
                    {" — "}
                    {formatCriterionValue(criterionByKey(e.key)!, e.value)}
                  </span>
                )}
              </div>
            </div>
          ))}
          {verifiedTotal > verified.length && (
            <div className="ml-6 text-[11px] text-slate-500">
              + {verifiedTotal - verified.length} more verified
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              <span className="font-semibold text-emerald-300">
                {verifiedTotal}
              </span>{" "}
              verified
            </span>
            {declaredTotal > 0 && (
              <span>
                <span className="font-semibold text-amber-300">
                  {declaredTotal}
                </span>{" "}
                declared
              </span>
            )}
          </div>
          <FullBadgeDialog applicant={applicant} />
        </div>
      </div>
    </motion.div>
  );
}

function MatchPill({ match }: { match: MatchResult | null }) {
  if (!match || match.total === 0) {
    return (
      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-300 ring-1 ring-inset ring-emerald-500/30 inline-flex items-center gap-1">
        <ShieldCheck className="size-2.5" strokeWidth={2.5} />
        Verified
      </span>
    );
  }
  const fullMatch = match.matches === match.total;
  if (fullMatch) {
    return (
      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-300 ring-1 ring-inset ring-emerald-500/30 inline-flex items-center gap-1">
        <Check className="size-2.5" strokeWidth={3} />
        Matches all
      </span>
    );
  }
  return (
    <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-rose-300 ring-1 ring-inset ring-rose-500/30 inline-flex items-center gap-1">
      <X className="size-2.5" strokeWidth={3} />
      Misses {match.total - match.matches}
    </span>
  );
}

function FullBadgeDialog({ applicant }: { applicant: ApplicationData }) {
  return (
    <Dialog>
      <DialogTrigger className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400 hover:text-white transition">
        View full →
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[520px] bg-transparent p-0 border-0 ring-0 shadow-none"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">
          {applicant.firstName} {applicant.lastInitial}. — full badge
        </DialogTitle>
        <VerificationBadge data={applicant} showQR={false} />
      </DialogContent>
    </Dialog>
  );
}
