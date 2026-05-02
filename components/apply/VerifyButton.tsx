"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Lock, ShieldCheck } from "lucide-react";
import { useCallback, useRef, useState } from "react";

type Stage = "idle" | "connecting" | "reading" | "verifying" | "success";
type Size = "sm" | "lg";

const STAGE_TEXT: Record<Exclude<Stage, "idle" | "success">, string> = {
  connecting: "Connecting to",
  reading: "Reading data from",
  verifying: "Verifying with",
};

const SIZE_CLASS: Record<Size, { pill: string; icon: string; text: string }> = {
  sm: {
    pill: "h-7 px-3 text-xs",
    icon: "size-3.5",
    text: "text-xs",
  },
  lg: {
    pill: "h-11 px-5 text-sm",
    icon: "size-4",
    text: "text-sm",
  },
};

export function VerifyButton({
  source,
  isVerified,
  onVerified,
  disabled,
  lockReason,
  size = "sm",
}: {
  source: string;
  isVerified: boolean;
  onVerified: () => void;
  disabled?: boolean;
  lockReason?: string;
  size?: Size;
}) {
  const [stage, setStage] = useState<Stage>("idle");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sz = SIZE_CLASS[size];

  const start = useCallback(() => {
    if (stage !== "idle" || disabled || lockReason) return;
    setStage("connecting");
    const t1 = setTimeout(() => setStage("reading"), 600);
    const t2 = setTimeout(() => setStage("verifying"), 1200);
    const t3 = setTimeout(() => setStage("success"), 1600);
    const t4 = setTimeout(() => {
      onVerified();
      setStage("idle");
    }, 2150);
    timersRef.current = [t1, t2, t3, t4];
  }, [stage, disabled, lockReason, onVerified]);

  if (isVerified) {
    return (
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
        className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 ${sz.pill} font-medium text-emerald-300 ring-1 ring-emerald-500/30`}
      >
        <Check className={sz.icon} strokeWidth={3} />
        Verified via {source}
      </motion.div>
    );
  }

  if (lockReason) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] ${sz.pill} font-medium text-slate-500 cursor-not-allowed`}
        title={lockReason}
      >
        <Lock className={sz.icon} />
        {lockReason}
      </span>
    );
  }

  if (stage === "idle") {
    return (
      <button
        type="button"
        onClick={start}
        disabled={disabled}
        className={`inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 ${sz.pill} font-medium text-slate-200 transition hover:border-emerald-400/60 hover:bg-emerald-500/10 hover:text-emerald-200 disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <ShieldCheck className={sz.icon} />
        Verify with {source}
      </button>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full bg-slate-100 ${sz.pill} font-medium text-slate-900`}
    >
      <AnimatePresence mode="wait">
        {stage !== "success" ? (
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-2"
          >
            <Loader2 className={`${sz.icon} animate-spin text-emerald-600`} />
            <span className="whitespace-nowrap">
              {STAGE_TEXT[stage as Exclude<Stage, "idle" | "success">]} {source}
              <span className="ml-px animate-pulse">…</span>
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 16 }}
            className="flex items-center gap-1.5"
          >
            <span
              className={`flex ${size === "lg" ? "size-5" : "size-4"} items-center justify-center rounded-full bg-emerald-500`}
            >
              <Check
                className={size === "lg" ? "size-3.5" : "size-3"}
                strokeWidth={3}
              />
            </span>
            <span>Verified</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
