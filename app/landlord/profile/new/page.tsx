"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Check,
  Home,
  Image as ImageIcon,
  Lock,
  MapPin,
  Plus,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VerifyButton } from "@/components/apply/VerifyButton";
import {
  encodeProfile,
  LANDLORD_PROFILE_LOCAL_KEY,
  type LandlordProfile,
  type Property,
} from "@/lib/landlord-profile";

export default function NewLandlordProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [yearStarted, setYearStarted] = useState<string>("");
  const [propertyCount, setPropertyCount] = useState<string>("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [identityVerified, setIdentityVerified] = useState(false);
  const [properties, setProperties] = useState<Property[]>([
    { address: "", ownershipVerified: false },
  ]);

  const validProperties = properties.filter((p) => p.address.trim().length > 0);

  const canPublish =
    name.trim() !== "" &&
    Number(yearStarted) > 1900 &&
    Number(yearStarted) <= new Date().getFullYear() &&
    validProperties.length > 0;

  function updateProperty(i: number, patch: Partial<Property>) {
    setProperties((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }
  function addProperty() {
    setProperties((prev) => [...prev, { address: "", ownershipVerified: false }]);
  }
  function removeProperty(i: number) {
    setProperties((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handlePublish() {
    if (!canPublish) return;
    const profile: LandlordProfile = {
      name: name.trim(),
      yearStarted: Number(yearStarted),
      propertyCount: Number(propertyCount) || validProperties.length,
      city: city.trim() || undefined,
      bio: bio.trim() || undefined,
      profilePhotoUrl: profilePhotoUrl.trim() || undefined,
      identityVerified,
      properties: validProperties.map((p) => ({
        address: p.address.trim(),
        photoUrl: p.photoUrl?.trim() || undefined,
        description: p.description?.trim() || undefined,
        ownershipVerified: !!p.ownershipVerified && identityVerified,
      })),
      createdAt: new Date().toISOString(),
    };
    const encoded = encodeProfile(profile);
    try {
      window.localStorage.setItem(LANDLORD_PROFILE_LOCAL_KEY, encoded);
    } catch {
      // ignore
    }
    router.push(`/landlord/profile/${encoded}`);
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
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-medium">
            For landlords
          </div>
          <h1 className="font-display mt-1 text-3xl sm:text-4xl font-medium tracking-tight text-white">
            Build your{" "}
            <span className="italic text-emerald-300">trust profile</span>.
          </h1>
          <p className="mt-3 text-slate-300 max-w-2xl">
            Tenants want to know who they&apos;re renting from. Show your track
            record, your properties, and the verified reviews previous tenants
            have left.
          </p>
        </motion.div>

        <div className="mt-8">
          <IdentityHero
            verified={identityVerified}
            onVerified={() => setIdentityVerified(true)}
          />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur space-y-4">
            <div className="flex items-center gap-2">
              <User className="size-4 text-emerald-300" />
              <h2 className="text-base font-semibold text-white">About you</h2>
            </div>
            <Field label="Display name">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Westwood Properties B.V. or Jan de Vries"
                className="bg-slate-950/60 border-white/10 text-slate-100 placeholder:text-slate-500"
              />
            </Field>
            <Field label="City (optional)">
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Amsterdam"
                className="bg-slate-950/60 border-white/10 text-slate-100 placeholder:text-slate-500"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Renting since (year)">
                <Input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={yearStarted}
                  onChange={(e) => setYearStarted(e.target.value)}
                  placeholder="2014"
                  className="bg-slate-950/60 border-white/10 text-slate-100 placeholder:text-slate-500"
                />
              </Field>
              <Field label="Total properties">
                <Input
                  type="number"
                  min="0"
                  value={propertyCount}
                  onChange={(e) => setPropertyCount(e.target.value)}
                  placeholder="12"
                  className="bg-slate-950/60 border-white/10 text-slate-100 placeholder:text-slate-500"
                />
              </Field>
            </div>
            <Field label="Profile photo URL (optional)" icon={<ImageIcon className="size-3" />}>
              <Input
                value={profilePhotoUrl}
                onChange={(e) => setProfilePhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="bg-slate-950/60 border-white/10 text-slate-100 placeholder:text-slate-500"
              />
            </Field>
            <Field label="Bio (optional)">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 500))}
                rows={4}
                placeholder="A few sentences about your approach to renting and the kind of tenants you look for."
                className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 resize-none"
              />
              <div className="mt-1 text-right text-[10px] text-slate-500">
                {bio.length}/500
              </div>
            </Field>
          </section>

          <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="size-4 text-emerald-300" />
                <h2 className="text-base font-semibold text-white">
                  Your properties
                </h2>
              </div>
              <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                {validProperties.length} listed
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Verify ownership with Kadaster against your DigiD identity. Only
              verified addresses can have listings published or reviews left.
            </p>

            <div className="mt-5 space-y-3">
              {properties.map((p, i) => {
                const hasAddress = p.address.trim().length > 0;
                const verifyLockReason = !identityVerified
                  ? "Verify identity first"
                  : !hasAddress
                    ? "Enter address first"
                    : undefined;
                return (
                  <div
                    key={i}
                    className={`rounded-xl border px-4 py-3 space-y-3 transition ${
                      p.ownershipVerified
                        ? "border-emerald-500/40 bg-emerald-500/[0.04]"
                        : "border-white/10 bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <Label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                            <MapPin className="size-3" />
                            Address {i + 1}
                          </Label>
                          {p.ownershipVerified && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
                              <ShieldCheck
                                className="size-2.5"
                                strokeWidth={2.5}
                              />
                              Ownership verified
                            </span>
                          )}
                        </div>
                        <Input
                          value={p.address}
                          onChange={(e) =>
                            updateProperty(i, {
                              address: e.target.value,
                              ownershipVerified: false,
                            })
                          }
                          placeholder="Ferdinand Bolstraat 100, Amsterdam"
                          className="mt-1 bg-slate-950/60 border-white/10 text-slate-100 placeholder:text-slate-500"
                        />
                      </div>
                      {properties.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProperty(i)}
                          className="mt-6 inline-flex size-8 items-center justify-center rounded-lg text-slate-500 hover:text-rose-300 hover:bg-rose-500/10 transition"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </div>
                    <Field
                      label="Photo URL (optional)"
                      icon={<ImageIcon className="size-3" />}
                    >
                      <Input
                        value={p.photoUrl ?? ""}
                        onChange={(e) =>
                          updateProperty(i, { photoUrl: e.target.value })
                        }
                        placeholder="https://images.unsplash.com/..."
                        className="bg-slate-950/60 border-white/10 text-slate-100 placeholder:text-slate-500"
                      />
                    </Field>
                    <Field label="Description (optional)">
                      <Input
                        value={p.description ?? ""}
                        onChange={(e) =>
                          updateProperty(i, { description: e.target.value })
                        }
                        placeholder="2-bedroom apartment, 65m², 3rd floor"
                        className="bg-slate-950/60 border-white/10 text-slate-100 placeholder:text-slate-500"
                      />
                    </Field>
                    <div className="pt-1">
                      <VerifyButton
                        source="Kadaster"
                        isVerified={!!p.ownershipVerified}
                        onVerified={() =>
                          updateProperty(i, { ownershipVerified: true })
                        }
                        lockReason={
                          p.ownershipVerified ? undefined : verifyLockReason
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={addProperty}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-dashed border-white/15 bg-white/[0.02] px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 hover:border-white/25 transition"
            >
              <Plus className="size-3.5" />
              Add another property
            </button>
          </section>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handlePublish}
            disabled={!canPublish}
            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-7 py-3.5 text-sm font-medium text-emerald-950 shadow-[0_0_30px_rgb(16_185_129_/_0.30)] transition hover:bg-emerald-400 hover:shadow-[0_0_40px_rgb(16_185_129_/_0.45)] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none"
          >
            <Home className="size-4" />
            Publish profile
            <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </button>
          {!canPublish && (
            <p className="text-[11px] text-slate-500">
              Add a name, year started, and at least one property address.
            </p>
          )}
        </div>
      </div>
    </main>
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

function IdentityHero({
  verified,
  onVerified,
}: {
  verified: boolean;
  onVerified: () => void;
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
                You can now verify ownership of your properties via Kadaster.
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
            <div className="text-[10px] uppercase tracking-[0.22em] text-emerald-300 font-semibold">
              Step 1 — Start here
            </div>
            <h3 className="font-display mt-2 text-2xl font-medium tracking-tight text-white">
              Verify your identity first
            </h3>
            <p className="mt-2 text-sm text-slate-300 max-w-lg leading-relaxed">
              We verify your identity with DigiD, then cross-reference it
              against the Kadaster land registry to confirm you actually own
              the properties you list. Tenants see all of this on your public
              profile.
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
