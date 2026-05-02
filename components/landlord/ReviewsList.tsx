"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Star } from "lucide-react";
import { type Review } from "@/lib/reviews-store";

export function ReviewsList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/40 px-6 py-12 text-center">
        <Star className="mx-auto size-7 text-slate-600" />
        <p className="mt-3 text-sm text-slate-400">
          No reviews yet — be the first verified tenant to share their
          experience.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      <AnimatePresence initial={false}>
        {reviews.map((r, i) => (
          <motion.li
            key={r.createdAt + r.tenantFirstName + i}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur px-5 py-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    {r.tenantFirstName} {r.tenantLastInitial}.
                  </span>
                  {r.verifiedStay && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
                      <ShieldCheck className="size-2.5" strokeWidth={2.5} />
                      Verified stay
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, n) => (
                    <Star
                      key={n}
                      className={`size-3.5 ${
                        n < r.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-[10px] text-slate-500 text-right shrink-0">
                {formatDate(r.createdAt)}
                {(r.stayedFrom || r.stayedTo) && (
                  <div className="mt-0.5">
                    Stay: {r.stayedFrom ?? "?"} → {r.stayedTo ?? "present"}
                  </div>
                )}
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              {r.text}
            </p>
            <div className="mt-2.5 text-[10px] uppercase tracking-[0.16em] text-slate-500">
              {r.propertyAddress}
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
