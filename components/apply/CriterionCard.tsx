"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { VerifyButton } from "./VerifyButton";
import type { Criterion } from "@/lib/criteria";
import type { FieldValue } from "@/lib/encoding";
import {
  type CriterionPreference,
  PREFERENCE_LABELS,
  preferenceColor,
} from "@/lib/listing";

type Props = {
  criterion: Criterion;
  field: FieldValue | undefined;
  landlordPreference?: CriterionPreference;
  verifyLockReason?: string;
  onToggle: (on: boolean) => void;
  onValueChange: (value: string | number | boolean) => void;
  onVerified: () => void;
};

export function CriterionCard({
  criterion,
  field,
  landlordPreference,
  verifyLockReason,
  onToggle,
  onValueChange,
  onVerified,
}: Props) {
  const included = !!field;
  const verified = field?.status === "verified";
  const declared = field?.status === "declared";
  const hasValue =
    field !== undefined &&
    field.value !== "" &&
    field.value !== null &&
    field.value !== undefined;

  const showVerifyButton =
    included &&
    criterion.verifiable &&
    (criterion.inputType === "toggle" || hasValue);

  return (
    <motion.div
      layout
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`group rounded-2xl border transition-all ${
        included
          ? "border-emerald-500/40 bg-slate-900/70 shadow-[0_0_0_1px_rgb(16_185_129_/_0.10)_inset,0_8px_30px_-12px_rgb(16_185_129_/_0.18)]"
          : "border-white/8 bg-slate-900/40 hover:border-white/20 hover:bg-slate-900/60"
      }`}
    >
      <button
        type="button"
        onClick={() => onToggle(!included)}
        className="w-full text-left px-5 py-4 cursor-pointer rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500/60 focus-visible:outline-offset-2"
      >
        <div className="flex items-start gap-3">
          <ToggleIndicator on={included} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0 flex-wrap">
                <span
                  className={`text-sm font-medium leading-tight transition-colors ${
                    included ? "text-white" : "text-slate-200"
                  }`}
                >
                  {criterion.label}
                </span>
                {landlordPreference && (
                  <PreferenceBadge preference={landlordPreference} />
                )}
              </div>
              <StatusPill verified={verified} declared={declared} />
            </div>
            {criterion.helpText && (
              <p className="mt-1 flex items-start gap-1 text-[11px] text-slate-400">
                <Info className="size-3 mt-px shrink-0" />
                <span>{criterion.helpText}</span>
              </p>
            )}
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {included && (
          <motion.div
            key="body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div
              className="px-5 pt-1 pb-4 ml-8 space-y-2.5"
              onClick={(e) => e.stopPropagation()}
            >
              {criterion.inputType !== "toggle" && (
                <FieldInput
                  criterion={criterion}
                  value={field?.value}
                  onChange={onValueChange}
                  disabled={verified}
                />
              )}

              {showVerifyButton && (
                <VerifyButton
                  source={criterion.verifySource ?? "source"}
                  isVerified={verified}
                  onVerified={onVerified}
                  lockReason={verified ? undefined : verifyLockReason}
                />
              )}

              {!criterion.verifiable && declared && (
                <p className="text-[11px] text-amber-300/90">
                  Self-declared. This will appear as the tenant&apos;s own
                  statement on the badge.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ToggleIndicator({ on }: { on: boolean }) {
  return (
    <motion.span
      animate={{
        backgroundColor: on ? "rgb(16 185 129)" : "rgba(0,0,0,0)",
        borderColor: on ? "rgb(16 185 129)" : "rgb(71 85 105)",
      }}
      transition={{ duration: 0.18 }}
      className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2"
    >
      <motion.span
        initial={false}
        animate={{ scale: on ? 1 : 0, opacity: on ? 1 : 0 }}
        transition={{ duration: 0.16 }}
        className="flex"
      >
        <Check className="size-3 text-slate-950" strokeWidth={3.5} />
      </motion.span>
    </motion.span>
  );
}

function PreferenceBadge({
  preference,
}: {
  preference: CriterionPreference;
}) {
  const c = preferenceColor(preference);
  return (
    <span
      className={`rounded-full ${c.bg} ${c.text} ring-1 ring-inset ${c.ring} px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider`}
    >
      {PREFERENCE_LABELS[preference]}
    </span>
  );
}

function StatusPill({
  verified,
  declared,
}: {
  verified: boolean;
  declared: boolean;
}) {
  if (verified) {
    return (
      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
        Verified
      </span>
    );
  }
  if (declared) {
    return (
      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300 ring-1 ring-inset ring-amber-500/30">
        Self-declared
      </span>
    );
  }
  return null;
}

function FieldInput({
  criterion,
  value,
  onChange,
  disabled,
}: {
  criterion: Criterion;
  value: FieldValue["value"] | undefined;
  onChange: (v: string | number | boolean) => void;
  disabled?: boolean;
}) {
  if (criterion.inputType === "select" && criterion.options) {
    return (
      <select
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-9 w-full rounded-lg border border-white/10 bg-slate-950/60 px-2.5 text-sm text-slate-100 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60"
      >
        <option value="">Select…</option>
        {criterion.options.map((opt) => (
          <option key={opt} value={opt} className="bg-slate-900">
            {opt}
          </option>
        ))}
      </select>
    );
  }

  if (criterion.inputType === "number") {
    return (
      <Input
        type="number"
        inputMode="numeric"
        value={typeof value === "number" ? value : ""}
        onChange={(e) => {
          const n = e.target.value === "" ? "" : Number(e.target.value);
          onChange(n === "" ? "" : (n as number));
        }}
        placeholder={
          criterion.key === "income"
            ? "e.g. 3850"
            : criterion.key === "age"
              ? "e.g. 28"
              : ""
        }
        disabled={disabled}
        className="bg-slate-950/60 border-white/10 text-slate-100 placeholder:text-slate-500"
      />
    );
  }

  return (
    <Input
      type="text"
      value={typeof value === "string" ? value : ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholderFor(criterion.key)}
      disabled={disabled}
      className="bg-slate-950/60 border-white/10 text-slate-100 placeholder:text-slate-500"
    />
  );
}

function placeholderFor(key: string): string {
  switch (key) {
    case "currentAddress":
      return "Street, postal code, city";
    case "selfEmployed":
      return "12345678";
    case "studentEnrollment":
      return "University of Amsterdam";
    case "reasonForMoving":
      return "Closer to work, new job, etc.";
    case "household":
      return "Single, couple, family with children";
    case "languages":
      return "Dutch, English, Spanish";
    case "moveInDate":
      return "1 June 2025";
    default:
      return "";
  }
}
