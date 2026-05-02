"use client";

import { CriterionCard } from "@/components/apply/CriterionCard";
import { VerifyButton } from "@/components/apply/VerifyButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { VerificationBadge } from "@/components/VerificationBadge";
import {
  addApplicationToListing,
  listingIdFromEncoded,
} from "@/lib/applications-store";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  CRITERIA,
  criterionByKey,
  type Criterion,
} from "@/lib/criteria";
import {
  encodeApplication,
  type ApplicationData,
  type FieldValue,
} from "@/lib/encoding";
import { decodeListing, type Listing } from "@/lib/listing";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BedDouble,
  Building2,
  Check,
  Euro,
  Lock,
  MapPin,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

export default function ApplyPage() {
  return (
    <Suspense fallback={null}>
      <ApplyInner />
    </Suspense>
  );
}

function ApplyInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingParam = searchParams.get("listing");
  const listing: Listing | null = useMemo(
    () => (listingParam ? decodeListing(listingParam) : null),
    [listingParam]
  );

  const initialFields = useMemo<Record<string, FieldValue>>(() => {
    if (!listing) return {};
    const out: Record<string, FieldValue> = {};
    Object.entries(listing.preferences).forEach(([key, p]) => {
      if (p === "required" || p === "preferred") {
        const c = criterionByKey(key);
        if (!c) return;
        if (c.inputType === "toggle") {
          out[key] = { status: "declared", value: true };
        } else {
          out[key] = { status: "declared", value: "" };
        }
      }
    });
    return out;
  }, [listing]);

  const [firstName, setFirstName] = useState("");
  const [lastInitial, setLastInitial] = useState("");
  const [fields, setFields] = useState<Record<string, FieldValue>>(initialFields);
  const [autoApproveDocs, setAutoApproveDocs] = useState(false);
  const [bio, setBio] = useState("");
  const [motivation, setMotivation] = useState("");

  const grouped = useMemo(() => {
    const out: Record<string, Criterion[]> = {};
    for (const c of CRITERIA) {
      if (c.key === "realPerson") continue;
      (out[c.category] ||= []).push(c);
    }
    return out;
  }, []);

  const identityVerified = fields.realPerson?.status === "verified";
  const identityCriterion = useMemo(
    () => CRITERIA.find((c) => c.key === "realPerson"),
    []
  );

  const includedCount = Object.keys(fields).length;
  const verifiedCount = Object.values(fields).filter(
    (f) => f.status === "verified"
  ).length;

  const canGenerate =
    firstName.trim() !== "" && lastInitial.trim() !== "" && includedCount > 0;

  function toggleCriterion(key: string, on: boolean) {
    setFields((prev) => {
      const next = { ...prev };
      if (on) {
        const c = criterionByKey(key);
        if (!c) return prev;
        if (c.inputType === "toggle") {
          next[key] = { status: "declared", value: true };
        } else {
          next[key] = { status: "declared", value: "" };
        }
      } else {
        delete next[key];
      }
      return next;
    });
  }

  function setValue(key: string, value: string | number | boolean) {
    setFields((prev) => {
      const f = prev[key];
      if (!f) return prev;
      return { ...prev, [key]: { status: "declared", value } };
    });
  }

  function setVerified(key: string) {
    setFields((prev) => {
      const f = prev[key];
      if (!f) return prev;
      return { ...prev, [key]: { ...f, status: "verified" } };
    });
  }

  function handleGenerate() {
    if (!canGenerate) return;
    const data: ApplicationData = {
      firstName: firstName.trim(),
      lastInitial: lastInitial.trim().slice(0, 1).toUpperCase(),
      fields,
      createdAt: new Date().toISOString(),
      autoApproveDocs,
      bio: bio.trim() || undefined,
      motivation: motivation.trim() || undefined,
      listingRef: listingParam ?? undefined,
    };
    const encoded = encodeApplication(data);
    if (listingParam) {
      addApplicationToListing(listingIdFromEncoded(listingParam), encoded);
    }
    router.push(`/v/${encoded}`);
  }

  const previewData: ApplicationData = {
    firstName: firstName.trim() || "—",
    lastInitial: lastInitial.trim().slice(0, 1).toUpperCase(),
    fields,
    createdAt: new Date().toISOString(),
    autoApproveDocs,
    bio: bio.trim() || undefined,
    motivation: motivation.trim() || undefined,
    listingRef: listingParam ?? undefined,
  };

  const bioLabel = listing?.bioPrompt ?? "Tell landlords about yourself";
  const motivationLabel =
    listing?.motivationPrompt ?? "Why this place? (optional)";

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-0 h-[400px] bg-[radial-gradient(40%_50%_at_50%_-10%,rgb(16_185_129_/_0.10)_0%,transparent_70%)]"
      />
      <div aria-hidden className="grid-dots pointer-events-none fixed inset-0 -z-0" />

      <header className="relative z-10 border-b border-white/5 bg-slate-950/70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
              <ShieldCheck className="size-4" strokeWidth={2.25} />
            </span>
            <span className="font-display font-medium tracking-tight text-white">
              Rentiff
            </span>
          </Link>
          <div className="text-xs text-slate-400 hidden sm:flex items-center gap-1.5">
            <Lock className="size-3" />
            You choose what to share
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(380px,440px)] lg:gap-12">
          <div className="min-w-0">
            {listing ? (
              <ListingBanner listing={listing} />
            ) : (
              <>
                <motion.h1
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-white"
                >
                  Build a profile landlords can{" "}
                  <span className="italic text-emerald-300">trust</span>.
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="mt-3 text-slate-300 max-w-xl"
                >
                  Choose what to share. Verify what you can. Landlords get a
                  complete picture — you stay in control of what they see.
                </motion.p>
              </>
            )}

            <Stats included={includedCount} verified={verifiedCount} />

            <div className="mt-10">
              <IdentityStep
                verified={identityVerified}
                onVerified={() => {
                  if (!fields.realPerson) {
                    setFields((prev) => ({
                      ...prev,
                      realPerson: { status: "verified", value: true },
                    }));
                  } else {
                    setVerified("realPerson");
                  }
                }}
                landlordPreference={
                  identityCriterion
                    ? listing?.preferences[identityCriterion.key]
                    : undefined
                }
              />
            </div>

            <div className="mt-10 space-y-10">
              {CATEGORY_ORDER.map((cat) => (
                <section key={cat}>
                  <CategoryHeader
                    label={CATEGORY_LABELS[cat]}
                    locked={!identityVerified}
                  />
                  <div className="mt-3 grid gap-3">
                    {(grouped[cat] || []).map((c) => (
                      <CriterionCard
                        key={c.key}
                        criterion={c}
                        field={fields[c.key]}
                        landlordPreference={listing?.preferences[c.key]}
                        verifyLockReason={
                          !identityVerified
                            ? "Verify identity first"
                            : undefined
                        }
                        onToggle={(on) => toggleCriterion(c.key, on)}
                        onValueChange={(v) => setValue(c.key, v)}
                        onVerified={() => setVerified(c.key)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <section className="mt-12 rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur">
              <h2 className="text-base font-semibold text-white">
                A few words from you
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Free-text introductions help landlords see the person behind
                the badge. Both fields are optional.
              </p>
              <div className="mt-4 space-y-4">
                <div>
                  <Label className="text-xs font-medium text-slate-300">
                    {bioLabel}
                  </Label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 500))}
                    rows={3}
                    placeholder="A short bio: your work, your interests, what you'd add to the building."
                    className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 resize-none"
                  />
                  <div className="mt-1 text-right text-[10px] text-slate-500">
                    {bio.length}/500
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-300">
                    {motivationLabel}
                  </Label>
                  <textarea
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value.slice(0, 500))}
                    rows={3}
                    placeholder={
                      listing
                        ? "Why this place feels right for you."
                        : "Why you're looking, what you're after, anything specific."
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 resize-none"
                  />
                  <div className="mt-1 text-right text-[10px] text-slate-500">
                    {motivation.length}/500
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-white flex items-center gap-1.5">
                    <Zap className="size-4 text-amber-400" />
                    Auto-release source documents
                  </h2>
                  <p className="mt-1 text-sm text-slate-400 max-w-md">
                    Skip the approval step — landlords can immediately access
                    source documents for your verified items.
                  </p>
                </div>
                <Switch
                  checked={autoApproveDocs}
                  onCheckedChange={(c: boolean) => setAutoApproveDocs(c)}
                />
              </div>
              {autoApproveDocs && (
                <p className="mt-3 text-[11px] text-amber-200 bg-amber-500/10 rounded-md px-3 py-2 ring-1 ring-amber-500/30">
                  Anyone with the link will be able to download source
                  documents without your approval.
                </p>
              )}
            </section>

            <section className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur">
              <h2 className="text-base font-semibold text-white">Your name</h2>
              <p className="mt-1 text-sm text-slate-400">
                First name and last initial only. Landlords don&apos;t need
                your full name to evaluate you.
              </p>
              <div className="mt-4 grid grid-cols-[1fr_88px] gap-3">
                <div>
                  <Label className="text-xs font-medium text-slate-300">
                    First name
                  </Label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Lotte"
                    className="mt-1 bg-slate-950/60 border-white/10 text-slate-100 placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-300">
                    Last initial
                  </Label>
                  <Input
                    value={lastInitial}
                    onChange={(e) =>
                      setLastInitial(
                        e.target.value.replace(/[^a-zA-Z]/g, "").slice(0, 1)
                      )
                    }
                    maxLength={1}
                    placeholder="V"
                    className="mt-1 bg-slate-950/60 border-white/10 text-slate-100 placeholder:text-slate-500 text-center uppercase"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-medium text-emerald-950 shadow-[0_0_30px_rgb(16_185_129_/_0.20)] transition hover:bg-emerald-400 hover:shadow-[0_0_40px_rgb(16_185_129_/_0.35)] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none"
              >
                {listing ? "Submit application" : "Generate shareable link"}
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </button>
              {!canGenerate && (
                <p className="mt-2 text-center text-[11px] text-slate-500">
                  Add your name and at least one criterion to continue.
                </p>
              )}
            </section>
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-medium">
                Live preview
              </span>
              <span className="text-[10px] text-slate-500">
                Updates as you toggle
              </span>
            </div>
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-8 -z-10 bg-[radial-gradient(60%_60%_at_50%_50%,rgb(16_185_129_/_0.10)_0%,transparent_70%)]"
              />
              <VerificationBadge
                data={previewData}
                listing={listing ?? undefined}
                showQR={false}
              />
            </div>
            <p className="mt-3 text-center text-[11px] text-slate-500">
              This is exactly what landlords will see.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

function ListingBanner({ listing }: { listing: Listing }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.08] to-transparent p-5 backdrop-blur"
    >
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-emerald-300/90 font-medium">
        <Building2 className="size-3" />
        Applying for
      </div>
      <h1 className="font-display mt-1 text-2xl sm:text-3xl font-medium tracking-tight text-white">
        {listing.title}
      </h1>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
        <span className="inline-flex items-center gap-1">
          <Euro className="size-3 text-emerald-300" />
          <span className="font-semibold text-white">
            €{listing.rent.toLocaleString("nl-NL")}
          </span>
          <span className="text-slate-400">/ month</span>
        </span>
        {listing.bedrooms > 0 && (
          <span className="inline-flex items-center gap-1">
            <BedDouble className="size-3 text-emerald-300" />
            {listing.bedrooms} bedroom{listing.bedrooms === 1 ? "" : "s"}
          </span>
        )}
        {listing.address && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3 text-emerald-300" />
            {listing.address}
          </span>
        )}
      </div>
      <p className="mt-3 text-[11px] text-slate-400">
        Items the landlord marked as{" "}
        <span className="text-rose-300 font-medium">required</span> or{" "}
        <span className="text-emerald-300 font-medium">preferred</span> have
        been pre-selected. You can adjust anything below.
      </p>
    </motion.div>
  );
}

