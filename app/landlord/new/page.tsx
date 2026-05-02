"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BedDouble,
  Building2,
  Camera,
  Euro,
  FileText,
  Info,
  Lock,
  ShieldCheck,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/landlord/ImageUploader";
import { addLandlordListing } from "@/lib/landlord-listings-store";
import {
  CRITERIA,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type Criterion,
} from "@/lib/criteria";
import {
  encodeListing,
  type CriterionPreference,
  type Listing,
  preferenceColor,
} from "@/lib/listing";
import {
  decodeProfile,
  LANDLORD_PROFILE_LOCAL_KEY,
  type LandlordProfile,
} from "@/lib/landlord-profile";

type PrefState = "skip" | CriterionPreference;

const SEGMENTS_FILTERABLE: PrefState[] = [
  "skip",
  "optional",
  "preferred",
  "required",
];
const SEGMENTS_NON_FILTERABLE: PrefState[] = ["skip", "optional", "preferred"];

const SEGMENT_LABELS: Record<PrefState, string> = {
  skip: "Skip",
  optional: "Optional",
  preferred: "Preferred",
  required: "Required",
};

export default function NewListingPage() {
  return (
    <Suspense fallback={null}>
      <NewListingInner />
    </Suspense>
  );
}

function NewListingInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const propertyParam = sp.get("property");
  const [title, setTitle] = useState("");
  const [rent, setRent] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [bioPrompt, setBioPrompt] = useState("");
  const [motivationPrompt, setMotivationPrompt] = useState(
    "Tell us why this place is right for you."
  );
  const [preferences, setPreferences] = useState<
    Record<string, CriterionPreference>
  >({});
  const [profileEncoded, setProfileEncoded] = useState<string | null>(null);
  const [profile, setProfile] = useState<LandlordProfile | null>(null);
  const [profileChecked, setProfileChecked] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LANDLORD_PROFILE_LOCAL_KEY);
      if (stored) {
        const decoded = decodeProfile(stored);
        if (decoded) {
          setProfileEncoded(stored);
          setProfile(decoded);
          // Prefill from a specific property if requested
          if (propertyParam !== null) {
            const idx = parseInt(propertyParam, 10);
            const p = decoded.properties[idx];
            if (p) {
              setAddress(p.address);
              if (p.description) setDescription(p.description);
              if (p.photoUrl) setPhotos([p.photoUrl]);
            }
          }
        }
      }
    } catch {
      // ignore
    } finally {
      setProfileChecked(true);
    }
  }, [propertyParam]);

  const grouped = useMemo(() => {
    const out: Record<string, Criterion[]> = {};
    for (const c of CRITERIA) (out[c.category] ||= []).push(c);
    return out;
  }, []);

  const askedCount = Object.keys(preferences).length;
  const requiredCount = Object.values(preferences).filter(
    (p) => p === "required"
  ).length;

  function setPref(key: string, p: PrefState) {
    setPreferences((prev) => {
      const next = { ...prev };
      if (p === "skip") delete next[key];
      else next[key] = p;
      return next;
    });
  }

  const canPublish =
    title.trim() !== "" && Number(rent) > 0 && askedCount > 0;

  function handlePublish() {
    if (!canPublish) return;
    const listing: Listing = {
      title: title.trim(),
      rent: Number(rent),
      bedrooms: Number(bedrooms) || 0,
      address: address.trim(),
      description: description.trim() || undefined,
      preferences,
      bioPrompt: bioPrompt.trim() || undefined,
      motivationPrompt: motivationPrompt.trim() || undefined,
      landlordProfileRef: profileEncoded ?? undefined,
      photos: photos.length > 0 ? photos : undefined,
      createdAt: new Date().toISOString(),
    };
    const encoded = encodeListing(listing);
    addLandlordListing(encoded);
    router.push(`/landlord/listings/${encoded}`);
  }

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-0 h-[400px] bg-[radial-gradient(40%_50%_at_50%_-10%,rgb(16_185_129_/_0.10)_0%,transparent_70%)]"
      />
      <div aria-hidden className="grid-dots pointer-events-none fixed inset-0 -z-0" />

      <header className="relative z-10 border-b border-white/5 bg-slate-950/70 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
              <ShieldCheck className="size-4" strokeWidth={2.25} />
            </span>
            <span className="font-display font-medium tracking-tight text-white">
              Rentiff
            </span>
          </Link>
          <Link
            href="/landlord"
            className="text-xs font-medium text-slate-400 hover:text-white transition"
          >
            ← Back to dashboard
          </Link>
        </div>
      </header>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10 lg:py-14">
        {!profileChecked ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-slate-900/40 p-8 h-40 animate-pulse" />
        ) : !profile ? (
          <ProfileGate />
        ) : (
          <>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-medium">
            For landlords
          </div>
          <h1 className="font-display mt-1 text-3xl sm:text-4xl font-medium tracking-tight text-white">
            Create a listing.{" "}
            <span className="italic text-emerald-300">Define what matters.</span>
          </h1>
          <p className="mt-3 text-slate-300 max-w-2xl">
            Pick the criteria you actually care about. Tenants applying through
            this listing will see what&apos;s required and what&apos;s
            preferred, and arrive with applications already shaped to your
            needs.
          </p>
          {profile && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-200">
              <ShieldCheck className="size-3.5" />
              Listing will be linked to your profile —{" "}
              <span className="font-semibold text-white">{profile.name}</span>
            </div>
          )}
        </motion.div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-emerald-300" />
              <h2 className="text-base font-semibold text-white">
                Listing details
              </h2>
            </div>
            <Field label="Title">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Sunny 2-bedroom apartment in De Pijp"
                className="bg-slate-950/60 border-white/10 text-slate-100 placeholder:text-slate-500"
              />
            </Field>
            <Field label="Address">
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ferdinand Bolstraat 100, Amsterdam"
                className="bg-slate-950/60 border-white/10 text-slate-100 placeholder:text-slate-500"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Monthly rent" icon={<Euro className="size-3" />}>
                <Input
                  type="number"
                  value={rent}
                  onChange={(e) => setRent(e.target.value)}
                  placeholder="1850"
                  className="bg-slate-950/60 border-white/10 text-slate-100 placeholder:text-slate-500"
                />
              </Field>
              <Field label="Bedrooms" icon={<BedDouble className="size-3" />}>
                <Input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  placeholder="2"
                  className="bg-slate-950/60 border-white/10 text-slate-100 placeholder:text-slate-500"
                />
              </Field>
            </div>
            <Field label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Bright corner apartment, fully furnished, close to Sarphatipark."
                rows={4}
                className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 resize-none"
              />
            </Field>
            <div>
              <Label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                <Camera className="size-3" />
                Photos (up to 4)
              </Label>
              <div className="mt-2">
                <ImageUploader values={photos} onChange={setPhotos} max={4} />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-emerald-300" />
              <h2 className="text-base font-semibold text-white">
                Free-text prompts (optional)
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Ask applicants to share a short bio and explain why they want
              this place. Both fields are optional for tenants.
            </p>
            <Field label="Bio prompt">
              <Input
                value={bioPrompt}
                onChange={(e) => setBioPrompt(e.target.value)}
                placeholder="Tell us a little about yourself."
                className="bg-slate-950/60 border-white/10 text-slate-100 placeholder:text-slate-500"
              />
            </Field>
            <Field label="Motivation prompt">
              <Input
                value={motivationPrompt}
                onChange={(e) => setMotivationPrompt(e.target.value)}
                placeholder="Why is this place right for you?"
                className="bg-slate-950/60 border-white/10 text-slate-100 placeholder:text-slate-500"
              />
            </Field>
          </section>
        </div>

        <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-300" />
              <h2 className="text-base font-semibold text-white">
                Verification preferences
              </h2>
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              {askedCount} asked · {requiredCount} required
            </div>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            For each criterion, tell tenants how much it matters. You can&apos;t
            require non-filterable criteria — Dutch equal-treatment law.
          </p>

          <div className="mt-6 space-y-6">
            {CATEGORY_ORDER.map((cat) => (
              <div key={cat}>
                <div className="text-[10px] uppercase tracking-[0.22em] font-semibold text-slate-300">
                  {CATEGORY_LABELS[cat]}
                </div>
                <div className="mt-2 grid gap-2">
                  {(grouped[cat] || []).map((c) => (
                    <PreferenceRow
                      key={c.key}
                      criterion={c}
                      value={preferences[c.key] ?? "skip"}
                      onChange={(p) => setPref(c.key, p)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handlePublish}
            disabled={!canPublish}
            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-7 py-3.5 text-sm font-medium text-emerald-950 shadow-[0_0_30px_rgb(16_185_129_/_0.30)] transition hover:bg-emerald-400 hover:shadow-[0_0_40px_rgb(16_185_129_/_0.45)] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none"
          >
            Publish listing
            <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </button>
          {!canPublish && (
            <p className="text-[11px] text-slate-500">
              Add a title, rent, and at least one criterion preference.
            </p>
          )}
        </div>
          </>
        )}
      </div>
    </main>
  );
}

function ProfileGate() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-xl rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.07] to-transparent p-8 text-center backdrop-blur"
    >
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
        <Lock className="size-5" />
      </div>
      <h2 className="font-display mt-5 text-2xl font-medium tracking-tight text-white">
        Build your profile first
      </h2>
      <p className="mt-2 text-sm text-slate-300">
        Tenants want to know who they&apos;re renting from. Listings without a
        landlord profile feel anonymous and untrustworthy — set up your track
        record before you publish a listing.
      </p>
      <div className="mt-6 flex flex-col items-center gap-2">
        <Link
          href="/landlord/profile/new"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-medium text-emerald-950 shadow-[0_0_30px_rgb(16_185_129_/_0.30)] transition hover:bg-emerald-400"
        >
          <User className="size-4" />
          Build your profile
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href="/landlord"
          className="text-xs text-slate-400 hover:text-slate-200 transition"
        >
          Back to dashboard
        </Link>
      </div>
    </motion.div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="text-xs font-medium text-slate-300 flex items-center gap-1">
        {icon}
        {label}
      </Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function PreferenceRow({
  criterion,
  value,
  onChange,
}: {
  criterion: Criterion;
  value: PrefState;
  onChange: (p: PrefState) => void;
}) {
  const segments = criterion.legallyFilterable
    ? SEGMENTS_FILTERABLE
    : SEGMENTS_NON_FILTERABLE;
  const active = value !== "skip";

  return (
    <div
      className={`rounded-xl border px-4 py-3 transition ${
        active
          ? "border-white/15 bg-white/[0.03]"
          : "border-white/8 bg-white/[0.01]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-slate-100">
            {criterion.label}
          </div>
          {!criterion.legallyFilterable && (
            <p className="mt-1 flex items-start gap-1 text-[10.5px] text-amber-300/80">
              <Info className="size-2.5 mt-px shrink-0" />
              <span>
                {criterion.helpText ??
                  "Cannot be required — Dutch equal treatment law."}
              </span>
            </p>
          )}
        </div>
        <Segments
          segments={segments}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

function Segments({
  segments,
  value,
  onChange,
}: {
  segments: PrefState[];
  value: PrefState;
  onChange: (p: PrefState) => void;
}) {
  return (
    <div className="inline-flex rounded-full bg-slate-950/60 ring-1 ring-white/10 p-0.5">
      {segments.map((s) => {
        const active = value === s;
        const colorClass = activeStyles(s);
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider transition ${
              active
                ? colorClass
                : "text-slate-400 hover:text-white"
            }`}
          >
            {SEGMENT_LABELS[s]}
          </button>
        );
      })}
    </div>
  );
}

function activeStyles(s: PrefState): string {
  if (s === "skip") return "bg-white/10 text-slate-200";
  const c = preferenceColor(s);
  return `${c.bg} ${c.text} ring-1 ring-inset ${c.ring}`;
}
