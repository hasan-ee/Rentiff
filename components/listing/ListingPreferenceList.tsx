"use client";

import { Info } from "lucide-react";
import {
  type CriterionPreference,
  PREFERENCE_LABELS,
  preferenceColor,
} from "@/lib/listing";
import type { Criterion } from "@/lib/criteria";

type Item = { criterion: Criterion | undefined; preference: CriterionPreference };

export function ListingPreferenceList({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return (
      <p className="mt-5 text-sm text-slate-500 italic">
        The landlord didn&apos;t specify any criteria preferences.
      </p>
    );
  }
  return (
    <ul className="mt-5 space-y-2">
      {items.map(({ criterion, preference }) => {
        if (!criterion) return null;
        const c = preferenceColor(preference);
        return (
          <li
            key={criterion.key}
            className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"
          >
            <span
              className={`mt-1 size-2 shrink-0 rounded-full ${c.dot}`}
              aria-hidden
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-100">
                  {criterion.label}
                </span>
                <span
                  className={`inline-flex rounded-full ${c.bg} ${c.text} ring-1 ring-inset ${c.ring} px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider`}
                >
                  {PREFERENCE_LABELS[preference]}
                </span>
              </div>
              {criterion.verifySource && (
                <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500 mt-0.5">
                  via {criterion.verifySource}
                </div>
              )}
              {!criterion.legallyFilterable && (
                <p className="mt-1 flex items-start gap-1 text-[10.5px] text-amber-300/80">
                  <Info className="size-2.5 mt-px shrink-0" />
                  <span>Cannot be enforced as a hard filter</span>
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