function CategoryHeader({
  label,
  locked,
}: {
  label: string;
  locked?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-3">
      <h2
        className={`text-xs uppercase tracking-[0.22em] font-semibold ${
          locked ? "text-slate-500" : "text-slate-300"
        }`}
      >
        {label}
      </h2>
      {locked && (
        <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
          <Lock className="size-2.5" />
          Verify after Step 1
        </span>
      )}
      <div className="h-px flex-1 bg-white/10" />
    </div>
  );
}

function IdentityStep({
  verified,
  onVerified,
  landlordPreference,
}: {
  verified: boolean;
  onVerified: () => void;
  landlordPreference?: ReturnType<
    typeof import("@/lib/listing").preferenceColor
  > extends infer R
    ? import("@/lib/listing").CriterionPreference | undefined
    : never;
}) {
  return (
    <motion.div
      layout
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-2xl border backdrop-blur ${
        verified
          ? "border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.07] via-emerald-500/[0.02] to-transparent"
          : "border-emerald-500/40 bg-gradient-to-br from-emerald-500/[0.10] via-emerald-500/[0.04] to-transparent shadow-[0_0_50px_rgb(16_185_129_/_0.18)]"
      }`}
    >
      {!verified && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"
        />
      )}

      <AnimatePresence mode="wait" initial={false}>
        {verified ? (
          <motion.div
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="p-5 flex items-center gap-4"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgb(16_185_129_/_0.18)]">
              <Check className="size-5 text-slate-950" strokeWidth={3} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-[0.22em] text-emerald-300 font-semibold">
                Step 1 — Complete
              </div>
              <h3 className="font-display mt-0.5 text-lg font-medium tracking-tight text-white">
                Identity verified via DigiD
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Other claims can now be cross-referenced with Dutch services.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="todo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="p-6"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.22em] text-emerald-300 font-semibold">
                Step 1 — Start here
              </span>
              {landlordPreference === "required" && (
                <span className="rounded-full bg-rose-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-rose-300 ring-1 ring-inset ring-rose-500/30">
                  Required by landlord
                </span>
              )}
            </div>
            <h3 className="font-display mt-2 text-2xl font-medium tracking-tight text-white">
              Verify your identity first
            </h3>
            <p className="mt-2 text-sm text-slate-300 max-w-lg leading-relaxed">
              Identity is the foundation of every other verification. Without
              it, your income, employment, and other claims can&apos;t be
              cross-referenced with Dutch services. Takes about 30 seconds.
            </p>
            <div className="mt-5">
              <VerifyButton
                source="DigiD"
                isVerified={false}
                onVerified={onVerified}
                size="lg"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Stats({
  included,
  verified,
}: {
  included: number;
  verified: number;
}) {
  return (
    <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-xs text-slate-300 backdrop-blur">
      <span>
        <span className="font-semibold text-white">{included}</span> included
      </span>
      <span className="size-1 rounded-full bg-white/20" />
      <span>
        <span className="font-semibold text-emerald-300">{verified}</span>{" "}
        verified
      </span>
    </div>
  );
}
