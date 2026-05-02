"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Download, FileSearch, ShieldCheck, Zap } from "lucide-react";
import { VerificationBadge } from "@/components/VerificationBadge";
import type { ApplicationData } from "@/lib/encoding";

export function SharedView({
  data,
  shareUrl,
}: {
  data: ApplicationData;
  shareUrl: string;
}) {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <BackgroundDecor />

      <header className="relative z-10 mx-auto flex max-w-3xl items-center justify-between px-5 pt-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
            <ShieldCheck className="size-4" strokeWidth={2.25} />
          </span>
          <span className="font-display font-medium tracking-tight text-white">
            Rentiff
          </span>
        </Link>
        <Link
          href="/apply"
          className="text-xs font-medium text-slate-400 hover:text-white transition"
        >
          Create your own →
        </Link>
      </header>

      <section className="relative z-10 mx-auto max-w-xl px-5 pt-10 pb-40">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center mb-6"
        >
          <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-medium">
            Verified introduction
          </div>
          <p className="mt-1 text-sm text-slate-400">
            What the tenant chose to share — every line labelled, every source
            named.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <VerificationBadge data={data} shareUrl={shareUrl} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mt-7 flex flex-col items-center"
        >
          {data.autoApproveDocs ? (
            <button
              type="button"
              onClick={() =>
                showToast("Source documents released — pre-approved by tenant")
              }
              className="group inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-medium text-emerald-950 shadow-[0_0_30px_rgb(16_185_129_/_0.30)] transition hover:bg-emerald-400 hover:shadow-[0_0_40px_rgb(16_185_129_/_0.45)]"
            >
              <Download className="size-4 transition group-hover:translate-y-0.5" />
              Get source documents
            </button>
          ) : (
            <button
              type="button"
              onClick={() => showToast("Request sent to tenant for approval")}
              className="group inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur ring-1 ring-white/15 transition hover:bg-white/15 hover:ring-emerald-500/40"
            >
              <FileSearch className="size-4 text-slate-300 transition group-hover:text-emerald-300" />
              Request source documents
            </button>
          )}

          {data.autoApproveDocs ? (
            <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-emerald-300">
              <Zap className="size-3" />
              Pre-approved by tenant — instant access
            </p>
          ) : (
            <p className="mt-3 text-[11px] text-slate-500">
              The tenant must approve before any source document is shared.
            </p>
          )}
        </motion.div>
      </section>

      <footer className="relative z-10 pb-8 text-center text-[11px] text-slate-500">
        Rentiff is a hackathon project. Not affiliated with any government
        service.
      </footer>

      <div className="pointer-events-none fixed bottom-3 right-3 z-20 select-none rounded-md border border-white/10 bg-slate-900/70 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.18em] text-slate-400 backdrop-blur">
        Demo — not a real verification service
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-8 left-1/2 z-30 -translate-x-1/2"
          >
            <div className="flex items-center gap-2.5 rounded-full bg-slate-900 ring-1 ring-white/10 px-4 py-2.5 text-sm text-white shadow-2xl">
              <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500">
                <Check className="size-3 text-slate-950" strokeWidth={3} />
              </span>
              {toast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function BackgroundDecor() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[520px] bg-[radial-gradient(60%_50%_at_50%_-10%,rgb(16_185_129_/_0.16)_0%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="grid-dots pointer-events-none absolute inset-0 -z-0"
      />
    </>
  );
}
